import { Injectable } from '@angular/core';

export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'LOG' | 'WARN' | 'ERROR' | 'OFF';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  private level: LogLevel = 'DEBUG'; // Cambia según entorno
  private format: (level: LogLevel, message: unknown, context?: unknown) => string =
    (level, message, context) => {
      const ctx = context ? JSON.stringify(context) : '';
      return `[${level}] ${typeof message === 'string' ? message : JSON.stringify(message)}${ctx ? ' | ' + ctx : ''}`;
    };

  setLevel(level: LogLevel) {
    this.level = level;
  }

  setFormat(formatFn: (level: LogLevel, message: unknown, context?: unknown) => string) {
    this.format = formatFn;
  }

  private shouldLog(level: LogLevel): boolean {
    const order: LogLevel[] = ['TRACE', 'DEBUG', 'INFO', 'LOG', 'WARN', 'ERROR', 'OFF'];
    return order.indexOf(level) >= order.indexOf(this.level) && this.level !== 'OFF';
  }

  trace(message: unknown, context?: unknown): void {
    if (this.shouldLog('TRACE')) console.trace(this.format('TRACE', message, context));
  }
  debug(message: unknown, context?: unknown): void {
    if (this.shouldLog('DEBUG')) console.debug(this.format('DEBUG', message, context));
  }
  info(message: unknown, context?: unknown): void {
    if (this.shouldLog('INFO')) console.info(this.format('INFO', message, context));
  }
  log(message: unknown, context?: unknown): void {
    if (this.shouldLog('LOG')) console.log(this.format('LOG', message, context));
  }
  warn(message: unknown, context?: unknown): void {
    if (this.shouldLog('WARN')) console.warn(this.format('WARN', message, context));
  }
  error(message: unknown, context?: unknown): void {
    if (this.shouldLog('ERROR')) console.error(this.format('ERROR', message, context));
  }
}
