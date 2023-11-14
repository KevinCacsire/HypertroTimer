import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SessionsPageRoutingModule } from './sessions-routing.module';

import { SessionsPage } from './sessions.page';
import { SessionItemComponent } from 'src/app/components/session-item/session-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SessionsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    SessionsPage,
    SessionItemComponent
  ]
})
export class SessionsPageModule {}
