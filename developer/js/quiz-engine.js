const urlParams = new URLSearchParams(window.location.search);

const sourceFile = urlParams.get('source'); 
const activeTopic = urlParams.get('topic') || 'Mathematics';
const questionLimit = sourceFile ? 10 : (parseInt(urlParams.get('limit')) || 10);

let examDataMatrix = [];
let sourceBlocksMatrix = [];
let questionDiagnosticsCache = [];
let activeDiagnosticFilter = 'ALL';

let paperDifficulty = 5;
let dynamicPassMark = 0;
let paperNotification = "";
let paperType = "";
let paperSubject = "";
let paperLevel = "";

let activeIndex = 0;
let currentLanguage = "EN";

let questionStates = [];
let selectedAnswers = [];
let timeRemainingSeconds = questionLimit * 60;
let timerEngine = null;
let isReviewModeActive = false; 

/**
 * Execute KaTeX math typesetting across a specified DOM subtree
 * @param {HTMLElement} element 
 */
function renderMathInSubtree(element) {
    if (!element || typeof renderMathInElement !== 'function') return;
    try {
        renderMathInElement(element, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false },
                { left: "\\[", right: "\\]", display: true }
            ],
            throwOnError: false
        });
    } catch (err) {
        console.warn("KaTeX render error:", err);
    }
}

/**
 * Robust Phase 2 Question Diagnostic Engine (Read-Only)
 * Evaluates a single question object against all objective structural requirements
 * @param {Object} item 
 * @param {number} index 
 * @param {Array<Object>} allQuestions 
 * @returns {{ status: 'PASS'|'WARNING'|'ERROR', issues: Array<{ severity: 'ERROR'|'WARNING', field: string, message: string }> }}
 */
function runQuestionDiagnostics(item, index, allQuestions = []) {
    if (!item || typeof item !== 'object') {
        return {
            status: 'ERROR',
            issues: [{ severity: 'ERROR', field: 'General', message: 'Question object is undefined or empty.' }]
        };
    }

    const issues = [];

    // 1. QuestionID Validation
    const qid = item.QuestionID || item.id || item.questionId || "";
    if (!qid || String(qid).trim() === "") {
        issues.push({ severity: 'ERROR', field: 'metaQuestionId', message: 'QuestionID is missing or blank.' });
    } else {
        const isDuplicate = allQuestions.some((other, oIdx) => {
            if (oIdx === index || !other) return false;
            const otherId = other.QuestionID || other.id || other.questionId || "";
            return String(otherId).trim() === String(qid).trim();
        });
        if (isDuplicate) {
            issues.push({ severity: 'ERROR', field: 'metaQuestionId', message: `Duplicate QuestionID "${qid}" detected in this file.` });
        }
    }

    // 2. Question Text (QEN / QBN)
    const engText = item.questionEnglish || item.text || "";
    const bngText = item.questionBengali || item.textBn || "";

    if (!engText || String(engText).trim() === "") {
        issues.push({ severity: 'ERROR', field: 'target-question-text', message: 'English question text (QEN|) is missing or empty.' });
    }
    if (!bngText || String(bngText).trim() === "") {
        issues.push({ severity: 'WARNING', field: 'target-question-text', message: 'Bengali question text (QBN|) is missing. English fallback is active.' });
    }

    // 3. Options A-D Validation
    const optA = item.optionEnglish?.a || item.a || "";
    const optB = item.optionEnglish?.b || item.b || "";
    const optC = item.optionEnglish?.c || item.c || "";
    const optD = item.optionEnglish?.d || item.d || "";

    const optArray = [
        { label: 'A', val: optA },
        { label: 'B', val: optB },
        { label: 'C', val: optC },
        { label: 'D', val: optD }
    ];

    optArray.forEach(opt => {
        if (!opt.val || String(opt.val).trim() === "") {
            issues.push({ severity: 'ERROR', field: 'target-options-container', message: `Option ${opt.label} is missing or empty.` });
        }
    });

    // Check for identical duplicate option values
    const filledOpts = optArray.filter(o => o.val && String(o.val).trim() !== "");
    for (let i = 0; i < filledOpts.length; i++) {
        for (let j = i + 1; j < filledOpts.length; j++) {
            if (String(filledOpts[i].val).trim().toLowerCase() === String(filledOpts[j].val).trim().toLowerCase()) {
                issues.push({ severity: 'WARNING', field: 'target-options-container', message: `Duplicate option text between (${filledOpts[i].label}) and (${filledOpts[j].label}).` });
            }
        }
    }

    // 4. Correct Answer Validation
    const rawCorrect = item.correct;
    const correctLetter = item.correctLetter || (rawCorrect !== null && rawCorrect !== undefined && !isNaN(rawCorrect) ? String.fromCharCode(65 + Number(rawCorrect)) : "");

    if (rawCorrect === null || rawCorrect === undefined || isNaN(rawCorrect) || rawCorrect < 0 || rawCorrect > 3) {
        if (!['A', 'B', 'C', 'D'].includes(String(correctLetter).toUpperCase())) {
            issues.push({ severity: 'ERROR', field: 'metaAnswer', message: `Correct answer "${correctLetter || rawCorrect || 'None'}" is invalid. Expected A, B, C, or D.` });
        }
    }

    // 5. Difficulty Validation
    const diff = item.difficulty;
    if (diff !== undefined && diff !== null && diff !== "") {
        const numDiff = parseFloat(diff);
        if (isNaN(numDiff) || numDiff < 1 || numDiff > 10) {
            issues.push({ severity: 'WARNING', field: 'metaDifficulty', message: `Difficulty value "${diff}" is outside recommended range (1-10).` });
        }
    }

    // 6. Image Reference Validation
    if (item.image && String(item.image).trim() !== "") {
        const imgStr = String(item.image).trim();
        if (imgStr.endsWith("/") || imgStr === "none") {
            issues.push({ severity: 'WARNING', field: 'metaImage', message: `Image path reference "${imgStr}" may be incomplete or empty.` });
        }
    }

    // Derive overall status
    let overallStatus = 'PASS';
    if (issues.some(i => i.severity === 'ERROR')) {
        overallStatus = 'ERROR';
    } else if (issues.some(i => i.severity === 'WARNING')) {
        overallStatus = 'WARNING';
    }

    return { status: overallStatus, issues };
}

/**
 * Calculates and caches diagnostic records for all questions in the loaded file
 */
