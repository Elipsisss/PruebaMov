import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'registro',
    redirectTo: 'registro',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },  
  
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },  {
    path: 'administration',
    loadChildren: () => import('./pages/administration/administration.module').then( m => m.AdministrationPageModule)
  },

  {
    path: 'perfil',
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  
  



  {
    path: 'e404',
    loadChildren: () => import('./pages/e404/e404.module').then( m => m.E404PageModule)
  },

  {
    path: 'recuperacion',
    loadChildren: () => import('./pages/recuperacion/recuperacion.module').then( m => m.RecuperacionPageModule)
  },

  {
    path: 'viaje',
    loadChildren: () => import('./pages/viaje/viaje.module').then( m => m.ViajePageModule)
  },

  {
    path: 'crearviajes',
    loadChildren: () => import('./pages/crearviajes/crearviajes.module').then( m => m.CrearviajesPageModule)
  },

  {
    path: 'detalle-reserva/:id', 
    loadChildren: () => import('./pages/detalle-reserva/detalle-reserva.module').then( m => m.DetalleReservaPageModule)
  },
  
  {
    path: 'tus-viajes',
    loadChildren: () => import('./pages/tus-viajes/tus-viajes.module').then( m => m.TusViajesPageModule)
  },


  
  {
    path: '**',
    redirectTo: 'e404',
    pathMatch: 'full'
  },





]

;

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
