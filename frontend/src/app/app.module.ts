import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppStoreModule } from 'src/store/AppStoreModule';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { LoadingComponent } from './components/loading/loading.component';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import { EffectsModule } from '@ngrx/effects';
import { LoginEffects } from 'src/store/login/login.effects';
import { LoggingExercisesEffects } from 'src/store/logging-exercises/logging.exercises.effects';
import { HttpClientModule } from '@angular/common/http';
import { LoggingSplitsEffects } from 'src/store/logging-splits/logging.splits.effects';
import { LoggingSessionsEffects } from 'src/store/logging-sessions/logging.sessions.effects';
import { WorkoutsEffects } from 'src/store/workouts/workouts.effects';
import { TabBarComponent } from './components/tab-bar/tab-bar.component';
import { PopoverComponent } from './components/popover/popover.component';
import { SettingsEffects } from 'src/store/settings/settings.effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const BASE_URL = 'https://peaceful-lowlands-98665-81c4d5d7b0be.herokuapp.com';
//export const BASE_URL = 'http://localhost:3000';
export const firebaseApp = initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [AppComponent, LoadingComponent, TabBarComponent,
    PopoverComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AppStoreModule,
    EffectsModule.forRoot([
      LoginEffects,
      LoggingSessionsEffects,
      LoggingSplitsEffects,
      LoggingExercisesEffects,
      WorkoutsEffects,
      SettingsEffects
    ]),
    HttpClientModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    FormsModule,
    ReactiveFormsModule,],
  providers: [{ provide: RouteReuseStrategy,
    useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
