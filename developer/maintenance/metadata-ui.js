/**
 * metadata-ui.js (v1.1)
 * Workflow Engine & UI Manager for Global Metadata Tagger
 * 
 * Part of the Conceptual Bridge Maintenance Suite.
 * Enforces strict sequential metadata verification, state-machine transitions,
 * and cascading dependency management with cached DOM references and decoupled state rendering.
 *
 * @fileoverview Guided metadata review workflow engine for conceptual bridge maintenance.
 * @module MetadataUI
 */

window.MetadataUI = (function () {
  'use strict';

  // =========================================================================
  // DEBUG CONFIGURATION
  // =========================================================================

  /** @type {boolean} Toggle detailed workflow and state transition logs */
  const DEBUG = false;

  /**
   * Internal logger helper function.
   * @param {string} category 
   * @param {...*} args 
   */
  function logDebug(category, ...args) {
    if (DEBUG) {
      console.log(`[MetadataUI::${category}]`, ...args);
    }
  }

  // =========================================================================
  // CONSTANTS & SCHEMAS
  // =========================================================================

  /**
   * Canonical sequential metadata workflow order.
   * Field processing MUST strictly follow this exact sequence.
   * @type {readonly string[]}
   */
  const WORKFLOW_ORDER = Object.freeze([
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
  ]);

  /**
   * Finite Row States
   * @readonly
   * @enum {string}
   */
  const ROW_STATES = Object.freeze({
    LOCKED: 'LOCKED',
    UNLOCKED: 'UNLOCKED',
    EDITING: 'EDITING',
    SAVED: 'SAVED',
    VERIFIED: 'VERIFIED',
    COMPLETED: 'COMPLETED'
  });

  /**
   * Subject Auto-Assignment Default Mapping
   * @readonly
   */
  const SUBJECT_AUTO_ASSIGNMENTS = Object.freeze({
    GACA: 'GENERAL AWARENESS & CURRENT AFFAIRS (GACA)',
    MATHEMATICS: 'MATHEMATICS'
  });

  /**
   * UI Class Name Constants
   * @readonly
   */
  const UI_CLASSES = Object.freeze({
    METADATA_ROW: 'metadata-row',
    ROW_LABEL: 'row-label',
    FIELD_CONTAINER: 'field-container',
    INPUT_TEXT: 'input-text',
    SELECT_DROPDOWN: 'select-dropdown',
    BUTTON_GROUP: 'button-group',
    BTN_ICON: 'btn-icon',
    BTN_ADD: 'btn-add',
    BTN_EDIT: 'btn-edit',
    BTN_SAVE: 'btn-save',
    CHECKBOX_CONTAINER: 'checkbox-container',
    CUSTOM_CHECKBOX: 'custom-checkbox',
    CHECKED: 'checked'
  });

  /**
   * UI Icon & Label Constants
   * @readonly
   */
  const UI_TEXT = Object.freeze({
    ADD_TITLE: 'Add Value',
    EDIT_TITLE: 'Edit Value',
    SAVE_TITLE: 'Save Value',
    CHECKBOX_TITLE: 'Mark Verified',
    DROPDOWN_DEFAULT: '-- Select Value --'
  });

  // =========================================================================
  // PRIVATE STATE MANAGEMENT
  // =========================================================================

  /** @type {HTMLElement|null} Container DOM reference */
  let containerElement = null;

  /** @type {Function|null} Callback to notify controller on UI state change */
  let onStateChangeCallback = null;

  /** @type {Object} External catalogue maps */
  let catalogDataRef = {};
  let mathCatalogRef = {};
  let currentSubjectMode = 'GACA';

  /**
   * Central Workflow State Store.
   * Maps fieldKey -> RowStateObject
   * @type {Object.<string, RowStateObject>}
   */
  let workflowStore = {};

  /**
   * Cached DOM references per row key.
   * Maps fieldKey -> CachedDOMReferences
   * @type {Object.<string, Object>}
   */
  let domCache = {};

  /**
   * Factory function to create an initial row state object.
   * @param {string} key 
   * @param {string} [initialValue=''] 
   * @returns {Object}
   */
  function createRowState(key, initialValue = '') {
    return {
      key,
      value: initialValue,
      state: ROW_STATES.LOCKED,
      verified: false,
      edited: false
    };
  }

  // =========================================================================
  // PUBLIC API & INITIALIZATION (Backward-Compatible)
  // =========================================================================

  /**
   * Initializes the MetadataUI engine.
   * @param {HTMLElement} container 
   * @param {Function} onChangeCb 
   */
  function init(container, onChangeCb) {
    containerElement = container;
    onStateChangeCallback = typeof onChangeCb === 'function' ? onChangeCb : null;
    resetWorkflowStore();
    logDebug('Init', 'Initialized engine');
  }

  /**
   * Main entry point to render metadata rows. Preserves public signature.
   * @param {Object} parsedMetadata 
   * @param {Object} catalogData 
   * @param {Object} mathCatalog 
   * @param {string} subjectMode 
   */
  function renderRows(parsedMetadata, catalogData, mathCatalog, subjectMode) {
    if (!containerElement) {
      console.error('MetadataUI: Engine not initialized. Call init() first.');
      return;
    }

    catalogDataRef = catalogData || {};
    mathCatalogRef = mathCatalog || {};
    currentSubjectMode = subjectMode || 'GACA';

    containerElement.innerHTML = '';
    resetWorkflowStore();
    domCache = {};

    logDebug('Render', `Rendering rows for subject mode: ${currentSubjectMode}`);

    // 1. Populate initial state from parsed metadata
    WORKFLOW_ORDER.forEach(key => {
      const val = parsedMetadata && parsedMetadata[key] ? parsedMetadata[key] : '';
      workflowStore[key] = createRowState(key, val);
    });

    // 2. Protect existing metadata; apply auto-assignment only to empty fields
    applySubjectAutoAssignment(currentSubjectMode);

    // 3. Render DOM structure and cache DOM references
    WORKFLOW_ORDER.forEach(key => {
      const rowEl = createRowComponent(workflowStore[key]);
      containerElement.appendChild(rowEl);
    });

    // 4. Evaluate sequential workflow states starting from Exam
    reevaluateWorkflowSequence();

    // 5. Notify controller of initial state
    notifyStateChange();
  }

  /**
   * Returns current metadata key-value state for TXT/JSON exports.
   * @returns {Object.<string, string>}
   */
  function getMetadataState() {
    const exportMap = {};
    WORKFLOW_ORDER.forEach(key => {
      exportMap[key] = workflowStore[key] ? workflowStore[key].value : '';
    });
    return exportMap;
  }

  /**
   * Programmatically updates a field's value in state and DOM.
   * @param {string} key 
   * @param {string} value 
   */
  function updateFieldValue(key, value) {
    if (!workflowStore[key]) return;

    workflowStore[key].value = value;
    const cached = domCache[key];
    if (cached && cached.inputText) {
      cached.inputText.value = value;
    }

    logDebug('UpdateFieldValue', `${key} -> "${value}"`);

    // Handle dynamic cascading reset if Topic changes programmatically
    if (key === 'Topic' && currentSubjectMode === 'MATHEMATICS') {
      handleTopicChange();
    }
  }

  // =========================================================================
  // WORKFLOW ENGINE & CENTRALIZED STATE TRANSITIONS
  // =========================================================================

  /**
   * Resets internal state store.
   */
  function resetWorkflowStore() {
    workflowStore = {};
    WORKFLOW_ORDER.forEach(key => {
      workflowStore[key] = createRowState(key);
    });
  }

  /**
   * Centralized transition function for changing row state.
   * Ensures all state updates are logged and trigger a dedicated UI render pass.
   * @param {string} key 
   * @param {string} newState 
   */
  function transitionRowState(key, newState) {
    const rowState = workflowStore[key];
    if (!rowState) return;

    if (rowState.state !== newState) {
      logDebug('StateTransition', `${key}: ${rowState.state} -> ${newState}`);
      rowState.state = newState;
    }

    // Render state visually via cached DOM elements
    renderRowStateUI(key);
  }

  /**
   * Evaluates the sequential progression of the entire workflow.
   * Ensures exactly ONE row is active (unlocked/editing/saved) at a time,
   * while previous verified rows stay completed, and upcoming rows remain locked.
   */
  function reevaluateWorkflowSequence() {
    let unlockNext = true;

    for (let i = 0; i < WORKFLOW_ORDER.length; i++) {
      const key = WORKFLOW_ORDER[i];
      const rowState = workflowStore[key];

      if (!unlockNext) {
        transitionRowState(key, ROW_STATES.LOCKED);
        continue;
      }

      if (rowState.verified) {
        transitionRowState(key, ROW_STATES.COMPLETED);
        // Continue loop to allow next row in sequence to unlock
      } else {
        // First unverified row encountered becomes the active step
        if (rowState.state === ROW_STATES.LOCKED || rowState.state === ROW_STATES.COMPLETED) {
          transitionRowState(key, ROW_STATES.UNLOCKED);
        }
        // Block subsequent rows from unlocking
        unlockNext = false;
      }
    }

    logDebug('Sequence', `Current Active Step: ${getCurrentRow() || 'ALL_COMPLETED'}`);
  }

  /**
   * Auto-assigns Subject according to subjectMode rules ONLY if field is empty.
   * Protects pre-existing uploaded metadata.
   * @param {string} mode 
   */
  function applySubjectAutoAssignment(mode) {
    const subjectState = workflowStore['Subject'];
    if (subjectState && (!subjectState.value || subjectState.value.trim() === '')) {
      if (SUBJECT_AUTO_ASSIGNMENTS[mode]) {
        subjectState.value = SUBJECT_AUTO_ASSIGNMENTS[mode];
        logDebug('AutoAssign', `Subject auto-assigned to "${subjectState.value}"`);
      }
    }
  }

  // =========================================================================
  // DOM COMPONENT RENDERER & EVENT HANDLERS
  // =========================================================================

  /**
   * Creates DOM element for a metadata row and caches element references.
   * @param {Object} rowData 
   * @returns {HTMLElement}
   */
  function createRowComponent(rowData) {
    const { key, value } = rowData;
    const row = document.createElement('div');
    row.className = UI_CLASSES.METADATA_ROW;
    row.dataset.key = key;

    row.innerHTML = `
      <div class="${UI_CLASSES.ROW_LABEL}">${escapeHtml(key)}</div>
      <div class="${UI_CLASSES.FIELD_CONTAINER}">
        <input type="text" class="${UI_CLASSES.INPUT_TEXT}" id="input-${key}" value="${escapeHtml(value)}" disabled />
        <select class="${UI_CLASSES.SELECT_DROPDOWN}" id="select-${key}" style="display: none;"></select>
      </div>
      <div class="${UI_CLASSES.BUTTON_GROUP}">
        <button class="${UI_CLASSES.BTN_ICON} ${UI_CLASSES.BTN_ADD}" title="${UI_TEXT.ADD_TITLE}">➕</button>
        <button class="${UI_CLASSES.BTN_ICON} ${UI_CLASSES.BTN_EDIT}" title="${UI_TEXT.EDIT_TITLE}">✏️</button>
        <button class="${UI_CLASSES.BTN_ICON} ${UI_CLASSES.BTN_SAVE}" title="${UI_TEXT.SAVE_TITLE}" disabled>💾</button>
      </div>
      <div class="${UI_CLASSES.CHECKBOX_CONTAINER}">
        <div class="${UI_CLASSES.CUSTOM_CHECKBOX}" title="${UI_TEXT.CHECKBOX_TITLE}"></div>
      </div>
    `;

    // Cache DOM references
    domCache[key] = {
      rowEl: row,
      inputText: row.querySelector(`.${UI_CLASSES.INPUT_TEXT}`),
      selectDropdown: row.querySelector(`.${UI_CLASSES.SELECT_DROPDOWN}`),
      btnAdd: row.querySelector(`.${UI_CLASSES.BTN_ADD}`),
      btnEdit: row.querySelector(`.${UI_CLASSES.BTN_EDIT}`),
      btnSave: row.querySelector(`.${UI_CLASSES.BTN_SAVE}`),
      checkbox: row.querySelector(`.${UI_CLASSES.CUSTOM_CHECKBOX}`)
    };

    // Bind Event Listeners via Cached Elements
    const cached = domCache[key];
    cached.btnAdd.addEventListener('click', () => handleAddClick(key));
    cached.btnEdit.addEventListener('click', () => handleEditClick(key));
    cached.btnSave.addEventListener('click', () => handleSaveClick(key));
    cached.selectDropdown.addEventListener('change', () => handleSelectChange(key));
    cached.checkbox.addEventListener('click', () => handleCheckboxClick(key));

    return row;
  }

  /**
   * Handles Add Button Click
   * @param {string} key 
   */
  function handleAddClick(key) {
    const cached = domCache[key];
    if (!cached) return;

    refreshDropdown(key, cached.selectDropdown);

    cached.inputText.style.display = 'none';
    cached.selectDropdown.style.display = 'block';

    transitionRowState(key, ROW_STATES.EDITING);
  }

  /**
   * Handles Edit Button Click
   * @param {string} key 
   */
  function handleEditClick(key) {
    const cached = domCache[key];
    if (!cached) return;

    refreshDropdown(key, cached.selectDropdown);

    if (workflowStore[key].value) {
      cached.selectDropdown.value = workflowStore[key].value;
    }

    cached.inputText.style.display = 'none';
    cached.selectDropdown.style.display = 'block';

    transitionRowState(key, ROW_STATES.EDITING);
  }

  /**
   * Handles Dropdown Change Event
   * @param {string} key 
   */
  function handleSelectChange(key) {
    const cached = domCache[key];
    if (!cached) return;

    // Enable save button if a selection is made
    cached.btnSave.disabled = !cached.selectDropdown.value;
  }

  /**
   * Handles Save Button Click
   * @param {string} key 
   */
  function handleSaveClick(key) {
    const cached = domCache[key];
    if (!cached) return;

    const selectedVal = cached.selectDropdown.value;

    // Save requires a valid non-empty value
    if (!selectedVal || selectedVal.trim() === '') {
      return;
    }

    // Update internal state
    workflowStore[key].value = selectedVal;
    workflowStore[key].edited = true;
    cached.inputText.value = selectedVal;

    // Transition UI display back to text input
    cached.selectDropdown.style.display = 'none';
    cached.inputText.style.display = 'block';

    transitionRowState(key, ROW_STATES.SAVED);

    // Dynamic Cascading Behavior for Mathematics Topic -> SubTopic
    if (key === 'Topic' && currentSubjectMode === 'MATHEMATICS') {
      handleTopicChange();
    }

    notifyStateChange();
  }

  /**
   * Handles Verification Checkbox Click
   * Strengthened Rule: Row must have a non-empty value, must not be in EDITING state,
   * and if edited, must have been explicitly SAVED before verifying.
   * @param {string} key 
   */
  function handleCheckboxClick(key) {
    const rowState = workflowStore[key];
    if (!rowState) return;

    const hasValue = rowState.value && rowState.value.trim() !== '';

    // Reject verification if value is empty or row is currently being edited
    if (!hasValue || rowState.state === ROW_STATES.EDITING) {
      logDebug('VerificationBlocked', `${key} cannot verify: empty value or in EDITING state`);
      return;
    }

    // Toggle verified status
    rowState.verified = !rowState.verified;
    logDebug('VerificationToggle', `${key} verified set to ${rowState.verified}`);

    if (rowState.verified) {
      transitionRowState(key, ROW_STATES.VERIFIED);
    } else {
      transitionRowState(key, ROW_STATES.SAVED);
    }

    // Trigger sequencing check to unlock next row or relock downstream
    reevaluateWorkflowSequence();
    notifyStateChange();
  }

  // =========================================================================
  // DYNAMIC DROPDOWN & MATHEMATICS TAXONOMY LOGIC
  // =========================================================================

  /**
   * Populates a select element based on metadata schemas and subject rules.
   * @param {string} key 
   * @param {HTMLSelectElement} selectEl 
   */
  function refreshDropdown(key, selectEl) {
    selectEl.innerHTML = `<option value="">${UI_TEXT.DROPDOWN_DEFAULT}</option>`;
    let options = [];

    if (currentSubjectMode === 'MATHEMATICS' && (key === 'Topic' || key === 'SubTopic')) {
      if (key === 'Topic') {
        options = mathCatalogRef ? Object.keys(mathCatalogRef) : [];
      } else if (key === 'SubTopic') {
        const selectedTopic = workflowStore['Topic'] ? workflowStore['Topic'].value : '';
        if (selectedTopic && mathCatalogRef && mathCatalogRef[selectedTopic]) {
          options = mathCatalogRef[selectedTopic];
        }
      }
    } else if (currentSubjectMode === 'GACA' && (key === 'Topic' || key === 'SubTopic')) {
      options = [];
    } else {
      options = catalogDataRef[key] || [];
    }

    options.forEach(opt => {
      const optEl = document.createElement('option');
      optEl.value = opt;
      optEl.textContent = opt;
      selectEl.appendChild(optEl);
    });
  }

  /**
   * Handles dynamic cascading reset when Mathematics Topic is modified.
   * Clears SubTopic, removes verification and saved state, relocks downstream,
   * refreshes SubTopic options, and prevents verification until saved.
   */
  function handleTopicChange() {
    const subTopicState = workflowStore['SubTopic'];
    if (!subTopicState) return;

    logDebug('TopicChange', 'Mathematics Topic changed. Resetting SubTopic and downstream fields.');

    // Clear and invalidate SubTopic state completely
    subTopicState.value = '';
    subTopicState.verified = false;
    subTopicState.edited = false;

    const cached = domCache['SubTopic'];
    if (cached) {
      cached.inputText.value = '';
      cached.selectDropdown.style.display = 'none';
      cached.inputText.style.display = 'block';
      refreshDropdown('SubTopic', cached.selectDropdown);
    }

    // Force re-evaluation of sequence starting after Topic
    reevaluateWorkflowSequence();
  }

  // =========================================================================
  // DECOUPLED UI STATE RENDERERS
  // =========================================================================

  /**
   * Master dispatcher to update UI controls based on current row state.
   * @param {string} key 
   */
  function renderRowStateUI(key) {
    const cached = domCache[key];
    const rowState = workflowStore[key];
    if (!cached || !rowState) return;

    switch (rowState.state) {
      case ROW_STATES.LOCKED:
        renderLockedState(cached);
        break;
      case ROW_STATES.UNLOCKED:
        renderUnlockedState(cached, rowState);
        break;
      case ROW_STATES.EDITING:
        renderEditingState(cached);
        break;
      case ROW_STATES.SAVED:
        renderSavedState(cached, rowState);
        break;
      case ROW_STATES.VERIFIED:
        renderVerifiedState(cached);
        break;
      case ROW_STATES.COMPLETED:
        renderCompletedState(cached);
        break;
    }
  }

  /**
   * Renders LOCKED State
   * @param {Object} cached 
   */
  function renderLockedState(cached) {
    cached.btnAdd.disabled = true;
    cached.btnEdit.disabled = true;
    cached.btnSave.disabled = true;
    cached.checkbox.classList.remove(UI_CLASSES.CHECKED);
    cached.checkbox.style.pointerEvents = 'none';
    cached.checkbox.style.opacity = '0.3';
    cached.rowEl.style.opacity = '0.5';
  }

  /**
   * Renders UNLOCKED State
   * @param {Object} cached 
   * @param {Object} rowState 
   */
  function renderUnlockedState(cached, rowState) {
    const hasValue = rowState.value && rowState.value.trim() !== '';

    cached.rowEl.style.opacity = '1.0';
    cached.btnAdd.disabled = hasValue;
    cached.btnEdit.disabled = !hasValue;
    cached.btnSave.disabled = true;

    // Checkbox is clickable ONLY if row has a non-empty value
    if (hasValue) {
      cached.checkbox.style.pointerEvents = 'auto';
      cached.checkbox.style.opacity = '1.0';
    } else {
      cached.checkbox.style.pointerEvents = 'none';
      cached.checkbox.style.opacity = '0.3';
    }

    cached.checkbox.classList.toggle(UI_CLASSES.CHECKED, rowState.verified);
  }

  /**
   * Renders EDITING State
   * @param {Object} cached 
   */
  function renderEditingState(cached) {
    cached.rowEl.style.opacity = '1.0';
    cached.btnAdd.disabled = true;
    cached.btnEdit.disabled = true;
    cached.btnSave.disabled = !cached.selectDropdown.value;
    cached.checkbox.style.pointerEvents = 'none';
    cached.checkbox.style.opacity = '0.3';
  }

  /**
   * Renders SAVED State
   * @param {Object} cached 
   * @param {Object} rowState 
   */
  function renderSavedState(cached, rowState) {
    cached.rowEl.style.opacity = '1.0';
    cached.btnAdd.disabled = true;
    cached.btnEdit.disabled = false;
    cached.btnSave.disabled = true;
    cached.checkbox.style.pointerEvents = 'auto';
    cached.checkbox.style.opacity = '1.0';
    cached.checkbox.classList.toggle(UI_CLASSES.CHECKED, rowState.verified);
  }

  /**
   * Renders VERIFIED State
   * @param {Object} cached 
   */
  function renderVerifiedState(cached) {
    cached.rowEl.style.opacity = '1.0';
    cached.btnAdd.disabled = true;
    cached.btnEdit.disabled = false;
    cached.btnSave.disabled = true;
    cached.checkbox.style.pointerEvents = 'auto';
    cached.checkbox.style.opacity = '1.0';
    cached.checkbox.classList.add(UI_CLASSES.CHECKED);
  }

  /**
   * Renders COMPLETED State
   * @param {Object} cached 
   */
  function renderCompletedState(cached) {
    renderVerifiedState(cached);
  }

  // =========================================================================
  // HELPER FUNCTIONS & PROGRESS TRACKING
  // =========================================================================

  /**
   * Returns current workflow completion metrics.
   * @returns {{total: number, completed: number, verified: number, pending: number, activeRowKey: string}}
   */
  function getProgressMetrics() {
    const total = WORKFLOW_ORDER.length;
    let completed = 0;
    let verified = 0;
    let pending = 0;
    let activeRowKey = null;

    WORKFLOW_ORDER.forEach(key => {
      const stateObj = workflowStore[key];
      if (!stateObj) return;

      if (stateObj.verified) verified++;
      if (stateObj.state === ROW_STATES.COMPLETED) completed++;

      if (stateObj.state === ROW_STATES.UNLOCKED || 
          stateObj.state === ROW_STATES.EDITING || 
          stateObj.state === ROW_STATES.SAVED) {
        if (!activeRowKey) activeRowKey = key;
        pending++;
      } else if (stateObj.state === ROW_STATES.LOCKED) {
        pending++;
      }
    });

    return {
      total,
      completed,
      verified,
      pending,
      activeRowKey: activeRowKey || WORKFLOW_ORDER[total - 1]
    };
  }

  /**
   * Returns whether all fields in the sequence have been verified.
   * @returns {boolean}
   */
  function isWorkflowComplete() {
    return WORKFLOW_ORDER.every(key => workflowStore[key] && workflowStore[key].verified);
  }

  /**
   * Returns current active row key.
   * @returns {string|null}
   */
  function getCurrentRow() {
    const metrics = getProgressMetrics();
    return metrics.activeRowKey;
  }

  /**
   * Notifies controller of UI changes if callback is registered.
   */
  function notifyStateChange() {
    if (onStateChangeCallback) {
      onStateChangeCallback();
    }
  }

  /**
   * Escapes special characters for HTML injection.
   * @param {string} str 
   * @returns {string}
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // =========================================================================
  // EXPOSED MODULE INTERFACE
  // =========================================================================

  return {
    // Standard Public Contracts (100% Backward Compatible)
    init,
    renderRows,
    getMetadataState,
    updateFieldValue,

    // Workflow Engine API Extensions
    isWorkflowComplete,
    getProgressMetrics,
    getCurrentRow,
    WORKFLOW_ORDER,
    ROW_STATES
  };
})();
