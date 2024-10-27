import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-detalle-reserva',
  templateUrl: './detalle-reserva.page.html',
  styleUrls: ['./detalle-reserva.page.scss'],
})
export class DetalleReservaPage implements OnInit {
  viajesReservados: any[] = []; // Array para almacenar los viajes reservados
  usuario: any;

  constructor(private viajeService: ViajeService) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    // Obtén el usuario actual
    this.usuario = JSON.parse(localStorage.getItem("user") || '{}');

    // Obtén todos los viajes
    const todosLosViajes = await this.viajeService.getViajes();

    // Filtra los viajes donde el usuario está en la lista de pasajeros
    this.viajesReservados = todosLosViajes.filter((viaje: any) =>
      viaje.pasajeros && viaje.pasajeros.includes(this.usuario.nombre)
    );
  }


  async cancelarReserva(viajeId: string) {
    const cancelado = await this.viajeService.cancelarReserva(viajeId, this.usuario.nombre);
    if (cancelado) {
      alert('Reserva cancelada con éxito.');
      // Actualiza la lista de reservas después de cancelar
      await this.cargarDatos();
    } else {
      alert('No se pudo cancelar la reserva. Inténtalo de nuevo.');
    }
  }
}






 


