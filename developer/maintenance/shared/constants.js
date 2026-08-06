/**
 * Conceptual Bridge - Shared Constants
 * Centralized registry for application icons, metadata tags, supported modes, and UI settings.
 */

import { ICONS } from './icons.js';

export { ICONS };

export const MODES = Object.freeze({
  GACA: 'GACA',
  MATH: 'MATH',
  GS: 'GS',
  GI: 'GI'
});

export const MODE_STATUS = Object.freeze({
  GACA: { active: true, label: 'ACTIVE', badgeClass: 'active' },
  MATH: { active: true, label: 'ACTIVE', badgeClass: 'active' },
  GS: { active: false, label: 'COMING SOON', badgeClass: 'coming-soon' },
  GI: { active: false, label: 'COMING SOON', badgeClass: 'coming-soon' }
});

export const METADATA_KEYS = Object.freeze({
  TITLE: 'Title',
  TAGS: 'Tags',
  ENGLISH: 'English',
  BENGALI: 'Bengali',
  VIDEO: 'Video',
  PDF_ENGLISH: 'PDF_English',
  PDF_BENGALI: 'PDF_Bengali',
  TEST_SOURCE: 'Test_Source',
  TOPIC: 'Topic',
  SUB_TOPIC: 'Sub-Topic',
  LEVEL: 'Level'
});

export const ANIMATION_TIMINGS = Object.freeze({
  TOAST_DURATION: 3500,
  SCROLL_SPEED: 300
});

export const DEFAULT_PDF_VALUE = 'none';
