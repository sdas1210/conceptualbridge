// =========================================
// CHARACTER INTRODUCER
// Conceptual Bridge Maintenance Suite
// =========================================

// =========================================
// STATE MANAGEMENT
// =========================================

let sessionFiles = []; // Array of { id, fileName, originalText, workingText, modified, operationCompleted }
let activeFileId = null;

// Active operation configuration
let selectedOp = null; // 'edit-line' | 'string-substitute' | 'create-line' | 'delete-line'

// Anchors & Navigation State
let currentLineIndex = 0; // 0-based
let anchor1Line = null;   // 1-based line number
let anchor2Line = null;   // 1-based line number
let calculatedTargets = []; // 0-based line indices

// Edit-in-line specific state
let editLineMode = 'start'; // 'start' | 'end' | 'middle'

// Create-line specific state
let createLinePos = 'before'; // 'before' | 'after'

// String-substitute specific interactive state
let substituteMatches = []; // Array of { lineIndex, lineContent, occurrenceInLine, charStart }
let currentMatchIndex = 0;
let lastProcessedScanCursor = { lineIndex: 0, charOffset: 0 };

// =========================================
// DOM ELEMENTS
// =========================================

const txtFileInput = document.getElementById("txtFileInput");
const sessionFilesContainer = document.getElementById("sessionFilesContainer");
const sessionFileSelect = document.getElementById("sessionFileSelect");
const fileStatusBox = document.getElementById("fileStatusBox");

const sectionSelectOperation = document.getElementById("sectionSelectOperation");
const sectionWorkspace = document.getElementById("sectionWorkspace");
const sectionFileInfo = document.getElementById("sectionFileInfo");
const workspacePlaceholder = document.getElementById("workspacePlaceholder");
const activeOpBadge = document.getElementById("activeOpBadge");

// Operation Cards
const opCards = document.querySelectorAll(".operation-card");

// Panels
const panelEditLine = document.getElementById("panelEditLine");
const panelStringSubstitute = document.getElementById("panelStringSubstitute");
const panelCreateLine = document.getElementById("panelCreateLine");
const panelDeleteLine = document.getElementById("panelDeleteLine");

// Edit in line controls
const btnEditStart = document.getElementById("btnEditStart");
const btnEditEnd = document.getElementById("btnEditEnd");
const btnEditMiddle = document.getElementById("btnEditMiddle");
const subPanelStartEnd = document.getElementById("subPanelStartEnd");
const editStartEndPayload = document.getElementById("editStartEndPayload");
const btnProceedStartEnd = document.getElementById("btnProceedStartEnd");

const subPanelMiddle = document.getElementById("subPanelMiddle");
const middleTargetString = document.getElementById("middleTargetString");
const middleAddOptions = document.getElementById("middleAddOptions");
const middleAddPayload = document.getElementById("middleAddPayload");
const middleInsertPositionRow = document.getElementById("middleInsertPositionRow");
const middleDeleteOptions = document.getElementById("middleDeleteOptions");
const middleDeleteEncounterSelectBox = document.getElementById("middleDeleteEncounterSelectBox");
const middleTargetEncounterIndex = document.getElementById("middleTargetEncounterIndex");
const btnProceedMiddle = document.getElementById("btnProceedMiddle");

// String Substitute controls
const substituteFindString = document.getElementById("substituteFindString");
const substituteReplaceString = document.getElementById("substituteReplaceString");
const btnProceedSubstitute = document.getElementById("btnProceedSubstitute");
const substituteSingleMatchBox = document.getElementById("substituteSingleMatchBox");
const matchCounterText = document.getElementById("matchCounterText");
const matchLineNumber = document.getElementById("matchLineNumber");
const matchLineContent = document.getElementById("matchLineContent");
const btnReplaceSingleMatch = document.getElementById("btnReplaceSingleMatch");
const btnNextSingleMatch = document.getElementById("btnNextSingleMatch");

// Create line controls
const btnCreateBefore = document.getElementById("btnCreateBefore");
const btnCreateAfter = document.getElementById("btnCreateAfter");
const subPanelCreatePayload = document.getElementById("subPanelCreatePayload");
const createLinePayload = document.getElementById("createLinePayload");
const btnProceedCreate = document.getElementById("btnProceedCreate");

// Delete line controls
const btnProceedDelete = document.getElementById("btnProceedDelete");

// Line Navigator & Anchors
const lineNavigatorSection = document.getElementById("lineNavigatorSection");
const lineNavigatorTitle = document.getElementById("lineNavigatorTitle");
const lineViewText = document.getElementById("lineViewText");
const anchorStatus = document.getElementById("anchorStatus");
const singleLineSelectRow = document.getElementById("singleLineSelectRow");
const btnSelectCurrentLine = document.getElementById("btnSelectCurrentLine");
const anchorSummaryBox = document.getElementById("anchorSummaryBox");
const sumAnchor1 = document.getElementById("sumAnchor1");
const sumAnchor2 = document.getElementById("sumAnchor2");
const sumGap = document.getElementById("sumGap");
const sumTotalTargets = document.getElementById("sumTotalTargets");

