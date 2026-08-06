/**
 * Conceptual Bridge - Application Configuration
 * Central application settings and feature flags.
 */

import { VERSION_INFO } from './version.js';

export const APP_CONFIG = Object.freeze({
  APPLICATION_NAME: 'Conceptual Bridge Maintenance Suite',
  FRAMEWORK_VERSION: VERSION_INFO.FRAMEWORK_VERSION,
  MAINTENANCE_VERSION: VERSION_INFO.MAINTENANCE_SUITE_VERSION,
  
  // Feature Flags & Runtime Modes
  DEVELOPER_MODE: true,
  ENABLE_LOGGING: true,
  ENABLE_DEBUG: false,
  ENABLE_ANIMATIONS: true,
  AUTO_SAVE_ENABLED: false,
  
  // Defaults
  DEFAULT_SUBJECT: 'math',
  STORAGE_PREFIX: 'cb_maint_'
});
