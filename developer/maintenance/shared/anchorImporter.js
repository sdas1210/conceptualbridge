/**
 * Conceptual Bridge - Anchor Importer
 * Parser engine for consuming raw TXT content and extracting structured anchor data objects.
 */

import { MODE_CONFIGURATION } from './config.js';

export function parseAnchorTXT(rawContent, filename = '') {
  if (!rawContent || typeof rawContent !== 'string') {
    throw new Error('File content is empty or unreadable.');
  }

  const lines = rawContent.split(/\r?\n/);
  const rawMap = {};

  lines.forEach((line) => {
    const parts = line.split('|');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('|').trim();
      rawMap[key] = value;
    }
  });

  // Determine Mode
  let mode = 'GACA';
  if (rawMap.Video) {
    mode = 'MATH';
  } else if (rawMap.Test_Source && rawMap.Test_Source.includes('/math/')) {
    mode = 'MATH';
  }

  const titleVal = rawMap.Title || '';
  let titleTemplate = titleVal;
  let setNumber = '';

  const setMatch = titleVal.match(/\(Set\s*-\s*(\d+)\)/i);
  if (setMatch) {
    setNumber = setMatch[1];
    titleTemplate = titleVal.replace(/\s*\(Set\s*-\s*\d+\)/i, '').trim();
  }

  let testSourceRaw = rawMap.Test_Source || '';
  const tsMatch = testSourceRaw.match(/questions\/[^/]+\/(.+)\.txt$/i);
  if (tsMatch) {
    testSourceRaw = tsMatch[1];
  }

  const cleanFilename = filename ? filename.replace(/\.txt$/i, '') : '';

  const parsedAnchor = {
    mode,
    titleTemplate,
    setNumber,
    title: titleVal,
    tagsTemplate: rawMap.Tags || '',
    tags: rawMap.Tags || '',
    english: mode === 'MATH' ? (rawMap.Video || '') : (rawMap.English || ''),
    bengali: rawMap.Bengali || '',
    pdfEnglish: rawMap.PDF_English || '',
    pdfBengali: rawMap.PDF_Bengali || '',
    testSourceRaw,
    testSource: rawMap.Test_Source || '',
    topic: rawMap.Topic || '',
    subTopic: rawMap['Sub-Topic'] || '',
    level: rawMap.Level || '',
    outputFilename: cleanFilename
  };

  return parsedAnchor;
}
