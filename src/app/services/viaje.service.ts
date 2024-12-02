import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class ViajeService {
  constructor(private firestore: AngularFirestore) {}

  // Crea un nuevo viaje
  public async createViaje(viaje: any): Promise<boolean> {
    const id = viaje.id || this.firestore.createId();
    const viajeRef = this.firestore.collection('Viajes').doc(id);

    const docSnapshot = await viajeRef.get().toPromise();
    if (docSnapshot?.exists) {
      return false; // Ya existe un viaje con este ID
    }

    await viajeRef.set(viaje);
    return true;
  }

  // Obtiene un viaje por su ID
  public async getViaje(id: string): Promise<any | null> {
    const viajeDoc = await this.firestore.collection('Viajes').doc(id).get().toPromise();
    return viajeDoc?.data() || null;
  }

  // Obtiene todos los viajes
  public async getViajes(): Promise<any[]> {
    const viajesSnapshot = await this.firestore.collection('Viajes').get().toPromise();
    return viajesSnapshot?.docs.map(doc => {
      const data = doc.data() as Record<string, any>; // Aseguramos que es un objeto
      return { id: doc.id, ...data };
    }) || [];
  }
  

  // Actualiza un viaje existente
  public async updateViaje(id: string, nuevoViaje: any): Promise<boolean> {
    const viajeRef = this.firestore.collection('Viajes').doc(id);

    const docSnapshot = await viajeRef.get().toPromise();
    if (docSnapshot?.exists) {
      await viajeRef.update(nuevoViaje);
      return true;
    }

    return false;
  }

  // Elimina un viaje por su ID
  public async deleteViaje(id: string): Promise<boolean> {
    const viajeRef = this.firestore.collection('Viajes').doc(id);

    const docSnapshot = await viajeRef.get().toPromise();
    if (docSnapshot?.exists) {
      await viajeRef.delete();
      return true;
    }

    return false;
  }

  // Agrega un pasajero a un viaje
  public async agregarPasajero(viajeId: string, pasajero: any): Promise<boolean> {
    const viajeRef = this.firestore.collection('Viajes').doc(viajeId);

    const docSnapshot = await viajeRef.get().toPromise();
    if (docSnapshot?.exists) {
      const viajeData = docSnapshot.data() as { pasajeros?: any[]; asientos_disp?: number };

      if (viajeData?.asientos_disp && viajeData.asientos_disp > 0) {
        const pasajeros = viajeData.pasajeros || [];
        pasajeros.push(pasajero);

        await viajeRef.update({
          pasajeros,
          asientos_disp: viajeData.asientos_disp - 1,
        });

        return true;
      }
    }

    return false;
  }



  public async cancelarReserva(viajeId: string, usuarioRut: string): Promise<boolean> {
    try {
      const viajeRef = this.firestore.collection('Viajes').doc(viajeId);
      const docSnapshot = await viajeRef.get().toPromise();
  
      if (docSnapshot && docSnapshot.exists) {
        const viajeData = docSnapshot.data() as { pasajeros?: string[]; asientos_disp?: number }; // Aseguramos tipos
        if (viajeData) {
          const pasajeros = Array.isArray(viajeData.pasajeros) ? [...viajeData.pasajeros] : [];
          const asientosDisp = typeof viajeData.asientos_disp === 'number' ? viajeData.asientos_disp : 0;
  
          // Encontramos el índice del usuario
          const pasajeroIndex = pasajeros.indexOf(usuarioRut);
          if (pasajeroIndex !== -1) {
            // Eliminamos al pasajero
            pasajeros.splice(pasajeroIndex, 1);
  
            // Actualizamos los datos en Firestore
            await viajeRef.update({
              pasajeros,
              asientos_disp: asientosDisp + 1,
            });
            return true; // Reserva cancelada con éxito
          } else {
            console.error('El usuario no tiene una reserva en este viaje.');
          }
        }
      }
      return false; // No se pudo cancelar la reserva
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      return false;
    }
  }
  








}
