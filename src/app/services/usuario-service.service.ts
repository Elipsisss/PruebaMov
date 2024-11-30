import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioAutenticado: any = null;

  constructor(private firestore: AngularFirestore) {
    this.init();
  }

  async init() {
    // Aquí puedes crear el admin en Firestore si no existe
    const admin: any = {
      email: "admin@duocuc.cl",
      nombre: "Admin",
      apellido: "Admin",
      rut: "16666666-6",
      fecha_nacimiento: "1990-03-24",
      tiene_auto: "si",
      marca_auto: "Toyota",
      asientos_disp: "4",
      patente: "XX-XX-00",
      genero: "Masculino",
      sede: "Puente Alto",
      password: "Admin123.",
      confirmpassword: "Admin123.",
      role: "admin"
    };

    const usuarios = await this.getUsuarios();
    const adminExistente = usuarios.find(usu => usu.email === admin.email);
    if (!adminExistente) {
      await this.createUsuario(admin);
    }
  }

  // Crea un usuario en Firestore
  public async createUsuario(usuario: any): Promise<boolean> {
    try {
      const usuariosRef = this.firestore.collection('Usuarios');
      const usuariosSnapshot = await usuariosRef.get().toPromise();
      
      // Tipo explícito para los documentos
      const usuarios: any[] = usuariosSnapshot?.docs.map(doc => doc.data() as any) || [];
  
      if (usuarios.find(usu => usu.rut === usuario.rut || usu.email === usuario.email)) {
        return false;
      }
  
      await usuariosRef.add(usuario);
      return true;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return false;
    }
  }
  
  // Obtiene todos los usuarios de Firestore
  public async getUsuarios(): Promise<any[]> {
    try {
      const usuariosSnapshot = await this.firestore.collection('usuarios').get().toPromise();
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
      const usuariosSnapshot = await this.firestore.collection('usuarios', ref => ref.where('rut', '==', rut)).get().toPromise();
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
      const usuariosSnapshot = await this.firestore.collection('usuarios', ref => ref.where('rut', '==', rut)).get().toPromise();
      if (!usuariosSnapshot || usuariosSnapshot.empty) {
        return false;
      }
      const docId = usuariosSnapshot.docs[0].id;
      await this.firestore.collection('usuarios').doc(docId).update(nuevoUsuario);
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return false;
    }
  }

  // Elimina un usuario en Firestore
  public async deleteUsuario(rut: string): Promise<boolean> {
    try {
      const usuariosSnapshot = await this.firestore.collection('usuarios', ref => ref.where('rut', '==', rut)).get().toPromise();
      if (!usuariosSnapshot || usuariosSnapshot.empty) {
        return false;
      }
      const docId = usuariosSnapshot.docs[0].id;
      await this.firestore.collection('usuarios').doc(docId).delete();
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  }

  // Autentica al usuario con email y password
  public async authenticate(email: string, password: string): Promise<boolean> {
    try {
      const usuarios = await this.getUsuarios();
      const usuario = usuarios.find(user => user.email === email && user.password === password);
      if (usuario) {
        this.usuarioAutenticado = usuario;
        localStorage.setItem('user', JSON.stringify(usuario));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al autenticar:', error);
      return false;
    }
  }

  // Obtiene el usuario autenticado
  public async getUsuarioAutenticado(): Promise<any | null> {
    if (!this.usuarioAutenticado) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.usuarioAutenticado = JSON.parse(userData);
      }
    }
    return this.usuarioAutenticado;
  }

  // Muestra todos los usuarios (para debug)
  public logUsuarios() {
    this.getUsuarios().then(usuarios => console.log(usuarios));
  }
}