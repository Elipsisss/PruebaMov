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
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  async perfil(){
    this.menu.close();
    this.router.navigate(['/perfil']);
    await this.router.navigate(['/perfil']);
    window.location.reload();
  }

  home(){
    this.menu.close();
    this.router.navigate(['/home']);
  }
  
  async crearViaje(){
    this.menu.close();
    await this.router.navigate(['/crearviajes']);
    window.location.reload();
  }

  async viaje(){
    this.menu.close();
    await this.router.navigate(['/viaje']);
    window.location.reload();
  }

  async tusViajes(){
    this.menu.close();
    await this.router.navigate(['/tus-viajes']);
    window.location.reload();
  }

  async administrar(){
    this.menu.close();
    await this.router.navigate(['/administration']);
    window.location.reload();
  }
  
  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === 'admin'; 
  }

  verificarAuto(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.tiene_auto === 'si'; 
  }

  async apotaQr(){
    this.menu.close();
    await this.router.navigate(['pruebaqr']);
    window.location.reload();
  }



  async tiempoAPI(){
    this.menu.close();
    await this.router.navigate(['tiempo']);
    window.location.reload();
  }





   detalleReserva(){
    this.menu.close();
    this.router.navigate(['/detalle-reserva/:id']);
  }

}


