/**
 * Conceptual Bridge - YouTube Anchor Builder
 * Permanent Maintenance Suite Tool
 * 
 * Handles state management, UI wizard mechanics, live preview synthesis,
 * file parsing, and strict metadata export validation.
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // STATE MODEL (Single Source of Truth)
    // =========================================================================
    const anchorData = {
        mode: "GACA",
        titleTemplate: "",
        setNumber: "",
        title: "",
        tagsTemplate: "",
        tags: "",
        english: "",
        bengali: "",
        pdfEnglish: "",
        pdfBengali: "",
        testSource: "",
        topic: "",
        subTopic: "",
        level: "",
        outputFilename: ""
    };

    let currentUnlockedStep = 1;
    let isDirty = false;

    // =========================================================================
    // DOM ELEMENTS CACHE
    // =========================================================================
    const elements = {
        // Steps
        steps: {},
        statusIcons: {},
        
        // Mode Cards
        modeCards: document.querySelectorAll('.mode-card'),

        // Inputs
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

        // Buttons
        btnDownload: document.getElementById('btnDownload'),
        btnReset: document.getElementById('btnReset'),
        btnLoadFile: document.getElementById('btnLoadFile'),
        fileInput: document.getElementById('fileInput'),
        btnCopyPreview: document.getElementById('btnCopyPreview'),
        btnDuplicate: document.getElementById('btnDuplicate'),

        // Preview Output
        previewArea: document.getElementById('previewArea'),
        charCounter: document.getElementById('charCounter'),
        unsavedBadge: document.getElementById('unsavedBadge'),
        toastContainer: document.getElementById('toastContainer')
    };

    // Cache step sections and status indicators
    for (let i = 1; i <= 13; i++) {
        elements.steps[i] = document.getElementById(`step${i}`);
        elements.statusIcons[i] = document.getElementById(`statusStep${i}`);
    }

    // =========================================================================
    // HELPER FUNCTIONS & REGEX PARSERS
    // =========================================================================

    /**
     * Extracts YouTube 11-character Video ID from full URLs or raw IDs.
     */
    function extractYouTubeID(input) {
        if (!input) return "";
        const clean = input.trim();
        if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
        
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = clean.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    /**
     * Formats PDF input to guarantee single `.pdf` extension.
     */
    function formatPdfFilename(input) {
        if (!input || !input.trim()) return "none";
        let clean = input.trim();
        if (!clean.toLowerCase().endsWith('.pdf')) {
            clean += '.pdf';
        }
        return clean;
    }

    /**
     * Displays transient toast alerts.
     */
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        elements.toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    /**
     * Smoothly scrolls container to designated step element.
     */
    function scrollToStep(stepNum) {
        if (elements.steps[stepNum]) {
            elements.steps[stepNum].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // =========================================================================
    // PREVIEW SYNTHESIS ENGINE (Rebuilds strictly from anchorData)
    // =========================================================================
    function rebuildPreview() {
        const lines = [];

        // Title Line
        if (anchorData.title) lines.push(`Title| ${anchorData.title}`);

        // Tags Line
        if (anchorData.tags) lines.push(`Tags| ${anchorData.tags}`);

        // YouTube Lines (Conditional by Mode)
        if (anchorData.mode === 'GACA') {
            if (anchorData.english !== "") lines.push(`English| ${anchorData.english}`);
            if (anchorData.bengali !== "") lines.push(`Bengali| ${anchorData.bengali}`);
        } else if (anchorData.mode === 'MATH') {
            if (anchorData.english !== "") lines.push(`Video| ${anchorData.english}`);
        }

        // PDF Lines
        if (anchorData.pdfEnglish) lines.push(`PDF_English| ${anchorData.pdfEnglish}`);
        if (anchorData.pdfBengali) lines.push(`PDF_Bengali| ${anchorData.pdfBengali}`);

        // Test Source
        if (anchorData.testSource) lines.push(`Test_Source| ${anchorData.testSource}`);

        // Topic Metadata
        if (anchorData.topic !== "") lines.push(`Topic| ${anchorData.topic}`);
        if (anchorData.subTopic !== "") lines.push(`Sub-Topic| ${anchorData.subTopic}`);
        if (anchorData.level !== "") lines.push(`Level| ${anchorData.level}`);

        const generatedText = lines.join('\n');
        elements.previewArea.textContent = generatedText || "// Configure wizard steps to build TXT file...";

        // Update stats
        const chars = generatedText.length;
        const lineCount = lines.length;
        elements.charCounter.textContent = `${chars} Chars | ${lineCount} Lines`;

        if (isDirty) {
            elements.unsavedBadge.classList.remove('hidden');
        } else {
            elements.unsavedBadge.classList.add('hidden');
        }

        return generatedText;
    }

    // =========================================================================
    // WIZARD STEP CONTROLLER
    // =========================================================================

    function lockStep(stepNum) {
        const stepEl = elements.steps[stepNum];
        if (!stepEl) return;
        stepEl.classList.remove('active', 'completed');
        stepEl.classList.add('locked');

        // Disable input controls within step
        stepEl.querySelectorAll('.form-control, .btn-save').forEach(input => input.disabled = true);
        stepEl.querySelector('.btn-edit')?.classList.add('hidden');
        stepEl.querySelector('.btn-save')?.classList.remove('hidden');
    }

    function unlockStepForEditing(stepNum) {
        const stepEl = elements.steps[stepNum];
        if (!stepEl) return;
        
        stepEl.classList.remove('locked', 'completed');
        stepEl.classList.add('active');

        stepEl.querySelectorAll('.form-control, .btn-save').forEach(input => input.disabled = false);
        stepEl.querySelector('.btn-edit')?.classList.add('hidden');
        stepEl.querySelector('.btn-save')?.classList.remove('hidden');

        scrollToStep(stepNum);
    }

    function completeStep(stepNum) {
        const stepEl = elements.steps[stepNum];
        if (!stepEl) return;

        stepEl.classList.remove('active', 'locked');
        stepEl.classList.add('completed');

        stepEl.querySelectorAll('.form-control, .btn-save').forEach(input => input.disabled = true);
        stepEl.querySelector('.btn-save')?.classList.add('hidden');
        stepEl.querySelector('.btn-edit')?.classList.remove('hidden');
    }

    function setNextStepActive(nextStepNum) {
        if (nextStepNum > 13) return;

        // Skip non-applicable steps based on Mode
        if (anchorData.mode === 'MATH' && (nextStepNum === 6 || nextStepNum === 8)) {
            // MATH mode skips step 6 (Bengali Video) and step 8 (PDF Bengali)
            setNextStepActive(nextStepNum + 1);
            return;
        }

        currentUnlockedStep = Math.max(currentUnlockedStep, nextStepNum);
        unlockStepForEditing(nextStepNum);
    }

    // =========================================================================
    // STEP-BY-STEP VALIDATION & SAVE LOGIC
    // =========================================================================

    function handleSaveStep(stepNum) {
        let isValid = true;
        isDirty = true;

        switch (stepNum) {
            case 1: // Mode Selection
                // Handled via mode card clicks
                completeStep(1);
                applyModeAdaptations();
                setNextStepActive(2);
                break;

            case 2: // Title Template
                const err2 = document.getElementById('errTitleTemplate');
                if (!elements.titleTemplateSelect.value) {
                    err2.textContent = "Please select a valid title template.";
                    isValid = false;
                } else {
                    err2.textContent = "";
                    anchorData.titleTemplate = elements.titleTemplateSelect.value;
                    updateTitleComputation();
                    completeStep(2);
                    setNextStepActive(3);
                }
                break;

            case 3: // Set Number
                const err3 = document.getElementById('errSetNumber');
                const valSet = elements.inputSetNumber.value.trim();
                if (!valSet || !/^\d+$/.test(valSet)) {
                    err3.textContent = "Set Number is required and must be numeric.";
                    isValid = false;
                } else {
                    err3.textContent = "";
                    anchorData.setNumber = valSet;
                    updateTitleComputation();
                    completeStep(3);
                    setNextStepActive(4);
                }
                break;

            case 4: // Tags Template
                const err4 = document.getElementById('errTagsTemplate');
                if (!elements.tagsTemplateSelect.value) {
                    err4.textContent = "Please select a tag group.";
                    isValid = false;
                } else {
                    err4.textContent = "";
                    anchorData.tagsTemplate = elements.tagsTemplateSelect.value;
                    updateTagsComputation();
                    completeStep(4);
                    setNextStepActive(5);
                }
                break;

            case 5: // English Video / Math Video
                const err5 = document.getElementById('errVideoEnglish');
                const valVidEng = elements.inputVideoEnglish.value.trim();
                if (valVidEng === "") {
                    err5.textContent = "";
                    anchorData.english = "";
                    elements.linkCheckEnglish.classList.add('hidden');
                    completeStep(5);
                    setNextStepActive(6);
                } else {
                    const extractedId = extractYouTubeID(valVidEng);
                    if (!extractedId) {
                        err5.textContent = "Invalid YouTube Video ID or URL.";
                        isValid = false;
                    } else {
                        err5.textContent = "";
                        anchorData.english = extractedId;
                        elements.inputVideoEnglish.value = extractedId;
                        elements.linkCheckEnglish.href = `https://www.youtube.com/watch?v=${extractedId}`;
                        elements.linkCheckEnglish.classList.remove('hidden');
                        completeStep(5);
                        setNextStepActive(6);
                    }
                }
                break;

            case 6: // Bengali Video (GACA only)
                const err6 = document.getElementById('errVideoBengali');
                const valVidBen = elements.inputVideoBengali.value.trim();
                if (valVidBen === "") {
                    err6.textContent = "";
                    anchorData.bengali = "";
                    elements.linkCheckBengali.classList.add('hidden');
                    completeStep(6);
                    setNextStepActive(7);
                } else {
                    const extractedBenId = extractYouTubeID(valVidBen);
                    if (!extractedBenId) {
                        err6.textContent = "Invalid YouTube Video ID or URL.";
                        isValid = false;
                    } else {
                        err6.textContent = "";
                        anchorData.bengali = extractedBenId;
                        elements.inputVideoBengali.value = extractedBenId;
                        elements.linkCheckBengali.href = `https://www.youtube.com/watch?v=${extractedBenId}`;
                        elements.linkCheckBengali.classList.remove('hidden');
                        completeStep(6);
                        setNextStepActive(7);
                    }
                }
                break;

            case 7: // PDF English
                anchorData.pdfEnglish = formatPdfFilename(elements.inputPdfEnglish.value);
                elements.inputPdfEnglish.value = anchorData.pdfEnglish === "none" ? "" : anchorData.pdfEnglish;
                completeStep(7);
                setNextStepActive(8);
                break;

            case 8: // PDF Bengali
                anchorData.pdfBengali = formatPdfFilename(elements.inputPdfBengali.value);
                elements.inputPdfBengali.value = anchorData.pdfBengali === "none" ? "" : anchorData.pdfBengali;
                completeStep(8);
                setNextStepActive(9);
                break;

            case 9: // Test Source
                const err9 = document.getElementById('errTestSource');
                const valTS = elements.inputTestSource.value.trim();
                if (!valTS) {
                    err9.textContent = "Test Source identifier is required.";
                    isValid = false;
                } else {
                    err9.textContent = "";
                    anchorData.testSource = updateTestSourceComputation(valTS);
                    completeStep(9);
                    setNextStepActive(10);
                }
                break;

            case 10: // Topic
                anchorData.topic = elements.inputTopic.value.trim();
                completeStep(10);
                setNextStepActive(11);
                break;

            case 11: // Sub-Topic
                anchorData.subTopic = elements.inputSubTopic.value.trim();
                completeStep(11);
                setNextStepActive(12);
                break;

            case 12: // Level
                anchorData.level = elements.inputLevel.value.trim();
                completeStep(12);
                setNextStepActive(13);
                break;

            case 13: // Output Filename & Enable Download
                const err13 = document.getElementById('errOutputFilename');
                const valOut = elements.inputOutputFilename.value.trim();
                if (!valOut) {
                    err13.textContent = "Output Filename identifier is required.";
                    isValid = false;
                } else {
                    err13.textContent = "";
                    anchorData.outputFilename = valOut;
                    completeStep(13);
                    elements.btnDownload.disabled = false;
                    showToast("Anchor build completed! Ready to download.", "success");
                }
                break;
        }

        if (isValid) {
            rebuildPreview();
        }
    }

    // =========================================================================
    // COMPUTATION & DOM GENERATORS
    // =========================================================================

    function updateTitleComputation() {
        if (anchorData.titleTemplate && anchorData.setNumber) {
            anchorData.title = `${anchorData.titleTemplate} (Set - ${anchorData.setNumber})`;
        } else {
            anchorData.title = "";
        }
        elements.computedTitle.textContent = anchorData.title || "--";
    }

    function updateTagsComputation() {
        if (anchorData.tagsTemplate === "RRB Group D 2024") {
            anchorData.tags = "RRB Group D, 10, GACA, 100-Series, CEN 08/2024";
        } else {
            anchorData.tags = anchorData.tagsTemplate;
        }
        elements.computedTags.textContent = anchorData.tags || "--";
    }

    function updateTestSourceComputation(rawInput) {
        const modePath = anchorData.mode.toLowerCase();
        const path = `questions/${modePath}/${rawInput}.txt`;
        elements.computedTestSource.textContent = path;
        return path;
    }

    function applyModeAdaptations() {
        if (anchorData.mode === 'MATH') {
            elements.titleStep5.textContent = "Primary Math Video";
            elements.steps[6].classList.add('hidden'); // Hide Bengali Video
            elements.steps[8].classList.add('hidden'); // Hide Bengali PDF
        } else {
            elements.titleStep5.textContent = "English YouTube Video";
            elements.steps[6].classList.remove('hidden');
            elements.steps[8].classList.remove('hidden');
        }
        
        // Re-evaluate test source path if already filled
        if (elements.inputTestSource.value.trim()) {
            anchorData.testSource = updateTestSourceComputation(elements.inputTestSource.value.trim());
        }
    }

    // =========================================================================
    // EVENT LISTENERS & INTERACTION HANDLERS
    // =========================================================================

    // Save & Edit Button Clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-save')) {
            const stepNum = parseInt(e.target.getAttribute('data-step'), 10);
            handleSaveStep(stepNum);
        } else if (e.target.classList.contains('btn-edit')) {
            const stepNum = parseInt(e.target.getAttribute('data-step'), 10);
            unlockStepForEditing(stepNum);
        }
    });

    // Mode Selection
    elements.modeCards.forEach(card => {
        card.addEventListener('click', () => {
            const mode = card.getAttribute('data-mode');
            
            if (card.classList.contains('disabled')) {
                showToast(`${mode} Mode - Coming Soon`, 'warning');
                /* TODO: Future implementation for GS and GI modes
                 * - GS Mode: Enable domain-specific tags and multi-lang PDF references
                 * - GI Mode: Enable visual question set references & logic paths
                 */
                return;
            }

            elements.modeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            anchorData.mode = mode;
        });
    });

    // Dynamic Title Update Listeners
    elements.inputSetNumber.addEventListener('input', () => {
        anchorData.setNumber = elements.inputSetNumber.value.trim();
        updateTitleComputation();
    });

    // Dynamic Test Source Listener
    elements.inputTestSource.addEventListener('input', () => {
        const val = elements.inputTestSource.value.trim();
        if (val) {
            updateTestSourceComputation(val);
        } else {
            elements.computedTestSource.textContent = "--";
        }
    });

    // Download Handler
    elements.btnDownload.addEventListener('click', () => {
        const textContent = rebuildPreview();
        const filename = `${anchorData.outputFilename || 'anchor'}.txt`;

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        isDirty = false;
        rebuildPreview();
        showToast(`Downloaded ${filename} successfully!`, 'success');
    });

    // Copy to Clipboard
    elements.btnCopyPreview.addEventListener('click', () => {
        const text = rebuildPreview();
        navigator.clipboard.writeText(text).then(() => {
            showToast('Preview copied to clipboard!', 'success');
        });
    });

    // Duplicate Anchor State
    elements.btnDuplicate.addEventListener('click', () => {
        anchorData.setNumber = "";
        anchorData.outputFilename = "";
        elements.inputSetNumber.value = "";
        elements.inputOutputFilename.value = "";
        
        updateTitleComputation();
        unlockStepForEditing(3);
        showToast('Duplicated! Enter new Set Number and Output Filename.', 'info');
    });

    // Reset Wizard
    elements.btnReset.addEventListener('click', () => {
        if (isDirty && !confirm("Are you sure you want to reset all wizard progress? Unsaved changes will be lost.")) {
            return;
        }

        // Reset Data Model
        Object.keys(anchorData).forEach(key => anchorData[key] = "");
        anchorData.mode = "GACA";

        // Reset Inputs
        document.querySelectorAll('.form-control').forEach(i => i.value = "");
        elements.linkCheckEnglish.classList.add('hidden');
        elements.linkCheckBengali.classList.add('hidden');
        elements.computedTitle.textContent = "--";
        elements.computedTags.textContent = "--";
        elements.computedTestSource.textContent = "--";

        // Reset Steps
        currentUnlockedStep = 1;
        isDirty = false;
        
        for (let i = 1; i <= 13; i++) {
            lockStep(i);
        }
        
        // Activate Mode card GACA
        elements.modeCards.forEach(c => {
            c.classList.remove('active');
            if (c.getAttribute('data-mode') === 'GACA') c.classList.add('active');
        });

        unlockStepForEditing(1);
        elements.btnDownload.disabled = true;
        rebuildPreview();
        showToast('Wizard reset to initial state.', 'info');
    });

    // Unsaved changes window prompt
    window.addEventListener('beforeunload', (e) => {
        if (isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // =========================================================================
    // LOAD & PARSE EXISTING ANCHOR TXT FILE
    // =========================================================================

    elements.btnLoadFile.addEventListener('click', () => elements.fileInput.click());

    elements.fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                parseAndLoadAnchorTXT(event.target.result, file.name);
                showToast(`Successfully loaded ${file.name}`, 'success');
            } catch (err) {
                showToast(`Failed to parse file: ${err.message}`, 'warning');
            }
        };
        reader.readAsText(file, 'UTF-8');
    });

    function parseAndLoadAnchorTXT(content, filename) {
        const lines = content.split(/\r?\n/);
        const parsed = {};

        lines.forEach(line => {
            const parts = line.split('|');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('|').trim();
                parsed[key] = value;
            }
        });

        // 1. Detect Mode
        if (parsed.Video) {
            anchorData.mode = "MATH";
            anchorData.english = parsed.Video;
        } else {
            anchorData.mode = "GACA";
            anchorData.english = parsed.English || "";
            anchorData.bengali = parsed.Bengali || "";
        }

        // 2. Parse Title & Set
        if (parsed.Title) {
            anchorData.title = parsed.Title;
            const setMatch = parsed.Title.match(/\(Set\s*-\s*(\d+)\)/i);
            if (setMatch) {
                anchorData.setNumber = setMatch[1];
                anchorData.titleTemplate = parsed.Title.replace(/\s*\(Set\s*-\s*\d+\)/i, '').trim();
            } else {
                anchorData.titleTemplate = parsed.Title;
            }
        }

        // 3. Parse Tags
        anchorData.tags = parsed.Tags || "";
        anchorData.tagsTemplate = parsed.Tags || "";

        // 4. Parse PDFs
        anchorData.pdfEnglish = parsed.PDF_English || "";
        anchorData.pdfBengali = parsed.PDF_Bengali || "";

        // 5. Parse Test Source
        if (parsed.Test_Source) {
            anchorData.testSource = parsed.Test_Source;
            const tsMatch = parsed.Test_Source.match(/questions\/[^/]+\/(.+)\.txt$/i);
            if (tsMatch) {
                elements.inputTestSource.value = tsMatch[1];
            } else {
                elements.inputTestSource.value = parsed.Test_Source;
            }
        }

        // 6. Metadata
        anchorData.topic = parsed.Topic || "";
        anchorData.subTopic = parsed["Sub-Topic"] || "";
        anchorData.level = parsed.Level || "";

        // Output filename from original file
        const cleanName = filename.replace(/\.txt$/i, '');
        anchorData.outputFilename = cleanName;

        // Populate Form Controls
        elements.titleTemplateSelect.value = anchorData.titleTemplate;
        elements.inputSetNumber.value = anchorData.setNumber;
        elements.tagsTemplateSelect.value = anchorData.tagsTemplate;
        elements.inputVideoEnglish.value = anchorData.english;
        elements.inputVideoBengali.value = anchorData.bengali;
        elements.inputPdfEnglish.value = anchorData.pdfEnglish === "none" ? "" : anchorData.pdfEnglish;
        elements.inputPdfBengali.value = anchorData.pdfBengali === "none" ? "" : anchorData.pdfBengali;
        elements.inputTopic.value = anchorData.topic;
        elements.inputSubTopic.value = anchorData.subTopic;
        elements.inputLevel.value = anchorData.level;
        elements.inputOutputFilename.value = cleanName;

        // Sync Mode UI
        elements.modeCards.forEach(c => {
            c.classList.remove('active');
            if (c.getAttribute('data-mode') === anchorData.mode) c.classList.add('active');
        });

        applyModeAdaptations();
        updateTitleComputation();
        updateTagsComputation();

        // Unlock all steps as completed
        for (let i = 1; i <= 13; i++) {
            completeStep(i);
        }
        
        // Unlock step 13 for immediate re-downloading
        unlockStepForEditing(13);
        elements.btnDownload.disabled = false;

        isDirty = false;
        rebuildPreview();
    }

    // Initialize UI
    rebuildPreview();
});