const navStartBtn = document.getElementById("navStartBtn");
const navPrev10Btn = document.getElementById("navPrev10Btn");
const navPrevBtn = document.getElementById("navPrevBtn");
const btnSetAnchor1 = document.getElementById("btnSetAnchor1");
const btnSetAnchor2 = document.getElementById("btnSetAnchor2");
const navNextBtn = document.getElementById("navNextBtn");
const navNext10Btn = document.getElementById("navNext10Btn");
const navEndBtn = document.getElementById("navEndBtn");

// Info & Console Elements
const infoFileName = document.getElementById("infoFileName");
const infoTotalLines = document.getElementById("infoTotalLines");
const infoTargetCount = document.getElementById("infoTargetCount");
const infoStatus = document.getElementById("infoStatus");
const consoleBox = document.getElementById("consoleBox");

// Actions
const btnNewSession = document.getElementById("btnNewSession");
const btnRunOperation = document.getElementById("btnRunOperation");
const btnDownload = document.getElementById("btnDownload");

// =========================================
// INITIALIZATION & LISTENERS
// =========================================

txtFileInput.addEventListener("change", handleFileUpload);
sessionFileSelect.addEventListener("change", handleFileDropdownChange);

opCards.forEach(card => {
    card.addEventListener("click", function() {
        selectOperation(this.dataset.op);
    });
});

// Edit line sub-modes
btnEditStart.addEventListener("click", () => setEditLineMode('start'));
btnEditEnd.addEventListener("click", () => setEditLineMode('end'));
btnEditMiddle.addEventListener("click", () => setEditLineMode('middle'));
btnProceedStartEnd.addEventListener("click", () => showAnchorSelectorForMode("EDIT_START_END"));

// Middle edit event bindings
document.querySelectorAll('input[name="middleAction"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
        if (e.target.value === 'add') {
            middleAddOptions.classList.remove("hidden");
            middleDeleteOptions.classList.add("hidden");
        } else {
            middleAddOptions.classList.add("hidden");
            middleDeleteOptions.classList.remove("hidden");
        }
        updateMiddleEncounterUI();
    });
});

document.querySelectorAll('input[name="middleEncounter"]').forEach(radio => {
    radio.addEventListener("change", updateMiddleEncounterUI);
});

document.querySelectorAll('input[name="middleAddOp"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
        if (e.target.value === 'insert') {
            middleInsertPositionRow.classList.remove("hidden");
        } else {
            middleInsertPositionRow.classList.add("hidden");
        }
    });
});

middleTargetString.addEventListener("input", () => {
    // Reset specific encounter selection state if user types a new target string
    middleTargetEncounterIndex.value = "1";
});

btnProceedMiddle.addEventListener("click", handleProceedMiddle);

// String Substitute event bindings
substituteFindString.addEventListener("input", () => {
    // Reset single occurrence search cursor when query changes
    substituteMatches = [];
    currentMatchIndex = 0;
    lastProcessedScanCursor = { lineIndex: 0, charOffset: 0 };
    substituteSingleMatchBox.classList.add("hidden");
});

btnProceedSubstitute.addEventListener("click", handleProceedSubstitute);
btnReplaceSingleMatch.addEventListener("click", handleReplaceSingleMatch);
btnNextSingleMatch.addEventListener("click", handleNextSingleMatch);

// Create line sub-modes
btnCreateBefore.addEventListener("click", () => setCreateLineMode('before'));
btnCreateAfter.addEventListener("click", () => setCreateLineMode('after'));
btnProceedCreate.addEventListener("click", () => showAnchorSelectorForMode("CREATE_LINE"));

// Delete line
btnProceedDelete.addEventListener("click", () => showAnchorSelectorForMode("DELETE_LINE"));

// Line Navigator & Anchors
navStartBtn.addEventListener("click", () => jumpToLine(0));
navPrev10Btn.addEventListener("click", () => jumpToLine(currentLineIndex - 10));
navPrevBtn.addEventListener("click", () => jumpToLine(currentLineIndex - 1));
navNextBtn.addEventListener("click", () => jumpToLine(currentLineIndex + 1));
navNext10Btn.addEventListener("click", () => jumpToLine(currentLineIndex + 10));
navEndBtn.addEventListener("click", () => jumpToLine(getActiveLines().length - 1));

