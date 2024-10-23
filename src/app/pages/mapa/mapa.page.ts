import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  map!: L.Map;
  viaje!: FormGroup; // Define la propiedad viaje

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.viaje = this.fb.group({
      // Define los controles del formulario aquí
      destino: [''],
      fecha: ['']
    });
    this.initializeMap();
  }

  initializeMap() {
    this.map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    L.marker([51.5, -0.09]).addTo(this.map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
  }
}