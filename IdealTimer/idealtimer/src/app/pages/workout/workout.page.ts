import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonModal, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import {  Subscription } from 'rxjs';
import { VolumeItemComponent } from 'src/app/components/volume-item/volume-item.component';
import { Exercise } from 'src/app/model/Exercise';
import { SidemenuSettings } from 'src/app/model/SidemenuSettings';
import { WorkoutInstance } from 'src/app/model/WorkoutInstance';
import { AppState } from 'src/store/AppState';
import { hide, show } from 'src/store/loading/loading.actions';
import { LoggingExercisesState } from 'src/store/logging-exercises/LoggingExercisesState';
import { resetRetrievedExercisesState, retrieveExercises } from 'src/store/logging-exercises/logging.exercises.actions';
import { SettingsState } from 'src/store/settings/SettingsState';
import { resetRetrievedSettingsState, retrieveSettings } from 'src/store/settings/settings.actions';
import { WorkoutsState } from 'src/store/workouts/WorkoutsState';
import { addWorkout, resetAddedWorkoutState, resetRetrievedWorkoutsState, retrieveWorkouts } from 'src/store/workouts/workouts.actions';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
})
export class WorkoutPage implements OnInit, OnDestroy {

  @ViewChild(IonModal) modal!: IonModal;
  @ViewChildren('volumeItem') volumeItems!: QueryList<VolumeItemComponent>;

  currentSessionName = this.route.snapshot.paramMap.get('sessionName');
  currentSessionId = this.route.snapshot.paramMap.get('sessionId');
  currentSplitName = this.route.snapshot.paramMap.get('splitName');
  currentSplitId = this.route.snapshot.paramMap.get('splitId');
  workoutInstanceNotFound: boolean = false;
  groupedExerciseVolumes: { [exerciseName: string]: Exercise[] } = {};
  loggingExercisesStateSubscription: Subscription = new Subscription;
  workoutVolumesStateSubscription: Subscription = new Subscription;
  startingDate: Date = new Date();
  endingDate: Date = new Date();
  groupedExercises!: Exercise[][];
  groupedExerciseIndex: number = 0;
  restIntervalTimer: number = 0;
  totalSeconds: number = 0;
  totalTimer: any;
  timerIntervalId: any;
  audio?: HTMLAudioElement;
  settingsStateSubscription: Subscription = new Subscription;
  retrievedSettings?: SidemenuSettings;
  recentWorkout: WorkoutInstance | null = null;
  currentSetWithinGroupedExercise: number = 0;


  constructor(private route: ActivatedRoute, private store: Store<AppState>,
    private toastController: ToastController, private router: Router) {
      const navigation = this.router.getCurrentNavigation();
      this.recentWorkout = navigation?.extras.state?.['recentWorkout'];
    }

  ngOnInit() {
    this.workoutVolumesStateSubscription = this.store.select('workouts').subscribe(workoutVolumesState => {
      this.onAddedWorkoutSuccess(workoutVolumesState);

      this.onErrorWorkouts(workoutVolumesState);
      this.toggleLoadingWorkouts(workoutVolumesState);
    })

    this.loggingExercisesStateSubscription = this.store.select('loggingExercises').subscribe(loggingExercisesState => {
      this.onRetrievedExercisesSuccess(loggingExercisesState);
      
      this.onError(loggingExercisesState);
      this.toggleLoading(loggingExercisesState);
    })

    this.settingsStateSubscription = this.store.select('settings').subscribe(settingsState => {
      this.onIsRetrievedSettingsSuccess(settingsState);

      this.onErrorSettings(settingsState);
    })

    this.handleNoRecentWorkout();
    this.fetchSettings();
    this.startTotalTimer();
    console.log("workout onInit")
  }

  ngOnDestroy() {
    console.log("workout onDestroy")
    if (this.loggingExercisesStateSubscription) {
      this.loggingExercisesStateSubscription.unsubscribe();
    }
    if (this.workoutVolumesStateSubscription) {
      this.workoutVolumesStateSubscription.unsubscribe();
    }
  }

  startTotalTimer() {
    this.totalTimer = setInterval(() => {
      this.totalSeconds++;
    }, 1000);
  }

  moveCheckToNextGroupedExercise(groupedExerciseIndexOfDeletedSet: number) {
    console.log("ExerciseIndex Of DeletedSet", groupedExerciseIndexOfDeletedSet);
    if (groupedExerciseIndexOfDeletedSet == this.groupedExerciseIndex) {
      this.groupedExerciseIndex++;
      this.currentSetWithinGroupedExercise = 0;
    }
  }

