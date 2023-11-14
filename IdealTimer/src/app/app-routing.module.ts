import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth/auth-guard';
import { TabBarComponent } from './components/tab-bar/tab-bar.component';

const routes: Routes = [
  { path: '', redirectTo: '/loader', pathMatch: 'full'},
  {
    path: 'splits',
    loadChildren: () => import('./pages/splits/splits.module').then( m => m.SplitsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: ':splitName/:splitId',
    loadChildren: () => import('./pages/sessions/sessions.module').then( m => m.SessionsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: ':splitName/:splitId/:sessionName/:sessionId',
    loadChildren: () => import('./pages/exercises/exercises.module').then(m => m.ExercisesPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: ':splitName/:splitId/:sessionName/:sessionId/workout',
    loadChildren: () => import('./pages/workout/workout.module').then( m => m.WorkoutPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'calendar',
    loadChildren: () => import('./pages/calendar/calendar.module').then( m => m.CalendarPageModule),
    canLoad: [AuthGuard]
  },
  { path: '**', redirectTo: 'loader' },
];

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', redirectTo: 'loader', pathMatch: 'full'},
      {
        path: 'loader',
        loadChildren: () => import('./pages/loader/loader.module').then( m => m.LoaderPageModule)},
      {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)},
      {
        path: 'home',
        component: TabBarComponent,
        children: routes,
        canLoad: [AuthGuard]
      },
      { path: '**', redirectTo: 'loader' },
    ], { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
