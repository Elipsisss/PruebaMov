import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  constructor(private firestore: AngularFirestore) {
    this.init();
  }

  async init() {}

  public async createViaje(viaje: any): Promise<boolean> {
    const viajeRef = this.firestore.collection('Viajes').doc(viaje.id || this.firestore.createId()); // Genera un ID si no hay uno
    const docSnapshot = await viajeRef.get().toPromise();
    if (docSnapshot && docSnapshot.exists) {
      return false;
    }
    await viajeRef.set(viaje);
    return true;
  }
  
  
  public async getViaje(id: string): Promise<any | null> {
    const viajeDoc = await this.firestore.collection('Viajes').doc(id).get().toPromise();
    if (viajeDoc && viajeDoc.exists) {
      return viajeDoc.data();
    } else {
      return null;
    }
  }
  

  public async getViajes(): Promise<any[]> {
    const viajesSnapshot = await this.firestore.collection('Viajes').get().toPromise();
    if (viajesSnapshot) {
      return viajesSnapshot.docs.map(doc => doc.data());
    } else {
      return [];
    }
  }
  


  public async updateViaje(id: string, nuevoViaje: any): Promise<boolean> {
    const viajeRef = this.firestore.collection('Viajes').doc(id);
    const docSnapshot = await viajeRef.get().toPromise();
    if (docSnapshot && docSnapshot.exists) {
      await viajeRef.update(nuevoViaje);
      return true;
    } else {
      return false; 
    }
  }
  

  public async deleteViaje(id: string): Promise<boolean> {
    const viajeRef = this.firestore.collection('Viajes').doc(id);
    const docSnapshot = await viajeRef.get().toPromise();
  
    if (docSnapshot && docSnapshot.exists) {
      await viajeRef.delete();
      return true;
    } else {
      return false; 
    }
  }
  

  public async agregarPasajero(viajeId: string, pasajero: any): Promise<boolean> {
    const viajeRef = this.firestore.collection('Viajes').doc(viajeId);
    const docSnapshot = await viajeRef.get().toPromise();
  
    if (docSnapshot && docSnapshot.exists) {
      const viajeData = docSnapshot.data() as { pasajeros?: any[]; asientos_disp?: number };
      if (viajeData) {
        const pasajeros = Array.isArray(viajeData.pasajeros) ? viajeData.pasajeros : [];
        const asientosDisp = typeof viajeData.asientos_disp === 'number' ? viajeData.asientos_disp : 0;
        if (asientosDisp > 0) {
          pasajeros.push(pasajero);
          await viajeRef.update({
            asientos_disp: asientosDisp - 1,
            pasajeros: pasajeros
          });
          return true;
        } else {
          return false; 
        }
      }
    }
    return false; 
  }

  async cancelarReserva(viajeId: string, usuarioRut: string): Promise<boolean> {
    const viajeRef = this.firestore.collection('Viajes').doc(viajeId);
    const docSnapshot = await viajeRef.get().toPromise();
    if (docSnapshot && docSnapshot.exists) {
      const viajeData = docSnapshot.data() as { pasajeros?: any[]; asientos_disp?: number };
      if (viajeData) {
        const pasajeros = Array.isArray(viajeData.pasajeros) ? viajeData.pasajeros : [];
        const asientosDisp = typeof viajeData.asientos_disp === 'number' ? viajeData.asientos_disp : 0;
        const pasajeroIndex = pasajeros.indexOf(usuarioRut);
        if (pasajeroIndex !== -1) {
          pasajeros.splice(pasajeroIndex, 1);
          await viajeRef.update({
            asientos_disp: asientosDisp + 1,
            pasajeros: pasajeros
          });
          return true; 
        }
      }
    }
    return false; 
  }
}
