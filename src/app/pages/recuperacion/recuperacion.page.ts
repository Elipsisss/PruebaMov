import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario-service.service';


@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.page.html',
  styleUrls: ['./recuperacion.page.scss'],
})
export class RecuperacionPage implements OnInit {
  user: FormGroup;

  constructor(private alertController: AlertController, private usuarioService: UsuarioService ) {
    this.user = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")])
    });
  }

  ngOnInit() {}

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
      // Verificar si el usuario está registrado
      const usuarios = await this.usuarioService.getUsuarios();
      const usuarioEncontrado = usuarios.find(user => user.email === email);
      
      if (usuarioEncontrado) {
        // Simular el envío de un correo electrónico
        await this.presentAlert('Se ha enviado un código a su correo electrónico', '');
        this.user.reset();
      } else {
        await this.presentAlert('El correo no está registrado', '');
      }
    } else {
      await this.presentAlert('Correo no válido', '');
    }
  }
}
