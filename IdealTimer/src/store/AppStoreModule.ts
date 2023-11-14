// app.store.module.ts

import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { loadingReducer } from './loading/loading.reducers';
import { loggingExercisesReducer } from './logging-exercises/logging.exercises.reducers';
import { loginReducer } from './login/login.reducers';
import { LoginEffects } from './login/login.effects';
import { loggingSplitsReducer } from './logging-splits/logging.splits.reducers';
import { LoggingSplitsEffects } from './logging-splits/logging.splits.effects';
import { loggingSessionsReducer } from './logging-sessions/logging.sessions.reducers';
import { LoggingSessionsEffects } from './logging-sessions/logging.sessions.effects';
import { LoggingExercisesEffects } from './logging-exercises/logging.exercises.effects';
import { workoutsReducer } from './workouts/workouts.reducers';
import { WorkoutsEffects } from './workouts/workouts.effects';
import { settingsReducer } from './settings/settings.reducers';
import { SettingsEffects } from './settings/settings.effects';

@NgModule({
  imports: [
    StoreModule.forRoot({
      loading: loadingReducer,
      loggingSplits: loggingSplitsReducer,
      loggingSessions: loggingSessionsReducer,
      loggingExercises: loggingExercisesReducer,
      workouts: workoutsReducer,
      login: loginReducer,
      settings: settingsReducer,
      // ... add any other reducers here ...
    }),
    EffectsModule.forRoot([
      LoginEffects,
      LoggingSplitsEffects,
      LoggingSessionsEffects,
      LoggingExercisesEffects,
      WorkoutsEffects,
      SettingsEffects,
      // ... add any other root effects here ...
    ]),
    // If you have any feature store modules, register them with forFeature
  ],
})
export class AppStoreModule {}
