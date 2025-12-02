import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { ToastController } from '@ionic/angular';

describe('NotificationService', () => {
    let service: NotificationService;
    let toastControllerSpy: jasmine.SpyObj<ToastController>;

    beforeEach(() => {
        toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);
        TestBed.configureTestingModule({
            providers: [
                NotificationService,
                { provide: ToastController, useValue: toastControllerSpy }
            ]
        });
        service = TestBed.inject(NotificationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should show toast with correct message', async () => {
        toastControllerSpy.create.and.returnValue(Promise.resolve({ present: () => Promise.resolve() } as any));
        await service.show('Test', 'success', 1000);
        expect(toastControllerSpy.create).toHaveBeenCalled();
    });

    it('should map toast type to color', () => {
        expect(service['mapToastTypeToColor']('success')).toBe('success');
        expect(service['mapToastTypeToColor']('warning')).toBe('warning');
        expect(service['mapToastTypeToColor']('danger')).toBe('danger');
        expect(service['mapToastTypeToColor']('error')).toBe('danger');
        expect(service['mapToastTypeToColor']('info')).toBe('primary');
        expect(service['mapToastTypeToColor']('other')).toBe('primary');
    });

    it('should showFromChat with text in metadata', async () => {
        spyOn(service, 'show').and.returnValue(Promise.resolve());
        const msg = { message: 'msg', metadata: { text: 'meta', level: 'success' } } as any;
        await service.showFromChat(msg);
        expect(service.show).toHaveBeenCalledWith('meta', 'success');
    });

    it('should showFromChat with text in parsed', async () => {
        spyOn(service, 'show').and.returnValue(Promise.resolve());
        const msg = { message: JSON.stringify({ text: 'parsed' }), metadata: {} } as any;
        await service.showFromChat(msg);
        expect(service.show).toHaveBeenCalledWith('parsed', 'info');
    });

    it('should showFromChat with raw string', async () => {
        spyOn(service, 'show').and.returnValue(Promise.resolve());
        const msg = { message: 'raw', metadata: {} } as any;
        await service.showFromChat(msg);
        expect(service.show).toHaveBeenCalledWith('raw', 'info');
    });

    it('should showFromChat with fallback', async () => {
        spyOn(service, 'show').and.returnValue(Promise.resolve());
        const msg = { message: undefined, metadata: {} } as any;
        await service.showFromChat(msg);
        expect(service.show).toHaveBeenCalledWith('Mensaje recibido', 'info');
    });
});