btnSetAnchor1.addEventListener("click", setFirstAnchor);
btnSetAnchor2.addEventListener("click", setSecondAnchor);
btnSelectCurrentLine.addEventListener("click", selectCurrentLineAsTarget);

// Global Actions
btnNewSession.addEventListener("click", handleNewSession);
btnRunOperation.addEventListener("click", executeOperation);
btnDownload.addEventListener("click", downloadModifiedFile);

// =========================================
// FILE MANAGEMENT & SESSION ISOLATION
// =========================================

async function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    for (const file of files) {
        try {
            const rawText = await file.text();
            const normalized = rawText.replace(/\r\n/g, "\n");
            
            const fileEntry = {
                id: "file_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
                fileName: file.name,
                originalText: normalized,
                workingText: normalized,
                modified: false,
                operationCompleted: false
            };

            sessionFiles.push(fileEntry);
            log(`File added to session: ${file.name}`);
        } catch (err) {
            console.error(err);
            log(`[-] Error reading ${file.name}`);
        }
    }

    txtFileInput.value = "";
    refreshSessionFilesDropdown();

    if (activeFileId === null && sessionFiles.length > 0) {
        switchToActiveFile(sessionFiles[0].id);
    }
}

function refreshSessionFilesDropdown() {
    if (sessionFiles.length === 0) {
        sessionFilesContainer.classList.add("hidden");
        return;
    }

    sessionFilesContainer.classList.remove("hidden");
    sessionFileSelect.innerHTML = "";

    sessionFiles.forEach((file, index) => {
        const opt = document.createElement("option");
        opt.value = file.id;
        opt.textContent = `${index + 1}. ${file.fileName}${file.modified ? " * (Modified)" : ""}`;
        sessionFileSelect.appendChild(opt);
    });

    if (activeFileId) {
        sessionFileSelect.value = activeFileId;
    }
}

function handleFileDropdownChange(e) {
    const targetFileId = e.target.value;
    if (targetFileId === activeFileId) return;

    const currentFile = getActiveFile();
    if (currentFile && currentFile.modified && !currentFile.operationCompleted) {
        const confirmSwitch = window.confirm("This file has unsaved modifications. Do you want to switch files?");
        if (!confirmSwitch) {
            sessionFileSelect.value = activeFileId;
            return;
        }
    }

    switchToActiveFile(targetFileId);
}

function switchToActiveFile(fileId) {
    activeFileId = fileId;
    sessionFileSelect.value = activeFileId;
    const file = getActiveFile();
    if (!file) return;

    // Reset workspace UI states and single match cache on file switch
    substituteMatches = [];
    currentMatchIndex = 0;
    lastProcessedScanCursor = { lineIndex: 0, charOffset: 0 };
    resetWorkspaceState();

    // Enable section 2 & 4
    sectionSelectOperation.classList.remove("disabled-section");
    sectionFileInfo.classList.remove("disabled-section");

    // Update File info card
    const lines = getActiveLines();
    infoFileName.textContent = file.fileName;
    infoTotalLines.textContent = lines.length;
    infoTargetCount.textContent = "0";
    infoStatus.textContent = file.modified ? "Modified" : "Ready";

    fileStatusBox.textContent = `Active File: ${file.fileName} | Total Lines: ${lines.length}`;
    log(`Switched active file: ${file.fileName}`);

    btnDownload.disabled = !file.modified;
}

function getActiveFile() {
    return sessionFiles.find(f => f.id === activeFileId) || null;
}

function getActiveLines() {
    const file = getActiveFile();
    return file ? file.workingText.split("\n") : [];
}

// =========================================
// SELECT OPERATION DISPATCHER
// =========================================

function selectOperation(op) {
    const file = getActiveFile();
    if (!file) return;

    selectedOp = op;

    opCards.forEach(c => c.classList.toggle("active", c.dataset.op === op));
    sectionWorkspace.classList.remove("disabled-section");
    workspacePlaceholder.classList.add("hidden");
    activeOpBadge.classList.remove("hidden");

    // Hide all sub-panels
    panelEditLine.classList.add("hidden");
    panelStringSubstitute.classList.add("hidden");
    panelCreateLine.classList.add("hidden");
    panelDeleteLine.classList.add("hidden");
    lineNavigatorSection.classList.add("hidden");

    btnRunOperation.disabled = true;
    resetAnchorData();

    if (op === 'edit-line') {
        activeOpBadge.textContent = "OPERATION: EDIT IN A LINE";
        panelEditLine.classList.remove("hidden");
        setEditLineMode('start');
    } else if (op === 'string-substitute') {
        activeOpBadge.textContent = "OPERATION: STRING SUBSTITUTE";
        panelStringSubstitute.classList.remove("hidden");
        substituteSingleMatchBox.classList.add("hidden");
    } else if (op === 'create-line') {
        activeOpBadge.textContent = "OPERATION: CREATE NEW LINE";
        panelCreateLine.classList.remove("hidden");
        setCreateLineMode('before');
    } else if (op === 'delete-line') {
        activeOpBadge.textContent = "OPERATION: DELETE LINE";
        panelDeleteLine.classList.remove("hidden");
    }
}

