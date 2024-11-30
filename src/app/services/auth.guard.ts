import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RouterStateSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route, state: RouterStateSnapshot) => {
  const navController = inject(NavController);
  
  const isAuthenticated = localStorage.getItem('user') ? true : false;
  const user = JSON.parse(localStorage.getItem('user') || '{}'); // Obtener el usuario desde localStorage
  const isAdmin = user?.role === 'admin'; // Verificar si el usuario es un administrador

  // Verificar si el usuario está autenticado, si no redirigir al login
  if (!isAuthenticated && state.url !== '/login') {
    navController.navigateRoot('/login');
    return false;
  }

  // Verificar si el usuario intenta acceder a la página de administración sin ser admin
  if (state.url.includes('/administration') && !isAdmin) {
    navController.navigateRoot('/home'); // Redirigir a home si no es admin
    return false;
  }

  return true;
};
