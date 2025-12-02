/*
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotifyCenterComponent } from './notify-center.component';

describe('NotifyCenterComponent', () => {
  let component: NotifyCenterComponent;
  let fixture: ComponentFixture<NotifyCenterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifyCenterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotifyCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should push a notification item', () => {
    component.push('Test message', 'success');
    expect(component.items().length).toBe(1);
    expect(component.items()[0].text).toBe('Test message');
    expect(component.items()[0].level).toBe('success');
  });

  it('should dismiss a notification item', () => {
    component.push('Dismiss me', 'warning');
    const id = component.items()[0].id;
    component.dismiss(id);
    expect(component.items().length).toBe(0);
  });

  it('should auto-dismiss after timeout', (done) => {
    jasmine.clock().install();
    component.push('Auto dismiss', 'info');
    const id = component.items()[0].id;
    jasmine.clock().tick(5001);
    expect(component.items().length).toBe(0);
    jasmine.clock().uninstall();
    done();
  });

  // Tests omitidos: pushFromChat es privado

  it('should return correct class for each level', () => {
    expect(component.classFor('success')).toBe('notify-item success');
    expect(component.classFor('warning')).toBe('notify-item warning');
    expect(component.classFor('danger')).toBe('notify-item danger');
    expect(component.classFor('info')).toBe('notify-item info');
    expect(component.classFor('other' as any)).toBe('notify-item info');
  });
});
*/
