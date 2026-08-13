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
const MATH_TAG_COMPONENTS = ['RRB', 'Group D', 'CEN - 08/2024', 'Mathematics', '10', '12', '12+'];
let mathCurriculum = { topics: [] };

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Shared Framework
  framework.init(TOOL_NAME);

  // =========================================================================
  // STATE MODEL (Single Source of Truth)
  // =========================================================================
  const anchorData = {
    mode: MODES.GACA,
    titleTemplate: '',
    mathTitleSourceURL: '',
    mathFetchedTitle: '',
    mathManualTitle: '',
    mathPrimaryVideoId: '',
    mathTagSelections: [],
    mathTopic: '',
    mathSubTopicSelections: [],
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

  const completedSteps = {};
  let currentUnlockedStep = 1;
  let isDirty = false;

  // =========================================================================
  // DOM ELEMENTS CACHE
  // =========================================================================
  const elements = {
    steps: {},
    modeGrid: document.getElementById('modeGrid'),

    titleTemplateSelect: document.getElementById('titleTemplateSelect'),
    mathTitleSourcePanel: document.getElementById('mathTitleSourcePanel'),
    standardTitleTemplatePanel: document.getElementById('standardTitleTemplatePanel'),
    inputMathTitleYouTube: document.getElementById('inputMathTitleYouTube'),
    mathManualTitlePanel: document.getElementById('mathManualTitlePanel'),
    mathFetchedTitlePanel: document.getElementById('mathFetchedTitlePanel'),
    inputMathManualTitle: document.getElementById('inputMathManualTitle'),
    mathFetchedTitle: document.getElementById('mathFetchedTitle'),
    inputSetNumber: document.getElementById('inputSetNumber'),
    computedTitle: document.getElementById('computedTitle'),

    tagsTemplateSelect: document.getElementById('tagsTemplateSelect'),
    mathTagsPanel: document.getElementById('mathTagsPanel'),
    standardTagsPanel: document.getElementById('standardTagsPanel'),
    mathTagChips: document.getElementById('mathTagChips'),
    mathSelectedTags: document.getElementById('mathSelectedTags'),
    mathTopicChips: document.getElementById('mathTopicChips'),
    mathSubTopicPanel: document.getElementById('mathSubTopicPanel'),
    mathSubTopicChips: document.getElementById('mathSubTopicChips'),
    computedTags: document.getElementById('computedTags'),

    inputVideoEnglish: document.getElementById('inputVideoEnglish'),
    linkCheckEnglish: document.getElementById('linkCheckEnglish'),
    titleStep5: document.getElementById('titleStep5'),
    mathPrimaryVideoHint: document.getElementById('mathPrimaryVideoHint'),

    inputVideoBengali: document.getElementById('inputVideoBengali'),
    linkCheckBengali: document.getElementById('linkCheckBengali'),

    inputPdfEnglish: document.getElementById('inputPdfEnglish'),
    inputPdfBengali: document.getElementById('inputPdfBengali'),

    inputTestSource: document.getElementById('inputTestSource'),
    mathTestSourcePanel: document.getElementById('mathTestSourcePanel'),
    standardTestSourcePanel: document.getElementById('standardTestSourcePanel'),
    mathTestSourceSelect: document.getElementById('mathTestSourceSelect'),
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
    applyMathUI();
    if (anchorData.mode === MODES.MATH) loadMathTestFiles();
    loadMathCurriculum();
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

  async function loadMathCurriculum() {
    try {
      const response = await fetch('math.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`math.json HTTP ${response.status}`);
      mathCurriculum = await response.json();
    } catch (error) {
      logger.warn(TOOL_NAME, `Unable to load math.json: ${error.message}`);
      mathCurriculum = { topics: [] };
    }
    renderMathSelectors();
  }

  function renderMathSelectors() {
    if (!elements.mathTagChips) return;
    elements.mathTagChips.innerHTML = '';
    MATH_TAG_COMPONENTS.forEach(value => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `math-chip ${anchorData.mathTagSelections.includes(value) ? 'selected' : ''}`;
      button.textContent = value;
      button.addEventListener('click', () => {
        anchorData.mathTagSelections = anchorData.mathTagSelections.includes(value)
          ? anchorData.mathTagSelections.filter(v => v !== value)
          : [...anchorData.mathTagSelections, value];
        renderMathSelectors();
        updateTagsComputation();
      });
      elements.mathTagChips.appendChild(button);
    });
    elements.mathSelectedTags.textContent = anchorData.mathTagSelections.join(', ') || '--';

    elements.mathTopicChips.innerHTML = '';
    (mathCurriculum.topics || []).forEach(topic => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `math-chip ${anchorData.mathTopic === topic.name ? 'selected' : ''}`;
      button.textContent = topic.name;
      button.addEventListener('click', () => {
        anchorData.mathTopic = anchorData.mathTopic === topic.name ? '' : topic.name;
        anchorData.mathSubTopicSelections = [];
        renderMathSelectors();
        updateTagsComputation();
      });
      elements.mathTopicChips.appendChild(button);
    });

    const selectedTopic = (mathCurriculum.topics || []).find(t => t.name === anchorData.mathTopic);
    elements.mathSubTopicPanel.classList.toggle('hidden', !selectedTopic);
    elements.mathSubTopicChips.innerHTML = '';
    if (selectedTopic) {
      (selectedTopic.subtopics || []).forEach(value => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `math-chip ${anchorData.mathSubTopicSelections.includes(value) ? 'selected' : ''}`;
        button.textContent = value;
        button.addEventListener('click', () => {
          anchorData.mathSubTopicSelections = anchorData.mathSubTopicSelections.includes(value)
            ? anchorData.mathSubTopicSelections.filter(v => v !== value)
            : [...anchorData.mathSubTopicSelections, value];
          renderMathSelectors();
          updateTagsComputation();
        });
        elements.mathSubTopicChips.appendChild(button);
      });
    }
  }

  function applyMathUI() {
    const isMath = anchorData.mode === MODES.MATH;
    elements.mathTitleSourcePanel.classList.toggle('hidden', !isMath);
    elements.standardTitleTemplatePanel.classList.toggle('hidden', isMath);
    elements.mathTagsPanel.classList.toggle('hidden', !isMath);
    elements.standardTagsPanel.classList.toggle('hidden', isMath);
    elements.mathTestSourcePanel.classList.toggle('hidden', !isMath);
    elements.standardTestSourcePanel.classList.toggle('hidden', isMath);
    elements.mathPrimaryVideoHint.classList.toggle('hidden', !isMath);
    renderMathSelectors();
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
    const generatedText = compileMetadataText(anchorData, completedSteps);
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

  function markStepCompleted(stepNum) {
    completedSteps[stepNum] = true;
    completeStepCard(elements.steps[stepNum]);
  }

  function markStepUncompleted(stepNum) {
    completedSteps[stepNum] = false;
    unlockStepCard(elements.steps[stepNum]);
  }

  // =========================================================================
  // DISPATCHED SAVE HANDLERS
  // =========================================================================
  const saveHandlers = {
    saveMode() {
      markStepCompleted(1);
      applyModeAdaptations();
      setNextStepActive(2);
      logger.debug(TOOL_NAME, `Saved Mode: ${anchorData.mode}`);
      return true;
    },

    async saveTitle() {
      const err = document.getElementById('errTitleTemplate');
      if (anchorData.mode !== MODES.MATH) {
        const val = elements.titleTemplateSelect.value;
        const v = validateRequired(val, 'Title Template');
        if (!v.isValid) { err.textContent = v.error; return false; }
        err.textContent = '';
        anchorData.titleTemplate = val;
        updateTitleComputation();
        markStepCompleted(2); setNextStepActive(3); return true;
      }

      const url = elements.inputMathTitleYouTube.value.trim();
      anchorData.mathTitleSourceURL = url;
      anchorData.mathFetchedTitle = '';
      anchorData.mathManualTitle = '';
      anchorData.titleTemplate = '';

      if (url) {
        const v = validateYouTubeField(url);
        if (!v.isValid || !v.videoId) { err.textContent = v.error || 'Enter a valid YouTube URL.'; return false; }
        try {
          const response = await fetch(`/api/developer/youtube-title?videoId=${encodeURIComponent(v.videoId)}`);
          const data = await response.json();
          if (!response.ok || data.status !== 'ok' || !data.title) throw new Error(data.message || 'Unable to retrieve YouTube title.');
          anchorData.mathFetchedTitle = data.title.trim();
          anchorData.titleTemplate = anchorData.mathFetchedTitle;
          anchorData.mathPrimaryVideoId = v.videoId;
          elements.mathFetchedTitle.textContent = anchorData.mathFetchedTitle;
          elements.inputVideoEnglish.value = v.videoId;
          elements.mathManualTitlePanel.classList.add('hidden');
          elements.mathFetchedTitlePanel.classList.remove('hidden');
        } catch (e) {
          err.textContent = e.message;
          return false;
        }
      } else {
        elements.mathFetchedTitlePanel.classList.add('hidden');
        elements.mathManualTitlePanel.classList.remove('hidden');
        anchorData.mathPrimaryVideoId = '';
      }
      err.textContent = '';
      markStepCompleted(2); setNextStepActive(3); return true;
    },

    saveSet() {
      const err = document.getElementById('errSetNumber');
      const val = elements.inputSetNumber.value.trim();
      if (anchorData.mode === MODES.MATH && !anchorData.mathFetchedTitle) {
        const manual = elements.inputMathManualTitle.value.trim();
        const titleCheck = validateRequired(manual, 'Manual Title');
        if (!titleCheck.isValid) { document.getElementById('errSetNumber').textContent = titleCheck.error; return false; }
        anchorData.mathManualTitle = manual;
        anchorData.titleTemplate = manual;
      }
      const v = validateNumeric(val, 'Set Number');
      if (!v.isValid) {
        err.textContent = v.error;
        return false;
      }
      err.textContent = '';
      anchorData.setNumber = val;
      updateTitleComputation();
      markStepCompleted(3);
      setNextStepActive(4);
      return true;
    },

    saveTags() {
      const err = document.getElementById('errTagsTemplate');
      if (anchorData.mode === MODES.MATH) {
        if (!anchorData.mathTagSelections.length) { err.textContent = 'Select at least one Math tag component.'; return false; }
        anchorData.tagsTemplate = 'math-custom';
        updateTagsComputation();
        err.textContent = '';
        markStepCompleted(4); setNextStepActive(5); return true;
      }
      const val = elements.tagsTemplateSelect.value;
      const v = validateRequired(val, 'Tag Group');
      if (!v.isValid) { err.textContent = v.error; return false; }
      err.textContent = '';
      anchorData.tagsTemplate = val;
      updateTagsComputation();
      markStepCompleted(4); setNextStepActive(5); return true;
    },

    saveEnglishVideo() {
      const err = document.getElementById('errVideoEnglish');
      const val = anchorData.mode === MODES.MATH ? anchorData.mathPrimaryVideoId : elements.inputVideoEnglish.value.trim();
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

      markStepCompleted(5);
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

      markStepCompleted(6);
      setNextStepActive(7);
      return true;
    },

    savePdfEnglish() {
      const val = elements.inputPdfEnglish.value;
      anchorData.pdfEnglish = formatPdfFilename(val);
      elements.inputPdfEnglish.value = anchorData.pdfEnglish === 'none' ? '' : anchorData.pdfEnglish;
      markStepCompleted(7);
      setNextStepActive(8);
      return true;
    },

    savePdfBengali() {
      const val = elements.inputPdfBengali.value;
      anchorData.pdfBengali = formatPdfFilename(val);
      elements.inputPdfBengali.value = anchorData.pdfBengali === 'none' ? '' : anchorData.pdfBengali;
      markStepCompleted(8);
      setNextStepActive(9);
      return true;
    },

    saveTestSource() {
      const err = document.getElementById('errTestSource');
      const raw = anchorData.mode === MODES.MATH
        ? elements.mathTestSourceSelect.value.trim()
        : elements.inputTestSource.value.trim();
      const v = validateRequired(raw, 'Question Bank Reference');
      if (!v.isValid) { err.textContent = v.error; return false; }
      err.textContent = '';
      anchorData.testSourceRaw = raw.replace(/\.txt$/i, '');
      updateTestSourceComputation(anchorData.testSourceRaw);
      markStepCompleted(9); setNextStepActive(10); return true;
    },

    saveTopic() {
      anchorData.topic = elements.inputTopic.value.trim();
      markStepCompleted(10);
      setNextStepActive(11);
      return true;
    },

    saveSubTopic() {
      anchorData.subTopic = elements.inputSubTopic.value.trim();
      markStepCompleted(11);
      setNextStepActive(12);
      return true;
    },

    saveLevel() {
      anchorData.level = elements.inputLevel.value.trim();
      markStepCompleted(12);
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
      markStepCompleted(13);
      enable(elements.btnDownload);
      toast.success('Anchor file compilation complete! Ready for export.');
      logger.info(TOOL_NAME, 'Completed wizard steps, output file ready.');
      return true;
    }
  };

  async function executeStepSave(stepNum) {
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
      const success = await handler();
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
    if (anchorData.mode === MODES.MATH) {
      const values = [...anchorData.mathTagSelections];
      if (anchorData.mathTopic) values.push(anchorData.mathTopic);
      values.push(...anchorData.mathSubTopicSelections);
      anchorData.tags = values.join(', ');
      elements.computedTags.textContent = anchorData.tags || '--';
      return;
    }
    const mode = anchorData.mode;
    const match = (TAG_TEMPLATES[mode] || []).find((t) => t.id === anchorData.tagsTemplate);
    anchorData.tags = match ? match.tags : anchorData.tagsTemplate;
    elements.computedTags.textContent = anchorData.tags || '--';
  }

  async function loadMathTestFiles() {
    if (anchorData.mode !== MODES.MATH || !elements.mathTestSourceSelect) return;
    try {
      const response = await fetch('/api/developer/questions?action=files&topic=math', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || data.status !== 'ok') throw new Error(data.message || 'Unable to list Math question files.');
      elements.mathTestSourceSelect.innerHTML = '<option value="">-- Browse questions/math --</option>';
      (data.data || []).forEach(file => {
        const option = document.createElement('option');
        option.value = String(file).replace(/\.txt$/i, '');
        option.textContent = file;
        elements.mathTestSourceSelect.appendChild(option);
      });
    } catch (error) {
      elements.mathTestSourceSelect.innerHTML = `<option value="">Unable to load files</option>`;
      logger.warn(TOOL_NAME, error.message);
    }
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

    // Re-apply Math-specific UI whenever the mode is saved/switched.
    // init() applies this once, but saveMode() reaches this function after
    // the user changes from the default GACA mode to MATH.
    applyMathUI();

    // Populate the Math Step 9 file browser after switching from the
    // default GACA mode to MATH. Previously this ran only during init().
    if (anchorData.mode === MODES.MATH) {
      loadMathTestFiles();
    }

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
    applyMathUI();

    if (anchorData.mode === MODES.MATH) {
      loadMathTestFiles();
    }
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-save')) {
      const stepNum = parseInt(e.target.getAttribute('data-step'), 10);
      executeStepSave(stepNum).catch(error => { logger.error(TOOL_NAME, error); toast.error(error.message || 'Unable to save this step.'); });
    } else if (e.target.classList.contains('btn-edit')) {
      const stepNum = parseInt(e.target.getAttribute('data-step'), 10);
      if (stepNum === 13) {
        disable(elements.btnDownload);
      }
      markStepUncompleted(stepNum);
      rebuildPreview();
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

  elements.inputMathTitleYouTube?.addEventListener('input', () => {
    anchorData.mathTitleSourceURL = elements.inputMathTitleYouTube.value.trim();
  });

  elements.inputMathManualTitle?.addEventListener('input', () => {
    anchorData.mathManualTitle = elements.inputMathManualTitle.value.trim();
    anchorData.titleTemplate = anchorData.mathManualTitle;
    updateTitleComputation();
  });

  elements.mathTestSourceSelect?.addEventListener('change', () => {
    const value = elements.mathTestSourceSelect.value.trim();
    if (value) updateTestSourceComputation(value);
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
    disable(elements.btnDownload);
    markStepUncompleted(3);
    markStepUncompleted(13);
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
    Object.keys(completedSteps).forEach((key) => (completedSteps[key] = false));

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
      const parsedResult = parseAnchorTXT(content, file.name);
      loadParsedDataIntoWizard(parsedResult.anchor || parsedResult);
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
      markStepCompleted(i);
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
