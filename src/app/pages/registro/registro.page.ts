import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  user: FormGroup;

  constructor() {
    this.user = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(2)]),
      rut: new FormControl('', [Validators.required, Validators.pattern(/^\d{6,8}-[kK0-9]$/)]),
      birthdate: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmpassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator }); // Aplica el validador personalizado aquí
  }

  ngOnInit() {}

  // Validador personalizado para verificar que las contraseñas coincidan
  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmpassword')?.value;
  
    return password && confirmPassword && password !== confirmPassword ? { passwordsDoNotMatch: true } : null;
  }
  


  
  submit() {
    if (this.user.valid) {
      console.log('Formulario válido', this.user.value);
      alert('Formulario valido')
      this.user.reset();
    } else {
      alert('Formulario inválido');
    }
  }
}
