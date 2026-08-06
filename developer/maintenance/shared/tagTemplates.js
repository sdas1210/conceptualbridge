/**
 * Conceptual Bridge - Tag Templates Store
 * Subject-specific tag templates.
 */

import { MODES } from '../constants.js';

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
