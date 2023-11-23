import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/store/AppState';
import { SplitsPageAddingForm } from './splits.page.adding.form';
import { addSplit, deleteSplit, resetAddedSplitState, resetDeletedSplitState,
  resetRetrievedSplitsState, resetUpdatedSplitState, retrieveSplits, updateSplit
  } from 'src/store/logging-splits/logging.splits.actions';
import { hide, show } from 'src/store/loading/loading.actions';
import { IonModal, ToastController } from '@ionic/angular';
import { LoggingSplitsState } from 'src/store/logging-splits/LoggingSplitsState';
import { Subscription } from 'rxjs';
import { Split } from 'src/app/model/Split';
import { SplitsPageEditingForm } from './splits.page.editing.form';

@Component({
  selector: 'app-splits',
  templateUrl: './splits.page.html',
  styleUrls: ['./splits.page.scss'],
})
export class SplitsPage implements OnInit, OnDestroy {

  @ViewChild('addModal') addModal!: IonModal;
  @ViewChild('editModal') editModal!: IonModal;
  
  editingSplit: Split | null = null;
  showEmptyMessage = false;
  splits: Split[] = [];
  addingForm!: FormGroup;
  editingForm!: FormGroup;
  loggingSplitsStateSubscriptionSplits: Subscription = new Subscription;
  private refresherEvent?: any;

  constructor(private router: Router, private formBuilder: FormBuilder,
    private store: Store<AppState>, private toastController: ToastController) {}

  ngOnInit() {
    this.addingForm = new SplitsPageAddingForm(this.formBuilder).createForm();
    this.editingForm = new SplitsPageEditingForm(this.formBuilder).createForm();

    this.loggingSplitsStateSubscriptionSplits = this.store.select('loggingSplits').subscribe(loggingSplitsState => {
      this.onAddedSplitSuccess(loggingSplitsState);
      this.onRetrievedSplitsSucess(loggingSplitsState);
      this.onDeletedSplitSuccess(loggingSplitsState);
      this.onUpdatedSplitSuccess(loggingSplitsState);

      this.onError(loggingSplitsState);
      this.toggleLoading(loggingSplitsState);
    })
    this.store.dispatch(retrieveSplits());
  }

  ngOnDestroy() {
    if (this.loggingSplitsStateSubscriptionSplits) {
      this.loggingSplitsStateSubscriptionSplits.unsubscribe();
    }
  }
  
  private async onAddedSplitSuccess(loggingSplitsState: LoggingSplitsState) {
    if (loggingSplitsState.isAddedSplit) {
      this.presentToastMessage('added', false);

      this.store.dispatch(resetAddedSplitState());
      this.store.dispatch(retrieveSplits());
    }
  }

  private onUpdatedSplitSuccess(loggingSplitsState: LoggingSplitsState) {
    if (loggingSplitsState.isUpdatedSplit) {
      this.presentToastMessage('updated', false);

      this.store.dispatch(resetUpdatedSplitState());
      this.store.dispatch(retrieveSplits());
    }
  }

  private onDeletedSplitSuccess(loggingSplitsState: LoggingSplitsState) {
    if (loggingSplitsState.isDeletedSplit) {
      this.presentToastMessage('deleted', false);

      this.store.dispatch(resetDeletedSplitState());
      this.store.dispatch(retrieveSplits());
    }
  }

  private async presentToastMessage(message: string, error: boolean) {
    const toastSuccess = await this.toastController.create({
      position: 'bottom',
      message: error ? message : 'Successfully ' + message + ' split!',
      color: error ? "danger" : "success",
      duration: 2500,
      cssClass: 'toast-custom',
    });

    toastSuccess.present();
  }

  private onRetrievedSplitsSucess(loggingSplitsState: LoggingSplitsState) {
    if (loggingSplitsState.isRetrievedSplits) {
      this.splits = loggingSplitsState.retrievedSplits;
      this.showEmptyMessage = loggingSplitsState.retrievedSplits.length === 0;

      if (this.refresherEvent) {
      this.refresherEvent.target.complete();
      this.refresherEvent = undefined;
    }

      this.store.dispatch(resetRetrievedSplitsState());
    }
  }

  private async onError(loggingSplitsState: LoggingSplitsState) {
    if (loggingSplitsState.error) {
      this.presentToastMessage(loggingSplitsState.error.message, true);
    }
  }

  private toggleLoading(loggingSplitsState: LoggingSplitsState) {
    if (loggingSplitsState.isAddingSplit || loggingSplitsState.isRetrievingSplits
      || loggingSplitsState.isDeletingSplit || loggingSplitsState.isUpdatingSplit) {
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    }
  }

  onSaveClickAdd() {
    this.store.dispatch(addSplit({
      splitName: this.addingForm.get('splitName')?.value,
      sessionsAmount: this.addingForm.get('sessionsAmount')?.value
    }));
    this.clearAddingForm();
  }

  clearAddingForm() {
    this.addingForm.get('splitName')?.setValue('');
    this.addingForm.get('sessionsAmount')?.setValue('');
    this.addingForm.markAsUntouched();
  }

  clickedSplit(splitName: string, splitId: string) {
    this.router.navigate(['home', splitName, splitId],
      { replaceUrl: true });
  }

  doRefresh(event: any) {
    this.refresherEvent = event;
    this.store.dispatch(retrieveSplits());
  }

  onSaveClickEdit() {
    this.store.dispatch(updateSplit({
      splitName: this.editingForm.get('splitName')?.value,
      sessionsAmount: this.editingForm.get('sessionsAmount')?.value,
      splitId: this.editingSplit!.splitId
    }));
  }

  onDeleteClick() {
    this.store.dispatch(deleteSplit({splitId: this.editingSplit!.splitId}));
  }

  clearEditingForm() {
    this.editingForm.markAsUntouched();
  }
  
  openEditModal(split: Split) {
    this.editingSplit = split;

    this.editingForm.patchValue({
      splitName: split.splitName,
      sessionsAmount: split.sessionsAmount
    });
    this.editModal.present();
  }

  handleEditEnterKey(): void {
    if (this.editingForm.valid) {
      this.onSaveClickEdit();
      this.editModal.dismiss()
    }
  }

  handleAddEnterKey(): void {
    if (this.addingForm.valid) {
      this.onSaveClickAdd();
      this.addModal.dismiss()
    }
  }
}