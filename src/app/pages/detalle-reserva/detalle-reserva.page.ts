import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViajeService } from 'src/app/services/viaje.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})
export class DetalleReservaPage implements OnInit {
  reserva: any;

  constructor(
    private viajeService: ViajeService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.getViajeDetails(id);
    } else {
      console.error('No ID provided in route');
    }
  }

  async getViajeDetails(id: string) {
    try {
      let viaje = await this.viajeService.getViaje(id);
      this.reserva = viaje;
      console.log(viaje);
    } catch (error) {
      console.error('Error fetching viaje:', error);
    }
  }
}
