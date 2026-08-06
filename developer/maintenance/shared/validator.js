/**
 * Conceptual Bridge - Validation Framework
 * Centralized business validation rules.
 */

import { validateVideo } from './youtubeUtils.js';

export function validateRequired(value, fieldName) {
  if (!value || value.toString().trim() === '') {
    return { isValid: false, error: `${fieldName} is required.` };
  }
  return { isValid: true, error: '' };
}

export function validateNumeric(value, fieldName) {
  const req = validateRequired(value, fieldName);
  if (!req.isValid) return req;

  if (!/^\d+$/.test(value.toString().trim())) {
    return { isValid: false, error: `${fieldName} must contain numeric characters only.` };
  }
  return { isValid: true, error: '' };
}

export function validateFilename(value) {
  const req = validateRequired(value, 'Output Filename');
  if (!req.isValid) return req;

  if (!/^[a-zA-Z0-9_-]+$/.test(value.trim())) {
    return { isValid: false, error: 'Filename can only contain alphanumeric characters, underscores, and hyphens.' };
  }
  return { isValid: true, error: '' };
}

export function validateYouTubeField(value) {
  return validateVideo(value);
}
