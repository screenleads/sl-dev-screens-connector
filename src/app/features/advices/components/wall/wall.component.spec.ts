// ...existing code...
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WallComponent } from './wall.component';

describe('WallComponent', () => {
  let component: WallComponent;
  let fixture: ComponentFixture<WallComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [WallComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should categorize media types', () => {
    expect(component.getMediaCategory('image/png')).toBe('image');
    expect(component.getMediaCategory('video/mp4')).toBe('video');
    expect(component.getMediaCategory('audio/mp3')).toBe('audio');
    expect(component.getMediaCategory('other')).toBe('other');
    expect(component.getMediaCategory('')).toBe('other');
  });

  it('should parse time strings', () => {
    expect(component['parseTime']('12:30')).toEqual({ h: 12, m: 30 });
    expect(component['parseTime']('bad')).toBeNull();
  });

  it('should normalize day names', () => {
    expect(component['normalizeDayName']('lunes')).toBe('MONDAY');
    expect(component['normalizeDayName']('SÁBADO')).toBe('SATURDAY');
    expect(component['normalizeDayName']('Domingo')).toBe('SUNDAY');
    expect(component['normalizeDayName']('WEDNESDAY')).toBe('WEDNESDAY');
  });

  // Test omitido: showAlert es privado

  it('should determine advice visibility (no rules)', () => {
    expect(component.isAdviceVisible({} as any)).toBeTrue();
    expect(component.isAdviceVisible(null)).toBeTrue();
    expect(component.isAdviceVisible(undefined)).toBeTrue();
  });
});
// ...existing code...
