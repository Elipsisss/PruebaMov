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
  usuario: any;
  usuarioReservado: boolean = false;

  constructor(private viajeService: ViajeService, private usuarioService: UsuarioService,     private router: Router, private route: ActivatedRoute ) { }

  async ngOnInit() {
    await this.Datos();
    await this.desactivarRecurrente()
  }



  async Datos() {
    this.viajes = await this.viajeService.getViajes();
    this.usuario = JSON.parse(localStorage.getItem("user") || '');
  }


  async tomarReserva(viajeId: string) {
    if (viajeId) {
      try {
        const viaje = this.viajes.find(v => v.id === viajeId);
        this.usuarioReservado = viaje?.pasajeros?.some((p: string) => p === this.usuario.rut) || false;
  
        if (this.usuarioReservado) {
          this.showAlert('Reserva duplicada', 'Ya has reservado este viaje.');
          return; 
        }
        const agregado = await this.viajeService.agregarPasajero(viajeId, this.usuario.rut);
        if (agregado) {
          this.showAlert('Reserva exitosa', 'Reserva realizada con éxito.');
          this.router.navigate(['/detalle-reserva', viajeId]);
        } else {
          this.showAlert('Error', 'No se pudo realizar la reserva. Inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error al reservar el viaje:', error);
        this.showAlert('Error', 'Ocurrió un error al reservar el viaje. Inténtalo de nuevo.');
      }
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
  }





  async desactivarRecurrente() {
    this.viajes = await this.viajeService.getViajes(); 
    this.viajes = this.viajes.filter(viaje => viaje.conductor != this.usuario.nombre);
  }



}