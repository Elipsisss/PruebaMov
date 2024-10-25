import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearviajesPageRoutingModule } from './crearviajes-routing.module';

import { CrearviajesPage } from './crearviajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearviajesPageRoutingModule
  ],
  declarations: [CrearviajesPage]
})
export class CrearviajesPageModule {}
