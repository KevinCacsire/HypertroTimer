import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPageForm } from './login.page.form';
import { AppState } from 'src/store/AppState';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { hide, show } from 'src/store/loading/loading.actions';
import { LoginState } from 'src/store/login/LoginState';
import { login, recoverPassword, register, resetRecoveredPassword, resetRegistered } from 'src/store/login/login.actions';
import { ToastController } from '@ionic/angular';
import { addDefaultSettings, resetAddedDefaultSettingsState } from 'src/store/settings/settings.actions';
import { SettingsState } from 'src/store/settings/SettingsState';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  showPassword = false;
  form!: FormGroup;
  loginStateSubscription: Subscription = new Subscription;
  settingsStateSubscription: Subscription = new Subscription;

  constructor(private formBuilder: FormBuilder, private store: Store<AppState>,
    private toastController: ToastController, private router: Router) { }

  ngOnInit() {
    this.form = new LoginPageForm(this.formBuilder).createForm();

    this.loginStateSubscription = this.store.select('login').subscribe(loginState => {
      this.onIsRecoveredPassword(loginState);
      this.onIsLoggedIn(loginState);
      this.onRegistered(loginState);

      this.onError1(loginState);
      this.toggleLoading1(loginState);
    })

    this.settingsStateSubscription = this.store.select('settings').subscribe(settingsState => {
      this.onIsAddedSettingsState(settingsState);

      this.onError2(settingsState);
    })

    console.log("login onInit")
  }

  ngOnDestroy() {
    console.log("login onDestroy")
    if (this.loginStateSubscription) {
      this.loginStateSubscription.unsubscribe();
    }
    if (this.settingsStateSubscription) {
      this.settingsStateSubscription.unsubscribe();
    }
  }

  private async onIsAddedSettingsState(settingsState: SettingsState) {
    if (settingsState.isAddedSettings) {
      this.store.dispatch(resetAddedDefaultSettingsState());
    }
  }

  private async onError2(settingsState: SettingsState) {
    if (settingsState.error) {
      this.presentToastMessage(settingsState.error.message, true);
    }
  }
  
  private async onIsRecoveredPassword(loginState: LoginState) {
    if (loginState.isRecoveredPassword) {
      this.presentToastMessage("Recovery email sent!", false);

      this.store.dispatch(resetRecoveredPassword());
    }
  }

  private onIsLoggedIn(loginState: LoginState) {
    if (loginState.isLoggedIn) {
      this.router.navigate(['home', 'splits'],
        { replaceUrl: true });
    }
  }
  
  private async onRegistered(loginState: LoginState) {
    if (loginState.isRegistered) {
      this.store.dispatch(addDefaultSettings({ darkmode: false, audioOn: true, volume: 0.5,  selectedAudioFile: 'bikebell-ding.wav' }));
      this.presentToastMessage("You have registered. Please login now!", false);
      this.store.dispatch(resetRegistered());
    }
  }
  
  private async onError1(loginState: LoginState) {
    if (loginState.error) {
      this.presentToastMessage(loginState.error.message, true);
      console.log(loginState)
    }
  }

  private async presentToastMessage(message: string, error: boolean) {
    const toastSuccess = await this.toastController.create({
      position: "bottom",
      message: message,
      color: error ? "danger" : "success",
      duration: 3500,
    });
    toastSuccess.present();
  }

  private toggleLoading1(loginState: LoginState) {
    if (loginState.isLoggingIn || loginState.isRecoveringPassword || loginState.isRegistering) {
      this.store.dispatch(show());
    } else {
      this.store.dispatch(hide());
    }
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  forgotEmailPassword() {
    this.store.dispatch(recoverPassword({email: this.form.get('email')?.value}));
  }

  login() {
    if (this.form.valid) {
      this.store.dispatch(login({email: this.form.get('email')?.value,
        password: this.form.get('password')?.value}));
    }
  }

  registration() {
    this.store.dispatch(register({userRegister: this.form.value}));
  }
}
