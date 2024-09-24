import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarios: any[] = [
    { email: 'usuario01@duocuc.cl', password: 'prueba01', isAdmin: true } // Admin de prueba
  ];
  private usuarioAutenticado: any = null;

  constructor() { }

  public createUsuario(usuario: any): boolean {
    if (this.getUsuario(usuario.rut) === undefined) {
      this.usuarios.push(usuario);
      return true;
    }
    return false;
  }
  
  public isUsuarioAdmin(): boolean {
    return this.usuarioAutenticado?.isAdmin || false;
  }

  public getUsuario(rut: string) {
    return this.usuarios.find(elemento => elemento.rut === rut);
  }

  public getUsuarios(): any[] {
    return this.usuarios;
  }

  public updateUsuario(rut: string, nuevoUsuario: any) {
    const indice = this.usuarios.findIndex(elemento => elemento.rut === rut);
    if (indice === -1) {
      return false;
    }
    this.usuarios[indice] = nuevoUsuario;
    return true;
  }

  public deleteUsuario(rut: string): boolean {
    const indice = this.usuarios.findIndex(elemento => elemento.rut === rut);
    if (indice === -1) {
      return false;
    }
    this.usuarios.splice(indice, 1);
    return true;
  }

  // Método para autenticar al usuario
  public authenticate(email: string, password: string): boolean {
    console.log('Verificando:', email, password);
    const usuario = this.usuarios.find(user => user.email === email && user.password === password);
    if (usuario) {
      this.usuarioAutenticado = usuario;
      return true;
    }
    return false;
  }

  public getUsuarioAutenticado() {
    return this.usuarioAutenticado;
  }

  public logUsuarios() {
    console.log(this.usuarios);
  }
}
