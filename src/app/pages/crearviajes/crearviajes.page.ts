import { Component, OnInit, AfterViewInit } from '@angular/core';
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
  });
  viajes: any[] = [];

  constructor(private viajeService: ViajeService, private usuarioService: UsuarioService) {}

  async ngOnInit() {
    await this.obtenerUsuario();
    this.usuario.nombre;
    this.usuario.apellido;
    this.usuario.asientos_disp;
    const usuarioData = localStorage.getItem('usuario');
    if (usuarioData) {
      this.usuario = JSON.parse(usuarioData);
    } else {
      console.warn('Error con el usuario');
    }
    await this.rescatarViajes();  
  }

  /*No funciona el mapa sin este codigo, porque el ngOnInit no carga el espacio del mapa, esta parte carga el
   mapa cuando todas las demas partes de la pagina esten completamente cargadas. */
  ngAfterViewInit() {     
    this.initMap();
  }

  initMap(){
    try {
      //ACA CARGAMOS E INICIALIZAMOS EL MAPA:
      this.map = L.map("map_html").locate({setView:true, maxZoom:16});
      //this.map = L.map("map_html").setView([-33.608552227594245, -70.58039819211703],16);
      
      //ES LA PLANTILLA PARA QUE SEA VEA EL MAPA:
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
  
      this.map.on('locationfound', (e)=>{
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
      });
  
      //VAMOS A AGREGAR UN BUSCADOR DE DIRECCIONES EN EL MAPA:
      this.geocoder = G.geocoder({
        placeholder: "Ingrese dirección a buscar",
        errorMessage: "Dirección no encontrada"
      }).addTo(this.map);
  
      //VAMOS A REALIZAR UNA ACCIÓN CON EL BUSCADOR, CUANDO OCURRA ALGO CON EL BUSCADOR:
      this.geocoder.on('markgeocode', (e)=>{
        //cargo el formulario:
        let lat = e.geocode.properties['lat'];
        let lon = e.geocode.properties['lon'];
        this.viaje.controls.nombre_destino.setValue(e.geocode.properties['display_name']);
        
        this.viaje.controls.id.setValue(uuidv4());
        this.viaje.controls.latitud.setValue(lat);
        this.viaje.controls.longitud.setValue(lon);
        
        if(this.map){
          L.Routing.control({
            waypoints: [L.latLng(-33.608552227594245, -70.58039819211703),
              L.latLng(lat,lon)],
              fitSelectedRoutes: true,
            }).on('routesfound', (e)=>{
              this.viaje.controls.distancia_metros.setValue(e.routes[0].summary.totalDistance);
              this.viaje.controls.tiempo_minutos.setValue(Math.round(e.routes[0].summary.totalTime/60));
          }).addTo(this.map);
        }
      });
    } catch (error) {
    }
  }


 async crearViaje() {
    if (this.viaje.invalid) {
        alert("Por favor completa todos los campos requeridos.");
        return; 
    }
    this.siEdita = false;

    if (await this.viajeService.createViaje(this.viaje.value)) {
        alert("Viaje creado!");
        this.viaje.reset(); 
        await this.rescatarViajes(); 
    } else {
        alert("Error al crear el viaje.");
    }
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
    } else {
      alert("Error al actualizar el viaje.");
    }
  }

  async eliminarViaje(id: string) {
    if (await this.viajeService.deleteViaje(id)) {
      alert("Viaje eliminado!");
      await this.rescatarViajes(); 
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



}