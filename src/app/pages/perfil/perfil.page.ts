import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario-service.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any = {}; 
  siEditaGenero: boolean = false; // Estado para editar género
  siEditaSede: boolean = false;   // Estado para editar sede
  tempGenero: string = '';
  tempSede: string = '';

  constructor(private usuarioService: UsuarioService, private alertController: AlertController) { }

  async ngOnInit() {
    await this.obtenerUsuario();
    this.usuario.nombre = this.formatoNombre(this.usuario.nombre);
    this.usuario.apellido = this.formatoApellido(this.usuario.apellido);
    this.usuario.sede = this.formatoSede(this.usuario.sede);
    this.tempGenero = this.usuario.genero;  
    this.tempSede = this.usuario.sede; // Inicializa el valor temporal de la sede
  }

  async obtenerUsuario() {
    this.usuario = await this.usuarioService.getUsuarioAutenticado();
    this.tempGenero = this.usuario.genero; 
    this.tempSede = this.usuario.sede; // Inicializa el valor temporal de la sede
  }

  private formatoSede(value: string): string {
    return value
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatoNombre(value: string): string {
    return value
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatoApellido(value: string): string {
    return value
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  async modificarGenero() {
    const rut_modificar = this.usuario.rut || ""; 
    this.usuario.genero = this.tempGenero; // Actualiza el género del usuario

    const success = await this.usuarioService.updateUsuario(rut_modificar, this.usuario);
    if (success) {
      await this.presentAlert('Perfecto!', 'Género modificado correctamente');
      this.siEditaGenero = false; // Ocultar botones después de guardar
      this.usuario = await this.usuarioService.getUsuarioAutenticado(); // Recargar el usuario actualizado
    } else {
      await this.presentAlert('Error!', 'No se pudo modificar el género');
    }
  }

  async modificarSede() {
    const rut_modificar = this.usuario.rut || ""; 
    this.usuario.sede = this.tempSede; // Actualiza la sede del usuario

    const success = await this.usuarioService.updateUsuario(rut_modificar, this.usuario);
    if (success) {
      await this.presentAlert('Perfecto!', 'Sede modificada correctamente');
      this.siEditaSede = false; // Ocultar botones después de guardar
      this.usuario = await this.usuarioService.getUsuarioAutenticado(); // Recargar el usuario actualizado
    } else {
      await this.presentAlert('Error!', 'No se pudo modificar la sede');
    }
  }

  async cancelarEdicionGenero() {
    this.siEditaGenero = false; 
    this.tempGenero = this.usuario.genero; // Restaura el valor anterior del género
  }

  async cancelarEdicionSede() {
    this.siEditaSede = false; 
    this.tempSede = this.usuario.sede; // Restaura el valor anterior de la sede
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Entendido'],
    });
    await alert.present();
  }
}
