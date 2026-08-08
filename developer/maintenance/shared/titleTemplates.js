/**
 * Conceptual Bridge - Title Templates Store
 * Subject-specific title templates.
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
