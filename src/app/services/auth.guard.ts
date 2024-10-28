import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';

import { RouterStateSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route, state: RouterStateSnapshot) => {
  const navController = inject(NavController);
  const isAuthenticated = localStorage.getItem("user") ? true : false;

  //VAMOS A VALIDAR SI EL USUARIO NO ESTÁ LOGUEADO Y ACCEDE A UNA PAGINA DISTINTA DE HOME:
  if(!isAuthenticated && state.url !== '/login'){
    navController.navigateRoot('/login');
    return false;
  }


  return true;
};
