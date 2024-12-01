import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrationPage } from './administration.page';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { fakeAsync, tick } from '@angular/core/testing';

describe('Página de administracion', () => {
  let component: AdministrationPage;
  let fixture: ComponentFixture<AdministrationPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
        declarations: [AdministrationPage],
        imports: [
          IonicModule.forRoot(),
          IonicStorageModule.forRoot(),
          AngularFireModule.initializeApp(environment.firebaseConfig),
          AngularFireAuthModule,
          AngularFirestoreModule
        ]
      }).compileComponents();

    fixture = TestBed.createComponent(AdministrationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. se debe abrir la pagina', () => {
    expect(component).toBeTruthy();
  });

  it('2. verifica que el formulario de registro se inicializa correctamente', () => {
    expect(component.persona).toBeDefined();
    expect(component.persona.controls['nombre']).toBeDefined();
    expect(component.persona.controls['apellido']).toBeDefined();
    expect(component.persona.controls['rut']).toBeDefined();
    expect(component.persona.controls['fecha_nacimiento']).toBeDefined();
    expect(component.persona.controls['email']).toBeDefined();
    expect(component.persona.controls['password']).toBeDefined();
    expect(component.persona.controls['genero']).toBeDefined();
    expect(component.persona.controls['sede']).toBeDefined();
    expect(component.persona.controls['tiene_auto']).toBeDefined();
    expect(component.persona.controls['role']).toBeDefined();
    expect(component.persona.controls['marca_auto']).toBeDefined();
    expect(component.persona.controls['patente']).toBeDefined();
    expect(component.persona.controls['asientos_disp']).toBeDefined();
  });

  it('3. Verifica que muestra una alerta cuanod el formulario no es invalido', async () => {
    spyOn(component, 'presentAlert');
    component.persona.controls['nombre'].setValue('');
    component.persona.controls['apellido'].setValue('');
    await component.registrar();
    expect(component.presentAlert).toHaveBeenCalledWith('Error', 'El usuario no se pudo registrar');
  });

});
