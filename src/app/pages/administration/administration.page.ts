import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.page.html',
  styleUrls: ['./administration.page.scss'],
})
export class AdministrationPage implements OnInit {

  editando: boolean = false;
  usuarios: { id: number, name: string, email: string }[] = [];
  editandoUsuario: { id: number, name: string, email: string } | null = null;
  usuarioForm!: FormGroup;
  botonEliminar: boolean = true;
  botonEditar: boolean = true;

  constructor(private fb: FormBuilder, private alertController: AlertController) { }

  ngOnInit() { 
    this.usuarioForm = this.fb.group({
      id: [0], 
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }


  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK']
    });
  
    await alert.present();
  }

    



  // Agregar usuario
  agregarUsuario() {
    if (this.usuarioForm.valid) {
      const email = this.usuarioForm.get('email')?.value; // Obtiene solo el valor del campo email
  
      // Verifica si el correo ya existe
      if (this.usuarios.some(usuario => usuario.email === email)) {
        this.mostrarAlerta("Este correo ya está registrado"); 
        return; 
      }
  
      const nuevoUsuario = { ...this.usuarioForm.value };
      nuevoUsuario.id = this.usuarios.length > 0 ? Math.max(...this.usuarios.map(u => u.id)) + 1 : 1;  // Asigna un id único a cada usuario
      this.usuarios.push(nuevoUsuario);
      this.limpiarFormulario();
    } else {
      this.mostrarAlerta("Formulario inválido");
    }
  }
  

  // Eliminar usuario
  eliminarUsuario(id: number) {
    this.usuarios = this.usuarios.filter(usuario => usuario.id !== id);
  }

  // Edicion de usuario
  editarUsuario(usuario: { id: number, name: string, email: string }) {
    this.editandoUsuario = { ...usuario };
    this.editando = true
    this.botonEliminar = false;
    this.botonEditar = false;
    
    // Actualiza el formulario con los datos del usuario a editar
    this.usuarioForm.patchValue({
      id: usuario.id,
      name: usuario.name,
      email: usuario.email
    });
  }

  //Guardar cambios en usuario editado
  guardarUsuarioEditado() {
    if (this.usuarioForm.valid && this.editandoUsuario) {
      const index = this.usuarios.findIndex(usuario => usuario.id === this.editandoUsuario!.id);
      if (index !== -1) {
        this.usuarios[index] = { ...this.usuarioForm.value };
      }
      this.cancelarEdicion();
    } else {
      console.log("Formulario inválido o no hay usuario editando");
    }
  }


  duplicadoEmailValidator(usuarios: { email: string }[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const email = control.value;
      const existe = usuarios.some(usuario => usuario.email === email);
      return existe ? { emailDuplicado: true } : null; // Retorna un error si el email ya existe
    };
  }

  // Cancelar edicion
  cancelarEdicion() {
    this.editando = false;
    this.editandoUsuario = null;
    this.limpiarFormulario();
    this.botonEliminar = true;
    this.botonEditar = true;
  }

  // Limpiar formulario
  limpiarFormulario() {
    this.usuarioForm.reset({
      id: 0,
      name: '',
      email: ''
    });
  }
}
