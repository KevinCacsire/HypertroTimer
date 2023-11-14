import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonModal, ToastController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { CalendarComponent, CalendarMode } from 'ionic6-calendar';
import { Subscription } from 'rxjs';
import { CalEvent } from 'src/app/model/CalEvent';
import { Exercise } from 'src/app/model/Exercise';
import { WorkoutInstance } from 'src/app/model/WorkoutInstance';
import { AppState } from 'src/store/AppState';
import { hide, show } from 'src/store/loading/loading.actions';
import { WorkoutsState } from 'src/store/workouts/WorkoutsState';
import { deleteWorkout, resetDeletedWorkoutState, resetRetrievedWorkoutsState, retrieveWorkouts } from 'src/store/workouts/workouts.actions';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit, OnDestroy {

  @ViewChild('infoModal') infoModal!: IonModal;
  selectedEventWorkoutInstance: WorkoutInstance | null = null;
  @ViewChild(CalendarComponent) myCal!: CalendarComponent;
  calendar = {
    mode: 'month' as CalendarMode,
    currentDate: new Date(),
  };
  viewTitle = '';
  eventSource: any[] = [];
  allWorkouts: WorkoutInstance[] | null = null;
  workoutsSubscription: Subscription = new Subscription;
  groupedExercises!: Exercise[][];
  clickedWorkoutId: string = '';
  private refresherEvent?: any;


  constructor(private store: Store<AppState>, private toastController: ToastController) { }

  ngOnInit() {
    this.workoutsSubscription = this.store.select('workouts').subscribe(workoutsState => {
      this.onRetrievedWorkoutsSuccess(workoutsState);
      this.onDeletedWorkoutSuccess(workoutsState);
      
      this.onError(workoutsState);
      this.toggleLoading(workoutsState);
    })
    console.log("calendar onInit")
  }

  ngOnDestroy() {
    console.log("calendar onDestroy")
    if (this.workoutsSubscription) {
      this.workoutsSubscription.unsubscribe();
    }
  }

  async ionViewWillEnter() {
    this.store.dispatch(retrieveWorkouts());
  }

  private onDeletedWorkoutSuccess(workoutsState: WorkoutsState) {
    if (workoutsState.isDeletedWorkout) {
      this.presentToastMessage("Successfully deleted workout-session!", false);

      this.store.dispatch(resetDeletedWorkoutState());
      this.store.dispatch(retrieveWorkouts());
    }
  }

  private async presentToastMessage(message: string, error: boolean) {
    const toastSuccess = await this.toastController.create({
      position: "bottom",
      message: message,
      color: error ? "danger" : "success",
      duration: 2500,
      cssClass: 'toast-custom',
    });
    toastSuccess.present();
  }

  private onRetrievedWorkoutsSuccess(workoutsState: WorkoutsState) {
    if (workoutsState.isRetrievedWorkouts) {
      this.allWorkouts = workoutsState.retrievedWorkouts;

      if (this.refresherEvent) {
        this.refresherEvent.target.complete();
        this.refresherEvent = undefined;
      }

      this.store.dispatch(resetRetrievedWorkoutsState());
      this.convertWorkoutsToEvents();
    }
  }

  doRefresh(event: any) {
    this.refresherEvent = event;
    this.store.dispatch(retrieveWorkouts());
  }

  private async onError(workoutsState: WorkoutsState) {
    if (workoutsState.error) {
      this.presentToastMessage(workoutsState.error.message, true);
    }
  }

  private convertWorkoutsToEvents() {
    const events: CalEvent[] = [];
    
    for (const workout of this.allWorkouts!) {
      const event: CalEvent = {
        title: workout.sessionName + " (" + workout.splitName + ")",
        startTime: new Date(workout.startingDate!),
        endTime: new Date(workout.endingDate!),
        allDay: false,
        workoutInstance: workout
      };
      events.push(event);
    }
    
    this.eventSource = events;
    this.myCal.loadEvents();
  }

  private toggleLoading(workoutsState: WorkoutsState) {
    if (workoutsState.isRetrievingWorkouts) {
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    } 
  }

  setToday(){
    this.myCal.currentDate = new Date();
  }

  calendarBack() {
    this.myCal.slidePrev();
  }

  calendarForward() {
    this.myCal.slideNext();
  }

  onEventSelected(event: any) {
    this.selectedEventWorkoutInstance = event.workoutInstance;
    this.clickedWorkoutId = event.workoutInstance.workoutId;
    this.groupedExercises = this.groupExercisesById(this.selectedEventWorkoutInstance!.exercisesVolumes);
    this.infoModal.present();
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
  
  onDeleteClick() {
    this.store.dispatch(deleteWorkout({workoutId: this.clickedWorkoutId}));
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
