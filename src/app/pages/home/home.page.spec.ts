import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule} from '@angular/router/testing';

import { HomePage } from './home.page';

describe('Página Home', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. Verifica si la pagina abre', () => {
    expect(component).toBeTruthy();
  });

  it('2. debería inicializar usuario en ngOnInit:', () => {
    const mockUserData = { name: 'userData' };
    component.usuario = mockUserData;
    component.ngOnInit();
    expect(component.usuario).toEqual(mockUserData);
  });

  it('3. Verificar que logout navega a la página de login:', () => {
    spyOn(component['navController'], 'navigateRoot');
    component.logout();
    expect(component['navController'].navigateRoot).toHaveBeenCalledWith('/login');
  });

});
