import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { APP_CONFIG } from './environments/config/app-config.token';
import { environment } from './environments/config/environment';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { jwtInterceptor } from './app/core/interceptors/jwt.interceptor';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: File, useClass: File },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    { provide: APP_CONFIG, useValue: environment },
    importProvidersFrom(LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.OFF
    }))
  ],
});
