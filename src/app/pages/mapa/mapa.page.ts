import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

//lo primero es agregar un import:
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {


  
  //vamos a crear variable(s) para controlar el mapa:
  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  usuario: any;
  
  //variable de grupo:
  viaje = new FormGroup({
    id: new FormControl(),
    conductor: new FormControl(),
    asientos_disp: new FormControl(),
    nombre_destino: new FormControl(),
    latitud: new FormControl(),
    longitud: new FormControl(),
    distancia_metros: new FormControl(),
    tiempo_minutos: new FormControl(),
    estado_viaje: new FormControl('pendiente'),
    pasajeros: new FormControl([])
  });

  constructor() { }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    this.viaje.controls.conductor.setValue(this.usuario.nombre);
  }

  initMap(){
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

  }

}