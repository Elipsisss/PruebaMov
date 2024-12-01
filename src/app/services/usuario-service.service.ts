import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioAutenticado: any = null;

  constructor(private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    this.init();
  }

  async init() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.usuarioAutenticado = JSON.parse(userData);
    }
  }

  // async init() {
  //   const admin: any = {
  //     email: "admin@duocuc.cl",
  //     nombre: "Admin",
  //     apellido: "Admin",
  //     rut: "16666666-6",
  //     fecha_nacimiento: "1990-03-24",
  //     tiene_auto: "si",
  //     marca_auto: "Toyota",
  //     asientos_disp: "4",
  //     patente: "XX-XX-00",
  //     genero: "Masculino",
  //     sede: "Puente Alto",
  //     password: "Admin123.",
  //     confirmpassword: "Admin123.",
  //     role: "admin"
  //   };
  
  //   const usuarios = await this.getUsuarios();
  // // aaaaaa
  
  //   const adminExistente = usuarios.find(usuario => usuario.role === 'admin');
    
  //   if (!adminExistente) {
  //     await this.createUsuario(admin);
  //   }
  // }


 
  public async createUsuario(nuevoUsuario: any): Promise<boolean> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(nuevoUsuario.email, nuevoUsuario.password);
      if (userCredential.user) {
        const role = nuevoUsuario.role || 'user';  
  
        await this.firestore.collection('Usuarios').doc(userCredential.user.uid).set({
          email: nuevoUsuario.email,
          nombre: nuevoUsuario.nombre,
          apellido: nuevoUsuario.apellido,
          rut: nuevoUsuario.rut,
          fecha_nacimiento: nuevoUsuario.fecha_nacimiento,
          tiene_auto: nuevoUsuario.tiene_auto,
          marca_auto: nuevoUsuario.marca_auto,
          asientos_disp: nuevoUsuario.asientos_disp,
          patente: nuevoUsuario.patente,
          genero: nuevoUsuario.genero,
          sede: nuevoUsuario.sede,
          role: role  
        });
  
        return true; 
      } else {
        return false; 
      }
    } catch (error) {
      console.error('Error al crear el usuario', error);
      return false; 
    }
  }
  

  

  public async getUsuarios(): Promise<any[]> {
    try {
      const usuariosSnapshot = await this.firestore.collection('Usuarios').get().toPromise();
      if (!usuariosSnapshot) {
        console.error('No se pudo obtener los usuarios de Firestore.');
        return [];
      }
      return usuariosSnapshot.docs.map(doc => doc.data() as any);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return [];
    }
  }

  // Obtiene un usuario específico por rut
  public async getUsuario(rut: string): Promise<any | null> {
    try {
      const usuariosSnapshot = await this.firestore.collection('Usuarios', ref => ref.where('rut', '==', rut)).get().toPromise();
      if (!usuariosSnapshot || usuariosSnapshot.empty) {
        console.error('Usuario no encontrado o error en Firestore.');
        return null;
      }
      const usuarios = usuariosSnapshot.docs.map(doc => doc.data() as any);
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }

  // Actualiza un usuario en Firestore
  public async updateUsuario(rut: string, nuevoUsuario: any): Promise<boolean> {
    try {
      // Buscar documentos donde el campo 'rut' coincida
      const usuariosSnapshot = await this.firestore.collection('Usuarios', ref => ref.where('rut', '==', rut)).get().toPromise();
      if (!usuariosSnapshot || usuariosSnapshot.empty) {
        console.error(`No se encontró ningún usuario con el rut: ${rut}`);
        return false;
      }
      const docId = usuariosSnapshot.docs[0].id;

      await this.firestore.collection('Usuarios').doc(docId).update(nuevoUsuario);
  
      console.log(`Usuario con rut ${rut} actualizado correctamente.`);
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario en Firestore:', error);
      return false;
    }
  }
  

  // Elimina un usuario en Firestore
  public async deleteUsuario(rut: string): Promise<boolean> {
    try {
      const usuariosSnapshot = await this.firestore.collection('Usuarios', ref => ref.where('rut', '==', rut)).get().toPromise();
      if (!usuariosSnapshot || usuariosSnapshot.empty) {
        return false;
      }
      const docId = usuariosSnapshot.docs[0].id;
      await this.firestore.collection('Usuarios').doc(docId).delete();
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  }

  // Autentica al usuario con email y password
  public async authenticate(email: string, password: string): Promise<boolean> {
    console.log("el principio de autenticar ");
    try {
      console.log("pase por aqui");
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
  
      // Verificar si el usuario se autenticó correctamente
      if (userCredential.user) {
        console.log(userCredential.user);
  
        // Buscar al usuario en la colección "Usuarios" usando el email
        const userDoc = await this.firestore.collection('Usuarios', ref => ref.where('email', '==', email)).get().toPromise();
  
        if (userDoc && !userDoc.empty) {
          console.log("encontre, documento");
  
          // Usamos los datos del documento encontrado
          this.usuarioAutenticado = userDoc.docs[0].data();
  
          // Aquí ya no estamos usando el uid explícitamente, solo estamos usando el email.
          localStorage.setItem('user', JSON.stringify(this.usuarioAutenticado));
  
          // Si encontramos el documento, devolvemos true
          return true;
        }
      }
  
      // Si no encontramos el usuario o la autenticación falló, devolvemos false
      return false;
    } catch (error) {
      console.error('Error al autenticar:', error);
      return false;
    }
  }
  // Obtiene el usuario autenticado
  public async getUsuarioAutenticado(): Promise<any | null> {
    if (!this.usuarioAutenticado) {
      const user = await this.afAuth.currentUser;
      console.log("usuario", user);
      if (user) {
        console.log("usuario", user);
        const usuarioId = user.uid;
        const usuarioRef = this.firestore.collection('Usuarios').doc(usuarioId);
        const usuarioDoc = await usuarioRef.get().toPromise();
        if (usuarioDoc && usuarioDoc.exists && usuarioDoc.data()) {
          this.usuarioAutenticado = usuarioDoc.data();
          console.log("usuario autenticado", this.usuarioAutenticado);
        }
      }
    }
    return this.usuarioAutenticado;
  }
  


  public logUsuarios() {
    this.getUsuarios().then(usuarios => console.log(usuarios));
  }
}