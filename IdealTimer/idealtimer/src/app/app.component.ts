import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SoundService } from 'src/app/services/sound.service';
import { AudioFile } from 'src/app/model/AudioFile'; 
import { Store } from '@ngrx/store';
import { AppState } from 'src/store/AppState';
import { Subscription } from 'rxjs';
import { SettingsState } from 'src/store/settings/SettingsState';
import { resetRetrievedSettingsState, retrieveSettings, updateSettings } from 'src/store/settings/settings.actions';
import { SidemenuSettings } from 'src/app/model/SidemenuSettings';
import { IonModal, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { deleteAccount, logout, resetDeletedAccount } from 'src/store/login/login.actions';
import { LoginState } from 'src/store/login/LoginState';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('faqModal') faqModal: IonModal | undefined;
  @ViewChild('aboutUsModal') aboutUsModal: IonModal | undefined;
  @ViewChild('contactUsModal') contactUsModal: IonModal | undefined;
  @ViewChild('deleteAccountModal') deleteAccountModal: IonModal | undefined;

  public appPages = [];
  showSoundOptionsList = false;
  allSoundOptions?: AudioFile[];
  settingsStateSubscription: Subscription = new Subscription;
  loginStateSubscription: Subscription = new Subscription;
  currentSettings: SidemenuSettings  = {
    darkmode: false,
    audioOn: true,
    volume: 0.5,
    selectedAudioFile: 'bikebell-ding.wav'
  };
  audio?: HTMLAudioElement;
  retrievedSettings?: SidemenuSettings;
  showSidemenu: boolean = false;

  constructor(private store: Store<AppState>, private toastController: ToastController,
    private soundService: SoundService, private router: Router) {
    window.addEventListener('beforeunload', this.menuClosed.bind(this));
  }

  isMenuVisible(): boolean {
    return !(this.router.url.includes('/login') || this.router.url.includes('/workout'));
  }

  ngOnInit() {
    this.settingsStateSubscription = this.store.select('settings').subscribe(settingsState => {
      this.onIsRetrievedSettingsSuccess(settingsState);

      this.onErrorSettings(settingsState);
    })
    this.loginStateSubscription = this.store.select('login').subscribe(loginState => {
      this.onIsDeletedAccountSuccess(loginState);
    })
    console.log("appComponent onInit")
  }

  ngOnDestroy() {
    console.log("appComponent onDestroy")
    if (this.settingsStateSubscription) {
      this.settingsStateSubscription.unsubscribe();
    }
    if (this.loginStateSubscription) {
      this.loginStateSubscription.unsubscribe();
    }
  }
  
  private async onIsRetrievedSettingsSuccess(settingsState: SettingsState) {
    if (settingsState.isRetrievedSettings) {
      this.currentSettings = settingsState.retrievedSettings;
      this.retrievedSettings = settingsState.retrievedSettings;
      this.store.dispatch(resetRetrievedSettingsState());
    }
  }

  private async onErrorSettings(settingsState: SettingsState) {
    if (settingsState.error) {
      this.presentToastMessage(settingsState.error.message, true, false);
    }
  }

  private async onIsDeletedAccountSuccess(loginState: LoginState) {
    if (loginState.isDeleted) {
      this.presentToastMessage("Account successfully deleted!", false, true);
      this.store.dispatch(resetDeletedAccount());
    }
  }

  private async presentToastMessage(message: string, error: boolean, positionedOnBottom: boolean) {
    const toastSuccess = await this.toastController.create({
      position: "bottom",
      message: message,
      color: error ? "danger" : "success",
      duration: error ? 2500 : 3500,
      cssClass: positionedOnBottom ? '' : 'toast-custom',
    });
    toastSuccess.present();
  }

  getSoundNameWithoutExtension(fullName: string): string {
    const indexOfDot = fullName.indexOf('.');
    if (indexOfDot !== -1) {
      return fullName.substring(0, indexOfDot);
    }
    return fullName;
  }

  menuOpened() {
    this.store.dispatch(retrieveSettings());
    this.allSoundOptions = this.soundService.fetchSoundOptions();
  }

  menuClosed() {
    if (this.retrievedSettings != this.currentSettings) {
      this.store.dispatch(updateSettings({
        darkmode: this.currentSettings?.darkmode!,
        audioOn: this.currentSettings?.audioOn!,
        volume: this.currentSettings?.volume!,
        selectedAudioFile: this.currentSettings?.selectedAudioFile!
      }))
    }
  }

  toggleDarkMode() {
    this.currentSettings = {
      ...this.currentSettings,
      darkmode: !this.currentSettings.darkmode,
    };
  }
  
  toggleSound() {
    this.currentSettings = {
      ...this.currentSettings,
      audioOn: !this.currentSettings.audioOn,
    };
    if (this.currentSettings.audioOn) {
      this.saveAndStoreAudio();
    }
  }

  adjustVolume(event: any) {
    this.currentSettings = {
      ...this.currentSettings,
      volume: event.detail.value,
    };
    this.saveAndStoreAudio();
  }
  
  soundSelected(event: any) {
    this.currentSettings = {
      ...this.currentSettings,
      selectedAudioFile: event.detail.value,
    };
    this.saveAndStoreAudio();
  }
  
  private saveAndStoreAudio() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
    this.audio = new Audio(`assets/sound-effects/${this.currentSettings.selectedAudioFile}`);
    this.audio.volume = this.currentSettings.audioOn ? this.currentSettings.volume! : 0;
    this.audio.play();
  }

  showSoundOptions() {
    this.showSoundOptionsList = true;
  }

  getVolumeIconName(volume: number): string {
    if (!this.currentSettings.audioOn) {
      return 'volume-mute';
    }
    if (volume === 0) {
      return 'volume-off';
    } else if (volume >= 0.1 && volume <= 0.3) {
      return 'volume-low';
    } else if (volume >= 0.4 && volume <= 0.7) {
      return 'volume-medium';
    } else if (volume >= 0.8 && volume <= 1.0) {
      return 'volume-high';
    }
    return 'volume-off';
  }

  async openFaqModal() {
    if (this.faqModal) {
      await this.faqModal.present();
    }
  }

  cancelFaqModal() {
    this.faqModal!.dismiss();
  }

  async openAboutUsModal() {
    if (this.aboutUsModal) {
      await this.aboutUsModal!.present();
    }
  }

  cancelAboutUsModal() {
    this.aboutUsModal!.dismiss();
  }

  async openContactUsModal() {
    if (this.contactUsModal) {
      await this.contactUsModal!.present();
    }
  }

  cancelContactUsModal() {
    this.contactUsModal!.dismiss();
  }

  async openDeleteAccountModal() {
    if (this.deleteAccountModal) {
      await this.deleteAccountModal!.present();
    }
  }

  cancelDeleteAccountModal() {
    this.deleteAccountModal!.dismiss();
  }

  logout() {
    this.store.dispatch(logout());
  }

  deleteAccount() {
    this.deleteAccountModal!.dismiss();
    this.store.dispatch(deleteAccount());
    this.store.dispatch(logout());
  }
}
