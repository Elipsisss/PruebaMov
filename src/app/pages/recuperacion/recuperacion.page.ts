import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario-service.service';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa AngularFireAuth

@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage implements OnInit {
  user: FormGroup;

  constructor(
    private alertController: AlertController, 
    private usuarioService: UsuarioService,
    private afAuth: AngularFireAuth // Inyecta AngularFireAuth
  ) {
    this.user = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")
      ])
    });
  }

  ngOnInit() {}

  // Función para mostrar alertas
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async submit() {
    const email = this.user.get('email')?.value;
  
    if (this.user.valid) {
      try {
 
        await this.afAuth.sendPasswordResetEmail(email);
     
        await this.presentAlert('Se ha enviado un código a su correo electrónico', '');
        this.user.reset(); 
      } catch (error: unknown) { 
        if (error instanceof Error) {

          console.error('Error al enviar correo de recuperación: ', error.message);
          
      
          if (error.message.includes('auth/user-not-found')) {
            await this.presentAlert('El correo no está registrado', '');
          } else {
            await this.presentAlert('Hubo un error al enviar el correo', '');
          }
        } else {
    
          console.error('Error inesperado: ', error);
          await this.presentAlert('Hubo un error desconocido', '');
        }
      }
    } else {
      await this.presentAlert('Correo no válido', '');
    }
  }
}  