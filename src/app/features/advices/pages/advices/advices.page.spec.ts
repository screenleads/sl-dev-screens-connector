import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvicesPage } from './advices.page';

describe('AdvicesPage', () => {
  let component: AdvicesPage;
  let fixture: ComponentFixture<AdvicesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
