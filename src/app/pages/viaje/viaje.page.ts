import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/services/viaje.service';
import { UsuarioService } from 'src/app/services/usuario-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {

  viajes: any[] = [];
  usuarios: any = {};

  constructor(private viajeService: ViajeService, private usuarioService: UsuarioService,     private router: Router, private route: ActivatedRoute ) { }

  async ngOnInit() {
    await this.Datos();
  }



  async Datos() {
    this.viajes = await this.viajeService.getViajes();
    this.usuarios = await this.usuarioService.getUsuarios();
  }


  async tomarReserva(viajeId: string) {
    if (viajeId) {
      try {
        const agregado = await this.viajeService.agregarPasajero(viajeId, this.usuarios);
        if (agregado) {
          alert('Reserva realizada con éxito.');
          this.router.navigate(['/detalle-reserva', viajeId]); // Redirige a la página de detalle de reserva
        } else {
          alert('No se pudo realizar la reserva. Inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error al reservar el viaje:', error);
      }
    }
  }





}