function resetWorkspaceState() {
    selectedOp = null;
    opCards.forEach(c => c.classList.remove("active"));
    workspacePlaceholder.classList.remove("hidden");
    activeOpBadge.classList.add("hidden");

    panelEditLine.classList.add("hidden");
    panelStringSubstitute.classList.add("hidden");
    panelCreateLine.classList.add("hidden");
    panelDeleteLine.classList.add("hidden");
    lineNavigatorSection.classList.add("hidden");

    btnRunOperation.disabled = true;
    resetAnchorData();
}

// =========================================
// SUB-OPERATION CONTROLLERS
// =========================================

function setEditLineMode(mode) {
    editLineMode = mode;
    btnEditStart.classList.toggle("active", mode === 'start');
    btnEditEnd.classList.toggle("active", mode === 'end');
    btnEditMiddle.classList.toggle("active", mode === 'middle');

    subPanelStartEnd.classList.add("hidden");
    subPanelMiddle.classList.add("hidden");
    lineNavigatorSection.classList.add("hidden");
    btnRunOperation.disabled = true;

    if (mode === 'start' || mode === 'end') {
        subPanelStartEnd.classList.remove("hidden");
    } else if (mode === 'middle') {
        subPanelMiddle.classList.remove("hidden");
        updateMiddleEncounterUI();
    }
}

function updateMiddleEncounterUI() {
    const action = document.querySelector('input[name="middleAction"]:checked')?.value || 'add';
    const encounter = document.querySelector('input[name="middleEncounter"]:checked')?.value || 'first';

    // Show encounter-picker input strictly for Delete + Multiple Encounters
    if (action === 'delete' && encounter === 'multiple') {
        middleDeleteEncounterSelectBox.classList.remove("hidden");
    } else {
        middleDeleteEncounterSelectBox.classList.add("hidden");
    }
}

function setCreateLineMode(pos) {
    createLinePos = pos;
    btnCreateBefore.classList.toggle("active", pos === 'before');
    btnCreateAfter.classList.toggle("active", pos === 'after');

    subPanelCreatePayload.classList.remove("hidden");
    lineNavigatorSection.classList.add("hidden");
    btnRunOperation.disabled = true;
}

function handleProceedMiddle() {
    const target = middleTargetString.value;
    if (!target) {
        alert("Target String / Character cannot be empty.");
        return;
    }

    const action = document.querySelector('input[name="middleAction"]:checked').value;
    const encounter = document.querySelector('input[name="middleEncounter"]:checked').value;

    if (action === 'delete' && encounter === 'multiple') {
        const encIdx = parseInt(middleTargetEncounterIndex.value, 10);
        if (isNaN(encIdx) || encIdx < 1) {
            alert("Encounter occurrence number must be a whole number >= 1.");
            return;
        }
    }

    const scope = document.querySelector('input[name="middleScope"]:checked').value;

    if (scope === 'single') {
        showLineNavigator("Select Single Target Line", true);
    } else if (scope === 'multiple') {
        showAnchorSelectorForMode("EDIT_MIDDLE_ANCHORS");
    } else if (scope === 'entire') {
        lineNavigatorSection.classList.add("hidden");
        const lines = getActiveLines();
        calculatedTargets = lines.map((_, i) => i);
        infoTargetCount.textContent = calculatedTargets.length;
        btnRunOperation.disabled = false;
        log(`Configured Middle/Somewhere scope: Entire File (${lines.length} lines)`);
    }
}

// =========================================
// STRING SUBSTITUTE: SINGLE OCCURRENCE ENGINE
// =========================================

function handleProceedSubstitute() {
    const findStr = substituteFindString.value;
    if (!findStr) {
        alert("Find / Target String cannot be empty.");
        return;
    }

    const scope = document.querySelector('input[name="substituteScope"]:checked').value;
    const lines = getActiveLines();

    if (scope === 'single') {
        lineNavigatorSection.classList.add("hidden");
        btnRunOperation.disabled = true;
        // Start fresh scan from the beginning of file
        lastProcessedScanCursor = { lineIndex: 0, charOffset: 0 };
        rebuildSingleMatchesList(findStr, 0);
    } else if (scope === 'multiple') {
        substituteSingleMatchBox.classList.add("hidden");
        showAnchorSelectorForMode("SUBSTITUTE_ANCHORS");
    } else if (scope === 'entire') {
        substituteSingleMatchBox.classList.add("hidden");
        lineNavigatorSection.classList.add("hidden");
        calculatedTargets = lines.map((_, i) => i);
        infoTargetCount.textContent = calculatedTargets.length;
        btnRunOperation.disabled = false;
        log(`Configured String Substitute scope: Entire File (${lines.length} lines)`);
    }
}

