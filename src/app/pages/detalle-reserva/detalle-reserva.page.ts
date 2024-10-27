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
  viaje: any; 

  constructor( private viajeService: ViajeService, private router: Router, private route: ActivatedRoute ) {}

  async ngOnInit() {
    const viajeId = this.route.snapshot.paramMap.get('id');
    if (viajeId) {
      await this.cargarViaje(viajeId);
    }
  }

  async cargarViaje(id: string) {
    try {
      this.viaje = await this.viajeService.getViaje(id);
      if (!this.viaje) {
        console.error("El viaje no fue encontrado.");
        // Opcional: redirigir o mostrar mensaje de error en la vista
      }
    } catch (error) {
      console.error("Error al obtener el viaje:", error);
      // Opcional: redirigir o manejar el error en la vista
    }
  }
}
