/**
 * Reusable KaTeX Renderer Helper Function
 * Safely renders LaTeX equations in a target DOM element using KaTeX.
 * Falls back gracefully to original plain text if KaTeX fails or isn't loaded.
 * @param {HTMLElement|string} targetElement - DOM element or selector string
 */
function renderKatexInElement(targetElement) {
    const element = typeof targetElement === 'string' 
        ? document.querySelector(targetElement) 
        : targetElement;

    if (!element) return;

    if (typeof renderMathInElement !== 'function') {
        return;
    }

    try {
        renderMathInElement(element, {
            delimiters: [
                { left: '$$', right: '$$', display: true },
                { left: '\\[', right: '\\]', display: true },
                { left: '\\(', right: '\\)', display: false },
                { left: '$', right: '$', display: false }
            ],
            throwOnError: false
        });
    } catch (err) {
        console.error('KaTeX rendering error caught silently:', err);
    }
}

const urlParams = new URLSearchParams(window.location.search);

const sourceFile = urlParams.get('source'); 
const activeTopic = urlParams.get('topic') || 'Mathematics';
const questionLimit = sourceFile ? 10 : (parseInt(urlParams.get('limit')) || 10);

// =========================================================
// TIMER TEST MODE & VISUAL THRESHOLDS CONFIGURATION
// =========================================================
const TIMER_TEST_MODE = false;

const TIMER_THRESHOLDS = TIMER_TEST_MODE ? {
    FIVE_MIN_INTERVAL: 5,   // Test mode: 5-second interval equivalent
    FINAL_RED: 5,           // Test mode: 5-second threshold
    FLASHING: 2            // Test mode: 2-second threshold
} : {
    FIVE_MIN_INTERVAL: 300, // Production mode: 300 seconds (5 minutes)
    FINAL_RED: 59,          // Production mode: 59 seconds threshold
    FLASHING: 10            // Production mode: 10 seconds threshold
};


let examDataMatrix = [];
let paperMeta = {};

//----------------------------------------------------
// Current Student Profile
//----------------------------------------------------
const currentStudent = {
    uid: null,
    name: "Guest Student",
    email: "",
    photo: "",
    membership: "Free"
};

const QUESTION_STATE = {

    NOT_VISITED: 0,

    NOT_ANSWERED: 1,

    ANSWERED: 2,

    REVIEW: 3

};

let paperDifficulty = 5;
let dynamicPassMark = 0;

let activeIndex = 0;
let defaultLanguage = "EN";
let questionLanguages = [];

let questionStates = [];
let selectedAnswers = [];
let timeRemainingSeconds = questionLimit * 60;
let timerEngine = null;
let isReviewModeActive = false; 



async function initializeQuizEngine() {
    if (sourceFile) {
        await executeTutorialFetch();
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
        paperMeta = payload.paperMeta || {};
        
        let targetQuestions = payload.data || (Array.isArray(payload) ? payload : []); 

        if (targetQuestions.length > 0) { 
            examDataMatrix = targetQuestions; 
            setupGlobalExamMetrics(activeTopic); 
        } else { showMissingFileScreen(); } 
    } catch (err) { showMissingFileScreen(); } 
}

async function executeTutorialFetch() {
    try {
        const response = await fetch(
            `/api/fetch-tutorial-questions?source=${encodeURIComponent(sourceFile)}`
        );

        if (!response.ok) {
            showMissingFileScreen();
            return;
        }

        const payload = await response.json();
        paperDifficulty = payload.averageDifficulty || 5;
        dynamicPassMark = payload.passMark || 0;
        paperMeta = payload.paperMeta || {};
        examDataMatrix = payload.data || [];

        document.getElementById('wizard-back-nav-btn').onclick =
            () => window.location.href = 'tutorials.html';

        document.getElementById('wizard-back-nav-btn').innerText =
            '← Go to Tutorials';

        document.getElementById('exit-dashboard-action-btn').onclick =
            () => window.location.href = 'tutorials.html';

        document.getElementById('exit-dashboard-action-btn').innerText =
            'Return to Tutorial Corner';

        setupGlobalExamMetrics(
            paperMeta.subject || "Tutorial"
        );
    } catch (err) {
        console.error(err);
        showMissingFileScreen();
    }
}

