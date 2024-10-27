import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/services/viaje.service';
import { UsuarioService } from 'src/app/services/usuario-service.service';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {

  viajes: any[] = [];
  usuarios: any = {};

  constructor(private viajeService: ViajeService, private usuarioService: UsuarioService) { }

  async ngOnInit() {
    await this.Datos();
  }



  async Datos() {
    this.viajes = await this.viajeService.getViajes();

    this.usuarios = await this.usuarioService.getUsuarios();

  }

}