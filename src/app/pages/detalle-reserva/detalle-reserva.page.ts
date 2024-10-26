import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})
export class DetalleReservaPage implements OnInit {
  reserva: any;

  constructor(private viajeService: ViajeService, private router: Router) {}

  async ngOnInit() {
    await this.getViajeDetails('id');
  }

  async getViajeDetails(id: string) {
    try {
      let viaje = await this.viajeService.getViaje(id);
      console.log(viaje);
    } catch (error) {
      console.error('Error fetching viaje:', error);
    }
  }
}
