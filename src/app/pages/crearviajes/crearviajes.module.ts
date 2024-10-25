import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearviajesPageRoutingModule } from './crearviajes-routing.module';

import { CrearviajesPage } from './crearviajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearviajesPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CrearviajesPage]
})
export class CrearviajesPageModule {}
