import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd, NavigationExtras  } from '@angular/router';
import { AppState } from 'src/store/AppState';
import { Store } from '@ngrx/store';
import { SessionsPageAddingForm } from './sessions.page.adding.form';
import { addSession, deleteSession, resetAddedSessionState, resetDeletedSessionState,
  resetRetrievedSessionsState, resetUpdatedSessionState, retrieveSessions, updateSession
  } from 'src/store/logging-sessions/logging.sessions.actions';
import { hide, show } from 'src/store/loading/loading.actions';
import { AlertController, IonModal, ToastController } from '@ionic/angular';
import { LoggingSessionsState } from 'src/store/logging-sessions/LoggingSessionsState';
import { Subscription } from 'rxjs/internal/Subscription';
import { Session } from 'src/app/model/Session';
import { SessionsPageEditingForm } from './sessions.page.editing.form';
import { WorkoutsState } from 'src/store/workouts/WorkoutsState';
import { resetRetrievedWorkoutsState, retrieveWorkoutsBySplitId } from 'src/store/workouts/workouts.actions';
import { WorkoutInstance } from 'src/app/model/WorkoutInstance';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.page.html',
  styleUrls: ['./sessions.page.scss'],
})
export class SessionsPage implements OnInit, OnDestroy {

  @ViewChild('addModal') addModal!: IonModal;
  @ViewChild('editModal') editModal!: IonModal;
  
  editingSession: Session | null = null;
  currentSplitName = this.route.snapshot.paramMap.get('splitName');
  currentSplitId = this.route.snapshot.paramMap.get('splitId');
  showEmptyMessage = false;
  sessions: Session[] = [];
  addingForm!: FormGroup;
  editingForm!: FormGroup;
  loggingSessionsStateSubscriptionSessions: Subscription = new Subscription;
  recentWorkouts: WorkoutInstance[] | null = null;
  workoutsSubscription: Subscription = new Subscription;
  private refresherEvent?: any;
  
  constructor(private router: Router, private formBuilder: FormBuilder,
    private store: Store<AppState>, private toastController: ToastController,
    private route: ActivatedRoute, private alertController: AlertController) { }

  ngOnInit() {
    this.addingForm = new SessionsPageAddingForm(this.formBuilder).createForm();
    this.editingForm = new SessionsPageEditingForm(this.formBuilder).createForm();

    this.loggingSessionsStateSubscriptionSessions = this.store.select('loggingSessions').subscribe(loggingSessionsState => {
      this.onAddedSessionSuccess(loggingSessionsState);
      this.onRetrievedSessionsSuccess(loggingSessionsState);
      this.onDeletedSessionSuccess(loggingSessionsState);
      this.onUpdatedSessionSuccess(loggingSessionsState);

      this.onErrorSessions(loggingSessionsState);
      this.toggleLoading(loggingSessionsState);
    })

    this.workoutsSubscription = this.store.select('workouts').subscribe(workoutsState => {
      this.onRetrievedWorkoutsSuccess(workoutsState);
      
      this.onErrorWorkouts(workoutsState);
    })
    console.log("sessions onInit")
  }

  async ionViewWillEnter() {
    this.store.dispatch(retrieveSessions({ splitId: this.currentSplitId! }));
  }

  ngOnDestroy() {
    console.log("sessions onDestroy")
    if (this.loggingSessionsStateSubscriptionSessions) {
      this.loggingSessionsStateSubscriptionSessions.unsubscribe();
    }
    if (this.workoutsSubscription) {
      this.workoutsSubscription.unsubscribe();
    }
  }

  private onRetrievedWorkoutsSuccess(workoutsState: WorkoutsState) {
    if (workoutsState.isRetrievedWorkouts) {
      this.recentWorkouts = workoutsState.retrievedWorkouts;
      this.store.dispatch(resetRetrievedWorkoutsState());
      this.mapWorkoutsToSessions();
    }
  }

  private mapWorkoutsToSessions(): void {
    const updatedSessions = this.sessions.map(session => {
      const workoutInstance = this.recentWorkouts!.find(w => w.sessionId === session.sessionId);
      
      const updatedSession: Session = { ...session };
  
      if (workoutInstance) {
        const startTime = new Date(workoutInstance.startingDate!);
        const endTime = new Date(workoutInstance.endingDate!);
        updatedSession.estimatedTime = this.calculateDuration(startTime, endTime);
      } else {
        updatedSession.estimatedTime = 'No Workouts Logged';
      }
      
      return updatedSession;
    });
  
    this.sessions = updatedSessions;
  }
  
  async doRefresh(event: any) {
    this.refresherEvent = event;
    this.store.dispatch(retrieveSessions({ splitId: this.currentSplitId! }));
  }

