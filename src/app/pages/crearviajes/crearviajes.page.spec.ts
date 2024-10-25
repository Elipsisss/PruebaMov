import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrearviajesPage } from './crearviajes.page';

describe('CrearviajesPage', () => {
  let component: CrearviajesPage;
  let fixture: ComponentFixture<CrearviajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearviajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