function rebuildSingleMatchesList(findStr, startFromLineIndex = 0) {
    const lines = getActiveLines();
    substituteMatches = [];

    if (!findStr || !lines || lines.length === 0) {
        renderNoMoreMatches();
        return;
    }

    for (let i = startFromLineIndex; i < lines.length; i++) {
        const line = lines[i];
        
        // Start searching from charOffset if on the cursor line, otherwise from the beginning (0)
        let searchFrom = (i === lastProcessedScanCursor.lineIndex) ? lastProcessedScanCursor.charOffset : 0;
        let foundIdx = line.indexOf(findStr, searchFrom);

        // Take only the first valid match on this line at/after the cursor
        if (foundIdx !== -1) {
            substituteMatches.push({
                lineIndex: i,
                lineContent: line,
                occurrenceInLine: 1,
                charStart: foundIdx,
                matchLength: findStr.length
            });
        }
    }

    if (substituteMatches.length === 0) {
        if (startFromLineIndex === 0 && lastProcessedScanCursor.lineIndex === 0) {
            alert(`Target string "${findStr}" was not found in the file.`);
            log(`[-] Target string "${findStr}" was not found in the file.`);
        } else {
            log(`[i] No more matches found for "${findStr}".`);
        }
        renderNoMoreMatches();
        return;
    }

    currentMatchIndex = 0;
    renderCurrentSingleMatch();
    substituteSingleMatchBox.classList.remove("hidden");
    log(`Single Occurrence Scan: Found ${substituteMatches.length} remaining match(es) for "${findStr}".`);
}

function renderCurrentSingleMatch() {
    if (substituteMatches.length === 0 || currentMatchIndex >= substituteMatches.length) {
        renderNoMoreMatches();
        return;
    }

    const match = substituteMatches[currentMatchIndex];
    matchCounterText.textContent = `Match ${currentMatchIndex + 1} of ${substituteMatches.length}`;
    matchLineNumber.textContent = `Line ${match.lineIndex + 1}`;
    matchLineContent.textContent = match.lineContent;

    btnReplaceSingleMatch.disabled = false;
    // NO wrap-around: disable Next Match on the last match
    btnNextSingleMatch.disabled = (currentMatchIndex >= substituteMatches.length - 1);
    btnNextSingleMatch.textContent = (currentMatchIndex >= substituteMatches.length - 1) ? "No More Matches" : "Next Match →";
}

function renderNoMoreMatches() {
    substituteSingleMatchBox.classList.remove("hidden");
    matchCounterText.textContent = "Scan Complete";
    matchLineNumber.textContent = "End of File";
    matchLineContent.textContent = "No more unprocessed matches.";
    btnReplaceSingleMatch.disabled = true;
    btnNextSingleMatch.disabled = true;
    btnNextSingleMatch.textContent = "Next Match →";
}

function handleNextSingleMatch() {
    if (currentMatchIndex < substituteMatches.length - 1) {
        currentMatchIndex++;
        renderCurrentSingleMatch();
    } else {
        btnNextSingleMatch.disabled = true;
        btnNextSingleMatch.textContent = "No More Matches";
        renderNoMoreMatches();
    }
}


function handleReplaceSingleMatch() {
    if (substituteMatches.length === 0 || currentMatchIndex >= substituteMatches.length) return;

    const match = substituteMatches[currentMatchIndex];
    const findStr = substituteFindString.value;
    const replaceStr = substituteReplaceString.value;
    const file = getActiveFile();
    if (!file) return;

    const lines = getActiveLines();
    const line = lines[match.lineIndex];

    // Single Occurrence mode: Find and replace strictly the FIRST occurrence on this physical line
    const firstIdx = line.indexOf(findStr);

    if (firstIdx !== -1) {
        // Replace only the first occurrence
        const modifiedLine = line.substring(0, firstIdx) + replaceStr + line.substring(firstIdx + findStr.length);
        lines[match.lineIndex] = modifiedLine;

        file.workingText = lines.join("\n");
        file.modified = true;
        file.operationCompleted = true;

        log(`[+] Replaced occurrence on Line ${match.lineIndex + 1}.`);

        // Advance scan cursor past this entire physical line to ensure 1 line = 1 match maximum
        lastProcessedScanCursor = {
            lineIndex: match.lineIndex + 1,
            charOffset: 0
        };

        refreshSessionFilesDropdown();
        infoStatus.textContent = "Modified";
        btnDownload.disabled = false;

        // Re-scan from the next physical line
        rebuildSingleMatchesList(findStr, match.lineIndex + 1);
    } else {
        alert("Target occurrence was not found on this line.");
    }
}

