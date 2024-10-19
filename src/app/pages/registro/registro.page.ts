import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario-service.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  user: FormGroup;
  usuario: any[] = [];

  constructor(private alertController: AlertController, private usuarioService: UsuarioService) {
    this.user = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern("[a-zA-Z]{3,15}")]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(3),Validators.pattern("[a-zA-Z]{3,15}")]), //se deja solo un apellido dejado, anula los numeros tambien
      rut: new FormControl('', [Validators.required, Validators.pattern(/^\d{6,8}-[kK0-9]$/)]),
      birthdate: new FormControl('', [Validators.required, this.anosvalidar(18, 100)]),
      tiene_auto: new FormControl('no', [Validators.required]),
      marca_auto: new FormControl('', [this.validarMarcaAuto.bind(this)]),
      asientos_disp: new FormControl('', []),
      patente: new FormControl('', [Validators.pattern(/^[A-Z]{2}[0-9]{4}$|^[A-Z]{4}[0-9]{2}$/)]),
      gender: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmpassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator }); 
  }
  
  

  marcaAuto: string[] = [
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
  

  ngOnInit() {
    this.usuario = this.usuarioService.getUsuarios();
  }
  // Para que las contraseñas coincidan
  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmpassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { passwordsDoNotMatch: true } : null;
  }

  


  validarMarcaAuto(control: AbstractControl) {
    const marca = control.value ? control.value.toLowerCase() : '';
    if (marca && !this.marcaAuto.includes(marca)) {
      return { marcaNoExiste: true };
    }
    return null;
  }


  anosvalidar(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return (age >= minAge && age <= maxAge) ? null : { 'invalidAge': true };
    };
  }








  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }



  
  async submit() {
    if (this.user.valid) {
      const nuevoUsuario = {
        email: this.user.get('email')?.value,
        nombre: this.user.get('name')?.value,
        apellido: this.user.get('lastname')?.value,
        rut: this.user.get('rut')?.value,
        birthdate: this.user.get('birthdate')?.value,
        tiene_auto: this.user.get('tiene_auto')?.value,
        marca_auto: this.user.get('marca_auto')?.value,
        asientos_disp: this.user.get('asientos_disp')?.value,
        patente: this.user.get('patente')?.value,
        gender: this.user.get('gender')?.value,
        password: this.user.get('password')?.value
      };
  
      // Intenta crear el usuario
      const usuarioCreado = this.usuarioService.createUsuario(nuevoUsuario);
      if (usuarioCreado) {
        await this.presentAlert('Perfecto!', 'Registrado correctamente');
        this.user.reset();
      } else {
        await this.presentAlert('Error!', 'El usuario ya está registrado');
      }
    } else {
      await this.presentAlert('Error!', 'El formulario no es válido');
    }
  }
}
