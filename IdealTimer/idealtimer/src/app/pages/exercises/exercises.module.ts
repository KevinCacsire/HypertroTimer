import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExercisesPageRoutingModule } from './exercises-routing.module';

import { ExercisesPage } from './exercises.page';
import { ExerciseItemComponent } from 'src/app/components/exercise-item/exercise-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExercisesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    ExercisesPage,
    ExerciseItemComponent
  ]
})
export class ExercisesPageModule {}