// =========================================
// LINE NAVIGATOR & ANCHOR REUSE ENGINE
// =========================================

function showAnchorSelectorForMode(modeTitle) {
    lineNavigatorTitle.textContent = "Line Inspector & Anchor Selector";
    singleLineSelectRow.classList.add("hidden");
    anchorSummaryBox.classList.remove("hidden");
    btnSetAnchor1.classList.remove("hidden");
    btnSetAnchor2.classList.remove("hidden");

    resetAnchorData();
    lineNavigatorSection.classList.remove("hidden");
    jumpToLine(0);
    log(`Opened Anchor Selector for: ${modeTitle}`);
}

function showLineNavigator(title, isSingleLineSelect) {
    lineNavigatorTitle.textContent = title;
    resetAnchorData();

    if (isSingleLineSelect) {
        singleLineSelectRow.classList.remove("hidden");
        anchorSummaryBox.classList.add("hidden");
        btnSetAnchor1.classList.add("hidden");
        btnSetAnchor2.classList.add("hidden");
        anchorStatus.textContent = "Inspect line and click Select Current Line";
    }

    lineNavigatorSection.classList.remove("hidden");
    jumpToLine(0);
}

function jumpToLine(index) {
    const lines = getActiveLines();
    if (lines.length === 0) return;

    if (index < 0) index = 0;
    if (index >= lines.length) index = lines.length - 1;

    currentLineIndex = index;
    const lineNumber = index + 1;
    lineViewText.value = `[Line ${lineNumber} / ${lines.length}]\n${lines[index]}`;

    updateAnchorHighlights();
}

function setFirstAnchor() {
    anchor1Line = currentLineIndex + 1;
    btnSetAnchor1.classList.add("anchor-selected");
    anchorStatus.textContent = `Anchor 1: Line ${anchor1Line} | Now select Anchor 2`;
    sumAnchor1.textContent = anchor1Line;
    calculateAnchorTargets();
}

function setSecondAnchor() {
    if (anchor1Line === null) {
        alert("Please set First Anchor (A1) first.");
        return;
    }

    const currentLine = currentLineIndex + 1;
    if (currentLine <= anchor1Line) {
        alert("Second Anchor (A2) must be on a line after First Anchor.");
        return;
    }

    anchor2Line = currentLine;
    btnSetAnchor2.classList.add("anchor-selected");
    sumAnchor2.textContent = anchor2Line;
    calculateAnchorTargets();
}

function calculateAnchorTargets() {
    if (anchor1Line === null || anchor2Line === null) {
        calculatedTargets = [];
        btnRunOperation.disabled = true;
        return;
    }

    const gap = anchor2Line - anchor1Line;
    sumGap.textContent = `+${gap}`;

    const lines = getActiveLines();
    calculatedTargets = [];

    let target = anchor1Line;
    while (target <= lines.length) {
        calculatedTargets.push(target - 1); // convert to 0-based
        target += gap;
    }

    sumTotalTargets.textContent = calculatedTargets.length;
    infoTargetCount.textContent = calculatedTargets.length;
    anchorStatus.textContent = `Anchors Set! ${calculatedTargets.length} repeating targets calculated.`;

    btnRunOperation.disabled = (calculatedTargets.length === 0);
    log(`Calculated ${calculatedTargets.length} target lines (Gap: ${gap}, A1: ${anchor1Line}, A2: ${anchor2Line})`);
}

function updateAnchorHighlights() {
    const currentLineNum = currentLineIndex + 1;
    btnSetAnchor1.classList.toggle("anchor-selected", anchor1Line === currentLineNum);
    btnSetAnchor2.classList.toggle("anchor-selected", anchor2Line === currentLineNum);
}

function selectCurrentLineAsTarget() {
    calculatedTargets = [currentLineIndex];
    infoTargetCount.textContent = "1";
    btnRunOperation.disabled = false;
    anchorStatus.textContent = `Selected Single Target: Line ${currentLineIndex + 1}`;
    log(`Selected single target: Line ${currentLineIndex + 1}`);
}

function resetAnchorData() {
    anchor1Line = null;
    anchor2Line = null;
    calculatedTargets = [];
    sumAnchor1.textContent = "--";
    sumAnchor2.textContent = "--";
    sumGap.textContent = "--";
    sumTotalTargets.textContent = "--";
    anchorStatus.textContent = "Select First Anchor";
    btnSetAnchor1.classList.remove("anchor-selected");
    btnSetAnchor2.classList.remove("anchor-selected");
}

// =========================================
// OPERATION EXECUTION ENGINE
// =========================================

