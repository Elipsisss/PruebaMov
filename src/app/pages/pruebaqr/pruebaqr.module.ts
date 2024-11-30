import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PruebaqrPageRoutingModule } from './pruebaqr-routing.module';

import { PruebaqrPage } from './pruebaqr.page';
import {QRCodeModule} from 'angularx-qrcode';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PruebaqrPageRoutingModule,
    QRCodeModule
  ],
  declarations: [PruebaqrPage]
})
export class PruebaqrPageModule {}
