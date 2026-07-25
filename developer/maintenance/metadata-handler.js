/**
 * metadata-handler.js
 * Business logic module for parsing, isolating, replacing,
 * and reconstructing metadata and question contents within TXT question banks.
 */

window.MetadataHandler = (function () {
  'use strict';

  // Standard ordered schema supported by the metadata system
  const METADATA_KEYS = [
    'Exam',
    'Subject',
    'Topic',
    'SubTopic',
    'Level',
    'Notification',
    'Type',
    'Marks',
    'QType',
    'ImageFolder'
  ];

  /**
   * Normalizes line endings to standard LF
   * @param {string} text 
   * @returns {string}
   */
  function normalizeText(text) {
    return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  }

  /**
   * Scans TXT content to count questions and parse existing metadata block
   * @param {string} rawText 
   * @param {string} subjectMode - 'GACA' or 'MATHEMATICS'
   */
  function analyzeFile(rawText, subjectMode) {
    const text = normalizeText(rawText);
    const delimiter = subjectMode === 'MATHEMATICS' ? 'QEN|' : 'Q|';

    // Find first question delimiter boundary
    const firstQuestionIndex = text.search(new RegExp(`^${delimiter.replace('|', '\\|')}`, 'm'));

    let headerSection = '';
    let bodySection = '';

    if (firstQuestionIndex !== -1) {
      headerSection = text.substring(0, firstQuestionIndex);
      bodySection = text.substring(firstQuestionIndex);
    } else {
      headerSection = text;
      bodySection = '';
    }

    // Parse existing key-value pairs in header section
    const existingMetadata = {};
    const lines = headerSection.split('\n');

    lines.forEach(line => {
      const match = line.match(/^([A-Za-z]+)\|?\s*(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        if (METADATA_KEYS.includes(key)) {
          existingMetadata[key] = value;
        }
      }
    });

    // Count Question Blocks
    let questionCount = 0;
    if (bodySection) {
      const regex = new RegExp(`^${delimiter.replace('|', '\\|')}`, 'gm');
      const matches = bodySection.match(regex);
      questionCount = matches ? matches.length : 0;
    }

    return {
      existingMetadata,
      bodySection,
      questionCount,
      hasMetadata: Object.keys(existingMetadata).length > 0
    };
  }

  /**
   * Reconstructs updated TXT file string with unified header metadata
   * @param {Object} metadataState - Key-value map of metadata
   * @param {string} bodySection - Preserved question blocks section
   * @returns {string}
   */
  function buildUpdatedTxt(metadataState, bodySection) {
    let headerText = '';

    METADATA_KEYS.forEach(key => {
      const val = metadataState[key] !== undefined ? metadataState[key] : '';
      headerText += `${key}| ${val}\n`;
    });

    headerText += '\n'; // Boundary separation
    return headerText + (bodySection || '');
  }

  /**
   * Downloads browser Blob files
   * @param {string} content 
   * @param {string} fileName 
   * @param {string} mimeType 
   */
  function triggerDownload(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return {
    METADATA_KEYS,
    normalizeText,
    analyzeFile,
    buildUpdatedTxt,
    triggerDownload
  };
})();
