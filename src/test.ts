// Polyfill for 'global' to fix sockjs-client and similar errors in Karma
(window as any).global = window;

// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';


// Polyfill for 'global' to fix sockjs-client and similar errors in Karma
(window as any).global = window;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Importar manualmente los specs compatibles
import './app/shared/models/Device.spec';
import './app/shared/models/Company.spec';
import './app/shared/models/ChatMessage.spec';
import './app/app.component.spec';
