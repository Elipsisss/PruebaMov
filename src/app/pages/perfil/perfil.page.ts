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
  siEditaGenero: boolean = false; 
  siEditaSede: boolean = false;   
  tempGenero: string = '';
  tempSede: string = '';

  constructor(private usuarioService: UsuarioService, private alertController: AlertController) { }

  // Al iniciar el componente, obtenemos el usuario
  async ngOnInit() {
    
    await this.obtenerUsuario();
    this.usuario.nombre = this.formatoNombre(this.usuario.nombre);
    this.usuario.apellido = this.formatoApellido(this.usuario.apellido);
    this.usuario.sede = this.formatoSede(this.usuario.sede);
    this.tempGenero = this.usuario.genero;  
    this.tempSede = this.usuario.sede;
  }

  // Obtiene el usuario autenticado dir ectamente desde el servicio
  async obtenerUsuario() {
    this.usuario = await this.usuarioService.getUsuarioAutenticado();
    if (this.usuario) {
      this.tempGenero = this.usuario.genero; 
      this.tempSede = this.usuario.sede; 
    }
  }

  // Formatea los valores de texto para los campos
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

  // Modifica el género del usuario y lo actualiza en Firestore
// Modifica el género del usuario y lo actualiza en Firestore
// Modifica el género del usuario y lo actualiza en Firestore
async modificarGenero() {
  const rut_modificar = this.usuario.rut || ""; 
  this.usuario.genero = this.tempGenero; 

  const success = await this.usuarioService.updateUsuario(rut_modificar, this.usuario);
  if (success) {
  
    localStorage.setItem('user', JSON.stringify(this.usuario));  
    await this.presentAlert('Perfecto!', 'Género modificado correctamente');
    this.siEditaGenero = false; 

    this.usuario = await this.usuarioService.getUsuarioAutenticado(); 
    this.tempGenero = this.usuario.genero; 
  } else {
    await this.presentAlert('Error!', 'No se pudo modificar el género');
  }
}
async modificarSede() {
  const rut_modificar = this.usuario.rut?.trim(); 
  
  if (!rut_modificar) {
    // Validar que el RUT sea válido
    await this.presentAlert('Error!', 'El RUT es inválido o no está definido.');
    return;
  }

  if (!this.tempSede || this.tempSede.trim() === "") {
    // Validar que la nueva sede sea válida
    await this.presentAlert('Error!', 'Debe ingresar una sede válida.');
    return;
  }

  try {
    this.usuario.sede = this.tempSede.trim(); // Asignar la nueva sede (sin espacios extra)
    const success = await this.usuarioService.updateUsuario(rut_modificar, this.usuario);

    if (success) {
      // Actualiza el almacenamiento local con los nuevos datos
      localStorage.setItem('user', JSON.stringify(this.usuario));  // Guarda los datos actualizados en localStorage
      await this.presentAlert('Perfecto!', 'Sede modificada correctamente.');
      this.siEditaSede = false; // Ocultar botones de edición
      this.usuario = await this.usuarioService.getUsuarioAutenticado(); // Obtener datos actualizados del usuario
      this.tempSede = this.usuario.sede; // Asegúrate de que los datos locales se actualicen
    } else {
      await this.presentAlert('Error!', 'No se pudo modificar la sede. Inténtalo de nuevo.');
    }
  } catch (error) {
    console.error('Error al modificar la sede:', error);
    await this.presentAlert('Error!', 'Ocurrió un error inesperado al modificar la sede.');
  }
}


  

  // Cancela la edición del género
  async cancelarEdicionGenero() {
    this.siEditaGenero = false; 
    this.tempGenero = this.usuario.genero; 
  }

  // Cancela la edición de la sede
  async cancelarEdicionSede() {
    this.siEditaSede = false; 
    this.tempSede = this.usuario.sede; 
  }

  // Muestra una alerta
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Entendido'],
    });
    await alert.present();
  }
}