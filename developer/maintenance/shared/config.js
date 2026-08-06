/**
 * Conceptual Bridge - Configuration Framework
 * Configuration-driven declarations for modes, title templates, tag groups, and metadata orders.
 */

import { MODES } from './constants.js';

export const TITLE_TEMPLATES = Object.freeze({
  [MODES.GACA]: [
    {
      id: 'gaca-live-100',
      label: '100 Most Important GK/GA Live Question Analysis',
      template: '100 Most Important GK/GA Live Question Analysis'
    }
  ],
  [MODES.MATH]: [
    {
      id: 'math-live-analysis',
      label: 'Complete Mathematics Chapter Live Analysis',
      template: 'Complete Mathematics Chapter Live Analysis'
    },
    {
      id: 'math-top-50',
      label: '50 Most Important Quantitative Aptitude Questions',
      template: '50 Most Important Quantitative Aptitude Questions'
    }
  ],
  [MODES.GS]: [],
  [MODES.GI]: []
});

export const TAG_TEMPLATES = Object.freeze({
  [MODES.GACA]: [
    {
      id: 'rrb-group-d-2024',
      label: 'RRB Group D 2024',
      tags: 'RRB Group D, 10, GACA, 100-Series, CEN 08/2024'
    }
  ],
  [MODES.MATH]: [
    {
      id: 'rrb-math-standard',
      label: 'RRB Mathematics Standard 2024',
      tags: 'RRB Math, Quantitative Aptitude, CBT-1, 2024'
    }
  ],
  [MODES.GS]: [],
  [MODES.GI]: []
});

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
      'english', // Represents Video| for MATH
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