  calculateDuration(start: Date, end: Date): string {
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}mins`;
  }

  private async onErrorWorkouts(workoutsState: WorkoutsState) {
    if (workoutsState.error) {
      this.presentToastMessage(workoutsState.error.message, true);
    }
  }
  
  private async onAddedSessionSuccess(loggingSessionsState: LoggingSessionsState) {
    if (loggingSessionsState.isAddedSession) {
      this.presentToastMessage('added', false);

      this.store.dispatch(resetAddedSessionState());
      this.store.dispatch(retrieveSessions({splitId: this.currentSplitId!}));
    }
  }

  private onUpdatedSessionSuccess(loggingSessionsState: LoggingSessionsState) {
    if (loggingSessionsState.isUpdatedSession) {
      this.presentToastMessage('updated', false);

      this.store.dispatch(resetUpdatedSessionState());
      this.store.dispatch(retrieveSessions({splitId: this.currentSplitId!}));
    }
  }
  
  private onDeletedSessionSuccess(loggingSessionsState: LoggingSessionsState) {
    if (loggingSessionsState.isDeletedSession) {
      this.presentToastMessage('deleted', false);

      this.store.dispatch(resetDeletedSessionState());
      this.store.dispatch(retrieveSessions({splitId: this.currentSplitId!}));
    }
  }

  private async presentToastMessage(message: string, error: boolean) {
    const toastSuccess = await this.toastController.create({
      position: "bottom",
      message: error ? message : 'Successfully ' + message + ' session!',
      color: error ? "danger" : "success",
      duration: 2500,
      cssClass: 'toast-custom',
    });
    toastSuccess.present();
  }

  private onRetrievedSessionsSuccess(loggingSessionsState: LoggingSessionsState) {
    if (loggingSessionsState.isRetrievedSessions) {
      const weekdayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      this.sessions = [...loggingSessionsState.retrievedSessions].sort((a, b) => {
        const weekdayA = weekdayOrder.indexOf(a.weekday);
        const weekdayB = weekdayOrder.indexOf(b.weekday);
        return weekdayA - weekdayB;
      });
      this.showEmptyMessage = this.sessions.length === 0;

      if (this.refresherEvent) {
        this.refresherEvent.target.complete();
        this.refresherEvent = undefined;
      }
      
      this.store.dispatch(resetRetrievedSessionsState());
      this.store.dispatch(retrieveWorkoutsBySplitId({ splitId: this.currentSplitId! }));
    }
  }

  private async onErrorSessions(loggingSessionsState: LoggingSessionsState) {
    if (loggingSessionsState.error) {
      this.presentToastMessage(loggingSessionsState.error.message, true);
    }
  }

  private toggleLoading(loggingSessionsState: LoggingSessionsState) {
    if (loggingSessionsState.isAddingSession || loggingSessionsState.isRetrievingSessions
      || loggingSessionsState.isDeletingSession || loggingSessionsState.isUpdatingSession) {
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    }
  }

  onSaveClickAdd() {
    this.store.dispatch(addSession({
      sessionName: this.addingForm.get('sessionName')?.value,
      weekday: this.addingForm.get('weekday')?.value,
      splitId: this.currentSplitId!
    }));
  
    this.addModal.dismiss();
  
    this.clearAddingForm();
  }
  

  clearAddingForm() {
    this.addingForm.get('sessionName')?.setValue('');
    this.addingForm.get('weekday')?.setValue('');
    this.addingForm.markAsUntouched();
  }

  clickedSession(sessionName: string, sessionId: string) {
    const workoutForSession = this.recentWorkouts!.find(workout => workout.sessionId === sessionId);

    this.router.navigate(['home', this.currentSplitName, this.currentSplitId, sessionName, sessionId],
      { replaceUrl: true, state: { recentWorkout: workoutForSession } }
    );
  }

  onSaveClickEdit() {
    this.store.dispatch(updateSession({
      sessionName: this.editingForm.get('sessionName')?.value,
      weekday: this.editingForm.get('weekday')?.value,
      splitId: this.currentSplitId!,
      sessionId: this.editingSession!.sessionId
    }));
  }

  onDeleteClick() {
    this.store.dispatch(deleteSession({
      splitId: this.currentSplitId!,
      sessionId: this.editingSession!.sessionId}));
  }

  openEditModal(session: Session) {
    this.editingSession = session;

    this.editingForm.patchValue({
      sessionName: session.sessionName,
      weekday: session.weekday
    });
    this.editModal.present();
  }

  navigateToHome() {
    this.router.navigate(['home', 'splits'], { replaceUrl: true });
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Quick Tip: Renaming Session',
      message: 'For minor changes, feel free to edit the session name. If it’s a different session altogether, it’s better to add a new session and remove this old one to keep the calendar consistent.',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  handleAddEnterKey(): void {
    if (this.addingForm.valid) {
      this.onSaveClickAdd();
      this.addModal.dismiss()
    }
  }

  handleEditEnterKey(): void {
    if (this.editingForm.valid) {
      this.onSaveClickEdit();
      this.editModal.dismiss()
    }
  }
}
