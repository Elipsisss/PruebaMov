import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/services/viaje.service';
import { UsuarioService } from 'src/app/services/usuario-service.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-tus-viajes',
  templateUrl: './tus-viajes.page.html',
  styleUrls: ['./tus-viajes.page.scss'],
})
export class TusViajesPage implements OnInit {

  viajes: any[] = [];
  usuario: any;

  constructor(private viajeService: ViajeService, private usuarioService: UsuarioService,     private router: Router, private route: ActivatedRoute ) { }

  async ngOnInit() {
    await this.Datos();
    await this.desactivarRecurrente()
  }



  async Datos() {
    this.viajes = await this.viajeService.getViajes();
    this.usuario = JSON.parse(localStorage.getItem("user") || '');
  }


  /*  este metodo se esta ocupando en este TS ?? o porque esta aqui ? 

  async tomarReserva(viajeId: string) {
    if (viajeId) {
      try {
        const agregado = await this.viajeService.agregarPasajero(viajeId, this.usuario.rut);
        if (agregado) {
          console.log(agregado);
          alert('Reserva realizada con éxito.');
          this.router.navigate(['/detalle-reserva', viajeId]); 
          alert('No se pudo realizar la reserva. Inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error al reservar el viaje:', error);
      }
    }
  }
  */

  async desactivarRecurrente() {
    this.viajes = await this.viajeService.getViajes(); 
    this.viajes = this.viajes.filter(viaje => viaje.conductor === this.usuario.nombre);
  }



}