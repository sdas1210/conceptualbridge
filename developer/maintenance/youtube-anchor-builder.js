/**
 * Conceptual Bridge - YouTube Anchor Builder (v2.1.0)
 * Updated to integrate framework logger and initialization services.
 */

import { framework } from './shared/framework.js';
import { logger } from './shared/logger.js';
import { MODES, MODE_STATUS } from './shared/constants.js';
import { TITLE_TEMPLATES, TAG_TEMPLATES, MODE_CONFIGURATION } from './shared/config.js';
import { validateRequired, validateNumeric, validateFilename, validateYouTubeField } from './shared/validator.js';
import { buildPreviewURL } from './shared/youtubeUtils.js';
import { formatPdfFilename, buildTestSource, compileMetadataText } from './shared/metadataFormatter.js';
import { parseAnchorTXT } from './shared/anchorImporter.js';
import { downloadTextFile, copyToClipboard, readTextFile } from './shared/fileUtils.js';
import { show, hide, enable, disable, lockStepCard, unlockStepCard, completeStepCard } from './shared/domUtils.js';
import { toast } from './shared/toast.js';
import { showConfirmDialog } from './shared/dialog.js';

const TOOL_NAME = 'YouTube Anchor Builder';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Shared Framework
  framework.init(TOOL_NAME);

  // =========================================================================
  // STATE MODEL (Single Source of Truth)
  // =========================================================================
  const anchorData = {
    mode: MODES.GACA,
    titleTemplate: '',
    setNumber: '',
    title: '',
    tagsTemplate: '',
    tags: '',
    english: '',
    bengali: '',
    pdfEnglish: '',
    pdfBengali: '',
    testSourceRaw: '',
    testSource: '',
    topic: '',
    subTopic: '',
    level: '',
    outputFilename: ''
  };

  let currentUnlockedStep = 1;
  let isDirty = false;

  // =========================================================================
  // DOM ELEMENTS CACHE
  // =========================================================================
  const elements = {
    steps: {},
    modeGrid: document.getElementById('modeGrid'),

    titleTemplateSelect: document.getElementById('titleTemplateSelect'),
    inputSetNumber: document.getElementById('inputSetNumber'),
    computedTitle: document.getElementById('computedTitle'),

    tagsTemplateSelect: document.getElementById('tagsTemplateSelect'),
    computedTags: document.getElementById('computedTags'),

    inputVideoEnglish: document.getElementById('inputVideoEnglish'),
    linkCheckEnglish: document.getElementById('linkCheckEnglish'),
    titleStep5: document.getElementById('titleStep5'),

    inputVideoBengali: document.getElementById('inputVideoBengali'),
    linkCheckBengali: document.getElementById('linkCheckBengali'),

    inputPdfEnglish: document.getElementById('inputPdfEnglish'),
    inputPdfBengali: document.getElementById('inputPdfBengali'),

    inputTestSource: document.getElementById('inputTestSource'),
    computedTestSource: document.getElementById('computedTestSource'),

    inputTopic: document.getElementById('inputTopic'),
    inputSubTopic: document.getElementById('inputSubTopic'),
    inputLevel: document.getElementById('inputLevel'),

    inputOutputFilename: document.getElementById('inputOutputFilename'),

    btnDownload: document.getElementById('btnDownload'),
    btnReset: document.getElementById('btnReset'),
    btnLoadFile: document.getElementById('btnLoadFile'),
    fileInput: document.getElementById('fileInput'),
    btnCopyPreview: document.getElementById('btnCopyPreview'),
    btnDuplicate: document.getElementById('btnDuplicate'),

    previewArea: document.getElementById('previewArea'),
    charCounter: document.getElementById('charCounter'),
    unsavedBadge: document.getElementById('unsavedBadge')
  };

  for (let i = 1; i <= 13; i++) {
    elements.steps[i] = document.getElementById(`step${i}`);
  }

  // =========================================================================
  // INITIALIZATION & CONFIGURATION BINDING
  // =========================================================================
  function init() {
    renderModeCards();
    populateSelectOptions(anchorData.mode);
    rebuildPreview();
    logger.success(TOOL_NAME, 'Application initialized successfully.');
  }

  function renderModeCards() {
    elements.modeGrid.innerHTML = '';
    Object.keys(MODES).forEach((modeKey) => {
      const mode = MODES[modeKey];
      const status = MODE_STATUS[mode];

      const card = document.createElement('div');
      card.className = `mode-card glassmorphism ${anchorData.mode === mode ? 'active' : ''} ${!status.active ? 'disabled' : ''}`;
      card.setAttribute('data-mode', mode);

      card.innerHTML = `
        <div class="mode-badge ${status.badgeClass}">${status.label}</div>
        <h3>${mode}</h3>
        <p>${getModeDescription(mode)}</p>
      `;

      card.addEventListener('click', () => handleModeSelect(mode, status.active));
      elements.modeGrid.appendChild(card);
    });
  }

  function getModeDescription(mode) {
    switch (mode) {
      case MODES.GACA: return 'General Awareness & Current Affairs';
      case MODES.MATH: return 'Mathematics Quantitative Suite';
      case MODES.GS: return 'General Science Framework';
      case MODES.GI: return 'General Intelligence & Reasoning';
      default: return '';
    }
  }

  function populateSelectOptions(mode) {
    elements.titleTemplateSelect.innerHTML = '<option value="">-- Select Template --</option>';
    const titles = TITLE_TEMPLATES[mode] || [];
    titles.forEach((t) => {
      const opt = document.createElement('option');
      opt.value = t.template;
      opt.textContent = t.label;
      elements.titleTemplateSelect.appendChild(opt);
    });

    elements.tagsTemplateSelect.innerHTML = '<option value="">-- Select Tags --</option>';
    const tags = TAG_TEMPLATES[mode] || [];
    tags.forEach((tg) => {
      const opt = document.createElement('option');
      opt.value = tg.id;
      opt.textContent = tg.label;
      elements.tagsTemplateSelect.appendChild(opt);
    });
  }

  // =========================================================================
  // PREVIEW SYNTHESIS ENGINE
  // =========================================================================
  function rebuildPreview() {
    const generatedText = compileMetadataText(anchorData);
    elements.previewArea.textContent = generatedText || '// Configure wizard steps to build TXT file...';

    const chars = generatedText.length;
    const lines = generatedText ? generatedText.split('\n').length : 0;
    elements.charCounter.textContent = `${chars} Chars | ${lines} Lines`;

    if (isDirty) {
      show(elements.unsavedBadge);
    } else {
      hide(elements.unsavedBadge);
    }

    return generatedText;
  }

  // =========================================================================
  // DISPATCHED SAVE HANDLERS
  // =========================================================================
  const saveHandlers = {
    saveMode() {
      completeStepCard(elements.steps[1]);
      applyModeAdaptations();
      setNextStepActive(2);
      logger.debug(TOOL_NAME, `Saved Mode: ${anchorData.mode}`);
      return true;
    },

    saveTitle() {
      const err = document.getElementById('errTitleTemplate');
      const val = elements.titleTemplateSelect.value;
      const v = validateRequired(val, 'Title Template');
      if (!v.isValid) {
        err.textContent = v.error;
        return false;
      }
      err.textContent = '';
      anchorData.titleTemplate = val;
      updateTitleComputation();
      completeStepCard(elements.steps[2]);
      setNextStepActive(3);
      return true;
    },

    saveSet() {
      const err = document.getElementById('errSetNumber');
      const val = elements.inputSetNumber.value.trim();
      const v = validateNumeric(val, 'Set Number');
      if (!v.isValid) {
        err.textContent = v.error;
        return false;
      }
      err.textContent = '';
      anchorData.setNumber = val;
      updateTitleComputation();
      completeStepCard(elements.steps[3]);
      setNextStepActive(4);
      return true;
    },

    saveTags() {
      const err = document.getElementById('errTagsTemplate');
      const val = elements.tagsTemplateSelect.value;
      const v = validateRequired(val, 'Tag Group');
      if (!v.isValid) {
        err.textContent = v.error;
        return false;
      }
      err.textContent = '';
      anchorData.tagsTemplate = val;
      updateTagsComputation();
      completeStepCard(elements.steps[4]);
      setNextStepActive(5);
      return true;
    },

    saveEnglishVideo() {
      const err = document.getElementById('errVideoEnglish');
      const val = elements.inputVideoEnglish.value.trim();
      const v = validateYouTubeField(val);
      if (!v.isValid) {
        err.textContent = v.error;
        return false;
      }
      err.textContent = '';
      anchorData.english = v.videoId;
      elements.inputVideoEnglish.value = v.videoId;

      if (v.videoId) {
        elements.linkCheckEnglish.href = buildPreviewURL(v.videoId);
        show(elements.linkCheckEnglish);
      } else {
        hide(elements.linkCheckEnglish);
      }

      completeStepCard(elements.steps[5]);
      setNextStepActive(6);
      return true;
    },

    saveBengaliVideo() {
      const err = document.getElementById('errVideoBengali');
      const val = elements.inputVideoBengali.value.trim();
      const v = validateYouTubeField(val);
      if (!v.isValid) {
        err.textContent = v.error;
        return false;
      }
      err.textContent = '';
      anchorData.bengali = v.videoId;
      elements.inputVideoBengali.value = v.videoId;

      if (v.videoId) {
        elements.linkCheckBengali.href = buildPreviewURL(v.videoId);
        show(elements.linkCheckBengali);
      } else {
        hide(elements.linkCheckBengali);
      }

      completeStepCard(elements.steps[6]);
      setNextStepActive(7);
      return true;
    },

    savePdfEnglish() {
      const val = elements.inputPdfEnglish.value;
      anchorData.pdfEnglish = formatPdfFilename(val);
      elements.inputPdfEnglish.value = anchorData.pdfEnglish === 'none' ? '' : anchorData.pdfEnglish;
      completeStepCard(elements.steps[7]);
      setNextStepActive(8);
      return true;
    },

    savePdfBengali() {
      const val = elements.inputPdfBengali.value;
      anchorData.pdfBengali = formatPdfFilename(val);
      elements.inputPdfBengali.value = anchorData.pdfBengali === 'none' ? '' : anchorData.pdfBengali;
      completeStepCard(elements.steps[8]);
      setNextStepActive(9);
      return true;
    },

    saveTestSource() {
      const err = document.getElementById('errTestSource');
      const val = elements.inputTestSource.value.trim();
      const v = validateRequired(val, 'Question Bank Reference');
      if (!v.isValid) {
        err.textContent = v.error;
        return false;
      }
      err.textContent = '';
      anchorData.testSourceRaw = val;
      updateTestSourceComputation(val);
      completeStepCard(elements.steps[9]);
      setNextStepActive(10);
      return true;
    },

    saveTopic() {
      anchorData.topic = elements.inputTopic.value.trim();
      completeStepCard(elements.steps[10]);
      setNextStepActive(11);
      return true;
    },

    saveSubTopic() {
      anchorData.subTopic = elements.inputSubTopic.value.trim();
      completeStepCard(elements.steps[11]);
      setNextStepActive(12);
      return true;
    },

    saveLevel() {
      anchorData.level = elements.inputLevel.value.trim();
      completeStepCard(elements.steps[12]);
      setNextStepActive(13);
      return true;
    },

    saveFilename() {
      const err = document.getElementById('errOutputFilename');
      const val = elements.inputOutputFilename.value.trim();
      const v = validateFilename(val);
      if (!v.isValid) {
        err.textContent = v.error;
        return false;
      }
      err.textContent = '';
      anchorData.outputFilename = val;
      completeStepCard(elements.steps[13]);
      enable(elements.btnDownload);
      toast.success('Anchor file compilation complete! Ready for export.');
      logger.info(TOOL_NAME, 'Completed wizard steps, output file ready.');
      return true;
    }
  };

  function executeStepSave(stepNum) {
    const handlerMap = {
      1: saveHandlers.saveMode,
      2: saveHandlers.saveTitle,
      3: saveHandlers.saveSet,
      4: saveHandlers.saveTags,
      5: saveHandlers.saveEnglishVideo,
      6: saveHandlers.saveBengaliVideo,
      7: saveHandlers.savePdfEnglish,
      8: saveHandlers.savePdfBengali,
      9: saveHandlers.saveTestSource,
      10: saveHandlers.saveTopic,
      11: saveHandlers.saveSubTopic,
      12: saveHandlers.saveLevel,
      13: saveHandlers.saveFilename
    };

    const handler = handlerMap[stepNum];
    if (handler) {
      isDirty = true;
      const success = handler();
      if (success) {
        rebuildPreview();
      }
    }
  }

  // =========================================================================
  // COMPUTATION HELPERS
  // =========================================================================
  function updateTitleComputation() {
    if (anchorData.titleTemplate && anchorData.setNumber) {
      anchorData.title = `${anchorData.titleTemplate} (Set - ${anchorData.setNumber})`;
    } else {
      anchorData.title = '';
    }
    elements.computedTitle.textContent = anchorData.title || '--';
  }

  function updateTagsComputation() {
    const mode = anchorData.mode;
    const match = (TAG_TEMPLATES[mode] || []).find((t) => t.id === anchorData.tagsTemplate);
    anchorData.tags = match ? match.tags : anchorData.tagsTemplate;
    elements.computedTags.textContent = anchorData.tags || '--';
  }

  function updateTestSourceComputation(rawInput) {
    const config = MODE_CONFIGURATION[anchorData.mode];
    const path = buildTestSource(rawInput, config.testSourceFolder);
    anchorData.testSource = path;
    elements.computedTestSource.textContent = path || '--';
  }

  function setNextStepActive(nextStepNum) {
    if (nextStepNum > 13) return;

    const config = MODE_CONFIGURATION[anchorData.mode];
    if (config.videoFields < 2 && nextStepNum === 6) {
      setNextStepActive(7);
      return;
    }

    currentUnlockedStep = Math.max(currentUnlockedStep, nextStepNum);
    unlockStepCard(elements.steps[nextStepNum]);
  }

  function applyModeAdaptations() {
    const config = MODE_CONFIGURATION[anchorData.mode];

    if (config.videoFields === 1) {
      elements.titleStep5.textContent = 'Primary YouTube Video';
      hide(elements.steps[6]);
    } else {
      elements.titleStep5.textContent = 'English YouTube Video';
      show(elements.steps[6]);
    }

    populateSelectOptions(anchorData.mode);

    if (elements.inputTestSource.value.trim()) {
      updateTestSourceComputation(elements.inputTestSource.value.trim());
    }
  }

  // =========================================================================
  // EVENT LISTENERS & DELEGATION
  // =========================================================================
  function handleModeSelect(mode, isActive) {
    if (!isActive) {
      toast.warning(`${mode} Mode - Coming Soon`);
      return;
    }

    anchorData.mode = mode;
    renderModeCards();
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-save')) {
      const stepNum = parseInt(e.target.getAttribute('data-step'), 10);
      executeStepSave(stepNum);
    } else if (e.target.classList.contains('btn-edit')) {
      const stepNum = parseInt(e.target.getAttribute('data-step'), 10);
      unlockStepCard(elements.steps[stepNum]);
    }
  });

  elements.inputSetNumber.addEventListener('input', () => {
    anchorData.setNumber = elements.inputSetNumber.value.trim();
    updateTitleComputation();
  });

  elements.inputTestSource.addEventListener('input', () => {
    const val = elements.inputTestSource.value.trim();
    updateTestSourceComputation(val);
  });

  elements.btnDownload.addEventListener('click', () => {
    const textContent = rebuildPreview();
    const filename = `${anchorData.outputFilename || 'anchor'}.txt`;
    downloadTextFile(textContent, filename);
    isDirty = false;
    rebuildPreview();
    toast.success(`Exported ${filename} successfully!`);
    logger.info(TOOL_NAME, `Exported file: ${filename}`);
  });

  elements.btnCopyPreview.addEventListener('click', () => {
    const text = rebuildPreview();
    copyToClipboard(text).then(() => toast.info('Preview copied to clipboard!'));
  });

  elements.btnDuplicate.addEventListener('click', () => {
    anchorData.setNumber = '';
    anchorData.outputFilename = '';
    elements.inputSetNumber.value = '';
    elements.inputOutputFilename.value = '';
    updateTitleComputation();
    unlockStepCard(elements.steps[3]);
    toast.info('Duplicated anchor. Specify new Set Number and Output Filename.');
  });

  elements.btnReset.addEventListener('click', async () => {
    if (isDirty) {
      const confirmed = await showConfirmDialog({
        title: 'Reset Wizard',
        message: 'Are you sure you want to reset all wizard progress? Unsaved changes will be lost.',
        confirmText: 'Reset Progress'
      });
      if (!confirmed) return;
    }

    resetWizardState();
  });

  function resetWizardState() {
    Object.keys(anchorData).forEach((key) => (anchorData[key] = ''));
    anchorData.mode = MODES.GACA;

    document.querySelectorAll('.form-control').forEach((i) => (i.value = ''));
    hide(elements.linkCheckEnglish);
    hide(elements.linkCheckBengali);
    elements.computedTitle.textContent = '--';
    elements.computedTags.textContent = '--';
    elements.computedTestSource.textContent = '--';

    currentUnlockedStep = 1;
    isDirty = false;

    for (let i = 1; i <= 13; i++) {
      lockStepCard(elements.steps[i]);
    }

    renderModeCards();
    unlockStepCard(elements.steps[1]);
    disable(elements.btnDownload);
    rebuildPreview();
    toast.info('Wizard reset to clean state.');
    logger.info(TOOL_NAME, 'Wizard reset.');
  }

  // Load Existing Anchor
  elements.btnLoadFile.addEventListener('click', () => elements.fileInput.click());

  elements.fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const content = await readTextFile(file);
      const parsed = parseAnchorTXT(content, file.name);
      loadParsedDataIntoWizard(parsed);
      toast.success(`Successfully imported ${file.name}`);
      logger.info(TOOL_NAME, `Successfully loaded file: ${file.name}`);
    } catch (err) {
      toast.error(`Import Failed: ${err.message}`);
      logger.error(TOOL_NAME, `Import error on file: ${file.name}`, err);
    }
  });

  function loadParsedDataIntoWizard(parsed) {
    Object.assign(anchorData, parsed);

    elements.titleTemplateSelect.value = anchorData.titleTemplate;
    elements.inputSetNumber.value = anchorData.setNumber;
    elements.tagsTemplateSelect.value = anchorData.tagsTemplate;
    elements.inputVideoEnglish.value = anchorData.english;
    elements.inputVideoBengali.value = anchorData.bengali;
    elements.inputPdfEnglish.value = anchorData.pdfEnglish === 'none' ? '' : anchorData.pdfEnglish;
    elements.inputPdfBengali.value = anchorData.pdfBengali === 'none' ? '' : anchorData.pdfBengali;
    elements.inputTestSource.value = anchorData.testSourceRaw;
    elements.inputTopic.value = anchorData.topic;
    elements.inputSubTopic.value = anchorData.subTopic;
    elements.inputLevel.value = anchorData.level;
    elements.inputOutputFilename.value = anchorData.outputFilename;

    renderModeCards();
    applyModeAdaptations();
    updateTitleComputation();
    updateTagsComputation();

    for (let i = 1; i <= 13; i++) {
      completeStepCard(elements.steps[i]);
    }

    unlockStepCard(elements.steps[13]);
    enable(elements.btnDownload);

    isDirty = false;
    rebuildPreview();
  }

  window.addEventListener('beforeunload', (e) => {
    if (isDirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  init();
});