function executeOperation() {
    const file = getActiveFile();
    if (!file) return;

    if (calculatedTargets.length === 0) {
        alert("No target lines selected.");
        return;
    }

    const lines = getActiveLines();
    let modificationsCount = 0;

    log(`\n--- Starting Operation: ${selectedOp.toUpperCase()} ---`);
    log(`Target File: ${file.fileName}`);

    // =========================================
    // 1. EDIT IN A LINE
    // =========================================
    if (selectedOp === 'edit-line') {
        if (editLineMode === 'start') {
            const payload = editStartEndPayload.value;
            calculatedTargets.forEach(idx => {
                if (idx < lines.length) {
                    lines[idx] = payload + lines[idx];
                    modificationsCount++;
                }
            });
            log(`[+] Prepend applied to ${modificationsCount} lines.`);
        } else if (editLineMode === 'end') {
            const payload = editStartEndPayload.value;
            calculatedTargets.forEach(idx => {
                if (idx < lines.length) {
                    lines[idx] = lines[idx] + payload;
                    modificationsCount++;
                }
            });
            log(`[+] Append applied to ${modificationsCount} lines.`);
        } else if (editLineMode === 'middle') {
            const targetStr = middleTargetString.value;
            const action = document.querySelector('input[name="middleAction"]:checked').value;
            const encounter = document.querySelector('input[name="middleEncounter"]:checked').value;

            let targetExistsInFile = false;
            lines.forEach(l => { if (l.includes(targetStr)) targetExistsInFile = true; });

            calculatedTargets.forEach(idx => {
                if (idx >= lines.length) return;
                let line = lines[idx];
                if (!line.includes(targetStr)) return;

                if (action === 'add') {
                    const addOp = document.querySelector('input[name="middleAddOp"]:checked').value;
                    const payload = middleAddPayload.value;

                    if (addOp === 'insert') {
                        const insertPos = document.querySelector('input[name="middleInsertPos"]:checked').value;
                        if (encounter === 'first') {
                            const pos = line.indexOf(targetStr);
                            if (pos !== -1) {
                                if (insertPos === 'before') {
                                    line = line.substring(0, pos) + payload + line.substring(pos);
                                } else {
                                    line = line.substring(0, pos + targetStr.length) + payload + line.substring(pos + targetStr.length);
                                }
                                modificationsCount++;
                            }
                        } else {
                            // Multiple Encounters: Insert at every occurrence
                            if (insertPos === 'before') {
                                line = line.split(targetStr).join(payload + targetStr);
                            } else {
                                line = line.split(targetStr).join(targetStr + payload);
                            }
                            modificationsCount++;
                        }
                    } else if (addOp === 'substitute') {
                        // Substitute replaces target
                        if (encounter === 'first') {
                            const pos = line.indexOf(targetStr);
                            if (pos !== -1) {
                                line = line.substring(0, pos) + payload + line.substring(pos + targetStr.length);
                                modificationsCount++;
                            }
                        } else {
                            // Multiple Encounters: Substitute replaces all occurrences
                            line = line.split(targetStr).join(payload);
                            modificationsCount++;
                        }
                    }
                } else if (action === 'delete') {
                    const deletePos = document.querySelector('input[name="middleDeletePos"]:checked').value;

                    if (encounter === 'first') {
                        // First encounter in line
                        const pos = line.indexOf(targetStr);
                        if (pos !== -1) {
                            if (deletePos === 'before') {
                                // Delete [BEGINNING ... TARGET]
                                line = line.substring(pos + targetStr.length);
                            } else {
                                // Delete [TARGET ... END]
                                line = line.substring(0, pos);
                            }
                            modificationsCount++;
                        }
                    } else {
                        // Multiple Encounters: user selects specific occurrence (1-based index)
                        const targetOccurrence = parseInt(middleTargetEncounterIndex.value, 10) || 1;
                        let occCount = 0;
                        let foundPos = -1;
                        let searchStart = 0;

                        while (occCount < targetOccurrence) {
                            foundPos = line.indexOf(targetStr, searchStart);
                            if (foundPos === -1) break;
                            occCount++;
                            searchStart = foundPos + targetStr.length;
                        }

                        if (foundPos !== -1) {
                            if (deletePos === 'before') {
                                // Delete from beginning of line through and including the selected target
                                line = line.substring(foundPos + targetStr.length);
                            } else {
                                // Delete the selected target and everything after it through the end of line
                                line = line.substring(0, foundPos);
                            }
                            modificationsCount++;
                        }
                    }
                }

                lines[idx] = line;
            });

            if (modificationsCount === 0) {
                if (targetExistsInFile) {
                    alert(`Target string "${targetStr}" exists in the file but was not found in the selected target lines.`);
                    log(`[-] Target string "${targetStr}" exists in the file but was not found in the selected target lines.`);
                } else {
                    alert(`Target string "${targetStr}" was not found.`);
                    log(`[-] Target string "${targetStr}" was not found.`);
                }
                return;
            }
        }
    }

    // =========================================
    // 2. STRING SUBSTITUTE (Multiple Lines / Entire File)
    // =========================================
    else if (selectedOp === 'string-substitute') {
        const findStr = substituteFindString.value;
        const replaceStr = substituteReplaceString.value;

        let targetExistsInFile = false;
        lines.forEach(l => { if (l.includes(findStr)) targetExistsInFile = true; });

        calculatedTargets.forEach(idx => {
            if (idx < lines.length) {
                const line = lines[idx];
                if (line.includes(findStr)) {
                    lines[idx] = line.split(findStr).join(replaceStr);
                    modificationsCount++;
                }
            }
        });

        if (modificationsCount === 0) {
            if (targetExistsInFile) {
                alert(`Target string "${findStr}" exists in the file but was not found in the selected target lines.`);
                log(`[-] Target string "${findStr}" exists in the file but was not found in the selected target lines.`);
            } else {
                alert(`Target string "${findStr}" was not found.`);
                log(`[-] Target string "${findStr}" was not found.`);
            }
            return;
        }

        log(`[+] Replaced occurrences across ${modificationsCount} lines.`);
    }

    // =========================================
    // 3. CREATE NEW LINE
    // =========================================
    else if (selectedOp === 'create-line') {
        const payload = createLinePayload.value;
        const targetSet = new Set(calculatedTargets);
        const newLines = [];

        for (let i = 0; i < lines.length; i++) {
            if (targetSet.has(i)) {
                if (createLinePos === 'before') {
                    newLines.push(payload);
                    newLines.push(lines[i]);
                } else {
                    newLines.push(lines[i]);
                    newLines.push(payload);
                }
                modificationsCount++;
            } else {
                newLines.push(lines[i]);
            }
        }

        file.workingText = newLines.join("\n");
        file.modified = true;
        file.operationCompleted = true;
        finishExecution(modificationsCount);
        return;
    }

    // =========================================
    // 4. DELETE LINE
    // =========================================
    else if (selectedOp === 'delete-line') {
        const targetSet = new Set(calculatedTargets);
        const newLines = lines.filter((_, index) => !targetSet.has(index));
        modificationsCount = lines.length - newLines.length;

        file.workingText = newLines.join("\n");
        file.modified = true;
        file.operationCompleted = true;
        finishExecution(modificationsCount);
        return;
    }

    // Save final lines back to workingText
    file.workingText = lines.join("\n");
    file.modified = true;
    file.operationCompleted = true;
    finishExecution(modificationsCount);
}

