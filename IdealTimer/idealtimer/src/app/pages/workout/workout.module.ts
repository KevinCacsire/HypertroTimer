import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutPageRoutingModule } from './workout-routing.module';

import { WorkoutPage } from './workout.page';
import { VolumeItemComponent } from 'src/app/components/volume-item/volume-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutPageRoutingModule,
  ],
  declarations: [
    WorkoutPage,
    VolumeItemComponent
  ]
})
export class WorkoutPageModule {}