  handleNewlyAddedSet(groupedExerciseIndexOfAddedSet: number, eventValue: number) {
    if (groupedExerciseIndexOfAddedSet + 1 == this.groupedExerciseIndex
        && this.currentSetWithinGroupedExercise == 0) {
      this.groupedExerciseIndex--;
    }
    if (groupedExerciseIndexOfAddedSet == this.groupedExerciseIndex) {
      this.currentSetWithinGroupedExercise = eventValue;
    }
    
    console.log("ExerciseIndex Of AddedSet", groupedExerciseIndexOfAddedSet);
    console.log("current ExerciseIndex", this.groupedExerciseIndex);
    console.log("current Set Within Exercise", this.currentSetWithinGroupedExercise);

  }

  setCurrentSetWithinGroupedExercise(eventValue: number) {
    console.log("current Set Within Exercise", eventValue);
    this.currentSetWithinGroupedExercise = eventValue;
  }

  startNewRestIntervalTime() {
    clearInterval(this.timerIntervalId);
    this.restIntervalTimer = 4;
  
    this.timerIntervalId = setInterval(() => {
      if (this.restIntervalTimer > 0) {
        this.restIntervalTimer--;
      }
      if (this.restIntervalTimer === 0) {
        this.audio?.play();
        clearInterval(this.timerIntervalId);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  subtractToRestIntervalTimer() {
    if (this.restIntervalTimer <= 5 && this.restIntervalTimer >= 0) {
      this.restIntervalTimer = 0;
    } else if (this.restIntervalTimer > 0) {
      this.restIntervalTimer = this.restIntervalTimer - 5;
    }
  }

  addToRestIntervalTimer() {
    if (this.restIntervalTimer > 0) this.restIntervalTimer = this.restIntervalTimer + 5;
  }

  private async fetchSettings() {
    this.store.dispatch(retrieveSettings());
  }
  
  private onRetrievedExercisesSuccess(loggingExercisesState: LoggingExercisesState) {
    if (loggingExercisesState.isRetrievedExercises) {
      const workout = new WorkoutInstance();
      workout.exercisesVolumes = [...loggingExercisesState.retrievedExercises];
      workout.exercisesVolumes.sort((a, b) => a.indexOrder! - b.indexOrder!);

      if (!this.workoutInstanceNotFound) {
        const existingExerciseIds = this.recentWorkout!.exercisesVolumes.map((exercise) => exercise.exerciseId);
        const newExercises = workout.exercisesVolumes.filter((exercise) => !existingExerciseIds.includes(exercise.exerciseId));
    
        const updatedExercisesVolumes = this.recentWorkout!.exercisesVolumes
            .filter((exercise) => workout.exercisesVolumes.some((e) => e.exerciseId === exercise.exerciseId))
            .map((exercise) => {
                const matchedExercise = workout.exercisesVolumes.find((e) => e.exerciseId === exercise.exerciseId);
                if (matchedExercise) {
                    return { ...exercise, exerciseName: matchedExercise.exerciseName };
                }
                return exercise;
            });
    
        // Create a new array by concatenating the existing exercises with the new ones
        const combinedExercisesVolumes = [...updatedExercisesVolumes, ...newExercises];
    
        this.recentWorkout = { ...this.recentWorkout, exercisesVolumes: combinedExercisesVolumes };
        this.recentWorkout.exercisesVolumes.sort((a, b) => {
            const indexA = workout.exercisesVolumes.findIndex((e) => e.exerciseId === a.exerciseId);
            const indexB = workout.exercisesVolumes.findIndex((e) => e.exerciseId === b.exerciseId);
            if (indexA !== indexB) {
                return indexA - indexB;
            } else {
                return a.indexOrder! - b.indexOrder!;
            }
        });
    
        this.groupedExercises = this.groupExercisesById(this.recentWorkout.exercisesVolumes);
    }
     else {
        this.recentWorkout = workout;
        this.groupedExercises = this.groupExercisesById(this.recentWorkout.exercisesVolumes);
      }
      this.store.dispatch(resetRetrievedExercisesState());
    }
}

  private handleNoRecentWorkout() {
    this.store.dispatch(retrieveExercises({ splitId: this.currentSplitId!, sessionId: this.currentSessionId! }));
    if (!this.recentWorkout) {
      this.workoutInstanceNotFound = true;
    }
  }

  private async onIsRetrievedSettingsSuccess(settingsState: SettingsState) {
    if (settingsState.isRetrievedSettings) {
      this.retrievedSettings = settingsState.retrievedSettings;
      if (this.retrievedSettings.audioOn) {
        this.audio = new Audio(`assets/sound-effects/${this.retrievedSettings.selectedAudioFile}`)
        this.audio.volume = this.retrievedSettings.volume!;
      }
      this.store.dispatch(resetRetrievedSettingsState());
    }
  }

  private async onErrorSettings(settingsState: SettingsState) {
    if (settingsState.error) {
      this.presentToastMessage(settingsState.error.message, true);
    }
  }
  
  private groupExercisesById(exercises: Exercise[]): Exercise[][] {
    const groupedExercises: any[] = [];
    const idToIndexMap: { [key: string]: number } = {};
  
    exercises.forEach(exercise => {
      if (exercise.exerciseId) {
        const existingIndex = idToIndexMap[exercise.exerciseId];
        if (existingIndex !== undefined) {
          groupedExercises[existingIndex].push(exercise);
        } else {
          idToIndexMap[exercise.exerciseId] = groupedExercises.length;
          groupedExercises.push([exercise]);
        }
      }
    });
    return groupedExercises;
  }

  private onAddedWorkoutSuccess(workoutVolumesState: WorkoutsState) {
    if (workoutVolumesState.isAddedWorkout) {
      this.store.dispatch(resetAddedWorkoutState());
    }
  }

  private async onError(loggingExercisesState: LoggingExercisesState) {
    if (loggingExercisesState.error) {
      this.presentToastMessage(loggingExercisesState.error.message, true);
    }
  }

  private async onErrorWorkouts(workoutVolumesState: WorkoutsState) {
    if (workoutVolumesState.error) {
      this.presentToastMessage(workoutVolumesState.error.message, true);
    }
  }

  toSplitsPage() {
    this.presentToastMessage('Congrats! You can review your workout-session in the calendar!', false);
    clearInterval(this.timerIntervalId);
    this.router.navigate(['home', 'splits'],
      { replaceUrl: true });
  }

  private async presentToastMessage(message: string, error: boolean) {
    const toastSuccess = await this.toastController.create({
      position: "bottom",
      message: message,
      color: error ? "danger" : "success",
      duration: error ? 2500 : 3500,
      cssClass: 'toast-custom',
    });
    toastSuccess.present();
  }

  private toggleLoading(loggingExercisesState: LoggingExercisesState) {
    if (loggingExercisesState.isRetrievingExercises) {
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    } 
  }

  private toggleLoadingWorkouts(workoutVolumesState: WorkoutsState) {
    if (workoutVolumesState.isAddingWorkout || workoutVolumesState.isRetrievingWorkouts) {
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    } 
  }

  updateTime() {
    this.endingDate = new Date();
  }

  finishWorkout() {
    const data: { exerciseId: string; exerciseName: string, weight: any; reps: any; }[] = [];
    this.volumeItems.forEach(item => {
      const itemData = item.getRepsWeightsNameAndId();
      data.push(...itemData);
    });

    this.store.dispatch(addWorkout({
      exercisesVolume: data,
      startingDate: this.startingDate,
      endingDate: this.endingDate,
      splitId: this.currentSplitId!,
      splitName: this.currentSplitName!,
      sessionId: this.currentSessionId!,
      sessionName: this.currentSessionName!}));
    this.toSplitsPage();
  }

  toExercisesPage() {
    clearInterval(this.timerIntervalId);
    if (this.workoutInstanceNotFound) {
      this.router.navigate(['home', this.currentSplitName, this.currentSplitId, this.currentSessionName, this.currentSessionId],
        { replaceUrl: true });
    } else {
      this.router.navigate(['home', this.currentSplitName, this.currentSplitId, this.currentSessionName, this.currentSessionId],
        { replaceUrl: true, state: { recentWorkout: this.recentWorkout} });
    }
    
  }

  calculateTotalTime(startingDate: Date, endingDate: Date): string {
    const startDate = new Date(startingDate);
    const endDate = new Date(endingDate);

    const timeDifference = endDate.getTime() - startDate.getTime();

    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}mins ${seconds}secs`;
  }
}
