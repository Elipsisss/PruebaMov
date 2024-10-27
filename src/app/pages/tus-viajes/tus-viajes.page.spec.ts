import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TusViajesPage } from './tus-viajes.page';

describe('TusViajesPage', () => {
  let component: TusViajesPage;
  let fixture: ComponentFixture<TusViajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TusViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