function finishExecution(modificationsCount) {
    const file = getActiveFile();
    if (!file) return;

    log(`[✓] Operation completed successfully. Total modifications: ${modificationsCount}`);
    infoStatus.textContent = "Modified";
    infoTotalLines.textContent = getActiveLines().length;

    refreshSessionFilesDropdown();
    btnDownload.disabled = false;
    jumpToLine(currentLineIndex);

    alert(`Operation Completed Successfully!\n${modificationsCount} modification(s) made.`);
}

// =========================================
// DOWNLOAD & RESET
// =========================================

function downloadModifiedFile() {
    const file = getActiveFile();
    if (!file || !file.modified) {
        alert("No modifications to download.");
        return;
    }

    const blob = new Blob([file.workingText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    log(`Downloaded modified file: ${file.fileName}`);
}

function handleNewSession() {
    const confirmReset = window.confirm("Start a new session? All uploaded files and working data will be cleared.");
    if (!confirmReset) return;

    sessionFiles = [];
    activeFileId = null;

    txtFileInput.value = "";
    sessionFilesContainer.classList.add("hidden");
    sessionFileSelect.innerHTML = "";
    fileStatusBox.textContent = "No file selected.";

    sectionSelectOperation.classList.add("disabled-section");
    sectionFileInfo.classList.add("disabled-section");
    resetWorkspaceState();

    infoFileName.textContent = "--";
    infoTotalLines.textContent = "--";
    infoTargetCount.textContent = "--";
    infoStatus.textContent = "Ready";

    btnRunOperation.disabled = true;
    btnDownload.disabled = true;

    consoleBox.textContent = "Waiting for files...";
    log("New session initialized.");
}

// =========================================
// LOGGER
// =========================================

function log(message) {
    if (consoleBox.textContent.trim() === "Waiting for files...") {
        consoleBox.textContent = "";
    }
    consoleBox.textContent += message + "\n";
    consoleBox.scrollTop = consoleBox.scrollHeight;
}
