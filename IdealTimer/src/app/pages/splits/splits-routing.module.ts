import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SplitsPage } from './splits.page';

const routes: Routes = [
  {
    path: '',
    component: SplitsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplitsPageRoutingModule {}
