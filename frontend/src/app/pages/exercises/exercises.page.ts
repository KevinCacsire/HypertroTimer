import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonInput, IonModal, ItemReorderEventDetail, ToastController } from '@ionic/angular';
import { Exercise } from 'src/app/model/Exercise';
import { ExerciseService } from 'src/app/services/exercise.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppState } from 'src/store/AppState';
import { Store } from '@ngrx/store';
import { ExercisesPageAddingForm } from './exercises.page.adding.form';
import { ExercisesPageEditingForm } from './exercises.page.editing.form';
import { addExercise, deleteExercise, resetAddedExerciseState, resetDeletedExerciseState,
  resetRetrievedExercisesState, resetUpdatedExerciseState, resetUpdatedExercisesState, retrieveExercises, updateExercise, updateExercises
  } from 'src/store/logging-exercises/logging.exercises.actions';
import { LoggingExercisesState } from 'src/store/logging-exercises/LoggingExercisesState';
import { hide, show } from 'src/store/loading/loading.actions';
import { WorkoutInstance } from 'src/app/model/WorkoutInstance';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.page.html',
  styleUrls: ['./exercises.page.scss'],
})
export class ExercisesPage implements OnInit, OnDestroy {

  @ViewChild('editModal') editModal!: IonModal;
  @ViewChild('addModal') addModal!: IonModal;
  @ViewChild('exerciseInput') exerciseInput!: IonInput;
  
