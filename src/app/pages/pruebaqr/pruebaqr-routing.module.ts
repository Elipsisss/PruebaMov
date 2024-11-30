import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PruebaqrPage } from './pruebaqr.page';

const routes: Routes = [
  {
    path: '',
    component: PruebaqrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PruebaqrPageRoutingModule {}
