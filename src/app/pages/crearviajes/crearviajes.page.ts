import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import{v4 as uuidv4} from 'uuid';




import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { ViajeService } from 'src/app/services/viaje.service';
import { UsuarioService } from 'src/app/services/usuario-service.service';

@Component({
  selector: 'app-crearviajes',
  templateUrl: './crearviajes.page.html',
  styleUrls: ['./crearviajes.page.scss'],
})
export class CrearviajesPage implements OnInit, AfterViewInit {
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  usuario: any;
  siEdita = false;

  viaje = new FormGroup({
    id: new FormControl('', [Validators.required]),
    valor: new FormControl('', [Validators.required]),
    nombre_destino: new FormControl('', [Validators.required]),
    latitud: new FormControl('', [Validators.required]),
    longitud: new FormControl('', [Validators.required]),
    distancia_metros: new FormControl('', [Validators.required]),
    tiempo_minutos: new FormControl(0, [Validators.required]),
    estado_viaje: new FormControl('pendiente'),
    pasajeros: new FormControl([]),
    conductor: new FormControl(['',[Validators.required]]),
  });
  viajes: any[] = [];

  constructor(private viajeService: ViajeService, private usuarioService: UsuarioService, private alertController: AlertController) {}

  async ngOnInit() {
    await this.obtenerUsuario();
    await this.rescatarViajes();
    const usuarioStr = localStorage.getItem("usuario");
      if (usuarioStr) {
          this.usuario = JSON.parse(usuarioStr);
      } else {
          this.usuario = {}; // O asigna un valor por defecto que consideres apropiado
      }
    this.viaje.controls.conductor.setValue(this.usuario.nombre);
  }

  /*No funciona el mapa sin este codigo, porque el ngOnInit no carga el espacio del mapa, esta parte carga el
   mapa cuando todas las demas partes de la pagina esten completamente cargadas. */
  ngAfterViewInit() {     
    this.initMap();
  }

  initMap() {
    try {
      // CARGAMOS E INICIALIZAMOS EL MAPA:
      this.map = L.map("map_html").locate({ setView: true, maxZoom: 16 });
  
      // PLANTILLA PARA QUE SE VEA EL MAPA:
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
  
      this.map.on('locationfound', (e) => {
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
      });
  
      // AGREGAR UN BUSCADOR DE DIRECCIONES EN EL MAPA:
      this.geocoder = G.geocoder({
        placeholder: "Ingrese dirección a buscar",
        errorMessage: "Dirección no encontrada"
      }).addTo(this.map);
      // ACCIÓN CON EL BUSCADOR, CUANDO OCURRA ALGO CON EL BUSCADOR:
      this.geocoder.on('markgeocode', (e) => {
        // CARGO EL FORMULARIO:
        let lat = e.geocode.properties['lat'];
        let lon = e.geocode.properties['lon'];
        this.viaje.controls.nombre_destino.setValue(e.geocode.properties['display_name']);
        this.viaje.controls.id.setValue(uuidv4());
        this.viaje.controls.latitud.setValue(lat);
        this.viaje.controls.longitud.setValue(lon);
        if (this.map) {
          L.Routing.control({
            waypoints: [
              L.latLng(-33.608552227594245, -70.58039819211703), 
              L.latLng(lat, lon) 
            ],
            fitSelectedRoutes: true,
            
          }).on('routesfound', (e) => {

            /* ASIGNO VARIABLE */
            const distancia = e.routes[0].summary.totalDistance; 
            const tiempo = Math.round(e.routes[0].summary.totalTime / 60); 

            /* GUARDO EL TIEMPO Y LA DISTANCIA */
            this.viaje.controls.distancia_metros.setValue(distancia);
            this.viaje.controls.tiempo_minutos.setValue(tiempo);
  
            // CALCULO
            const tarifa = this.calcularTarifa(distancia, tiempo * 60); // CONVIERTO EL TIEMPO A SEGUNDOS 
            this.viaje.controls.valor.setValue(tarifa.toString()); // SI NO LO CONVIERTO A STRING ME SALE UN ERROR XD
          }).addTo(this.map);
        }
      });
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
    }
  }

 async crearViaje() {
    if (this.viaje.invalid) {
        alert("Por favor completa todos los campos requeridos.");
        return; 
    }
    this.siEdita = false;

    if (await this.viajeService.createViaje(this.viaje.value)) {
      const alert = await this.alertController.create({
        header: 'viaje creado exitosamente ',
      });
      alert.present();
        this.viaje.reset(); 
        await this.rescatarViajes(); 
    } else {
        alert("Error al crear el viaje.");
    }
}

async confirmarCreaciondeviaje () {
  const alert = await this.alertController.create({
    header: 'Confirmar creación de viaje',
    message: '¿Estás seguro que quieres crear este viaje ?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Crear viaje',
        handler: () => {
          this.crearViaje();
        },
      },
    ],
  });
  await alert.present();
}


  async rescatarViajes() {
    this.viajes = await this.viajeService.getViajes(); 
  }


  async actualizarViaje() {
    const viajeId = this.viaje.controls.id.value; 
    if (!viajeId) {
        alert("El ID del viaje no puede estar vacío.");
        return; 
    }
    if (await this.viajeService.updateViaje(viajeId, this.viaje.value)) {
        alert("Viaje actualizado!");
        await this.rescatarViajes();
        this.viaje.reset();  
    } else {
        alert("No se puede modificar el destino del viaje");
    }
}


  async eliminarViaje(id: string) {
    if (await this.viajeService.deleteViaje(id)) {
      alert("Viaje eliminado!");
      await this.rescatarViajes();
      this.viaje.reset();  
    } else {
      alert("Error al eliminar el viaje.");
    }
  }


  buscar(viaje: any) {
    this.siEdita = true;
    this.viaje.patchValue(viaje);
  }

  async obtenerUsuario() {
    this.usuario = await this.usuarioService.getUsuarioAutenticado();
  }


 /*https://practicatest.cl/preguntas/los-taxis-que-usan-taximetro-como-mecanismo-de-cobro-tarifario-deben-exhibir-en-el-parabrisas-delantero-el-valor-de/Z6Ka#:~:text=Explicaci%C3%B3n,(lo%20que%20ocurra%20primero).
  en base a ese link se hizo el calculo */ 
  calcularTarifa(distancia: number, tiempo: number): number {
    const tarifaBase = 300; // Tarifa base para los primeros 200 metros
    const metros = 200; // 200 metros
    const incremento = 130; // tarifa que se paga adicional en LOS 60 SEGUNDOS O 200 METROS
    const tiempo_segundos = 60; // 60 segundos
    let tarifaTotal = tarifaBase;
  
    // Calcular la cantidad de segmentos de 200 metros recorridos
    if (distancia > metros) {
      const segmentosDistancia = Math.floor((distancia - metros) / metros);
      tarifaTotal += segmentosDistancia * incremento;
    }

    // Calcular la cantidad de segmentos de 60 segundos
    if (tiempo > tiempo_segundos) {
      const segmentosTiempo = Math.floor((tiempo - tiempo_segundos) / tiempo_segundos);
      tarifaTotal += segmentosTiempo * incremento;
    }
  
    return tarifaTotal; // Retornar el valor de la tarifa total
  }
  

  cancelarAccion() {
    this.viaje.reset(); 
  }
  
}