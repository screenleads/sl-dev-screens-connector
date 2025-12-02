import { Injectable, inject } from '@angular/core';
import { LoggingService } from './logging.service';

export interface ExternalErrorReporter {
  reportError(error: any, context?: any): void;
}

@Injectable({ providedIn: 'root' })
export class ErrorLoggerService {
  private externalReporters: ExternalErrorReporter[] = [];

  private logger = inject(LoggingService);


  log(message: unknown, context?: unknown): void {
    this.logger.log(message, context);
  }

  warn(message: unknown, context?: unknown): void {
    this.logger.warn(message, context);
  }

  info(message: unknown, context?: unknown): void {
    this.logger.info(message, context);
  }

  debug(message: unknown, context?: unknown): void {
    this.logger.debug(message, context);
  }

  error(error: unknown, context?: unknown): void {
    this.logger.log('[ERROR]', { error, context });
    // Report to external tools if configured
    this.externalReporters.forEach(reporter => {
      try {
        reporter.reportError(error, context);
      } catch (e) {
        this.logger.warn('External reporter failed', e);
      }
    });
  }

  addExternalReporter(reporter: ExternalErrorReporter): void {
    this.externalReporters.push(reporter);
  }
}
