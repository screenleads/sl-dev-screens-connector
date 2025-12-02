import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationUpdateModalComponent } from './notification-update-modal.component';
import { By } from '@angular/platform-browser';

describe('NotificationUpdateModalComponent', () => {
    let component: NotificationUpdateModalComponent;
    let fixture: ComponentFixture<NotificationUpdateModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotificationUpdateModalComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(NotificationUpdateModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show default message', () => {
        const messageEl = fixture.nativeElement.querySelector('.modal-message');
        expect(messageEl?.textContent).toContain('Hay una nueva versión disponible.');
    });

    it('should emit modalClose when dismissed', () => {
        spyOn(component.modalClose, 'emit');
        component.dismiss();
        expect(component.modalClose.emit).toHaveBeenCalled();
    });

    it('should open downloadUrl when download is called', () => {
        spyOn(window, 'open');
        component.downloadUrl = 'https://example.com/app.apk';
        component.download();
        expect(window.open).toHaveBeenCalledWith('https://example.com/app.apk', '_system');
    });
});
