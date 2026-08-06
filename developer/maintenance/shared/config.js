/**
 * Conceptual Bridge - Configuration Framework
 * Refactored to import title and tag templates from modular template files.
 */

import { MODES } from './constants.js';
import { TITLE_TEMPLATES } from './templates/titleTemplates.js';
import { TAG_TEMPLATES } from './templates/tagTemplates.js';

export { TITLE_TEMPLATES, TAG_TEMPLATES };

export const MODE_CONFIGURATION = Object.freeze({
  [MODES.GACA]: {
    videoFields: 2,
    pdfFields: 2,
    testSourceFolder: 'gaca',
    metadataOrder: [
      'title',
      'tags',
      'english',
      'bengali',
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
      english: 'English',
      bengali: 'Bengali',
      pdfEnglish: 'PDF_English',
      pdfBengali: 'PDF_Bengali',
      testSource: 'Test_Source',
      topic: 'Topic',
      subTopic: 'Sub-Topic',
      level: 'Level'
    }
  },
  [MODES.MATH]: {
    videoFields: 1,
    pdfFields: 2,
    testSourceFolder: 'math',
    metadataOrder: [
      'title',
      'tags',
      'english', // Maps to Video| in MATH mode
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
      english: 'Video',
      pdfEnglish: 'PDF_English',
      pdfBengali: 'PDF_Bengali',
      testSource: 'Test_Source',
      topic: 'Topic',
      subTopic: 'Sub-Topic',
      level: 'Level'
    }
  },
  [MODES.GS]: {
    videoFields: 1,
    pdfFields: 2,
    testSourceFolder: 'gs',
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
      english: 'Video',
      pdfEnglish: 'PDF_English',
      pdfBengali: 'PDF_Bengali',
      testSource: 'Test_Source',
      topic: 'Topic',
      subTopic: 'Sub-Topic',
      level: 'Level'
    }
  },
  [MODES.GI]: {
    videoFields: 1,
    pdfFields: 2,
    testSourceFolder: 'gi',
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
      english: 'Video',
      pdfEnglish: 'PDF_English',
      pdfBengali: 'PDF_Bengali',
      testSource: 'Test_Source',
      topic: 'Topic',
      subTopic: 'Sub-Topic',
      level: 'Level'
    }
  }
});
