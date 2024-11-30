import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, collection, doc, getDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  usuario: any;

  // Inyectamos los servicios necesarios
  private afAuth = inject(Auth); // Servicio de autenticación
  private firestore = inject(Firestore);    // Servicio de Firestore

  constructor(private navController: NavController) {}

  async ngOnInit() {
    // Obtener el usuario autenticado
    const user = this.afAuth.currentUser;

    if (user) {
      // Si el usuario está autenticado, buscamos su información en Firestore
      const userDocRef = doc(this.firestore, `Usuarios/${user.uid}`);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        this.usuario = userDoc.data();
        console.log("Usuario autenticado desde Firestore:", this.usuario);
      } else {
        console.log("No se encontró el documento del usuario en Firestore.");
      }
    } else {
      console.log("No hay un usuario autenticado.");
    }
  }

  async logout() {
    // Cerrar sesión en Firebase
    await this.afAuth.signOut();  
    this.navController.navigateRoot('/login');
  }

}
