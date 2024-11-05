import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CrearviajesPage } from './crearviajes.page';

const routes: Routes = [
  {
    path: '',
    component: CrearviajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CrearviajesPageRoutingModule {}
