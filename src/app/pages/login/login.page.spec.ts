import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginPage } from './login.page';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

describe('Página de login', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
        declarations: [LoginPage],
        imports: [
          IonicModule.forRoot(),
          IonicStorageModule.forRoot(),
          AngularFireModule.initializeApp(environment.firebaseConfig),
          AngularFireAuthModule,
          AngularFirestoreModule
        ]
      }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. debe cargar la pagina', () => {
    expect(component).toBeTruthy();
  });

  it('2. debería inicializar el formulario de inicio de sesión correctamente', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('3. verifica que se muestra una alerta cuando el formulario es inválido', async () => {
    spyOn(component, 'presentAlert');
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    await component.submitLogin();
    expect(component.presentAlert).toHaveBeenCalledWith('Error', 'Formulario no válido');
  });

  it('4. verifica que se navega a la página de home cuando las credenciales son correctas', async () => {
    spyOn(component.usuarioService, 'authenticate').and.returnValue(Promise.resolve(true));
    spyOn(component.router, 'navigate');
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    await component.submitLogin();
    expect(component.router.navigate).toHaveBeenCalledWith(['/home']);
  });
  
});
