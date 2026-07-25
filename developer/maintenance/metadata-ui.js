/**
 * metadata-ui.js
 * UI Manager module responsible for component rendering, field dependencies,
 * interactive state updates (Add/Edit/Save/Checkbox), and button states.
 */

window.MetadataUI = (function () {
  'use strict';

  let containerElement = null;
  let metadataState = {};
  let checkboxStates = {};
  let onStateChangeCallback = null;

  /**
   * Initialize UI Module
   * @param {HTMLElement} container 
   * @param {Function} onChangeCb 
   */
  function init(container, onChangeCb) {
    containerElement = container;
    onStateChangeCallback = onChangeCb;
  }

  /**
   * Renders UI metadata rows using atomic component template
   */
  function renderRows(parsedMetadata, catalogData, mathCatalog, subjectMode) {
    containerElement.innerHTML = '';
    metadataState = {};
    checkboxStates = {};

    MetadataHandler.METADATA_KEYS.forEach(key => {
      const initialVal = parsedMetadata[key] || '';
      metadataState[key] = initialVal;
      checkboxStates[key] = false;

      const rowEl = createMetadataRowComponent(key, initialVal, catalogData, mathCatalog, subjectMode);
      containerElement.appendChild(rowEl);
    });

    // Subject Auto-Assignment Rules
    if (subjectMode === 'GACA') {
      updateFieldValue('Subject', 'GENERAL AWARENESS & CURRENT AFFAIRS (GACA)');
    } else if (subjectMode === 'MATHEMATICS') {
      updateFieldValue('Subject', 'MATHEMATICS');
    }
  }

  /**
   * Component Factory: Creates a standard UI Metadata Row
   */
  function createMetadataRowComponent(key, value, catalogData, mathCatalog, subjectMode) {
    const row = document.createElement('div');
    row.className = 'metadata-row';
    row.dataset.key = key;

    const hasValue = value.trim() !== '';

    row.innerHTML = `
      <div class="row-label">${key}</div>
      <div class="field-container">
        <input type="text" class="input-text" id="input-${key}" value="${escapeHtml(value)}" disabled />
        <select class="select-dropdown" id="select-${key}" style="display: none;"></select>
      </div>
      <div class="button-group">
        <button class="btn-icon btn-add" title="Add Value" ${hasValue ? 'disabled' : ''}>➕</button>
        <button class="btn-icon btn-edit" title="Edit Value" ${!hasValue ? 'disabled' : ''}>✏️</button>
        <button class="btn-icon btn-save" title="Save Value" disabled>💾</button>
      </div>
      <div class="checkbox-container">
        <div class="custom-checkbox" title="Mark Verified"></div>
      </div>
    `;

    // Bind Row Controls
    const inputEl = row.querySelector(`#input-${key}`);
    const selectEl = row.querySelector(`#select-${key}`);
    const addBtn = row.querySelector('.btn-add');
    const editBtn = row.querySelector('.btn-edit');
    const saveBtn = row.querySelector('.btn-save');
    const checkEl = row.querySelector('.custom-checkbox');

    // Add Click
    addBtn.addEventListener('click', () => {
      populateDropdown(key, selectEl, catalogData, mathCatalog, subjectMode);
      inputEl.style.display = 'none';
      selectEl.style.display = 'block';
      saveBtn.disabled = false;
    });

    // Edit Click
    editBtn.addEventListener('click', () => {
      populateDropdown(key, selectEl, catalogData, mathCatalog, subjectMode);
      if (metadataState[key]) {
        selectEl.value = metadataState[key];
      }
      inputEl.style.display = 'none';
      selectEl.style.display = 'block';
      saveBtn.disabled = false;
    });

    // Save Click
    saveBtn.addEventListener('click', () => {
      const selectedVal = selectEl.value;
      updateFieldValue(key, selectedVal);

      selectEl.style.display = 'none';
      inputEl.style.display = 'block';

      saveBtn.disabled = true;
      addBtn.disabled = true;
      editBtn.disabled = false;

      // Handle Mathematics Topic -> SubTopic Cascading Dependency
      if (key === 'Topic' && subjectMode === 'MATHEMATICS') {
        resetSubTopicRow(catalogData, mathCatalog, subjectMode);
      }

      if (onStateChangeCallback) onStateChangeCallback();
    });

    // Independent Checkbox Click
    checkEl.addEventListener('click', () => {
      checkboxStates[key] = !checkboxStates[key];
      checkEl.classList.toggle('checked', checkboxStates[key]);
      if (onStateChangeCallback) onStateChangeCallback();
    });

    return row;
  }

  /**
   * Populates Dropdown elements dynamically based on catalog schemas
   */
  function populateDropdown(key, selectEl, catalogData, mathCatalog, subjectMode) {
    selectEl.innerHTML = '<option value="">-- Select Value --</option>';
    let options = [];

    if (subjectMode === 'MATHEMATICS' && (key === 'Topic' || key === 'SubTopic')) {
      if (key === 'Topic') {
        options = mathCatalog ? Object.keys(mathCatalog) : [];
      } else if (key === 'SubTopic') {
        const selectedTopic = metadataState['Topic'];
        if (selectedTopic && mathCatalog && mathCatalog[selectedTopic]) {
          options = mathCatalog[selectedTopic];
        }
      }
    } else {
      options = catalogData[key] || [];
    }

    options.forEach(opt => {
      const optEl = document.createElement('option');
      optEl.value = opt;
      optEl.textContent = opt;
      selectEl.appendChild(optEl);
    });
  }

  /**
   * Resets SubTopic dropdown options when Topic changes
   */
  function resetSubTopicRow(catalogData, mathCatalog, subjectMode) {
    updateFieldValue('SubTopic', '');
    const subtopicRow = containerElement.querySelector('.metadata-row[data-key="SubTopic"]');
    if (subtopicRow) {
      const addBtn = subtopicRow.querySelector('.btn-add');
      const editBtn = subtopicRow.querySelector('.btn-edit');
      addBtn.disabled = false;
      editBtn.disabled = true;
    }
  }

  /**
   * Programmatically updates field value in memory and DOM
   */
  function updateFieldValue(key, value) {
    metadataState[key] = value;
    const row = containerElement.querySelector(`.metadata-row[data-key="${key}"]`);
    if (row) {
      const inputEl = row.querySelector('.input-text');
      inputEl.value = value;
    }
  }

  function getMetadataState() {
    return metadataState;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  return {
    init,
    renderRows,
    getMetadataState,
    updateFieldValue
  };
})();
