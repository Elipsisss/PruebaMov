import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario-service.service';

@Component({
  selector: 'app-administrar',
  templateUrl: './administration.page.html',
  styleUrls: ['./administration.page.scss'],
})
export class AdministrationPage implements OnInit {
  persona = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]),
    apellido: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z]{3,15}")]),
    rut: new FormControl('', [Validators.required, Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    fecha_nacimiento: new FormControl('', [Validators.required, this.anios(18, 100)]),
    email: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    genero: new FormControl('', [Validators.required]),
    sede: new FormControl('', [Validators.required]),
    tiene_auto: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
    marca_auto: new FormControl('', [this.validarMarcaAuto.bind(this)]),
    patente: new FormControl('', [Validators.pattern(/^[A-Z]{4}[0-9]{2}$/)]),
    asientos_disp: new FormControl('', [Validators.min(1), Validators.max(8)]),
  });

  usuarios: any[] = [];

  constructor(private alertController: AlertController, private usuarioService: UsuarioService) {}

  marcasAuto: string[] = [
    'abarth', 'acura', 'alfa romeo', 'audi', 'bmw', 'bentley', 'buick', 'cadillac',
    'chevrolet', 'citroën', 'dodge', 'fiat', 'ford', 'genesis', 'honda', 'hyundai',
    'infiniti', 'jaguar', 'jeep', 'kia', 'lamborghini', 'land rover', 'lexus',
    'lincoln', 'maserati', 'mazda', 'mclaren', 'mercedes benz', 'mini', 'mitsubishi',
    'nissan', 'pagani', 'peugeot', 'porsche', 'ram', 'renault', 'rolls royce',
    'saab', 'seat', 'skoda', 'smart', 'subaru', 'suzuki', 'tesla', 'toyota',
    'volkswagen', 'volvo', 'byd', 'jac', 'changan', 'great wall', 'geely',
    'haval', 'mg', 'brilliance', 'foton', 'lynk & co', 'dongfeng', 'xpeng',
    'nio', 'ora', 'rivian', 'polestar', 'karma', 'landwind', 'zotye',
    'wuling', 'baojun', 'gac', 'hummer'
  ];
  
  async ngOnInit() {
    await this.actualizarUsuarios(); 
  }

  async registrar() {
    const success = await this.usuarioService.createUsuario(this.persona.value);
    if (success) {
      await this.presentAlert('Usuario Registrado', '');
      this.persona.reset();
      await this.actualizarUsuarios(); 
    } else {
      await this.presentAlert('Error', 'El usuario no se pudo registrar');
    }
  }

  buscar(usuario: any) {
    this.persona.patchValue(usuario);
  }

  async confirmarEliminacion(rut: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar usuario',
      message: '¿Estás seguro de que deseas eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminar(rut);
          },
        },
      ],
    });

    await alert.present();
  }


  async eliminar(rut: string) {
    const success = await this.usuarioService.deleteUsuario(rut);
    if (success) {
      await this.actualizarUsuarios(); 
    }
  }



  async modificar() {
    const rut_modificar = this.persona.controls.rut.value || "";
    const success = await this.usuarioService.updateUsuario(rut_modificar, this.persona.value);
    if (success) {
      await this.presentAlert('Perfecto!', 'Modificado correctamente');
      await this.actualizarUsuarios(); 
    } else {
      await this.presentAlert('Error!', 'No se pudo modificar');
    }
  }

  async actualizarUsuarios() {
    this.usuarios = await this.usuarioService.getUsuarios();
    this.usuarios = this.usuarios.filter(usuario => usuario.role !== 'admin');
  }

  anios(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fecha_nacimiento = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - fecha_nacimiento.getFullYear();
      const monthDiff = today.getMonth() - fecha_nacimiento.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < fecha_nacimiento.getDate())) {
        age--;
      }

      return (age >= minAge && age <= maxAge) ? null : { 'invalidAge': true };
    };
  }

  validarMarcaAuto(control: AbstractControl) {
    const marca = control.value ? control.value.toLowerCase() : '';
    if (marca && !this.marcasAuto.includes(marca)) {
      return { marcaNoExiste: true };
    }
    return null;
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
