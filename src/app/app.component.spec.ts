// ...eliminado, debe estar solo dentro del array de providers...
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { APP_CONFIG } from 'src/environments/config/app-config.token';
import { HttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  it('should create the app', async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: 'TOKEN_LOGGER_CONFIG', useValue: {} },
        { provide: 'TOKEN_LOGGER_CONFIG_ENGINE_FACTORY', useValue: { provideConfigEngine: () => ({ getConfig: () => ({}) }) } },
        { provide: 'TOKEN_LOGGER_METADATA_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_RULES_SERVICE', useValue: { shouldCallWriter: () => false, shouldCallServer: () => false, shouldCallMonitor: () => false } },
        { provide: 'TOKEN_LOGGER_MAPPER_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_WRITER_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_MONITOR_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_FILTER_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_LEVEL_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_ENGINE_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_FORMATTER_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_HANDLER_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_STORAGE_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_TRANSPORT_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_VALIDATOR_SERVICE', useValue: {} },
        { provide: 'TOKEN_LOGGER_SERVER_SERVICE', useValue: {} },
        { provide: APP_CONFIG, useValue: {} },
        { provide: HttpClient, useValue: {} }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
