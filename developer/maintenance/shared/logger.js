/**
 * Conceptual Bridge - Centralized Logger Framework
 * Abstracted application logger for diagnostic, performance, and operational logging.
 */

import { APP_CONFIG } from './appConfig.js';

export const LOG_LEVELS = Object.freeze({
  DEBUG: 0,
  INFO: 1,
  SUCCESS: 2,
  WARN: 3,
  ERROR: 4,
  NONE: 5
});

class Logger {
  constructor() {
    this.minLevel = APP_CONFIG.ENABLE_DEBUG ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;
  }

  /**
   * Internal output handler
   */
  _log(level, levelName, module, message, data = null) {
    if (!APP_CONFIG.ENABLE_LOGGING || level < this.minLevel) return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${levelName}] [${module}]:`;

    switch (level) {
      case LOG_LEVELS.DEBUG:
        console.debug(prefix, message, data || '');
        break;
      case LOG_LEVELS.INFO:
        console.info(prefix, message, data || '');
        break;
      case LOG_LEVELS.SUCCESS:
        console.log(`%c${prefix} ${message}`, 'color: #22c55e; font-weight: bold;', data || '');
        break;
      case LOG_LEVELS.WARN:
        console.warn(prefix, message, data || '');
        break;
      case LOG_LEVELS.ERROR:
        console.error(prefix, message, data || '');
        break;
    }
  }

  debug(module, message, data = null) {
    this._log(LOG_LEVELS.DEBUG, 'DEBUG', module, message, data);
  }

  info(module, message, data = null) {
    this._log(LOG_LEVELS.INFO, 'INFO', module, message, data);
  }

  success(module, message, data = null) {
    this._log(LOG_LEVELS.SUCCESS, 'SUCCESS', module, message, data);
  }

  warning(module, message, data = null) {
    this._log(LOG_LEVELS.WARN, 'WARN', module, message, data);
  }

  error(module, message, data = null) {
    this._log(LOG_LEVELS.ERROR, 'ERROR', module, message, data);
  }

  /**
   * Performance execution time measurement wrapper
   */
  performance(module, label, fn) {
    const start = performance.now();
    const result = fn();
    const duration = (performance.now() - start).toFixed(2);
    this.info(module, `Perf [${label}]: ${duration} ms`);
    return result;
  }
}

export const logger = new Logger();
