import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-tiempo',
  templateUrl: './tiempo.page.html',
  styleUrls: ['./tiempo.page.scss'],
})
export class TiempoPage implements OnInit {

  tiempo: any = {};  // Variable para almacenar los datos del clima

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.getWeather();
  }

  // Método para obtener el clima
  getWeather() {
    this.apiService.getTiempo().subscribe(
      (data) => {
        console.log(data);  // Verifica la estructura de los datos en la consola
        this.tiempo = data;  // Almacenamos los datos completos en 'tiempo'
      },
      (error) => {
        console.error('Error al obtener el clima:', error);  // Manejo de errores
      }
    );
  }












}
