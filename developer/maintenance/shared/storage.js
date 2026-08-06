/**
 * Conceptual Bridge - Storage Framework
 * Abstracted web storage interface for drafts, preferences, and state persistence.
 */

import { APP_CONFIG } from './appConfig.js';
import { logger } from './logger.js';

const MODULE_NAME = 'Storage';

class StorageManager {
  constructor() {
    this.prefix = APP_CONFIG.STORAGE_PREFIX;
  }

  _getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Save an object or primitive to local storage
   */
  save(key, value) {
    try {
      const fullKey = this._getKey(key);
      const serialized = JSON.stringify(value);
      localStorage.setItem(fullKey, serialized);
      logger.debug(MODULE_NAME, `Saved key: ${key}`);
      return true;
    } catch (e) {
      logger.error(MODULE_NAME, `Failed to save key: ${key}`, e);
      return false;
    }
  }

  /**
   * Load an object or primitive from local storage
   */
  load(key, fallback = null) {
    try {
      const fullKey = this._getKey(key);
      const item = localStorage.getItem(fullKey);
      if (item === null) return fallback;
      return JSON.parse(item);
    } catch (e) {
      logger.error(MODULE_NAME, `Failed to load key: ${key}`, e);
      return fallback;
    }
  }

  remove(key) {
    try {
      const fullKey = this._getKey(key);
      localStorage.removeItem(fullKey);
      logger.debug(MODULE_NAME, `Removed key: ${key}`);
      return true;
    } catch (e) {
      logger.error(MODULE_NAME, `Failed to remove key: ${key}`, e);
      return false;
    }
  }

  exists(key) {
    const fullKey = this._getKey(key);
    return localStorage.getItem(fullKey) !== null;
  }

  clear() {
    try {
      Object.keys(localStorage)
        .filter(k => k.startsWith(this.prefix))
        .forEach(k => localStorage.removeItem(k));
      logger.info(MODULE_NAME, 'Cleared application storage namespace');
      return true;
    } catch (e) {
      logger.error(MODULE_NAME, 'Failed to clear storage', e);
      return false;
    }
  }
}

export const storage = new StorageManager();
