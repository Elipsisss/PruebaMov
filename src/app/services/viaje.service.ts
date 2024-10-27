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











  public async agregarPasajero(viajeId: string, pasajero: any): Promise<boolean> {
    let viajes: any[] = await this.storage.get("viajes") || [];
    const indice = viajes.findIndex(v => v.id === viajeId);

    if (indice === -1) {
      return false; // El viaje no existe
    }

    // Asegúrate de que `pasajeros` es un array y luego agrega el nuevo pasajero
    if (!viajes[indice].pasajeros) {
      viajes[indice].pasajeros = [];
    }

    viajes[indice].pasajeros.push(pasajero);
    await this.storage.set("viajes", viajes);
    return true;
  }






















}
