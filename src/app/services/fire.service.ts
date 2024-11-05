import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(private firestore: AngularFirestore) { }

  async crearUsuario(usuario : any){
    const docRef = this.firestore.collection('Usuarios').doc(usuario.rut);
    const docActual = await docRef.get().toPromise();
    if(docActual?.exists){
     return false  
    }
    await docRef.set(usuario);
    return true
  }

  getUsuarios(){
    return this.firestore.collection('Usuarios').valueChanges();

  }
  
  getUsuario(rut:string){
    return this.firestore.collection('Usuarios').doc(rut).valueChanges();
  }
  
  updateUsuario(usuario:any){
    return this.firestore.collection('Usuarios').doc(usuario.rut).update(usuario)
  }

  
  deleteUsuario(rut:string){
    return this.firestore.collection('Usuarios').doc(rut).delete()
  }
}
