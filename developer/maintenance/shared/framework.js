/**
 * Conceptual Bridge - Framework Initializer
 * Bootstraps common shared services for maintenance tools.
 */

import { APP_CONFIG } from './appConfig.js';
import { VERSION_INFO } from './version.js';
import { logger } from './logger.js';
import { storage } from './storage.js';

const MODULE_NAME = 'Framework';

class MaintenanceFramework {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initializes framework state and outputs initialization log
   * @param {string} toolName - Name of the initializing maintenance tool
   */
  init(toolName = 'Maintenance Tool') {
    if (this.initialized) return;

    logger.info(
      MODULE_NAME,
      `Initializing ${APP_CONFIG.APPLICATION_NAME} v${VERSION_INFO.FRAMEWORK_VERSION}`
    );
    logger.info(MODULE_NAME, `Active Tool: ${toolName}`);

    this.initialized = true;
  }
}

export const framework = new MaintenanceFramework();
