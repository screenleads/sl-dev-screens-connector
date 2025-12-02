/*
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LeadInfoComponent } from './lead-info.component';

describe('LeadInfoComponent', () => {
  let component: LeadInfoComponent;
  let fixture: ComponentFixture<LeadInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LeadInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log advice on ngOnInit', () => {
    const logger = (component as any).logger;
    spyOn(logger, 'info');
    component.advice = { id: 1 } as any;
    component.ngOnInit();
    expect(logger.info).toHaveBeenCalledWith('[WebsocketEventHandler] Advice Recibido', { id: 1 });
  });

  it('should return url from formatUrl', () => {
    expect(component.formatUrl()).toBe('https://example.com/legal');
  });

  it('should accept advice input', () => {
    const adviceMock = { id: 2, description: 'test' } as any;
    component.advice = adviceMock;
    expect(component.advice).toEqual(adviceMock);
  });
});
*/
