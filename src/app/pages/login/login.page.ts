import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  email: string ="";
  password: string="";

  constructor(private router: Router) { }

  ngOnInit() {
  }
  
  login() {
    if (this.email == "usuario01@duocuc.cl" && this.password =="prueba01") { 
      console.log('INICIO DE SESION CORRECTO');
      alert("Inicio de sesión correcto");
      this.router.navigate(['/home']);
    } else {
      alert("Correo o contraseña incorrectos");
    }
  }
     

}
