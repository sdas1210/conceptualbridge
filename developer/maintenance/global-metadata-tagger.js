/**
 * global-metadata-tagger.js
 * Main Controller orchestrating application state, session initialization,
 * event routing, file loading, and export downloads.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // State
  let activeSubjectMode = 'GACA';
  let catalogData = {};
  let mathCatalog = {};
  let loadedFileContent = '';
  let parsedBodySection = '';
  let activeFileName = 'questions_tagged.txt';

  // DOM Elements
  const subjectCards = document.querySelectorAll('.subject-card');
  const uploadZone = document.getElementById('uploadZone');
  const txtFileInput = document.getElementById('txtFileInput');
  const selectedFileNameDisplay = document.getElementById('selectedFileName');
  const fileSummary = document.getElementById('fileSummary');
  const questionCountDisplay = document.getElementById('questionCountDisplay');
  const metadataStatusDisplay = document.getElementById('metadataStatusDisplay');
  const editorCard = document.getElementById('editorCard');
  const metadataFormContainer = document.getElementById('metadataFormContainer');
  const downloadSection = document.getElementById('downloadSection');
  const downloadTxtBtn = document.getElementById('downloadTxtBtn');
  const downloadJsonBtn = document.getElementById('downloadJsonBtn');

  // Initialize Controller
  init();

  async function init() {
    await loadCatalogs();
    setupEventListeners();
    MetadataUI.init(metadataFormContainer, handleUIStateChange);
  }

  /**
   * Loads metadata.json and math.json automatically
   */
  async function loadCatalogs() {
    try {
      const [metaRes, mathRes] = await Promise.all([
        fetch('metadata.json'),
        fetch('math.json')
      ]);

      if (metaRes.ok) catalogData = await metaRes.json();
      if (mathRes.ok) mathCatalog = await mathRes.json();
    } catch (err) {
      console.warn('Metadata Tagger: Catalog fetch warning. Ensure metadata.json and math.json exist.', err);
    }
  }

  /**
   * Registers global event listeners
   */
  function setupEventListeners() {
    // Subject Workspace Switching
    subjectCards.forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('disabled')) return;

        subjectCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        activeSubjectMode = card.dataset.subject;
        
        // Re-process file if already loaded
        if (loadedFileContent) {
          processLoadedFile();
        }
      });
    });

    // Drag and Drop / File Input
    uploadZone.addEventListener('click', () => txtFileInput.click());
    
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--accent-blue)';
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.style.borderColor = 'var(--glass-border)';
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--glass-border)';
      if (e.dataTransfer.files.length > 0) {
        txtFileInput.files = e.dataTransfer.files;
        handleFileSelect();
      }
    });

    txtFileInput.addEventListener('change', handleFileSelect);

    // Downloads
    downloadTxtBtn.addEventListener('click', exportTxtFile);
    downloadJsonBtn.addEventListener('click', exportCatalogJson);
  }

  /**
   * Handles File Select Event
   */
  function handleFileSelect() {
    const file = txtFileInput.files[0];
    if (!file) return;

    activeFileName = file.name;
    selectedFileNameDisplay.textContent = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      loadedFileContent = e.target.result;
      processLoadedFile();
    };
    reader.readAsText(file);
  }

  /**
   * Executes Metadata Parsing Pipeline
   */
  function processLoadedFile() {
    const analysis = MetadataHandler.analyzeFile(loadedFileContent, activeSubjectMode);
    
    parsedBodySection = analysis.bodySection;

    // Update File Summary
    questionCountDisplay.textContent = analysis.questionCount;
    metadataStatusDisplay.textContent = analysis.hasMetadata ? 'Detected & Populated' : 'None (Blank Editor)';

    fileSummary.style.display = 'flex';
    editorCard.style.display = 'block';
    downloadSection.style.display = 'block';

    // Render Editor UI Rows
    MetadataUI.renderRows(analysis.existingMetadata, catalogData, mathCatalog, activeSubjectMode);
    
    // Enable Download TXT
    downloadTxtBtn.disabled = false;
  }

  /**
   * Tracks UI modifications and syncs dynamic updates to metadata catalog
   */
  function handleUIStateChange() {
    const currentState = MetadataUI.getMetadataState();

    // Check if any newly added values exist to register into catalogData
    Object.keys(currentState).forEach(key => {
      const val = currentState[key];
      if (val && catalogData[key] && !catalogData[key].includes(val)) {
        if (key !== 'Topic' && key !== 'SubTopic') {
          catalogData[key].push(val);
        }
      }
    });
  }

  /**
   * Export Updated TXT Output
   */
  function exportTxtFile() {
    const finalMetadataState = MetadataUI.getMetadataState();
    const updatedTxtContent = MetadataHandler.buildUpdatedTxt(finalMetadataState, parsedBodySection);
    
    MetadataHandler.triggerDownload(updatedTxtContent, activeFileName, 'text/plain');
  }

  /**
   * Export Updated metadata.json Catalogue
   */
  function exportCatalogJson() {
    const jsonString = JSON.stringify(catalogData, null, 2);
    MetadataHandler.triggerDownload(jsonString, 'metadata.json', 'application/json');
  }
});