function recalculateFileDiagnostics() {
    questionDiagnosticsCache = examDataMatrix.map((q, idx) => runQuestionDiagnostics(q, idx, examDataMatrix));

    let passCount = 0;
    let warnCount = 0;
    let errCount = 0;

    questionDiagnosticsCache.forEach(d => {
        if (d.status === 'PASS') passCount++;
        else if (d.status === 'WARNING') warnCount++;
        else if (d.status === 'ERROR') errCount++;
    });

    const summaryBar = document.getElementById('developer-summary-bar');
    if (summaryBar) {
        if (examDataMatrix.length === 0) {
            summaryBar.style.display = 'none';
        } else {
            summaryBar.style.display = 'flex';
            document.getElementById('sum-total').textContent = `Total: ${examDataMatrix.length}`;
            document.getElementById('sum-pass').textContent = `PASS: ${passCount}`;
            document.getElementById('sum-warning').textContent = `WARN: ${warnCount}`;
            document.getElementById('sum-error').textContent = `ERR: ${errCount}`;
        }
    }
}

/**
 * Applies active diagnostic filter (ALL, PASS, WARNING, ERROR) to palette and navigation
 * @param {'ALL'|'PASS'|'WARNING'|'ERROR'} filterType 
 */
function applyDiagnosticFilter(filterType) {
    activeDiagnosticFilter = filterType;

    ['all', 'pass', 'warning', 'error'].forEach(id => {
        const btn = document.getElementById(`flt-${id}`);
        if (btn) btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`flt-${filterType.toLowerCase()}`);
    if (activeBtn) activeBtn.classList.add('active');

    renderPaletteGrid();

    // If current question does not match filter, jump to first matching question
    if (filterType !== 'ALL' && questionDiagnosticsCache[activeIndex]?.status !== filterType) {
        const nextMatch = questionDiagnosticsCache.findIndex(d => d.status === filterType);
        if (nextMatch !== -1) {
            jumpToQuestion(nextMatch);
        }
    }
}

/**
 * Switches right panel inspector tabs (metadata, diagnostics, source, parsed, diff)
 * @param {string} tabName 
 */
function switchInspectorTab(tabName) {
    const tabNames = ['metadata', 'diagnostics', 'source', 'parsed', 'diff'];
    const tabBtns = document.querySelectorAll('.insp-tab-btn');

    tabBtns.forEach((btn, idx) => {
        if (tabNames[idx] === tabName) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    tabNames.forEach(name => {
        const pane = document.getElementById(`tab-pane-${name}`);
        if (pane) pane.style.display = (name === tabName) ? 'block' : 'none';
    });
}

/**
 * Focuses developer attention onto a specific inspector field
 * @param {string} elementId 
 */
function focusDiagnosticField(elementId) {
    switchInspectorTab('metadata');
    const targetRow = document.getElementById(`row-${elementId}`) || document.getElementById(elementId);
    if (targetRow) {
        document.querySelectorAll('.meta-row').forEach(r => r.classList.remove('focused-field'));
        targetRow.classList.add('focused-field');
        targetRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

async function initializeDeveloperMode() {
    console.log("Developer Quiz Engine");

    document.getElementById("step-instructions-1").style.display = "none";
    document.getElementById("step-footer-1").style.display = "none";
    document.getElementById("stage-two-wrapper-node").style.display = "none";
    document.getElementById("timer-header-wrapper").style.display = "none";
    document.getElementById("ribbon-bar-container").style.display = "none";
    document.getElementById("quiz-workspace").style.display = "flex";

    const topicSelect = document.getElementById("topicSelect");
    const fileSelect = document.getElementById("fileSelect");

    try {
        const response = await fetch("/api/developer/questions?action=topics");
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const payload = await response.json();
        topicSelect.innerHTML = "";

        const topics = Array.isArray(payload.data) ? payload.data : [];
        if (topics.length === 0) {
            const opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "-- No Topics --";
            topicSelect.appendChild(opt);
            fileSelect.innerHTML = "";
            return;
        }

        topics.forEach(topic => {
            const option = document.createElement("option");
            option.value = topic;
            option.textContent = topic.toUpperCase();
            topicSelect.appendChild(option);
        });

        await loadDeveloperFileList(topicSelect.value);
    } catch (err) {
        console.error("Failed to load developer topics:", err);
        topicSelect.innerHTML = "<option value=''>Error loading topics</option>";
        fileSelect.innerHTML = "";
    }
}

async function loadDeveloperFileList(topic) {
    const fileSelect = document.getElementById("fileSelect");
    fileSelect.innerHTML = "";

    if (!topic) return;

    try {
        const fileResponse = await fetch(
            `/api/developer/questions?action=files&topic=${encodeURIComponent(topic)}`
        );
        if (!fileResponse.ok) {
            throw new Error(`HTTP error: ${fileResponse.status}`);
        }

        const filePayload = await fileResponse.json();
        const files = Array.isArray(filePayload.data) ? filePayload.data : [];

        if (files.length === 0) {
            const opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "-- No Files --";
            fileSelect.appendChild(opt);
            return;
        }

        files.forEach(file => {
            const option = document.createElement("option");
            option.value = file;
            option.textContent = file;
            fileSelect.appendChild(option);
        });

        console.log("Files Loaded for topic:", topic);
    } catch (err) {
        console.error(`Failed to load files for topic "${topic}":`, err);
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Error loading files";
        fileSelect.appendChild(opt);
    }
}

async function onDeveloperTopicChanged() {
    const topic = document.getElementById("topicSelect").value;
    await loadDeveloperFileList(topic);
}

async function initializeQuizEngine() {
    if (window.location.pathname.includes("/developer/")) {
        await initializeDeveloperMode();
        return;
    }

    if (sourceFile) {
        await parseTutorialTextFileMatrix(sourceFile);
    } else {
        await executeStandardExamCornerFetch();
    }
}

async function executeStandardExamCornerFetch() { 
    try {
        const response = await fetch(`/api/fetch-questions?topic=${activeTopic}&limit=${questionLimit}`); 
        if (!response.ok) { showMissingFileScreen(); return; } 

        const payload = await response.json(); 
        paperDifficulty = payload.averageDifficulty || 5;
        dynamicPassMark = payload.passMark || 0;
        paperNotification = payload.notification || "";
        paperType = payload.type || "";
        paperSubject = payload.subject || "";
        paperLevel = payload.level || "";
        
        let targetQuestions = payload.data || (Array.isArray(payload) ? payload : []); 

        if (targetQuestions.length > 0) { 
            examDataMatrix = targetQuestions; 
            setupGlobalExamMetrics(activeTopic); 
        } else { showMissingFileScreen(); } 
    } catch (err) { showMissingFileScreen(); } 
}

async function parseTutorialTextFileMatrix(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) { showMissingFileScreen(); return; }

        const rawText = await response.text();
        const lines = rawText.split('\n').map(l => l.trim());

        let parsedList = [];
        let currentBlock = null;
        let activePropertyKey = null;

        lines.forEach(line => {
            if (!line) return;

            let cleanLine = line.replace(/\[source:\s*\d+\]/gi, '').trim();
            if (!cleanLine) return;

            const pipeIdx = cleanLine.indexOf('|');

            if (pipeIdx !== -1) {
                const key = cleanLine.substring(0, pipeIdx).trim().toUpperCase();
                const value = cleanLine.substring(pipeIdx + 1).trim();

                if (key === 'Q' || key === 'QEN') {
                    activePropertyKey = 'text';
                    currentBlock = { text: value, a: '', b: '', c: '', d: '', correctLetter: '', exam: 'GACA Tutorial Series', shift: '' };
                } else if (currentBlock) {
                    if (key === 'A' || key === 'B' || key === 'C' || key === 'D') {
                        activePropertyKey = key.toLowerCase();
                        currentBlock[activePropertyKey] = value;
                    } else if (key === 'SHIFT') {
                        activePropertyKey = null;
                        currentBlock.shift = value;
                    } else if (key === 'CORRECT') {
                        activePropertyKey = null;
                        currentBlock.correctLetter = value.toUpperCase();
                        
                        if (currentBlock.text && currentBlock.a && currentBlock.b && currentBlock.c && currentBlock.d) {
                            const correctText = currentBlock[currentBlock.correctLetter.toLowerCase()];
                            
                            let optionsArray = [
                                { originalKey: 'a', text: currentBlock.a },
                                { originalKey: 'b', text: currentBlock.b },
                                { originalKey: 'c', text: currentBlock.c },
                                { originalKey: 'd', text: currentBlock.d }
                            ];

                            for (let i = optionsArray.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
                            }

                            currentBlock.a = optionsArray[0].text;
                            currentBlock.b = optionsArray[1].text;
                            currentBlock.c = optionsArray[2].text;
                            currentBlock.d = optionsArray[3].text;

                            let newCorrectIndex = optionsArray.findIndex(opt => opt.text === correctText);
                            currentBlock.correct = newCorrectIndex !== -1 ? newCorrectIndex : 0;

                            parsedList.push(currentBlock);
                        }
                    }
                }
            } else {
                if (currentBlock && activePropertyKey) {
                    currentBlock[activePropertyKey] += (currentBlock[activePropertyKey] ? ' ' : '') + cleanLine;
                }
            }
        });

        if (parsedList.length > 0) {
            for (let i = parsedList.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [parsedList[i], parsedList[j]] = [parsedList[j], parsedList[i]];
            }
            
            examDataMatrix = parsedList.slice(0, questionLimit);

            document.getElementById('wizard-back-nav-btn').onclick = () => window.location.href = 'tutorials.html';
            document.getElementById('wizard-back-nav-btn').innerText = '← Go to Tutorials';
            document.getElementById('exit-dashboard-action-btn').onclick = () => window.location.href = 'tutorials.html';
            document.getElementById('exit-dashboard-action-btn').innerText = 'Return to Tutorial Corner';

            setupGlobalExamMetrics('GACA Short Assessment');
        } else { showMissingFileScreen(); }
    } catch (err) { console.error(err); showMissingFileScreen(); }
}

function setupGlobalExamMetrics(topicName) { 
    selectedAnswers = new Array(examDataMatrix.length).fill(null); 
    questionStates = new Array(examDataMatrix.length).fill(0); 
    if (examDataMatrix.length > 0) {
        questionStates[0] = 1;
    }

    let formattedSectionTitle = topicName; 
    if (topicName.toUpperCase() === 'GACA' || topicName === 'GACA Short Assessment') formattedSectionTitle = 'GENERAL AWARENESS & CURRENT AFFAIRS'; 
    else if (topicName.toUpperCase() === 'GS') formattedSectionTitle = 'GENERAL SCIENCE'; 
    else if (topicName.toUpperCase() === 'GI') formattedSectionTitle = 'GENERAL INTELLIGENCE'; 
    else if (topicName.toUpperCase() === 'MATH' || topicName.toUpperCase() === 'MATHEMATICS') formattedSectionTitle = 'MATHEMATICS'; 
    else formattedSectionTitle = topicName.toUpperCase();
    
    document.getElementById('active-section-label').innerText = formattedSectionTitle; 
    document.getElementById('wizard-exam-main-title').innerText = `${formattedSectionTitle} - LIVE EXAM MODULE`; 
    document.getElementById('wizard-duration-lbl').innerText = `Duration: ${questionLimit} Mins`; 
    document.getElementById('wizard-marks-lbl').innerText = `Maximum Marks: ${examDataMatrix.length}`; 
    document.getElementById('wizard-count-lbl').innerText = examDataMatrix.length; 
}

function openConcernReportModal() {
    document.getElementById('concern-text-field').value = '';
    document.getElementById('concern-modal-node').style.display = 'flex';
}

function closeConcernReportModal() {
    document.getElementById('concern-modal-node').style.display = 'none';
}

function submitConcernFormDetails() {
    const textContent = document.getElementById('concern-text-field').value.trim();
    if (!textContent) { alert("Please type your concern before submitting."); return; }

    const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount > 100) { alert(`Your explanation is too long (${wordCount} words). Please restrict your response to less than 100 words.`); return; }

    const reportPayload = {
        concern: textContent,
        activeSourceFile: sourceFile || 'Exam API Route',
        questionIndex: activeIndex + 1,
        rawQuestionContent: examDataMatrix[activeIndex]?.text || ''
    };

    fetch('/api/submit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportPayload)
    })
    .then(response => {
        if (response.ok) alert("Thank you! Your concern has been submitted safely to the server.");
        else alert("Report package processed internally, but sync node threw a routing mismatch response.");
        closeConcernReportModal();
    })
    .catch(err => {
        console.error("Network sync route missing exception:", err);
        alert("Connection pipeline timeout. Report captured locally on console stream matrices.");
        closeConcernReportModal();
    });
}

function checkInstructionScrollProgress() { 
    const container = document.getElementById('instruction-scroll-pane'); 
    const nextButton = document.getElementById('instruction-next-action-btn'); 
    const totalScrollHeight = container.scrollHeight; 
    const currentPosition = container.scrollTop + container.clientHeight; 
    if (totalScrollHeight - currentPosition <= 5) { nextButton.disabled = false; } 
}

function goToWizardStageTwo() { 
    document.getElementById('step-instructions-1').style.display = 'none'; 
    document.getElementById('step-footer-1').style.display = 'none'; 
    document.getElementById('stage-two-wrapper-node').style.display = 'flex'; 
}

function backToWizardStageOne() { 
    document.getElementById('stage-two-wrapper-node').style.display = 'none'; 
    document.getElementById('step-instructions-1').style.display = 'flex'; 
    document.getElementById('step-footer-1').style.display = 'flex'; 
}

document.getElementById('instruction-scroll-pane')?.addEventListener('scroll', checkInstructionScrollProgress); 

function toggleReadyToBeginButtonState() { 
    const isChecked = document.getElementById('declaration-checkbox').checked; 
    document.getElementById('ready-begin-action-btn').disabled = !isChecked; 
}

function launchExamMatrixWorkspace() { 
    currentLanguage = document.getElementById('wizard-lang-dropdown').value; 
    document.getElementById('view-lang-select').value = currentLanguage; 
    document.getElementById('stage-two-wrapper-node').style.display = 'none'; 
    document.getElementById('timer-header-wrapper').style.display = 'block'; 
    document.getElementById('ribbon-bar-container').style.display = 'flex'; 
    document.getElementById('quiz-workspace').style.display = 'flex'; 
    startClockCountdown(); 
    renderExamWindow(); 
}

function showMissingFileScreen() { 
    document.getElementById('step-instructions-1').style.display = 'none'; 
    document.getElementById('step-footer-1').style.display = 'none'; 
    document.getElementById('fallback-screen-holder').innerHTML = `
        <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; text-align:center; font-family:sans-serif; background:#1a365d; color:white; padding:20px;">
            <h1>⚠️ Content Available Soon</h1>
            <p>The matrix question bank is undergoing engineering optimization sync routines.</p>
            <button onclick="window.location.href='${sourceFile ? "tutorials.html" : "exams.html"}'" style="background:#2563eb; color:white; border:none; padding:12px 30px; font-weight:bold; border-radius:4px; cursor:pointer; margin-top:20px;">← Go Back</button>
        </div>
    `; 
}

function startClockCountdown() { 
    timerEngine = setInterval(() => { 
        if (timeRemainingSeconds <= 0) { 
            clearInterval(timerEngine); 
            triggerExamSubmission(); 
        } else { 
            timeRemainingSeconds--; 
            const mins = Math.floor(timeRemainingSeconds / 60).toString().padStart(2, '0'); 
            const secs = (timeRemainingSeconds % 60).toString().padStart(2, '0'); 
            document.getElementById('clock-display').innerText = `${mins}:${secs}`; 
        } 
    }, 1000); 
}

/**
 * Safe field-based localization resolver: uses canonical English and Bengali fields without splitting on slashes
 * @param {string} engText 
 * @param {string} bngText 
 * @returns {string}
 */
function getLocalizedText(engText, bngText = "") {
    if (currentLanguage === "BN") {
        if (bngText !== undefined && bngText !== null && String(bngText).trim() !== "") {
            return String(bngText).trim();
        }
    }
    return String(engText ?? bngText ?? "").trim();
}

function toggleViewLanguage() { 
    currentLanguage = document.getElementById('view-lang-select').value; 
    renderExamWindow(); 
}

function handleImageLoadError() {
    const imgWrapper = document.getElementById('target-image-container');
    if (imgWrapper) imgWrapper.style.display = 'none';
}

function renderExamWindow() { 
    const questionTextElem = document.getElementById('target-question-text');
    const container = document.getElementById('target-options-container'); 
    const feedbackContainer = document.getElementById('review-feedback-container'); 
    const commonContainer = document.getElementById('target-common-container');
    const imageContainer = document.getElementById('target-image-container');
    const imageElem = document.getElementById('target-question-image');
    const shiftLabel = document.getElementById('shift-label-view');
    const banner = document.getElementById('developer-validation-banner');

    if (examDataMatrix.length === 0) {
        questionTextElem.textContent = "No questions loaded.";
        container.innerHTML = "";
        feedbackContainer.innerHTML = "";
        commonContainer.style.display = "none";
        imageContainer.style.display = "none";
        shiftLabel.innerText = "";
        if (banner) banner.style.display = "none";
        document.getElementById('question-number-title').innerText = "Question No. 0";
        renderPaletteGrid();
        updateDeveloperInspector(null, null);
        return;
    }

    const currentItem = examDataMatrix[activeIndex]; 
    const currentRawSource = sourceBlocksMatrix[activeIndex] || "";
    
    if (questionStates[activeIndex] === 0 && !isReviewModeActive) { 
        questionStates[activeIndex] = 1; 
    } 

    document.getElementById('question-number-title').innerText = `Question No. ${activeIndex + 1}`; 

    // Metadata Tagging / Shift display
    if (isReviewModeActive) {
        let text = "";
        if (currentItem.exam) text += currentItem.exam;
        if (currentItem.shift) {
            if (text !== "") text += " | ";
            text += currentItem.shift;
        }
        shiftLabel.innerText = text;
    } else {
        shiftLabel.innerText = "";
    } 

    // Render Common/Equation section if present
    const commonContent = currentItem.equation || currentItem.common || currentItem.Common || "";
    if (commonContent && String(commonContent).trim() !== "") {
        commonContainer.style.display = "block";
        commonContainer.textContent = String(commonContent).trim();
        renderMathInSubtree(commonContainer);
    } else {
        commonContainer.style.display = "none";
        commonContainer.textContent = "";
    }

    // Render Question Image if present
    if (currentItem.image && String(currentItem.image).trim() !== "") {
        imageContainer.style.display = "block";
        imageElem.src = currentItem.image;
    } else {
        imageContainer.style.display = "none";
        imageElem.src = "";
    }

    // Render Question Text safely using textContent
    const engText = currentItem.questionEnglish || currentItem.text || "";
    const bngText = currentItem.questionBengali || currentItem.textBn || "";
    const resolvedQuestionText = getLocalizedText(engText, bngText);
    
    questionTextElem.textContent = resolvedQuestionText;
    renderMathInSubtree(questionTextElem);

    container.innerHTML = ''; 
    feedbackContainer.innerHTML = ''; 
    
    // Resolve Options A-D
    const rawOptions = [
        { eng: currentItem.optionEnglish?.a || currentItem.a || "", bn: currentItem.optionBengali?.a || currentItem.aBn || "" },
        { eng: currentItem.optionEnglish?.b || currentItem.b || "", bn: currentItem.optionBengali?.b || currentItem.bBn || "" },
        { eng: currentItem.optionEnglish?.c || currentItem.c || "", bn: currentItem.optionBengali?.c || currentItem.cBn || "" },
        { eng: currentItem.optionEnglish?.d || currentItem.d || "", bn: currentItem.optionBengali?.d || currentItem.dBn || "" }
    ];

    const userChoice = selectedAnswers[activeIndex]; 
    const correctChoice = (currentItem.correct !== null && currentItem.correct !== undefined) ? currentItem.correct : -1; 

    rawOptions.forEach((optObj, idx) => { 
        let statusClass = ''; 
        let isCheckedAttr = ''; 

        if (isReviewModeActive) { 
            if (userChoice === idx && userChoice !== correctChoice) { 
                statusClass = 'review-wrong'; 
            } else if (idx === correctChoice) { 
                statusClass = 'review-correct'; 
            } 
            if (userChoice === idx) isCheckedAttr = 'checked'; 
        } else { 
            if (userChoice === idx) { 
                statusClass = 'selected'; 
                isCheckedAttr = 'checked'; 
            } 
        } 

        const localizedOption = getLocalizedText(optObj.eng, optObj.bn); 

        const rowDiv = document.createElement('div');
        rowDiv.className = `option-row ${statusClass}`.trim();
        if (!isReviewModeActive) {
            rowDiv.onclick = () => selectOptionIndex(idx);
        }

        const inputRadio = document.createElement('input');
        inputRadio.type = 'radio';
        inputRadio.name = 'tcs-opt';
        inputRadio.id = `opt-${idx}`;
        if (isCheckedAttr) inputRadio.checked = true;
        if (isReviewModeActive) inputRadio.disabled = true;

        const label = document.createElement('label');
        label.htmlFor = `opt-${idx}`;
        label.style.cursor = isReviewModeActive ? 'default' : 'pointer';
        label.style.width = '100%';
        label.style.fontWeight = '600';
        label.textContent = `(${String.fromCharCode(65 + idx)}) ${localizedOption}`;

        rowDiv.appendChild(inputRadio);
        rowDiv.appendChild(label);
        container.appendChild(rowDiv);

        renderMathInSubtree(label);
    }); 

    // Review Feedback Presentation
    if (isReviewModeActive) { 
        const correctOptObj = rawOptions[correctChoice] || { eng: "", bn: "" };
        const correctOptionText = getLocalizedText(correctOptObj.eng, correctOptObj.bn);

        if (userChoice === null) {
            feedbackContainer.innerHTML = `
                <div class="review-status-box">
                    <div class="review-card pink compact">
                        <div class="review-card-title">⚪ QUESTION NOT ATTEMPTED</div>
                        <div class="review-answer-inline">
                            ✅ CORRECT ANSWER :- (${String.fromCharCode(65 + correctChoice)}) ${correctOptionText}
                        </div>
                    </div>
                    ${renderLearnModule()}
                </div>
            `;
        } else if (userChoice === correctChoice) {
            const userOptObj = rawOptions[userChoice] || { eng: "", bn: "" };
            const userOptionText = getLocalizedText(userOptObj.eng, userOptObj.bn);
            feedbackContainer.innerHTML = `
                <div class="review-status-box">
                    <div class="review-card blue compact">
                        <div class="review-card-title">
                            ✅ YOUR SELECTED ANSWER IS CORRECT :-
                            <span class="review-answer-inline">
                                (${String.fromCharCode(65 + userChoice)}) ${userOptionText}
                            </span>
                        </div>
                    </div>
                    ${renderLearnModule()}
                </div>
            `;
        } else {
            const userOptObj = rawOptions[userChoice] || { eng: "", bn: "" };
            const userOptionText = getLocalizedText(userOptObj.eng, userOptObj.bn);
            feedbackContainer.innerHTML = `
                <div class="review-status-box">
                    <div class="review-card red compact">
                        <div class="review-card-title">
                            ❌ YOUR SELECTED ANSWER :-
                            <span class="review-answer-inline">
                                (${String.fromCharCode(65 + userChoice)}) ${userOptionText}
                            </span>
                        </div>
                    </div>
                    <div class="review-card green compact">
                        <div class="review-card-title">
                            ✅ CORRECT ANSWER :-
                            <span class="review-answer-inline">
                                (${String.fromCharCode(65 + correctChoice)}) ${correctOptionText}
                            </span>
                        </div>
                    </div>
                    ${renderLearnModule()}
                </div>
            `;
        }
        renderMathInSubtree(feedbackContainer);
    } 

    const questionContent = document.querySelector(".question-content");
    if (questionContent) {
        questionContent.scrollTop = 0;
    }

    // Phase 2: Diagnostic Evaluation for Active Question
    const diag = questionDiagnosticsCache[activeIndex] || runQuestionDiagnostics(currentItem, activeIndex, examDataMatrix);
    renderActiveQuestionDiagnostics(diag);

    renderPaletteGrid(); 
    updateDeveloperInspector(currentItem, currentRawSource, diag);
}

/**
 * Displays diagnostic status banner and issues on the active question workspace
 * @param {{ status: 'PASS'|'WARNING'|'ERROR', issues: Array<{ severity: 'ERROR'|'WARNING', field: string, message: string }> }} diag 
 */
function renderActiveQuestionDiagnostics(diag) {
    const banner = document.getElementById('developer-validation-banner');
    if (!banner) return;

    banner.className = `diagnostic-active-banner ${diag.status.toLowerCase()}`;
    banner.style.display = 'block';

    if (diag.status === 'PASS') {
        banner.innerHTML = `<strong>Status: PASS</strong> — No structural issues detected for this question.`;
    } else {
        const titleIcon = diag.status === 'ERROR' ? '🚫' : '⚠️';
        const issuesHtml = diag.issues.map(i => `
            <div class="diag-issue-item ${i.severity.toLowerCase()}" onclick="focusDiagnosticField('${i.field}')">
                <strong>[${i.severity}]</strong> ${i.message}
            </div>
        `).join('');

        banner.innerHTML = `
            <div><strong>${titleIcon} Status: ${diag.status}</strong> (${diag.issues.length} item${diag.issues.length > 1 ? 's' : ''})</div>
            <div style="margin-top:4px;">${issuesHtml}</div>
        `;
    }
}

function selectOptionIndex(idx) { 
    if (isReviewModeActive) return; 
    selectedAnswers[activeIndex] = idx; 
    renderExamWindow(); 
} 

function clearResponse() { 
    if (isReviewModeActive) return; 
    selectedAnswers[activeIndex] = null; 
    questionStates[activeIndex] = 1; 
    renderExamWindow(); 
} 

function saveAndNext() { 
    if (isReviewModeActive) { 
        if (activeIndex < examDataMatrix.length - 1) { activeIndex++; renderExamWindow(); } 
        return; 
    } 
    if (selectedAnswers[activeIndex] !== null) { 
        questionStates[activeIndex] = 2; 
    } else { 
        questionStates[activeIndex] = 1; 
    } 
    moveToNextOrWrap(); 
} 

function markForReview() { 
    if (isReviewModeActive) return; 
    questionStates[activeIndex] = 3; 
    moveToNextOrWrap(); 
} 

function moveToNextOrWrap() { 
    if (activeIndex < examDataMatrix.length - 1) { 
        activeIndex++; 
        renderExamWindow(); 
    } else { 
        alert("You have reached the end of the question set. Feel free to review your matrix palette dashboard or click Submit."); 
        renderPaletteGrid(); 
    } 
} 

function jumpToQuestion(idx) { 
    if (idx < 0 || idx >= examDataMatrix.length) return;
    activeIndex = idx; 
    updateDeveloperCounter();
    renderExamWindow(); 
} 

/**
 * Renders question palette cells with dual Status Badges (✓, !, ✕) and ARIA support
 */
function renderPaletteGrid() { 
    const grid = document.getElementById('palette-grid-holder'); 
    grid.innerHTML = ''; 
    
    questionStates.forEach((stateValue, idx) => {
        const diag = questionDiagnosticsCache[idx] || { status: 'PASS' };

        // Apply diagnostic filter
        if (activeDiagnosticFilter !== 'ALL' && diag.status !== activeDiagnosticFilter) {
            return;
        }

        const isActive = idx === activeIndex; 
        let computedStateClass = `state-${stateValue}`;

        if (isReviewModeActive && stateValue === 2) {
            const userSelection = selectedAnswers[idx];
            const officialCorrectAnswer = examDataMatrix[idx]?.correct;

            if (userSelection !== officialCorrectAnswer) {
                computedStateClass = 'state-wrong-review';
            }
        }

        let diagSymbol = '✓';
        if (diag.status === 'WARNING') diagSymbol = '!';
        if (diag.status === 'ERROR') diagSymbol = '✕';

        const cellHtml = `
            <div class="palette-cell ${computedStateClass} diag-${diag.status.toLowerCase()} ${isActive ? 'active-cell' : ''}" 
                 onclick="jumpToQuestion(${idx})"
                 aria-label="Question ${idx + 1}, Exam State: ${stateValue}, Diagnostic Status: ${diag.status}"
                 role="button"
                 tabindex="0">
                ${idx + 1}
                <span class="diag-badge" title="Diagnostic: ${diag.status}">${diagSymbol}</span>
            </div>
        `; 
        grid.insertAdjacentHTML('beforeend', cellHtml); 
    }); 
} 

function triggerExamSubmission() { 
    if (timerEngine) clearInterval(timerEngine); 
    
    if (isReviewModeActive) { 
        window.location.href = sourceFile ? 'tutorials.html' : 'exams.html'; 
        return; 
    } 
    
    let totalQuestions = examDataMatrix.length; 
    let attempted = 0; 
    let correct = 0; 
    let wrong = 0; 

    selectedAnswers.forEach((answerIndex, qIndex) => { 
        if (answerIndex !== null) { 
            attempted++; 
            if (answerIndex === examDataMatrix[qIndex].correct) { 
                correct++; 
            } else { 
                wrong++; 
            } 
        } 
    }); 

    let finalScore = correct - (wrong * 0.33); 
    
    let difficultyLabel = "";
    let difficultyEmoji = "";
    
    if (paperDifficulty <= 2.5) {
        difficultyEmoji = "🟢";
        difficultyLabel = "Very Easy";
    } else if (paperDifficulty <= 4) {
        difficultyEmoji = "🔵";
        difficultyLabel = "Easy";
    } else if (paperDifficulty <= 5.5) {
        difficultyEmoji = "🟡";
        difficultyLabel = "Moderate";
    } else if (paperDifficulty <= 7) {
        difficultyEmoji = "🟠";
        difficultyLabel = "Hard";
    } else if (paperDifficulty <= 8.5) {
        difficultyEmoji = "🔴";
        difficultyLabel = "Very Hard";
    } else {
        difficultyEmoji = "⚫";
        difficultyLabel = "Expert";
    }
    
    const passed = finalScore >= dynamicPassMark;
    const scorePercent = (Math.max(finalScore, 0) / (totalQuestions || 1)) * 100;
    
    let rating = "";
    if (scorePercent >= 90) rating = "🥇 Outstanding";
    else if (scorePercent >= 75) rating = "🌟 Excellent";
    else if (scorePercent >= 60) rating = "👍 Good";
    else if (scorePercent >= 45) rating = "🙂 Average";
    else if (scorePercent >= 35) rating = "📘 Needs Improvement";
    else rating = "📚 Practice More";

    document.getElementById('timer-header-wrapper').style.display = 'none'; 
    document.getElementById('ribbon-bar-container').style.display = 'none'; 
    document.getElementById('quiz-workspace').style.display = 'none'; 
    
    document.getElementById('exam-title-display').innerText = "Conceptual Bridge - Exam Report Summary"; 

    document.getElementById('res-total').innerText = totalQuestions; 
    document.getElementById('res-attempted').innerText = attempted; 
    document.getElementById('res-correct').innerText = correct; 
    document.getElementById('res-wrong').innerText = wrong; 
    document.getElementById('res-final-score').innerText = finalScore.toFixed(2); 
    document.getElementById("res-difficulty").innerText = `${difficultyEmoji} ${difficultyLabel} (${paperDifficulty.toFixed(2)}/10)`;
    document.getElementById("res-passmark").innerText = `${dynamicPassMark.toFixed(2)} / ${totalQuestions}`;
    document.getElementById("res-result").innerText = passed ? "✅ PASS" : "❌ FAIL";
    document.getElementById("res-rating").innerText = rating;
    document.getElementById('quiz-report-workspace').style.display = 'flex'; 
} 

function activateReviewMode() { 
    isReviewModeActive = true; 
    
    document.getElementById('quiz-report-workspace').style.display = 'none'; 
    document.getElementById('ribbon-bar-container').style.display = 'flex'; 
    document.getElementById('quiz-workspace').style.display = 'flex'; 
    
    document.getElementById('exam-title-display').innerText = "Conceptual Bridge - Performance Review Mode"; 
    
    document.getElementById('action-btn-review').disabled = true; 
    document.getElementById('action-btn-review').style.opacity = '0.5'; 
    document.getElementById('action-btn-review').style.cursor = 'not-allowed'; 
    
    document.getElementById('action-btn-clear').disabled = true; 
    document.getElementById('action-btn-clear').style.opacity = '0.5'; 
    document.getElementById('action-btn-clear').style.cursor = 'not-allowed'; 
    
    document.getElementById('action-btn-report').style.display = 'inline-block'; 
    document.getElementById('action-btn-savenext').innerText = "Next Question →"; 
    document.getElementById('action-btn-submit').innerText = sourceFile ? "Return to Tutorial Corner" : "Return to Exam Corner"; 
    document.getElementById('legend-lbl-answered').innerText = "Correctly Answered";
    
    const targetLegendBox = document.getElementById('legend-box-container');
    const wrongAnswerRowHtml = `
        <div class="legend-item" id="dynamic-wrongly-answered-row">
            <span class="legend-badge" style="background:var(--status-wrong);"></span> Wrongly Answered
        </div>
    `;
    targetLegendBox.insertAdjacentHTML('beforeend', wrongAnswerRowHtml);

    activeIndex = 0; 
    renderExamWindow(); 
} 

function renderLearnModule(){
    return `
    <div class="learn-card">
        <div class="learn-title">🦆 Learn this Concept</div>
        <button class="learn-btn" onclick="generateShortNote(${activeIndex})">Generate Short Note</button>
        <div id="learn-output" class="learn-placeholder">
            Click on <b>Generate Short Note</b> to receive a concise explanation of this concept.
        </div>
    </div>
    `;
}

function generateShortNote(questionIndex){
    const holder = document.getElementById("learn-output");
    holder.innerHTML = `
        <b>Loading explanation...</b>
        <br><br>
        This placeholder will later be replaced with DuckDuckGo AI generated notes.
    `;
}

/*=========================================================
    Phase 2: Comprehensive Multi-Tab Developer Inspector
=========================================================*/

function updateDeveloperInspector(question, rawSource = "", diag = null) {
    // Reset focus
    document.querySelectorAll('.meta-row').forEach(r => r.classList.remove('focused-field'));

    if (!question) {
        document.getElementById("metaQuestionId").textContent = "-";
        document.getElementById("metaDifficulty").textContent = "-";
        document.getElementById("metaLevel").textContent = "-";
        document.getElementById("metaMarks").textContent = "-";
        document.getElementById("metaType").textContent = "-";
        document.getElementById("metaAnswer").textContent = "-";
        document.getElementById("metaImage").textContent = "-";
        document.getElementById("metaNotification").textContent = "-";
        document.getElementById("metaExam").textContent = "-";
        document.getElementById("metaTopic").textContent = "-";
        document.getElementById("metaSubTopic").textContent = "-";

        document.getElementById("raw-source-display").textContent = "No source block available.";
        document.getElementById("parsed-object-display").textContent = "No parsed object.";
        document.getElementById("diff-comparison-display").innerHTML = "<em>No comparison data.</em>";
        return;
    }

    // 1. Tab: Metadata
    document.getElementById("metaQuestionId").textContent = question.QuestionID || question.id || question.questionId || "-";
    document.getElementById("metaDifficulty").textContent = question.difficulty ?? "-";
    document.getElementById("metaLevel").textContent = question.level || "-";
    document.getElementById("metaMarks").textContent = question.marks || "-";
    document.getElementById("metaType").textContent = question.qType || question.type || "-";
    document.getElementById("metaAnswer").textContent = question.correctLetter ?? (question.correct !== undefined && question.correct !== null ? String.fromCharCode(65 + Number(question.correct)) : "-");
    document.getElementById("metaImage").textContent = question.image ? "Available" : "None";
    document.getElementById("metaNotification").textContent = question.notification || "-";
    document.getElementById("metaExam").textContent = question.exam || "-";
    document.getElementById("metaTopic").textContent = question.topic || "-";
    document.getElementById("metaSubTopic").textContent = question.subTopic || "-";

    // 2. Tab: Diagnostics Detail
    if (diag) {
        const pill = document.getElementById("diag-detail-status-pill");
        pill.innerHTML = `<span class="diag-metric-pill ${diag.status.toLowerCase()}">Status: ${diag.status}</span>`;

        const issuesList = document.getElementById("diag-detail-issues-list");
        if (diag.issues.length === 0) {
            issuesList.innerHTML = `<p style="color:#166534; font-size:0.85rem;">✓ All structural checks passed cleanly.</p>`;
        } else {
            issuesList.innerHTML = diag.issues.map(i => `
                <div class="diag-issue-item ${i.severity.toLowerCase()}" onclick="focusDiagnosticField('${i.field}')" style="margin-bottom:6px;">
                    <div><strong>[${i.severity}] ${i.field}:</strong> ${i.message}</div>
                </div>
            `).join('');
        }
    }

    // 3. Tab: Read-Only Raw Source Block
    document.getElementById("raw-source-display").textContent = rawSource || "Raw source block not found for this question index.";

    // 4. Tab: Read-Only Parsed Object JSON
    document.getElementById("parsed-object-display").textContent = JSON.stringify(question, null, 2);

    // 5. Tab: Source vs Parsed Diff Mapping
    renderSourceVsParsedDiff(rawSource, question);
}

/**
 * Generates an analytical discrepancy comparison between original TXT source lines and the parsed object
 * @param {string} rawSource 
 * @param {Object} question 
 */
function renderSourceVsParsedDiff(rawSource, question) {
    const container = document.getElementById('diff-comparison-display');
    if (!container) return;

    if (!rawSource || !question) {
        container.innerHTML = "<em>No comparison data.</em>";
        return;
    }

    const sourceLines = rawSource.split('\n').map(l => l.trim()).filter(Boolean);
    const sourceKeyMap = {};

    sourceLines.forEach(line => {
        const pipeIdx = line.indexOf('|');
        if (pipeIdx !== -1) {
            const key = line.substring(0, pipeIdx).trim().toUpperCase();
            const val = line.substring(pipeIdx + 1).trim();
            sourceKeyMap[key] = val;
        }
    });

    let html = '';

    // Check Question Text
    if (sourceKeyMap['QEN'] || sourceKeyMap['Q']) {
        const srcText = sourceKeyMap['QEN'] || sourceKeyMap['Q'];
        const parsedText = question.questionEnglish || question.text;
        const matched = srcText === parsedText;
        html += `
            <div class="diff-row">
                <span class="diff-field-name">Question (English)</span>
                <span class="diff-status-tag ${matched ? 'matched' : 'discrepancy'}">${matched ? 'MATCHED' : 'PARSER DISCREPANCY'}</span>
                <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Source: ${srcText}</div>
                <div style="font-size:0.75rem; color:#0f172a;">Parsed: ${parsedText || 'None'}</div>
            </div>
        `;
    }

    // Check QBN
    if (sourceKeyMap['QBN']) {
        const srcBng = sourceKeyMap['QBN'];
        const parsedBng = question.questionBengali || question.textBn;
        const matched = srcBng === parsedBng;
        html += `
            <div class="diff-row">
                <span class="diff-field-name">Question (Bengali)</span>
                <span class="diff-status-tag ${matched ? 'matched' : 'discrepancy'}">${matched ? 'MATCHED' : 'PARSER DISCREPANCY'}</span>
                <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Source: ${srcBng}</div>
                <div style="font-size:0.75rem; color:#0f172a;">Parsed: ${parsedBng || 'None'}</div>
            </div>
        `;
    } else {
        html += `
            <div class="diff-row">
                <span class="diff-field-name">Question (Bengali)</span>
                <span class="diff-status-tag derived">NORMALIZED / DERIVED</span>
                <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Source: <em>Missing</em></div>
                <div style="font-size:0.75rem; color:#0f172a;">Parsed: ${question.questionBengali || question.textBn || 'English Fallback'}</div>
            </div>
        `;
    }

    // Check Options A-D
    ['A', 'B', 'C', 'D'].forEach(opt => {
        if (sourceKeyMap[opt]) {
            const srcOpt = sourceKeyMap[opt];
            const parsedOptEng = question.optionEnglish ? question.optionEnglish[opt.toLowerCase()] : question[opt.toLowerCase()];
            const matched = srcOpt.includes(parsedOptEng || '');
            html += `
                <div class="diff-row">
                    <span class="diff-field-name">Option ${opt}</span>
                    <span class="diff-status-tag ${matched ? 'matched' : 'discrepancy'}">${matched ? 'MATCHED' : 'PARSER DISCREPANCY'}</span>
                    <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Source: ${srcOpt}</div>
                    <div style="font-size:0.75rem; color:#0f172a;">Parsed (EN): ${parsedOptEng}</div>
                </div>
            `;
        }
    });

    // Check Correct Answer
    if (sourceKeyMap['CORRECT']) {
        const srcCorrect = sourceKeyMap['CORRECT'];
        const parsedCorrect = question.correctLetter || (question.correct !== null ? String.fromCharCode(65 + Number(question.correct)) : "");
        const matched = srcCorrect.toUpperCase() === parsedCorrect.toUpperCase();
        html += `
            <div class="diff-row">
                <span class="diff-field-name">Correct Answer</span>
                <span class="diff-status-tag ${matched ? 'matched' : 'discrepancy'}">${matched ? 'MATCHED' : 'PARSER DISCREPANCY'}</span>
                <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Source: ${srcCorrect}</div>
                <div style="font-size:0.75rem; color:#0f172a;">Parsed: ${parsedCorrect} (Index: ${question.correct})</div>
            </div>
        `;
    }

    // Check QuestionID
    if (sourceKeyMap['QUESTIONID']) {
        const srcId = sourceKeyMap['QUESTIONID'];
        const parsedId = question.QuestionID || question.id;
        const matched = srcId === parsedId;
        html += `
            <div class="diff-row">
                <span class="diff-field-name">QuestionID</span>
                <span class="diff-status-tag ${matched ? 'matched' : 'discrepancy'}">${matched ? 'MATCHED' : 'PARSER DISCREPANCY'}</span>
                <div style="font-size:0.75rem; color:#64748b; margin-top:2px;">Source: ${srcId}</div>
                <div style="font-size:0.75rem; color:#0f172a;">Parsed: ${parsedId}</div>
            </div>
        `;
    }

    container.innerHTML = html || '<em>No direct source keys matched.</em>';
}

async function loadDeveloperFile() {
    const topicSelect = document.getElementById("topicSelect");
    const fileSelect = document.getElementById("fileSelect");
    const loadBtn = document.getElementById("loadBtn");

    const topic = topicSelect.value;
    const file = fileSelect.value;

    if (!topic || !file) {
        alert("Please select both a topic and a file to load.");
        return;
    }

    loadBtn.disabled = true;
    loadBtn.textContent = "Loading...";

    try {
        const response = await fetch(
            `/api/developer/questions?action=load&topic=${encodeURIComponent(topic)}&file=${encodeURIComponent(file)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const payload = await response.json();

        if (payload.status !== "ok" || !Array.isArray(payload.data)) {
            alert(payload.message || "Unable to load question file.");
            examDataMatrix = [];
            sourceBlocksMatrix = [];
            activeIndex = 0;
            recalculateFileDiagnostics();
            updateDeveloperCounter();
            renderExamWindow();
            return;
        }

        if (payload.data.length === 0) {
            alert("The selected file contains 0 valid questions.");
            examDataMatrix = [];
            sourceBlocksMatrix = [];
            activeIndex = 0;
            recalculateFileDiagnostics();
            updateDeveloperCounter();
            renderExamWindow();
            return;
        }

        examDataMatrix = payload.data;
        sourceBlocksMatrix = Array.isArray(payload.sourceBlocks) ? payload.sourceBlocks : [];
        activeIndex = 0;
        activeDiagnosticFilter = 'ALL';

        selectedAnswers = new Array(examDataMatrix.length).fill(null);
        questionStates = new Array(examDataMatrix.length).fill(0);
        questionStates[0] = 1;

        recalculateFileDiagnostics();
        updateDeveloperCounter();
        setupGlobalExamMetrics(topic);
        renderExamWindow();
    } catch (err) {
        console.error("Failed to load developer question file:", err);
        alert("Failed to communicate with developer API.");
        examDataMatrix = [];
        sourceBlocksMatrix = [];
        activeIndex = 0;
        recalculateFileDiagnostics();
        updateDeveloperCounter();
        renderExamWindow();
    } finally {
        loadBtn.disabled = false;
        loadBtn.textContent = "Load";
    }
}

function developerPreviousQuestion() {
    if (examDataMatrix.length === 0) return;

    if (activeDiagnosticFilter === 'ALL') {
        if (activeIndex > 0) {
            activeIndex--;
            updateDeveloperCounter();
            renderExamWindow();
        }
    } else {
        // Find previous question matching filter
        for (let i = activeIndex - 1; i >= 0; i--) {
            if (questionDiagnosticsCache[i]?.status === activeDiagnosticFilter) {
                activeIndex = i;
                updateDeveloperCounter();
                renderExamWindow();
                break;
            }
        }
    }
}

function developerNextQuestion() {
    if (examDataMatrix.length === 0) return;

    if (activeDiagnosticFilter === 'ALL') {
        if (activeIndex < examDataMatrix.length - 1) {
            activeIndex++;
            updateDeveloperCounter();
            renderExamWindow();
        }
    } else {
        // Find next question matching filter
        for (let i = activeIndex + 1; i < examDataMatrix.length; i++) {
            if (questionDiagnosticsCache[i]?.status === activeDiagnosticFilter) {
                activeIndex = i;
                updateDeveloperCounter();
                renderExamWindow();
                break;
            }
        }
    }
}

function updateDeveloperCounter() {
    const counterNode = document.getElementById("developerCounter");
    if (!counterNode) return;

    if (examDataMatrix.length === 0) {
        counterNode.textContent = "0 / 0";
    } else {
        counterNode.textContent = `${activeIndex + 1} / ${examDataMatrix.length}`;
    }
}
        
initializeQuizEngine();
