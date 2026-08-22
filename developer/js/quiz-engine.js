const urlParams = new URLSearchParams(window.location.search);

const sourceFile = urlParams.get('source'); 
const activeTopic = urlParams.get('topic') || 'Mathematics';
const questionLimit = sourceFile ? 10 : (parseInt(urlParams.get('limit')) || 10);

let examDataMatrix = [];

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
 * Lightweight structural validator for the active question object
 * @param {Object} item 
 * @returns {Array<string>} list of validation warning messages
 */
function validateQuestionObject(item) {
    if (!item) return ["Question object is undefined or empty."];
    const warnings = [];

    const questionId = item.QuestionID || item.id || item.questionId;
    if (!questionId) warnings.push("Missing QuestionID");

    const engText = item.questionEnglish || item.text || "";
    const bngText = item.questionBengali || item.textBn || "";
    if (!engText && !bngText) warnings.push("Missing Question Text (QEN/QBN)");

    const optA = item.optionEnglish?.a || item.a || "";
    const optB = item.optionEnglish?.b || item.b || "";
    const optC = item.optionEnglish?.c || item.c || "";
    const optD = item.optionEnglish?.d || item.d || "";

    if (!optA && !optB && !optC && !optD) {
        warnings.push("Missing all Options (A-D)");
    } else if (!optA || !optB || !optC || !optD) {
        warnings.push("Incomplete Option set (requires A, B, C, D)");
    }

    if (item.correct === null || item.correct === undefined || isNaN(item.correct)) {
        if (!item.correctLetter) warnings.push("Missing Correct Answer (Correct|)");
    }

    return warnings;
}

function updateValidationStatusDisplay(warnings) {
    const banner = document.getElementById("developer-validation-banner");
    if (!banner) return;
    if (warnings.length === 0) {
        banner.style.display = "none";
        banner.innerHTML = "";
    } else {
        banner.style.display = "block";
        banner.innerHTML = `⚠️ <strong>Question Validation Notice:</strong> ${warnings.join(" | ")}`;
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
            option.textContent = topic;
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

    if (!topic) {
        return;
    }

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

// ADVANCED TUTORIAL PARSER WITH AUTOMATIC OPTION SCRAMBLING
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
    if (topicName === 'GACA' || topicName === 'gaca' || topicName === 'GACA Short Assessment') formattedSectionTitle = 'GENERAL AWARENESS & CURRENT AFFAIRS'; 
    else if (topicName === 'GS' || topicName === 'gs') formattedSectionTitle = 'GENERAL SCIENCE'; 
    else if (topicName === 'GI' || topicName === 'gi') formattedSectionTitle = 'GENERAL INTELLIGENCE'; 
    else if (topicName === 'Mathematics' || topicName === 'math') formattedSectionTitle = 'MATHEMATICS'; 
    
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
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportPayload)
    })
    .then(response => {
        if (response.ok) {
            alert("Thank you! Your concern has been submitted safely to the server.");
        } else {
            alert("Report package processed internally, but sync node threw a routing mismatch response.");
        }
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

    if (examDataMatrix.length === 0) {
        questionTextElem.textContent = "No questions loaded.";
        container.innerHTML = "";
        feedbackContainer.innerHTML = "";
        commonContainer.style.display = "none";
        imageContainer.style.display = "none";
        shiftLabel.innerText = "";
        document.getElementById('question-number-title').innerText = "Question No. 0";
        updateValidationStatusDisplay([]);
        renderPaletteGrid();
        updateDeveloperInspector(null);
        return;
    }

    const currentItem = examDataMatrix[activeIndex]; 
    
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

    // Run Developer Validator
    const validationWarnings = validateQuestionObject(currentItem);
    updateValidationStatusDisplay(validationWarnings);

    renderPaletteGrid(); 
    updateDeveloperInspector(currentItem);
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

function renderPaletteGrid() { 
    const grid = document.getElementById('palette-grid-holder'); 
    grid.innerHTML = ''; 
    
    questionStates.forEach((stateValue, idx) => { 
        const isActive = idx === activeIndex; 
        let computedStateClass = `state-${stateValue}`;

        if (isReviewModeActive && stateValue === 2) {
            const userSelection = selectedAnswers[idx];
            const officialCorrectAnswer = examDataMatrix[idx].correct;

            if (userSelection !== officialCorrectAnswer) {
                computedStateClass = 'state-wrong-review';
            }
        }

        const cellHtml = `
            <div class="palette-cell ${computedStateClass} ${isActive ? 'active-cell' : ''}" onclick="jumpToQuestion(${idx})">
                ${idx + 1}
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
    Developer Inspector
=========================================================*/

function updateDeveloperInspector(question){
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
        return;
    }

    document.getElementById("metaQuestionId").textContent =
        question.QuestionID || question.id || question.questionId || "-";

    document.getElementById("metaDifficulty").textContent =
        question.difficulty ?? "-";

    document.getElementById("metaLevel").textContent =
        question.level || "-";

    document.getElementById("metaMarks").textContent =
        question.marks || "-";

    document.getElementById("metaType").textContent =
        question.qType || question.type || "-";

    document.getElementById("metaAnswer").textContent =
        question.correctLetter ??
        (question.correct !== undefined && question.correct !== null
            ? String.fromCharCode(65 + Number(question.correct))
            : "-");

    document.getElementById("metaImage").textContent =
        question.image ? "Available" : "None";

    document.getElementById("metaNotification").textContent =
        question.notification || "-";

    document.getElementById("metaExam").textContent =
        question.exam || "-";

    document.getElementById("metaTopic").textContent =
        question.topic || "-";

    document.getElementById("metaSubTopic").textContent =
        question.subTopic || "-";
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
            activeIndex = 0;
            updateDeveloperCounter();
            renderExamWindow();
            return;
        }

        if (payload.data.length === 0) {
            alert("The selected file contains 0 valid questions.");
            examDataMatrix = [];
            activeIndex = 0;
            updateDeveloperCounter();
            renderExamWindow();
            return;
        }

        examDataMatrix = payload.data;
        activeIndex = 0;
        updateDeveloperCounter();

        selectedAnswers = new Array(examDataMatrix.length).fill(null);
        questionStates = new Array(examDataMatrix.length).fill(0);
        questionStates[0] = 1;

        setupGlobalExamMetrics(topic);
        renderExamWindow();
    } catch (err) {
        console.error("Failed to load developer question file:", err);
        alert("Failed to communicate with developer API.");
        examDataMatrix = [];
        activeIndex = 0;
        updateDeveloperCounter();
        renderExamWindow();
    } finally {
        loadBtn.disabled = false;
        loadBtn.textContent = "Load";
    }
}

function developerPreviousQuestion() {
    if (examDataMatrix.length === 0) return;

    if (activeIndex > 0) {
        activeIndex--;
        updateDeveloperCounter();
        renderExamWindow();
    }
}

function developerNextQuestion() {
    if (examDataMatrix.length === 0) return;

    if (activeIndex < examDataMatrix.length - 1) {
        activeIndex++;
        updateDeveloperCounter();
        renderExamWindow();
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
