import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private menu: MenuController, private router: Router) {}
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

  viaje(){
    this.menu.close();
    this.router.navigate(['/viaje']);
  }
  administrar(){
    this.menu.close();
    this.router.navigate(['/administration']);
  }
}