  editingExercise: Exercise | null = null;
  currentSessionName = this.route.snapshot.paramMap.get('sessionName');
  currentSessionId = this.route.snapshot.paramMap.get('sessionId');
  currentSplitName = this.route.snapshot.paramMap.get('splitName');
  currentSplitId = this.route.snapshot.paramMap.get('splitId');
  showEmptyMessage = false;
  exercises: Exercise[] = [];
  allExercises: string[] = [];
  filteredExercises: string[] = [];
  selectedMuscleGroups: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  selectedNewExercise: string = '';
  addingForm!: FormGroup;
  editingForm!: FormGroup;
  loggingExercisesStateSubscriptionExercises: Subscription = new Subscription;
  recentWorkout: WorkoutInstance | null = null;
  exerciseVolumesMap = new Map<string, Exercise[]>();
  private refresherEvent?: any;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute,
      private exerciseService: ExerciseService, private toastController: ToastController,
      private store: Store<AppState>, private router: Router,
      private alertController: AlertController) {
    const navigation = this.router.getCurrentNavigation();
    this.recentWorkout = navigation?.extras.state?.['recentWorkout'];
  }

  async ngOnInit() {
    this.addingForm = new ExercisesPageAddingForm(this.formBuilder).createForm();
    this.editingForm = new ExercisesPageEditingForm(this.formBuilder).createForm();

    this.loggingExercisesStateSubscriptionExercises = this.store.select('loggingExercises').subscribe(loggingExercisesState => {
      this.onAddedExerciseSuccess(loggingExercisesState);
      this.onRetrievedExercisesSuccess(loggingExercisesState);
      this.onDeletedExerciseSuccess(loggingExercisesState);
      this.onUpdatedExerciseSuccess(loggingExercisesState);
      this.onUpdatedExercisesSuccess(loggingExercisesState);

      this.onError(loggingExercisesState);
      this.toggleLoading(loggingExercisesState);
    })
    
    this.store.dispatch(retrieveExercises({splitId: this.currentSplitId!, sessionId: this.currentSessionId!}));
    this.exerciseService.fetchAllExercises().subscribe({
      next: (exerciseNames: string[]) => {
        this.allExercises = exerciseNames;
      },
      error: (error) => {
        console.error('Error fetching exercise data:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.loggingExercisesStateSubscriptionExercises) {
      this.loggingExercisesStateSubscriptionExercises.unsubscribe();
    }
  }

  private async onAddedExerciseSuccess(loggingExercisesState: LoggingExercisesState) {
    if (loggingExercisesState.isAddedExercise) {
      this.presentToastMessage("added", false);

      this.store.dispatch(resetAddedExerciseState());
      this.store.dispatch(retrieveExercises({splitId: this.currentSplitId!, sessionId: this.currentSessionId!}));
    }
  }

  private async onUpdatedExerciseSuccess(loggingExercisesState: LoggingExercisesState) {
    if (loggingExercisesState.isUpdatedExercise) {
      this.presentToastMessage("updated", false);

      this.store.dispatch(resetUpdatedExerciseState());
      this.store.dispatch(retrieveExercises({splitId: this.currentSplitId!, sessionId: this.currentSessionId!}));
    }
  }

  private async onUpdatedExercisesSuccess(loggingExercisesState: LoggingExercisesState) {
    if (loggingExercisesState.isUpdatedExercises) {
      this.presentToastMessage("updated", false);

      this.store.dispatch(resetUpdatedExercisesState());
      this.store.dispatch(retrieveExercises({splitId: this.currentSplitId!, sessionId: this.currentSessionId!}));
    }
  }

  private onDeletedExerciseSuccess(loggingExercisesState: LoggingExercisesState) {
    if (loggingExercisesState.isDeletedExercise) {
      this.presentToastMessage("deleted", false);

      this.store.dispatch(resetDeletedExerciseState());
      this.store.dispatch(retrieveExercises({splitId: this.currentSplitId!, sessionId: this.currentSessionId!}));
    }
  }

  private onRetrievedExercisesSuccess(loggingExercisesState: LoggingExercisesState) {
    if (loggingExercisesState.isRetrievedExercises) {
      this.exercises = [...loggingExercisesState.retrievedExercises].sort((a, b) => a.indexOrder! - b.indexOrder!);
      
      this.showEmptyMessage = this.exercises.length === 0;

      if (this.refresherEvent) {
        this.refresherEvent.target.complete();
        this.refresherEvent = undefined;
      }

      this.store.dispatch(resetRetrievedExercisesState());
      this.mapWorkoutToExercises();
    }
  }
  
  doRefresh(event: any) {
    this.refresherEvent = event;
    this.store.dispatch(retrieveExercises({splitId: this.currentSplitId!, sessionId: this.currentSessionId!}));
  }

  private mapWorkoutToExercises() {
    if (!this.recentWorkout || !this.recentWorkout.exercisesVolumes) {
      return;
    }

    this.exerciseVolumesMap = new Map<string, Exercise[]>(); 
    this.recentWorkout!.exercisesVolumes.forEach(volume => {
      if (this.exerciseVolumesMap.has(volume.exerciseId!)) {
        this.exerciseVolumesMap.get(volume.exerciseId!)!.push(volume);
      } else {
        this.exerciseVolumesMap.set(volume.exerciseId!, [volume]);
      }
    });
  }

  private async onError(loggingExercisesState: LoggingExercisesState) {
    if (loggingExercisesState.error) {
      this.presentToastMessage(loggingExercisesState.error.message, true);
    }
  }

  private async presentToastMessage(message: string, error: boolean) {
    const toastSuccess = await this.toastController.create({
      position: "bottom",
      message: error ? message : 'Successfully ' + message + ' exercise!',
      color: error ? "danger" : "success",
      duration: message=="updated" ? 1500 : 2500,
      cssClass: 'toast-custom',
    });
    toastSuccess.present();
  }

  private toggleLoading(loggingExercisesState: LoggingExercisesState) {
    if (loggingExercisesState.isAddingExercise || loggingExercisesState.isRetrievingExercises
      || loggingExercisesState.isDeletingExercise || loggingExercisesState.isUpdatingExercise 
      || loggingExercisesState.isUpdatingExercises) {
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    } 
  }

  // BEGINNING OF ADDING-FORM
  addExerciseToSearchBar(exercise: string) {
    this.selectedNewExercise = exercise;
    this.exerciseInput.value = exercise.split(';')[0];
    this.addingForm.get('exercise')?.setValue(exercise.split(';')[0]);
    this.filteredExercises = [];
  }
  
  onExerciseInput() {
    const searchTerm = (this.exerciseInput.value as string).toLowerCase();
  
    this.filteredExercises = this.allExercises
      .filter(exercise  => {
        const exerciseParts = exercise.split(';');
        const exerciseName = exerciseParts[0].trim();
        const exerciseMuscleGroups = exerciseParts[1]
          .split(',')
          .map(s => s.trim())
          .map(Number);
  
        return (
          /*this.selectedMuscleGroups.length === 0 ||
          exerciseMuscleGroups.length === 1 ||*/
          this.selectedMuscleGroups.some(group => exerciseMuscleGroups.includes(group))
        ) && this.searchTermMatchesExercise(exerciseName, searchTerm)
      })
  }

  searchTermMatchesExercise(exerciseName: string, searchTerm: string): boolean {
    const searchTerms = searchTerm.split(' ').filter(term => term.length > 0);
  
    let index = 0;
    for (const term of searchTerms) {
      index = exerciseName.toLowerCase().indexOf(term);
      if (index === -1) {
        return false;
      }
    }
    return true;
  }

  toggleMuscleGroup(...muscleGroups: number[]) {
    muscleGroups.forEach(muscleGroup => {
      if (this.selectedMuscleGroups.includes(muscleGroup)) {
        this.selectedMuscleGroups = this.selectedMuscleGroups.filter(group => group !== muscleGroup);
      } else {
        this.selectedMuscleGroups.push(muscleGroup);
      }
    });
  
    this.onExerciseInput();
  }

  areSelected(...muscleGroups: number[]): boolean {
    return muscleGroups.every(group => this.selectedMuscleGroups.includes(group));
  }

  onSaveClickAdd() {
    this.store.dispatch(addExercise({
      exerciseName: this.addingForm.get('exercise')?.value,
      indexOrder: this.exercises.length,
      splitId: this.currentSplitId!,
      sessionId: this.currentSessionId!,
      exerciseType: this.selectedNewExercise.split(';')[2].trim()
    }));
    this.clearAddingForm();
  }

  clearAddingForm() {
    this.addingForm.get('exercise')?.setValue('');
    this.addingForm.markAsUntouched();
    this.selectedNewExercise = '';
  }
  // END of ADDING-FORM

  openEditModal(exercise: Exercise) {
    this.editingExercise = exercise;
    this.editingForm.patchValue({
      exercise: exercise.exerciseName,
    });
    this.editModal.present();
  }

  onSaveClickEdit() {
    this.store.dispatch(updateExercise({
      exerciseName: this.editingForm.get('exercise')?.value,
      indexOrder: this.exercises.findIndex(exercise => exercise.exerciseId === this.editingExercise!.exerciseId),
      splitId: this.currentSplitId!,
      sessionId: this.currentSessionId!,
      exerciseId: this.editingExercise!.exerciseId!,
      exerciseType: this.editingExercise!.exerciseType!.trim()
    }));
  }

  onDeleteClick() {
    const deletedExerciseIndex = this.exercises.findIndex(exercise => exercise.exerciseId === this.editingExercise!.exerciseId);

    if (deletedExerciseIndex !== -1) {
      const updatedExercises = [...this.exercises];
      const deletedExercise = updatedExercises.splice(deletedExerciseIndex, 1)[0];
      updatedExercises.push(deletedExercise);
      this.updateExerciseIndexOrders(updatedExercises);
      
      this.store.dispatch(deleteExercise({
        splitId: this.currentSplitId!,
        sessionId: this.currentSessionId!,
        exerciseId: this.editingExercise!.exerciseId!
      }));
    }
  }

  updateOrder() {
    const updatedExercises = [...this.exercises];
    this.updateExerciseIndexOrders(updatedExercises);
  }

  private updateExerciseIndexOrders(exercises: Exercise[]): void {
    const updatedExercises = exercises.map((exercise, index) => ({
      ...exercise,
      indexOrder: index
    }));
    this.store.dispatch(updateExercises({
      exercises: updatedExercises,
      splitId: this.currentSplitId!,
      sessionId: this.currentSessionId!,
    }));
  }

  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    const fromIndex = ev.detail.from;
    const toIndex = ev.detail.to;
    const updatedExercises = [...this.exercises];
    const [movedItem] = updatedExercises.splice(fromIndex, 1);
    updatedExercises.splice(toIndex, 0, movedItem);
    this.exercises = updatedExercises;
  
    ev.detail.complete();

    this.updateOrder();
  }

  startWorkout() {
    this.router.navigate(['home', this.currentSplitName, this.currentSplitId, this.currentSessionName, this.currentSessionId, "workout"],
    { replaceUrl: true, state: { recentWorkout: this.recentWorkout } });
  }

  navigateToSplits() {  
    this.router.navigate(['home', this.currentSplitName, this.currentSplitId], 
      { replaceUrl: true });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Quick Tip: Renaming Exercises',
      message: 'For minor changes, feel free to edit the exercise name. If it’s a different exercise altogether, it’s better to add a new exercise and remove this old one to keep the timer consistent.',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  handleAddEnterKey(): void {
    if (this.addingForm.valid && this.selectedNewExercise !== '') {
      this.onSaveClickAdd();
      this.addModal.dismiss();
    }
  }

  handleEditEnterKey(): void {
    if (this.editingForm.valid) {
      this.onSaveClickEdit();
      this.editModal.dismiss();
    }
  }
}
