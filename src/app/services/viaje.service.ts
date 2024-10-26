import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  public async createViaje(viaje: any): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    if (viajes.find(v => v.id == viaje.id) != undefined) {
      return false; // El viaje ya existe
    }
    viajes.push(viaje);
    await this.storage.set("viajes", viajes);
    return true;
  }

  public async getViaje(id: string): Promise<any> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes.find(v => v.id == id);
  }

  public async getViajes(): Promise<any[]> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    return viajes;
  }
  
  public async updateViaje(id: string, nuevoViaje: any): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(v => v.id == id);
    if (indice == -1) {
      return false; // El viaje no existe
    }
    viajes[indice] = nuevoViaje;
    await this.storage.set("viajes", viajes);
    return true;
  }

  public async deleteViaje(id: string): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(v => v.id == id);
    if (indice == -1) {
      return false; // El viaje no existe
    }
    viajes.splice(indice, 1);
    await this.storage.set("viajes", viajes);
    return true;
  }

  // Método para crear una reserva
  public async createReserva(reserva: any): Promise<boolean> {
    let reservas: any[] = await this.storage.get("reservas") || [];
    if (reservas.find(r => r.id == reserva.id) != undefined) {
      return false; // La reserva ya existe
    }
    reservas.push(reserva);
    await this.storage.set("reservas", reservas);
    return true;
  }

  // Método para obtener todas las reservas
  public async getReservas(): Promise<any[]> {
    let reservas: any[] = await this.storage.get("reservas") || [];
    return reservas;
  }
}
