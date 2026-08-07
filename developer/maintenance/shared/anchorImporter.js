/**
 * Conceptual Bridge - Anchor Importer
 * Config-driven parser engine for consuming raw TXT content and extracting structured anchor data objects.
 * Serves as the exact inverse of the exporter.
 */

import { MODE_CONFIGURATION, TITLE_TEMPLATES, TAG_TEMPLATES } from './config.js';

/**
 * Parses raw Anchor TXT file content and converts it into a structured anchor object model
 * along with a validation report containing mode, warnings, and errors.
 *
 * @param {string} rawContent - The raw TXT file string content to parse.
 * @param {string} [filename=''] - Optional filename used to resolve the outputFilename property.
 * @returns {{
 *   anchor: Object,
 *   warnings: string[],
 *   errors: string[],
 *   mode: string
 * }} Structured result object containing the parsed anchor data model, diagnostic messages, and determined mode.
 */
export function parseAnchorTXT(rawContent, filename = '') {
  const warnings = [];
  const errors = [];

  // 1. Validation & Quality Checks for Input Content
  if (typeof rawContent !== 'string') {
    errors.push('File content is invalid or not a string.');
    return {
      anchor: null,
      warnings,
      errors,
      mode: 'UNKNOWN'
    };
  }

  if (!rawContent.trim()) {
    errors.push('File content is empty.');
    return {
      anchor: null,
      warnings,
      errors,
      mode: 'UNKNOWN'
    };
  }

  // 2. Line-by-Line Parsing with Duplicate Metadata Detection
  const lines = rawContent.split(/\r?\n/);
  const rawMap = {};
  const extraMetadata = {};

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return; // Ignore blank lines

    const parts = trimmedLine.split('|');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('|').trim();

      if (!key) return;

      if (Object.prototype.hasOwnProperty.call(rawMap, key)) {
        warnings.push(`Duplicate metadata key found: "${key}". Keeping first value ("${rawMap[key]}") and ignoring duplicate ("${value}").`);
      } else {
        rawMap[key] = value;
      }
    }
  });

  // 3. Mode Detection (GACA vs MATH vs UNKNOWN)
  let mode = 'UNKNOWN';

  if (rawMap.Video) {
    mode = 'MATH';
  } else if (rawMap.English || rawMap.Bengali) {
    mode = 'GACA';
  } else if (rawMap.Test_Source) {
    const tsLower = rawMap.Test_Source.toLowerCase();
    if (tsLower.includes('/math/')) {
      mode = 'MATH';
    } else if (tsLower.includes('/gaca/')) {
      mode = 'GACA';
    } else if (tsLower.includes('/gs/')) {
      mode = 'GS';
    } else if (tsLower.includes('/gi/')) {
      mode = 'GI';
    }
  }

  if (mode === 'UNKNOWN') {
    warnings.push('Operation mode could not be confidently determined. Defaulting to UNKNOWN mode.');
  }

  // 4. Configuration-Driven Field Resolver Mapping
  const config = MODE_CONFIGURATION[mode] || {
    videoFields: 1,
    pdfFields: 2,
    testSourceFolder: mode.toLowerCase(),
    metadataOrder: [
      'title',
      'tags',
      'english',
      'pdfEnglish',
      'pdfBengali',
      'testSource',
      'topic',
      'subTopic',
      'level'
    ],
    fieldKeyMap: {
      title: 'Title',
      tags: 'Tags',
      english: mode === 'MATH' ? 'Video' : 'English',
      bengali: 'Bengali',
      pdfEnglish: 'PDF_English',
      pdfBengali: 'PDF_Bengali',
      testSource: 'Test_Source',
      topic: 'Topic',
      subTopic: 'Sub-Topic',
      level: 'Level'
    }
  };

  const knownKeys = new Set(Object.values(config.fieldKeyMap));
  
  // Collect Unknown Metadata Keys
  Object.keys(rawMap).forEach((key) => {
    if (!knownKeys.has(key)) {
      extraMetadata[key] = rawMap[key];
    }
  });

  // 5. Title & Set Number Parsing + Template Recovery
  const titleKey = config.fieldKeyMap.title || 'Title';
  const titleVal = rawMap[titleKey] || '';
  let titleTemplateText = titleVal;
  let titleTemplateId = titleVal;
  let setNumber = '';

  const setMatch = titleVal.match(/\(Set\s*-\s*(\d+)\)/i);
  if (setMatch) {
    setNumber = setMatch[1];
    titleTemplateText = titleVal.replace(/\s*\(Set\s*-\s*\d+\)/i, '').trim();
    titleTemplateId = titleTemplateText;
  }

  // Match against registered TITLE_TEMPLATES
  if (mode !== 'UNKNOWN' && TITLE_TEMPLATES[mode]) {
    const matchedTitleTpl = TITLE_TEMPLATES[mode].find(
      (t) => t.template.trim().toLowerCase() === titleTemplateText.trim().toLowerCase()
    );
    if (matchedTitleTpl) {
      titleTemplateId = matchedTitleTpl.id;
    }
  }

  // 6. Tags Template Recovery
  const tagsKey = config.fieldKeyMap.tags || 'Tags';
  const tagsVal = rawMap[tagsKey] || '';
  let tagsTemplateId = tagsVal;

  if (mode !== 'UNKNOWN' && TAG_TEMPLATES[mode]) {
    const matchedTagTpl = TAG_TEMPLATES[mode].find(
      (tg) => tg.tags.trim().toLowerCase() === tagsVal.trim().toLowerCase() || tg.id === tagsVal
    );
    if (matchedTagTpl) {
      tagsTemplateId = matchedTagTpl.id;
    }
  }

  // 7. Test Source Path Extraction
  const testSourceKey = config.fieldKeyMap.testSource || 'Test_Source';
  let testSourceRaw = rawMap[testSourceKey] || '';
  const tsMatch = testSourceRaw.match(/questions\/[^/]+\/(.+)\.txt$/i);
  if (tsMatch) {
    testSourceRaw = tsMatch[1];
  }

  // 8. Output Filename Cleansing
  const cleanFilename = filename ? filename.replace(/\.txt$/i, '') : '';

  // 9. Construct Final Anchor Data Object
  const parsedAnchor = {
    mode,
    titleTemplate: titleTemplateId,
    setNumber,
    title: titleVal,
    tagsTemplate: tagsTemplateId,
    tags: tagsVal,
    english: mode === 'MATH' ? (rawMap.Video || '') : (rawMap.English || ''),
    bengali: rawMap.Bengali || '',
    pdfEnglish: rawMap.PDF_English || '',
    pdfBengali: rawMap.PDF_Bengali || '',
    testSourceRaw,
    testSource: rawMap[testSourceKey] || '',
    topic: rawMap[config.fieldKeyMap.topic || 'Topic'] || '',
    subTopic: rawMap[config.fieldKeyMap.subTopic || 'Sub-Topic'] || '',
    level: rawMap[config.fieldKeyMap.level || 'Level'] || '',
    outputFilename: cleanFilename,
    extraMetadata
  };

  return {
    anchor: parsedAnchor,
    warnings,
    errors,
    mode
  };
}