import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SplitsPageRoutingModule } from './splits-routing.module';
import { SplitsPage } from './splits.page';
import { SplitItemComponent } from 'src/app/components/split-item/split-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SplitsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    SplitsPage,
    SplitItemComponent
  ]
})
export class SplitsPageModule {
}
