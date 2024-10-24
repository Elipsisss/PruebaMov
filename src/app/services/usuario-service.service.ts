import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioAutenticado: any = null;

  constructor(private storage: Storage) {
    this.init();
  }


  async init() {
    await this.storage.create();
    
    const admin = {
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

   
    const usuarios: any[] = await this.getUsuarios();
    if (!usuarios.find(usu => usu.email === admin.email)) {
      await this.createUsuario(admin);
    }
  }


  public async createUsuario(usuario: any): Promise<boolean> {
    try {
      let usuarios: any[] = await this.getUsuarios();
      if (usuarios.find(usu => usu.rut === usuario.rut || usu.email === usuario.email)) {
        return false; 
      }
      usuarios.push(usuario);
      await this.storage.set("usuarios", usuarios);
      return true; 
    } catch (error) {
      console.error('Error al crear usuario:', error);
      return false;
    }
  }

  
  public async getUsuario(rut: string): Promise<any> {
    const usuarios: any[] = await this.getUsuarios();
    return usuarios.find(elemento => elemento.rut === rut);
  }

  // Obtiene todos los usuarios
  public async getUsuarios(): Promise<any[]> {
    return (await this.storage.get("usuarios")) || [];
  }


  public async updateUsuario(rut: string, nuevoUsuario: any): Promise<boolean> {
    try {
      let usuarios: any[] = await this.getUsuarios();
      const indice = usuarios.findIndex(elemento => elemento.rut === rut);
      if (indice === -1) {
        return false; 
      }
      usuarios[indice] = nuevoUsuario;
      await this.storage.set("usuarios", usuarios);
      return true; 
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return false;
    }
  }

  
  public async deleteUsuario(rut: string): Promise<boolean> {
    try {
      let usuarios: any[] = await this.getUsuarios();
      const indice = usuarios.findIndex(elemento => elemento.rut === rut);
      if (indice === -1) {
        return false; 
      }
      usuarios.splice(indice, 1);
      await this.storage.set("usuarios", usuarios);
      return true; 
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  }

  
  public async authenticate(email: string, password: string): Promise<boolean> {
    try {
      const usuarios: any[] = await this.getUsuarios();
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

  
 public async getUsuarioAutenticado(): Promise<any> {
  if (!this.usuarioAutenticado) {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.usuarioAutenticado = JSON.parse(userData);
    }
  }
  return this.usuarioAutenticado;
}

 
  public logUsuarios() {
    this.getUsuarios().then(usuarios => console.log(usuarios));
  }
}
