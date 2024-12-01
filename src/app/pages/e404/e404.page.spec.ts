import { ComponentFixture, TestBed } from '@angular/core/testing';
import { E404Page } from './e404.page';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';

describe('Página de error404', () => {
  let component: E404Page;
  let fixture: ComponentFixture<E404Page>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
        declarations: [E404Page],
        imports: [
          IonicModule.forRoot(),
          IonicStorageModule.forRoot(),
          AngularFireModule.initializeApp(environment.firebaseConfig),
          AngularFireAuthModule,
          AngularFirestoreModule
        ]
      }).compileComponents();

    fixture = TestBed.createComponent(E404Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. la pagina debe cargar', () => {
    expect(component).toBeTruthy();
  });

  it('2. verifica que el método goBack funcione cuando se hace clic en el botón "Volver atrás"', () => {
    spyOn(component, 'goBack');
    const button = fixture.debugElement.nativeElement.querySelector('ion-button');
    button.click();
    fixture.detectChanges();
    expect(component.goBack).toHaveBeenCalled();
  });

  it('3. verifica que el método navCtrl.back se llama correctamente en goBack', () => {
    spyOn(component['navCtrl'], 'back');
    component.goBack();
    expect(component['navCtrl'].back).toHaveBeenCalled();
  });

  it('4. verifica que el título de la página es "e404"', () => {
    const title = fixture.debugElement.nativeElement.querySelector('ion-title');
    expect(title.textContent).toContain('e404');
  });
});
