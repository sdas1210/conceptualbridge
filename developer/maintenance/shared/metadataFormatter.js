/**
 * Conceptual Bridge - Metadata Formatter
 * Pure helper utilities for normalizing metadata and building TXT output strings.
 */

import { MODE_CONFIGURATION } from './config.js';
import { DEFAULT_PDF_VALUE } from './constants.js';

export function formatPdfFilename(input) {
  if (!input || !input.trim()) return DEFAULT_PDF_VALUE;
  let clean = input.trim();
  if (!clean.toLowerCase().endsWith('.pdf')) {
    clean += '.pdf';
  }
  return clean;
}

export function buildTestSource(rawInput, folder) {
  if (!rawInput || !rawInput.trim()) return '';
  const clean = rawInput.trim();
  return `questions/${folder}/${clean}.txt`;
}

export function generateMetadataLine(key, value) {
  if (value === undefined || value === null || value === '') return null;
  return `${key}| ${value}`;
}

export function compileMetadataText(anchorData, completedSteps = {}) {
  const mode = anchorData.mode || 'GACA';
  const config = MODE_CONFIGURATION[mode];
  if (!config) return '';

  const lines = [];

  config.metadataOrder.forEach((fieldKey) => {
    const outputKey = config.fieldKeyMap[fieldKey];
    const value = anchorData[fieldKey];

    // Check if step-based optional metadata fields have been saved
    let shouldInclude = false;

    if (fieldKey === 'topic') {
      shouldInclude = Boolean(completedSteps[10]);
    } else if (fieldKey === 'subTopic') {
      shouldInclude = Boolean(completedSteps[11]);
    } else if (fieldKey === 'level') {
      shouldInclude = Boolean(completedSteps[12]);
    } else {
      shouldInclude = value !== undefined && value !== null && value !== '';
    }

    if (shouldInclude) {
      lines.push(`${outputKey}| ${value || ''}`);
    }
  });

  return lines.join('\n');
}
