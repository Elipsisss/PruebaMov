import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { RegistroPage } from './registro.page';
import { environment } from '../../../environments/environment';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistroPage],
      imports: [
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFirestoreModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Verificar si la página registro se abre', () => {
    expect(component).toBeTruthy();
  });

  it('2.1 Validar nombre incorrecto al estar vacio', ()=>{
    const nombreControl = component.user.get('nombre');
    nombreControl?.setValue("");
    expect(nombreControl?.valid).toBeFalse();
    expect(nombreControl?.hasError('required')).toBeTrue();
  })

  it('2.2 Validar formato del nombre', () => {
    const nombreControl = component.user.get('nombre');
    nombreControl?.setValue("f");
    expect(nombreControl?.valid).toBeFalse();
    expect(nombreControl?.hasError('pattern')).toBeTrue();
  });

  it('2.3 Validar un nombre correcto', () =>{
    const nombreControl = component.user.get('nombre');
    nombreControl?.setValue("Gareca");
    expect(nombreControl?.hasError('required')).toBeFalse();
    expect(nombreControl?.hasError('pattern')).toBeFalse();
    expect(nombreControl?.valid).toBeTrue();
  })

  it('3. Verificar que submit muestra una alerta cuando el formulario es inválido', async () => {
    spyOn(component, 'presentAlert');
    component.user.controls['email'].setValue('');
    component.user.controls['password'].setValue('');
    await component.submit();
    expect(component.presentAlert).toHaveBeenCalledWith('Error!', 'El formulario no es válido');
  });

  it('4. Verificar que el campo rut es inválido si no cumple con el patrón', () => {
    const rutControl = component.user.get('rut');
    rutControl?.setValue('12345678');
    expect(rutControl?.valid).toBeFalse();
    expect(rutControl?.hasError('pattern')).toBeTrue();
  });

  it('6. Verificar que el campo password y confirmpassword coinciden', () => {
    const passwordControl = component.user.get('password');
    const confirmPasswordControl = component.user.get('confirmpassword');
    passwordControl?.setValue('password123');
    confirmPasswordControl?.setValue('password123');
    fixture.detectChanges();
    expect(component.user.hasError('passwordsDoNotMatch')).toBeFalse();
  });

});