import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { UsuarioService } from './services/usuario-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private menu: MenuController, private usuarioService: UsuarioService, private router: Router) {}
  salir(){
    this.menu.close();
    this.router.navigate(['/login']);
  }
  perfil(){
    this.menu.close();
    this.router.navigate(['/perfil']);
  }

  home(){
    this.menu.close();
    this.router.navigate(['/home']);
  }
  
  crearViaje(){
    this.menu.close();
    this.router.navigate(['/crearviajes']);
  }

  viaje(){
    this.menu.close();
    this.router.navigate(['/viaje']);
  }
  administrar(){
    this.menu.close();
    this.router.navigate(['/administration']);
  }
  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin'; 
  }

  verificarAuto(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.tiene_auto === 'si'; 
  }

  detalleReserva(){
    this.menu.close();
    this.router.navigate(['/detalle-reserva']);
  }



}