function setupGlobalExamMetrics(topicName) { 
    selectedAnswers = new Array(examDataMatrix.length).fill(null); 
    questionStates = new Array(examDataMatrix.length).fill(QUESTION_STATE.NOT_VISITED); 
    questionLanguages = new Array(examDataMatrix.length).fill(defaultLanguage);

    let formattedSectionTitle = topicName; 
    if (topicName === 'GACA' || topicName === 'gaca' || topicName === 'GACA Short Assessment') formattedSectionTitle = 'GENERAL AWARENESS & CURRENT AFFAIRS'; 
    else if (topicName === 'GS' || topicName === 'gs') formattedSectionTitle = 'GENERAL SCIENCE'; 
    else if (topicName === 'GI' || topicName === 'gi') formattedSectionTitle = 'GENERAL INTELLIGENCE'; 
    else if (topicName === 'Mathematics') formattedSectionTitle = 'MATHEMATICS'; 
    
    document.getElementById('active-section-label').innerText = formattedSectionTitle; 
    document.getElementById('wizard-exam-main-title').innerText = `${formattedSectionTitle} - LIVE EXAM MODULE`; 
    document.getElementById('wizard-duration-lbl').innerText = `Duration: ${questionLimit} Mins`; 
    document.getElementById('wizard-marks-lbl').innerText =`Maximum Marks: ${paperMeta.totalMarks || examDataMatrix.length}`;
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
        rawQuestionContent: examDataMatrix[activeIndex].text
    };

    fetch('/api/submit-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    const container = document.getElementById("instruction-scroll-pane");
    const nextButton = document.getElementById("instruction-next-action-btn");

    if (!container || !nextButton) {
        console.log("Container or button not found");
        return;
    }

    console.log(
        "Scroll:",
        container.scrollTop,
        container.clientHeight,
        container.scrollHeight
    );

    const reachedBottom =
        Math.ceil(container.scrollTop + container.clientHeight)
        >= container.scrollHeight - 20;

    if (reachedBottom) {
        console.log("Reached Bottom");
        nextButton.disabled = false;
    }
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

function toggleReadyToBeginButtonState() { 
    const isChecked = document.getElementById('declaration-checkbox').checked; 
    document.getElementById('ready-begin-action-btn').disabled = !isChecked; 
    const noticeEl = document.getElementById('default-language-notice');
    if (noticeEl) {
        noticeEl.style.color = isChecked ? '#16a34a' : '#dc2626';
    }
}

function launchExamMatrixWorkspace() { 
    defaultLanguage = document.getElementById('wizard-lang-dropdown').value; 
    questionLanguages = new Array(examDataMatrix.length).fill(defaultLanguage);
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

function updateTimerVisuals(secondsRemaining) {
    const clockDisplay = document.getElementById('clock-display');
    if (!clockDisplay) return;

    // Reset visual state classes
    clockDisplay.classList.remove('timer-warning', 'timer-flashing');

    // 00:00 completion state -> SOLID RED
    if (secondsRemaining === 0) {
        clockDisplay.classList.add('timer-warning');
    }
    // Rule 3: Final threshold flashing (<= 10 seconds in prod, <= 2 seconds in test mode)
    else if (secondsRemaining <= TIMER_THRESHOLDS.FLASHING) {
        clockDisplay.classList.add('timer-flashing');
    }
    // Rule 2: Final threshold continuous red (<= 59 seconds in prod, <= 5 seconds in test mode)
    else if (secondsRemaining <= TIMER_THRESHOLDS.FINAL_RED) {
        clockDisplay.classList.add('timer-warning');
    }
    // Rule 1: Exact 5-minute boundaries (every 300s in prod, every 5s in test mode)
    else if (secondsRemaining % TIMER_THRESHOLDS.FIVE_MIN_INTERVAL === 0) {
        clockDisplay.classList.add('timer-warning');
    }
}

function startClockCountdown() { 
    // Display initial timer string and initial visual state
    const initialMins = Math.floor(timeRemainingSeconds / 60).toString().padStart(2, '0');
    const initialSecs = (timeRemainingSeconds % 60).toString().padStart(2, '0');
    document.getElementById('clock-display').innerText = `${initialMins}:${initialSecs}`;
    updateTimerVisuals(timeRemainingSeconds);

    timerEngine = setInterval(() => { 
        if (timeRemainingSeconds <= 0) { 
            clearInterval(timerEngine); 
            updateTimerVisuals(0);
            triggerExamSubmission(); 
        } else { 
            timeRemainingSeconds--; 
            const mins = Math.floor(timeRemainingSeconds / 60).toString().padStart(2, '0'); 
            const secs = (timeRemainingSeconds % 60).toString().padStart(2, '0'); 
            document.getElementById('clock-display').innerText = `${mins}:${secs}`; 
            updateTimerVisuals(timeRemainingSeconds);
        } 
    }, 1000); 
}

function getLocalizedText(rawString, activeQuestionLanguage) { 
    if (!rawString) return ""; 
    const parts = rawString.split('/'); 
    if (parts.length < 2) return rawString.trim(); 
    return activeQuestionLanguage === "EN" ? parts[0].trim() : parts[1].trim(); 
}

function toggleViewLanguage() { 
    const selectedLang = document.getElementById('view-lang-select').value;
    questionLanguages[activeIndex] = selectedLang; 
    renderExamWindow(); 
}

function renderExamWindow() { 
    if (examDataMatrix.length === 0) return; 
    const currentItem = examDataMatrix[activeIndex]; 
    const activeQuestionLanguage = questionLanguages[activeIndex] || defaultLanguage;
    document.getElementById('view-lang-select').value = activeQuestionLanguage;
    
    document.getElementById('question-number-title').innerText = `Question No. ${activeIndex + 1}`; 
    const shiftLabel = document.getElementById('shift-label-view');

    if (isReviewModeActive) {
        let meta = [];
        if (paperMeta.exam) meta.push(paperMeta.exam);
        if (paperMeta.notification) meta.push(`${paperMeta.notification}`);
        if (paperMeta.type) meta.push(paperMeta.type);
        if (currentItem.shift) meta.push(currentItem.shift);
        shiftLabel.innerText = meta.join(" | ");
    } else {
        shiftLabel.innerText = "";
    } 

    let questionText;
    if (typeof currentItem.textBn !== "undefined") {
        questionText =
            activeQuestionLanguage === "EN"
                ? currentItem.text
                : currentItem.textBn;
    } else {
        questionText = getLocalizedText(currentItem.text, activeQuestionLanguage);
    }
    
    const questionContainer = document.getElementById("target-question-text");
    questionContainer.innerHTML = '';

    const qTextDiv = document.createElement("div");
    qTextDiv.className = "question-text";
    qTextDiv.textContent = questionText;
    questionContainer.appendChild(qTextDiv);

    if (currentItem.equation) {
        const eqDiv = document.createElement("div");
        eqDiv.className = "question-common";
        eqDiv.textContent = currentItem.equation;
        questionContainer.appendChild(eqDiv);
    }

    // Trigger KaTeX rendering across the complete question container (text + equation)
    renderKatexInElement(questionContainer);
                
    const container = document.getElementById('target-options-container'); 
    const feedbackContainer = document.getElementById('review-feedback-container'); 
    container.innerHTML = ''; 
    feedbackContainer.innerHTML = ''; 
    
    const optArray =
        activeQuestionLanguage === "EN"
            ? [
                currentItem.a,
                currentItem.b,
                currentItem.c,
                currentItem.d
            ]
            : [
                currentItem.aBn,
                currentItem.bBn,
                currentItem.cBn,
                currentItem.dBn
            ];
    const userChoice = selectedAnswers[activeIndex]; 
    const correctChoice = currentItem.correct; 

    optArray.forEach((opt, idx) => { 
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

        const localizedOption = getLocalizedText(opt, activeQuestionLanguage); 

        const optRow = document.createElement("div");
        optRow.className = `option-row ${statusClass}`;
        if (!isReviewModeActive) {
            optRow.onclick = () => selectOptionIndex(idx);
        }

        const optInput = document.createElement("input");
        optInput.type = "radio";
        optInput.name = "tcs-opt";
        optInput.id = `opt-${idx}`;
        if (isCheckedAttr) optInput.checked = true;
        if (isReviewModeActive) optInput.disabled = true;

        const optLabel = document.createElement("label");
        optLabel.style.cursor = isReviewModeActive ? 'default' : 'pointer';
        optLabel.style.width = "100%";
        optLabel.style.fontWeight = "600";
        optLabel.htmlFor = `opt-${idx}`;
        optLabel.textContent = `(${String.fromCharCode(65 + idx)}) ${localizedOption}`;

        optRow.appendChild(optInput);
        optRow.appendChild(optLabel);
        container.appendChild(optRow);
    }); 
    renderKatexInElement(container);

    if (isReviewModeActive) { 
        const correctOptionText = getLocalizedText(optArray[correctChoice], activeQuestionLanguage);

        if (userChoice === null) {
            const statusBox = document.createElement("div");
            statusBox.className = "review-status-box";

            const card = document.createElement("div");
            card.className = "review-card pink compact";

            const cardTitle = document.createElement("div");
            cardTitle.className = "review-card-title";
            cardTitle.textContent = "⚪ QUESTION NOT ATTEMPTED";

            const ansInline = document.createElement("div");
            ansInline.className = "review-answer-inline";
            ansInline.textContent = `✅ CORRECT ANSWER :- (${String.fromCharCode(65 + correctChoice)}) ${correctOptionText}`;

            card.appendChild(cardTitle);
            card.appendChild(ansInline);
            statusBox.appendChild(card);
            statusBox.insertAdjacentHTML('beforeend', renderLearnModule());
            feedbackContainer.appendChild(statusBox);
        } else if (userChoice === correctChoice) {
            const userOptionText = getLocalizedText(optArray[userChoice], activeQuestionLanguage);

            const statusBox = document.createElement("div");
            statusBox.className = "review-status-box";

            const card = document.createElement("div");
            card.className = "review-card blue compact";

            const cardTitle = document.createElement("div");
            cardTitle.className = "review-card-title";
            cardTitle.textContent = "✅ YOUR SELECTED ANSWER IS CORRECT :- ";

            const ansSpan = document.createElement("span");
            ansSpan.className = "review-answer-inline";
            ansSpan.textContent = `(${String.fromCharCode(65 + userChoice)}) ${userOptionText}`;

            cardTitle.appendChild(ansSpan);
            card.appendChild(cardTitle);
            statusBox.appendChild(card);
            statusBox.insertAdjacentHTML('beforeend', renderLearnModule());
            feedbackContainer.appendChild(statusBox);
        } else {
            const userOptionText = getLocalizedText(optArray[userChoice], activeQuestionLanguage);

            const statusBox = document.createElement("div");
            statusBox.className = "review-status-box";

            const cardRed = document.createElement("div");
            cardRed.className = "review-card red compact";

            const cardTitleRed = document.createElement("div");
            cardTitleRed.className = "review-card-title";
            cardTitleRed.textContent = "❌ YOUR SELECTED ANSWER :- ";

            const ansSpanRed = document.createElement("span");
            ansSpanRed.className = "review-answer-inline";
            ansSpanRed.textContent = `(${String.fromCharCode(65 + userChoice)}) ${userOptionText}`;

            cardTitleRed.appendChild(ansSpanRed);
            cardRed.appendChild(cardTitleRed);

            const cardGreen = document.createElement("div");
            cardGreen.className = "review-card green compact";

            const cardTitleGreen = document.createElement("div");
            cardTitleGreen.className = "review-card-title";
            cardTitleGreen.textContent = "✅ CORRECT ANSWER :- ";

            const ansSpanGreen = document.createElement("span");
            ansSpanGreen.className = "review-answer-inline";
            ansSpanGreen.textContent = `(${String.fromCharCode(65 + correctChoice)}) ${correctOptionText}`;

            cardTitleGreen.appendChild(ansSpanGreen);
            cardGreen.appendChild(cardTitleGreen);

            statusBox.appendChild(cardRed);
            statusBox.appendChild(cardGreen);
            statusBox.insertAdjacentHTML('beforeend', renderLearnModule());
            feedbackContainer.appendChild(statusBox);
        }
        renderKatexInElement(feedbackContainer);
    } 
    const questionContent = document.querySelector(".question-content");

    if (questionContent) {
        questionContent.scrollTop = 0;
    }
    renderPaletteGrid(); 
} 

function selectOptionIndex(idx) { 
    if (isReviewModeActive) return; 
    selectedAnswers[activeIndex] = idx; 
    renderExamWindow(); 
} 

function clearResponse() { 
    if (isReviewModeActive) return; 
    selectedAnswers[activeIndex] = null; 
    questionStates[activeIndex] =     QUESTION_STATE.NOT_ANSWERED; 
    renderExamWindow(); 
} 

function saveAndNext() { 
    if (isReviewModeActive) { 
        if (activeIndex < examDataMatrix.length - 1) { activeIndex++; renderExamWindow(); } 
        return; 
    } 
    if (selectedAnswers[activeIndex] !== null) { 
        questionStates[activeIndex] =     QUESTION_STATE.ANSWERED; 
    } else { 
        questionStates[activeIndex] =     QUESTION_STATE.NOT_ANSWERED; 
    } 
    moveToNextOrWrap(); 
} 

function markForReview() { 
    if (isReviewModeActive) return; 
    if (selectedAnswers[activeIndex] !== null) {
        questionStates[activeIndex] = QUESTION_STATE.REVIEW;
    } else {
        questionStates[activeIndex] = QUESTION_STATE.REVIEW;
    }
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
    if (!isReviewModeActive && questionStates[activeIndex] === QUESTION_STATE.NOT_VISITED) {
        questionStates[activeIndex] = QUESTION_STATE.NOT_ANSWERED;
    }
    activeIndex = idx; 
    renderExamWindow(); 
} 

function updateQuestionStatistics() {
    let answered = 0;
    let marked = 0;
    let notVisited = 0;
    let markedAnswered = 0;
    let notAnswered = 0;

    questionStates.forEach((state, index) => {
        const hasAnswer = selectedAnswers[index] !== null;
       switch(state){

        case QUESTION_STATE.NOT_VISITED:
            notVisited++;
            break;
        
        case QUESTION_STATE.NOT_ANSWERED:
            notAnswered++;
            break;
        
        case QUESTION_STATE.ANSWERED:
            answered++;
            break;
        
        case QUESTION_STATE.REVIEW:
        
            if(hasAnswer){
                markedAnswered++;
            }else{
                marked++;
            }
        
            break;
        
        }
    });

    document.getElementById("count-answered").innerText = answered;
    document.getElementById("count-marked").innerText = marked;
    document.getElementById("count-not-visited").innerText = notVisited;
    document.getElementById("count-marked-answered").innerText = markedAnswered;
    document.getElementById("count-not-answered").innerText = notAnswered;
}

function renderPaletteGrid() { 
    const grid = document.getElementById('palette-grid-holder'); 
    grid.innerHTML = ''; 
    
    questionStates.forEach((stateValue, idx) => { 
        const isActive = idx === activeIndex; 
        let computedStateClass = `state-${stateValue}`;

        if (
            isReviewModeActive &&
            stateValue === QUESTION_STATE.ANSWERED
        ) {
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
    updateQuestionStatistics();
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
    }
    else if (paperDifficulty <= 4) {
        difficultyEmoji = "🔵";
        difficultyLabel = "Easy";
    }
    else if (paperDifficulty <= 5.5) {
        difficultyEmoji = "🟡";
        difficultyLabel = "Moderate";
    }
    else if (paperDifficulty <= 7) {
        difficultyEmoji = "🟠";
        difficultyLabel = "Hard";
    }
    else if (paperDifficulty <= 8.5) {
        difficultyEmoji = "🔴";
        difficultyLabel = "Very Hard";
    }
    else {
        difficultyEmoji = "⚫";
        difficultyLabel = "Expert";
    }
    
    const passed = finalScore >= dynamicPassMark;
    const scorePercent = (Math.max(finalScore,0) / totalQuestions) * 100;
    
    let rating = "";
    if(scorePercent>=90) rating="🥇 Outstanding";
    else if(scorePercent>=75) rating="🌟 Excellent";
    else if(scorePercent>=60) rating="👍 Good";
    else if(scorePercent>=45) rating="🙂 Average";
    else if(scorePercent>=35) rating="📘 Needs Improvement";
    else rating="📚 Practice More";

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
    document.getElementById("res-passmark").innerText =`${dynamicPassMark.toFixed(2)} / ${paperMeta.totalMarks || totalQuestions}`;
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
        <div class="learn-title">
            🦆 Learn this Concept
        </div>
        <button class="learn-btn" onclick="generateShortNote(${activeIndex})">
            Generate Short Note
        </button>
        <div id="learn-output" class="learn-placeholder">
            Click on <b>Generate Short Note</b> to receive a concise explanation of this concept.
        </div>
    </div>
    `;
}

function generateShortNote(questionIndex){
    const holder=document.getElementById("learn-output");
    holder.innerHTML=`
    <b>Loading explanation...</b><br><br>
    This placeholder will later be replaced with DuckDuckGo AI generated notes.
    `;
}

function refreshStudentProfile() {
    document.querySelectorAll(".student-name").forEach(node => {
        node.innerText = currentStudent.name;
    });
}

// Initial binding and execution
document.addEventListener("DOMContentLoaded", () => {
    const scrollPane = document.getElementById('instruction-scroll-pane');
    if (scrollPane) {
        scrollPane.addEventListener('scroll', checkInstructionScrollProgress);
    }

    refreshStudentProfile();
    initializeQuizEngine();
});

// Enable Next button immediately on mobile devices
window.addEventListener("load", () => {
    if (window.innerWidth <= 768) {
        const nextBtn = document.getElementById("instruction-next-action-btn");
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }
});