// =========================================
// ANSWER KEY BUILDER
// Conceptual Bridge Maintenance Suite
// =========================================


// =========================================
// ELEMENT REFERENCES
// =========================================

const totalQuestionsInput =
    document.getElementById("totalQuestionsInput");

const initialQuestionInput =
    document.getElementById("initialQuestionInput");

const questionRange =
    document.getElementById("questionRange");

const startSessionBtn =
    document.getElementById("startSessionBtn");

const newSessionBtn =
    document.getElementById("newSessionBtn");

const answerWorkspace =
    document.getElementById("answerWorkspace");

const currentQuestionNumber =
    document.getElementById("currentQuestionNumber");

const questionPosition =
    document.getElementById("questionPosition");

const answerButtons =
    document.querySelectorAll(".answer-btn");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const answerGrid =
    document.getElementById("answerGrid");

const progressBar =
    document.getElementById("progressBar");

const progressPercent =
    document.getElementById("progressPercent");

const consoleBox =
    document.getElementById("console");

const downloadStandardBtn =
    document.getElementById("downloadStandardBtn");

const fileCountInput =
    document.getElementById("fileCountInput");


// 1-file mode uploader container
const twoFileUploader =
    document.getElementById("twoFileUploader");

const singleTxtInput =
    document.getElementById("singleTxtInput");


// 2-file & 3-file mode uploader container
const threeFileUploader =
    document.getElementById("threeFileUploader");

const englishTxtInput =
    document.getElementById("englishTxtInput");

const bengaliTxtInput =
    document.getElementById("bengaliTxtInput");

// 3-file mode ANS KEY elements
const answerKeyUploadBox =
    document.getElementById("answerKeyUploadBox");

const answerKeyTxtInput =
    document.getElementById("answerKeyTxtInput");

const answerKeyInfoPanel =
    document.getElementById("answerKeyInfoPanel");

const displaySelectedAnswer =
    document.getElementById("displaySelectedAnswer");

const displayOriginalKeyContainer =
    document.getElementById("displayOriginalKeyContainer");

const displayOriginalAnswer =
    document.getElementById("displayOriginalAnswer");

const displayAnswerKeyValue =
    document.getElementById("displayAnswerKeyValue");


// General file status
const fileStatus =
    document.getElementById("fileStatus");


// Editor mode containers
const singleEditorMode =
    document.getElementById("singleEditorMode");

const splitEditorMode =
    document.getElementById("splitEditorMode");

const blockPosition =
    document.getElementById("blockPosition");


// Single editor
const singleEditorFileName =
    document.getElementById("singleEditorFileName");

const singleBlockEditor =
    document.getElementById("singleBlockEditor");

const singlePreviousBtn =
    document.getElementById("singlePreviousBtn");

const singleNextBtn =
    document.getElementById("singleNextBtn");

const singleEditBtn =
    document.getElementById("singleEditBtn");

const singleSaveBtn =
    document.getElementById("singleSaveBtn");


// English editor
const englishEditorFileName =
    document.getElementById("englishEditorFileName");

const englishBlockEditor =
    document.getElementById("englishBlockEditor");

const englishPreviousBtn =
    document.getElementById("englishPreviousBtn");

const englishNextBtn =
    document.getElementById("englishNextBtn");

const englishEditBtn =
    document.getElementById("englishEditBtn");

const englishSaveBtn =
    document.getElementById("englishSaveBtn");


// Bengali editor
const bengaliEditorFileName =
    document.getElementById("bengaliEditorFileName");

const bengaliBlockEditor =
    document.getElementById("bengaliBlockEditor");

const bengaliPreviousBtn =
    document.getElementById("bengaliPreviousBtn");

const bengaliNextBtn =
    document.getElementById("bengaliNextBtn");

const bengaliEditBtn =
    document.getElementById("bengaliEditBtn");

const bengaliSaveBtn =
    document.getElementById("bengaliSaveBtn");


// Progress & Output Validation elements
const progressLabelAnswered =
    document.getElementById("progressLabelAnswered");

const answeredCount =
    document.getElementById("answeredCount");

const rowReceivedAnswer =
    document.getElementById("rowReceivedAnswer");

const receivedAnswerCount =
    document.getElementById("receivedAnswerCount");

const progressLabelRemaining =
    document.getElementById("progressLabelRemaining");

const rowChangedAnswers =
    document.getElementById("rowChangedAnswers");

const changedAnswersCount =
    document.getElementById("changedAnswersCount");

const labelRequiredAnswers =
    document.getElementById("labelRequiredAnswers");

const labelSelectedAnswers =
    document.getElementById("labelSelectedAnswers");

const labelMissingAnswers =
    document.getElementById("labelMissingAnswers");


// Builder Mode Elements
const gacaModeBtn =
    document.getElementById("gacaModeBtn");

const mathModeBtn =
    document.getElementById("mathModeBtn");

const selectedBuilderMode =
    document.getElementById("selectedBuilderMode");



// =========================================
// SESSION STATE
// =========================================

let totalQuestions = 100;
let initialQuestion = 1;
let currentIndex = 0;
let answers = [];
let sessionActive = false;

let sourceMode = 1; // 1, 2, or 3
let currentSourceBlockIndex = 0;


// Single TXT mode
let singleTxtFile = null;
let singleTxtText = "";
let singleBlocks = [];


// Bilingual mode
let englishTxtFile = null;
let bengaliTxtFile = null;
let englishTxtText = "";
let bengaliTxtText = "";
let englishBlocks = [];
let bengaliBlocks = [];


// 3-File ANS KEY mode
let answerKeyFile = null;
let answerKeyText = "";
let answerKeyEntries = []; // [{ option: "A", value: "..." }]
let reviewed = [];          // boolean[]
let changed = [];           // boolean[]


// Edit state
let activeEditSide = null; // null | "single" | "english" | "bengali"
let singleFileModified = false;
let englishFileModified = false;
let bengaliFileModified = false;
let builderMode = "gaca";



// =========================================
// EVENT LISTENERS
// =========================================

totalQuestionsInput.addEventListener("input", updateSessionPreview);
initialQuestionInput.addEventListener("input", updateSessionPreview);

startSessionBtn.addEventListener("click", startAnswerSession);

previousBtn.addEventListener("click", previousQuestion);
nextBtn.addEventListener("click", nextQuestion);

answerButtons.forEach(button => {
    button.addEventListener("click", function() {
        selectAnswer(this.dataset.answer);
    });
});

newSessionBtn.addEventListener("click", startNewSession);
downloadStandardBtn.addEventListener("click", downloadStandardFile);
fileCountInput.addEventListener("change", handleSourceModeChange);

// File uploads
singleTxtInput.addEventListener("change", loadSingleTxt);
englishTxtInput.addEventListener("change", loadEnglishTxt);
bengaliTxtInput.addEventListener("change", loadBengaliTxt);
answerKeyTxtInput.addEventListener("change", loadAnswerKeyTxt);

// Source Navigation
singlePreviousBtn.addEventListener("click", goToPreviousSourceBlock);
singleNextBtn.addEventListener("click", goToNextSourceBlock);

englishPreviousBtn.addEventListener("click", goToPreviousSourceBlock);
englishNextBtn.addEventListener("click", goToNextSourceBlock);

bengaliPreviousBtn.addEventListener("click", goToPreviousSourceBlock);
bengaliNextBtn.addEventListener("click", goToNextSourceBlock);

// Edit / Save
singleEditBtn.addEventListener("click", () => beginBlockEdit("single"));
singleSaveBtn.addEventListener("click", () => saveBlockEdit("single"));

englishEditBtn.addEventListener("click", () => beginBlockEdit("english"));
englishSaveBtn.addEventListener("click", () => saveBlockEdit("english"));

bengaliEditBtn.addEventListener("click", () => beginBlockEdit("bengali"));
bengaliSaveBtn.addEventListener("click", () => saveBlockEdit("bengali"));

gacaModeBtn.addEventListener("click", () => setBuilderMode("gaca"));
mathModeBtn.addEventListener("click", () => setBuilderMode("math"));



// =========================================
// BUILDER MODE
// =========================================

function setBuilderMode(mode) {
    if (sessionActive) {
        alert("Start a New Session before changing the Answer Key Builder mode.");
        return;
    }

    builderMode = mode === "math" ? "math" : "gaca";

    gacaModeBtn.classList.toggle("active", builderMode === "gaca");
    mathModeBtn.classList.toggle("active", builderMode === "math");

    selectedBuilderMode.textContent = builderMode === "math" ? "MATH" : "GACA";

    if (builderMode === "math") {
        fileCountInput.value = "1";
        fileCountInput.disabled = true;
        handleSourceModeChange();
        fileStatus.textContent = "Math Mode: Select one TXT file. Question blocks are detected from QEN|.";
    } else {
        fileCountInput.disabled = false;
        handleSourceModeChange();
        fileStatus.textContent = "GACA Mode: Existing Answer Key Builder workflow.";
    }

    // Clear old data
    singleTxtInput.value = "";
    englishTxtInput.value = "";
    bengaliTxtInput.value = "";
    answerKeyTxtInput.value = "";

    singleTxtFile = null;
    singleTxtText = "";
    singleBlocks = [];

    englishTxtFile = null;
    englishTxtText = "";
    englishBlocks = [];

    bengaliTxtFile = null;
    bengaliTxtText = "";
    bengaliBlocks = [];

    answerKeyFile = null;
    answerKeyText = "";
    answerKeyEntries = [];

    currentSourceBlockIndex = 0;

    singleEditorFileName.textContent = "No file selected";
    englishEditorFileName.textContent = "No file selected";
    bengaliEditorFileName.textContent = "No file selected";

    renderSourceBlock();
}


// =========================================
// INITIAL PAGE SETUP
// =========================================

updateSessionPreview();
updateProgress();


// =========================================
// SESSION PREVIEW
// =========================================

function updateSessionPreview() {
    let total = parseInt(totalQuestionsInput.value, 10);
    let initial = parseInt(initialQuestionInput.value, 10);

    if (!Number.isInteger(total) || total < 1) {
        total = 1;
    }

    if (!Number.isInteger(initial) || initial < 1) {
        initial = 1;
    }

    const finalQuestion = initial + total - 1;
    questionRange.textContent = `${initial} – ${finalQuestion}`;

    if (!sessionActive) {
        document.getElementById("progressTotalQuestions").textContent = total;
        document.getElementById("remainingCount").textContent = total;
        document.getElementById("requiredAnswers").textContent = total;
        document.getElementById("missingAnswers").textContent = total;
    }
}


// =========================================
// START ANSWER SESSION
// =========================================

function startAnswerSession() {
    const total = parseInt(totalQuestionsInput.value, 10);
    const initial = parseInt(initialQuestionInput.value, 10);

    if (!Number.isInteger(total) || total < 1) {
        alert("Total Questions must be a positive whole number.");
        totalQuestionsInput.focus();
        return;
    }

    if (!Number.isInteger(initial) || initial < 1) {
        alert("Initial Question No. must be a positive whole number.");
        initialQuestionInput.focus();
        return;
    }

    // 3-File Mode Strict Pre-Flight Validation
    if (builderMode === "gaca" && sourceMode === 3) {
        if (!englishTxtFile || !bengaliTxtFile || !answerKeyFile) {
            alert("Please upload English TXT, Bengali TXT, and ANS KEY TXT files before starting.");
            return;
        }

        const engCount = englishBlocks.length;
        const benCount = bengaliBlocks.length;
        const ansCount = answerKeyEntries.length;

        if (engCount === 0 || benCount === 0 || ansCount === 0) {
            alert("One or more files have no valid entries or question blocks.");
            return;
        }

        if (engCount !== benCount || benCount !== ansCount || total !== ansCount) {
            alert(
                `Source Count Mismatch:\n` +
                `Total Questions: ${total}\n` +
                `English Blocks: ${engCount}\n` +
                `Bengali Blocks: ${benCount}\n` +
                `ANS KEY Entries: ${ansCount}\n\n` +
                `All four counts must match exactly.`
            );
            return;
        }
    }

    totalQuestions = total;
    initialQuestion = initial;
    currentIndex = 0;

    // Initialize Answer State
    if (builderMode === "gaca" && sourceMode === 3) {
        answers = answerKeyEntries.map(entry => entry.option);
        reviewed = new Array(totalQuestions).fill(false);
        changed = new Array(totalQuestions).fill(false);
    } else {
        answers = new Array(totalQuestions).fill(null);
    }

    sessionActive = true;

    // Lock configuration
    totalQuestionsInput.disabled = true;
    initialQuestionInput.disabled = true;
    fileCountInput.disabled = true;
    startSessionBtn.disabled = true;

    // Enable workspace
    answerWorkspace.classList.remove("disabled-workspace");
    answerButtons.forEach(button => {
        button.disabled = false;
    });

    newSessionBtn.disabled = false;
    consoleBox.textContent = "";

    log("Answer session started.");
    log(`Total Questions: ${totalQuestions}`);
    log(`Initial Question No.: ${initialQuestion}`);
    log(`Question Range: ${initialQuestion} – ${initialQuestion + totalQuestions - 1}`);

    if (builderMode === "gaca" && sourceMode === 3) {
        log(`ANS KEY loaded: ${answerKeyFile.name}`);
        log(`Answer Key entries found: ${answerKeyEntries.length}`);
        log(`English blocks found: ${englishBlocks.length}`);
        log(`Bengali blocks found: ${bengaliBlocks.length}`);
        log("All three sources aligned.");
        log(`Question 1 answer loaded: ${answers[0]}`);
    }

    renderAnswerGrid();
    showCurrentQuestion();
    updateProgress();
    validateOutput();
}


// =========================================
// SHOW CURRENT QUESTION
// =========================================

function showCurrentQuestion() {
    if (!sessionActive) return;

    const displayedQuestion = initialQuestion + currentIndex;
    currentQuestionNumber.textContent = displayedQuestion;
    questionPosition.textContent = `${currentIndex + 1} of ${totalQuestions}`;

    document.getElementById("progressCurrentQuestion").textContent = displayedQuestion;

    // Navigation buttons (Disabled if active editing)
    if (activeEditSide !== null) {
        previousBtn.disabled = true;
        nextBtn.disabled = true;
    } else {
        previousBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalQuestions - 1;
    }

    // Show selected answer button
    answerButtons.forEach(button => {
        button.classList.remove("selected");
        if (answers[currentIndex] === button.dataset.answer) {
            button.classList.add("selected");
        }
    });

    // 3-File Mode Specific Metadata Display
    if (builderMode === "gaca" && sourceMode === 3 && answerKeyEntries[currentIndex]) {
        answerKeyInfoPanel.classList.remove("hidden");
        const currentAns = answers[currentIndex] || "–";
        const origAns = answerKeyEntries[currentIndex].option;
        const origVal = answerKeyEntries[currentIndex].value;

        displaySelectedAnswer.textContent = currentAns;
        displayAnswerKeyValue.textContent = origVal || "(No value text)";

        if (changed[currentIndex]) {
            displayOriginalKeyContainer.classList.remove("hidden");
            displayOriginalAnswer.textContent = origAns;
        } else {
            displayOriginalKeyContainer.classList.add("hidden");
        }
    } else {
        answerKeyInfoPanel.classList.add("hidden");
    }

    updateCurrentGridItem();
}


// =========================================
// SELECT ANSWER
// =========================================

function selectAnswer(answer) {
    if (!sessionActive || activeEditSide !== null) {
        return;
    }

    const answeredIndex = currentIndex;
    const oldAnswer = answers[answeredIndex];
    answers[answeredIndex] = answer;

    // In 3-file mode, check if answer was modified from original ANS KEY
    // Note: Selecting an answer does NOT mark the question as reviewed
    if (builderMode === "gaca" && sourceMode === 3 && answerKeyEntries[answeredIndex]) {
        const origOption = answerKeyEntries[answeredIndex].option;
        changed[answeredIndex] = (answer !== origOption);

        if (oldAnswer !== answer) {
            log(`Question ${initialQuestion + answeredIndex} answer changed: ${oldAnswer || origOption} → ${answer}`);
        } else {
            log(`Question ${initialQuestion + answeredIndex} answered: ${answer}`);
        }

        updateGridItem(answeredIndex);
        updateProgress();
        validateOutput();
        showCurrentQuestion();
    } else {
        log(`Question ${initialQuestion + answeredIndex} answered: ${answer}`);
        updateGridItem(answeredIndex);
        updateProgress();
        validateOutput();

        // Auto-advance for Mode 1 & Mode 2
        if (answeredIndex < totalQuestions - 1) {
            const nextIndex = answeredIndex + 1;
            const sourceTotal = getSourceBlockCount();

            if (sourceTotal === 0 || nextIndex < sourceTotal) {
                goToQuestionBlock(nextIndex);
            } else {
                currentIndex = nextIndex;
                showCurrentQuestion();
            }
        } else {
            showCurrentQuestion();
        }
    }
}


// =========================================
// PREVIOUS QUESTION
// =========================================

function previousQuestion() {
    if (!sessionActive || activeEditSide !== null || currentIndex <= 0) {
        return;
    }
    goToQuestionBlock(currentIndex - 1);
}


// =========================================
// NEXT QUESTION
// =========================================

function nextQuestion() {
    if (!sessionActive || activeEditSide !== null) {
        return;
    }

    // 3-File Mode: nextQuestion() is the single authoritative action that marks review complete
    if (builderMode === "gaca" && sourceMode === 3) {
        if (!reviewed[currentIndex]) {
            reviewed[currentIndex] = true;
            log(`Question ${initialQuestion + currentIndex} reviewed.`);
            updateProgress();
            validateOutput();
        }
    }

    if (currentIndex >= totalQuestions - 1) {
        return;
    }

    goToQuestionBlock(currentIndex + 1);
}


// =========================================
// ANSWER GRID
// =========================================

function renderAnswerGrid() {
    answerGrid.innerHTML = "";

    for (let i = 0; i < totalQuestions; i++) {
        const item = document.createElement("div");
        item.className = "answer-grid-item";
        item.dataset.index = i;

        const displayedQuestion = initialQuestion + i;
        item.innerHTML = `
            <span class="grid-question">${displayedQuestion}</span>
            <span class="grid-answer">${answers[i] || "–"}</span>
        `;

        if (answers[i]) {
            item.classList.add("answered");
        }

        if (builderMode === "gaca" && sourceMode === 3 && changed[i]) {
            item.classList.add("changed");
        }

        if (i === currentIndex) {
            item.classList.add("current");
        }

        item.addEventListener("click", function() {
            if (activeEditSide !== null) {
                alert("Please save your edits before switching question blocks.");
                return;
            }
            const selectedIndex = Number(this.dataset.index);
            goToQuestionBlock(selectedIndex);
        });

        answerGrid.appendChild(item);
    }
}


// =========================================
// UPDATE ONE GRID ITEM
// =========================================

function updateGridItem(index) {
    const item = answerGrid.querySelector(`[data-index="${index}"]`);
    if (!item) return;

    const answerDisplay = item.querySelector(".grid-answer");
    answerDisplay.textContent = answers[index] || "–";

    if (answers[index]) {
        item.classList.add("answered");
    } else {
        item.classList.remove("answered");
    }

    if (builderMode === "gaca" && sourceMode === 3) {
        if (changed[index]) {
            item.classList.add("changed");
        } else {
            item.classList.remove("changed");
        }
    }
}


// =========================================
// UPDATE CURRENT GRID HIGHLIGHT
// =========================================

function updateCurrentGridItem() {
    const items = answerGrid.querySelectorAll(".answer-grid-item");
    items.forEach(item => item.classList.remove("current"));

    const currentItem = answerGrid.querySelector(`[data-index="${currentIndex}"]`);
    if (currentItem) {
        currentItem.classList.add("current");
    }
}


// =========================================
// UPDATE PROGRESS
// =========================================

function updateProgress() {
    const isThreeFileGACA = (builderMode === "gaca" && sourceMode === 3);

    let progressCount = 0;
    let remaining = 0;
    let percentage = 0;

    if (isThreeFileGACA) {
        progressLabelAnswered.textContent = "Answer Reviewed";
        progressLabelRemaining.textContent = "Remaining Review";
        rowReceivedAnswer.classList.remove("hidden");
        receivedAnswerCount.textContent = answerKeyEntries.length;

        // Progress derived strictly from reviewed[] array
        progressCount = reviewed.filter(r => r === true).length;
        remaining = totalQuestions - progressCount;
        percentage = sessionActive && totalQuestions > 0 ? Math.round((progressCount / totalQuestions) * 100) : 0;

        answeredCount.textContent = progressCount;
        document.getElementById("remainingCount").textContent = remaining;
    } else {
        progressLabelAnswered.textContent = "Answered";
        progressLabelRemaining.textContent = "Remaining";
        rowReceivedAnswer.classList.add("hidden");

        progressCount = answers.filter(answer => answer !== null).length;
        remaining = sessionActive ? totalQuestions - progressCount : parseInt(totalQuestionsInput.value, 10) || 100;
        percentage = sessionActive && totalQuestions > 0 ? Math.round((progressCount / totalQuestions) * 100) : 0;

        answeredCount.textContent = progressCount;
        document.getElementById("remainingCount").textContent = remaining;
    }

    document.getElementById("progressTotalQuestions").textContent =
        sessionActive ? totalQuestions : totalQuestionsInput.value;

    progressBar.style.width = `${percentage}%`;
    progressPercent.textContent = `${percentage}%`;

    // Status label logic
    let statusText;
    if (!sessionActive) {
        statusText = "0% — NOT STARTED";
    } else if (progressCount === 0) {
        statusText = "0% — NOT STARTED";
    } else if (progressCount === totalQuestions) {
        statusText = isThreeFileGACA ? "100% — REVIEW COMPLETED" : "100% — COMPLETED";
    } else {
        statusText = isThreeFileGACA ? `${percentage}% — IN REVIEW` : `${percentage}% — IN PROGRESS`;
    }

    document.getElementById("progressStatus").textContent = statusText;
}


// =========================================
// OUTPUT VALIDATION
// =========================================

function validateOutput() {
    if (!sessionActive) return false;

    const isThreeFileGACA = (builderMode === "gaca" && sourceMode === 3);
    const selectedAnswers = answers.filter(answer => ["A", "B", "C", "D"].includes(answer));
    const selectedCount = selectedAnswers.length;
    const missingCount = totalQuestions - selectedCount;
    const standardEntries = selectedCount;

    if (isThreeFileGACA) {
        labelRequiredAnswers.textContent = "Required Reviews";
        labelSelectedAnswers.textContent = "Questions Reviewed";
        labelMissingAnswers.textContent = "Remaining Reviews";

        rowChangedAnswers.classList.remove("hidden");
        const numChanged = changed.filter(c => c === true).length;
        changedAnswersCount.textContent = numChanged;

        const reviewedCount = reviewed.filter(r => r === true).length;
        document.getElementById("requiredAnswers").textContent = totalQuestions;
        document.getElementById("selectedAnswers").textContent = reviewedCount;
        document.getElementById("missingAnswers").textContent = totalQuestions - reviewedCount;
        document.getElementById("ansoptEntries").textContent = standardEntries;

        const valid = (
            reviewedCount === totalQuestions &&
            selectedCount === totalQuestions &&
            activeEditSide === null &&
            answers.every(a => ["A", "B", "C", "D"].includes(a))
        );

        if (valid) {
            document.getElementById("validationStatus").textContent = "PASSED";
            downloadStandardBtn.disabled = false;
            logCompletionOnce();
        } else {
            document.getElementById("validationStatus").textContent = "NOT READY";
            downloadStandardBtn.disabled = true;
        }

        return valid;
    } else {
        labelRequiredAnswers.textContent = "Required Answers";
        labelSelectedAnswers.textContent = "Answers Selected";
        labelMissingAnswers.textContent = "Missing Answers";
        rowChangedAnswers.classList.add("hidden");

        document.getElementById("requiredAnswers").textContent = totalQuestions;
        document.getElementById("selectedAnswers").textContent = selectedCount;
        document.getElementById("missingAnswers").textContent = missingCount;
        document.getElementById("ansoptEntries").textContent = standardEntries;

        const valid = (
            selectedCount === totalQuestions &&
            standardEntries === totalQuestions &&
            activeEditSide === null &&
            answers.every(a => ["A", "B", "C", "D"].includes(a))
        );

        if (valid) {
            document.getElementById("validationStatus").textContent = "PASSED";
            downloadStandardBtn.disabled = false;
            logCompletionOnce();
        } else {
            document.getElementById("validationStatus").textContent = "NOT READY";
            downloadStandardBtn.disabled = true;
        }

        return valid;
    }
}


// =========================================
// COMPLETION LOG
// =========================================

let completionLogged = false;

function logCompletionOnce() {
    if (completionLogged) return;
    completionLogged = true;

    if (builderMode === "gaca" && sourceMode === 3) {
        log("All questions reviewed and validated.");
        log("Output Validation: PASSED");
        log(`Ansopt Entries: ${totalQuestions}`);
        log("Ansopt.txt is ready for download.");
    } else {
        log("All required answers completed.");
        log("Output Validation: PASSED");
        log(`Ansopt Entries: ${totalQuestions}`);
        log("Ansopt.txt is ready for download.");
    }

    requestAnimationFrame(() => {
        const gridSection = document.getElementById("answerGridSection");
        if (gridSection) {
            gridSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
}


// =========================================
// STANDARD OUTPUT (Ansopt1.txt)
// =========================================

function createStandardOutput() {
    return answers.join("\n\n") + "\n\n";
}


// =========================================
// CREATE NUMBERED ANSWER OUTPUT (Ansopt.txt)
// =========================================

function createNumberedOutput() {
    const outputLines = [];
    for (let i = 0; i < totalQuestions; i++) {
        const questionNumber = i + 1;
        const answer = answers[i];
        if (answer) {
            outputLines.push(`Q${questionNumber} ${answer}`);
        }
    }
    return outputLines.join("\n\n");
}


// =========================================
// DOWNLOAD STANDARD FILE
// =========================================

function downloadStandardFile() {
    if (!validateOutput()) {
        return;
    }

    const standardContent = createStandardOutput();
    downloadTextFile(standardContent, "Ansopt1.txt");

    const numberedContent = createNumberedOutput();
    let currentDelay = 300;

    setTimeout(() => {
        downloadTextFile(numberedContent, "Ansopt.txt");
    }, currentDelay);

    // Download edited sources if modified
    if (sourceMode === 1) {
        if (singleFileModified && singleTxtFile) {
            currentDelay += 300;
            setTimeout(() => {
                downloadTextFile(singleTxtText, singleTxtFile.name);
            }, currentDelay);
            log(`Edited source file downloaded: ${singleTxtFile.name}`);
        }
    } else {
        if (englishFileModified && englishTxtFile) {
            currentDelay += 300;
            setTimeout(() => {
                downloadTextFile(englishTxtText, englishTxtFile.name);
            }, currentDelay);
            log(`Edited English file downloaded: ${englishTxtFile.name}`);
        }

        if (bengaliFileModified && bengaliTxtFile) {
            currentDelay += 300;
            setTimeout(() => {
                downloadTextFile(bengaliTxtText, bengaliTxtFile.name);
            }, currentDelay);
            log(`Edited Bengali file downloaded: ${bengaliTxtFile.name}`);
        }
    }

    log("Ansopt1.txt and Ansopt.txt downloaded.");
}


// =========================================
// GENERIC TXT DOWNLOAD
// =========================================

function downloadTextFile(content, fileName) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


// =========================================
// NEW SESSION
// =========================================

function startNewSession() {
    if (!sessionActive) return;

    const answered = answers.filter(a => a !== null).length;
    let message = "Start a new answer session?";
    if (answered > 0) {
        message += "\n\nCurrent answers and review state will be reset.";
    }

    const confirmed = window.confirm(message);
    if (!confirmed) return;

    sessionActive = false;
    totalQuestions = 100;
    initialQuestion = 1;
    currentIndex = 0;
    answers = [];
    reviewed = [];
    changed = [];
    completionLogged = false;
    singleFileModified = false;
    englishFileModified = false;
    bengaliFileModified = false;

    totalQuestionsInput.disabled = false;
    initialQuestionInput.disabled = false;
    fileCountInput.disabled = builderMode === "math";

    totalQuestionsInput.value = 100;
    initialQuestionInput.value = 1;

    startSessionBtn.disabled = false;
    newSessionBtn.disabled = true;

    answerWorkspace.classList.add("disabled-workspace");
    answerButtons.forEach(button => {
        button.disabled = true;
        button.classList.remove("selected");
    });

    previousBtn.disabled = true;
    nextBtn.disabled = true;

    currentQuestionNumber.textContent = "--";
    questionPosition.textContent = "-- of --";
    document.getElementById("progressCurrentQuestion").textContent = "--";

    answerGrid.innerHTML = `
        <div class="empty-grid-message">
            Start an answer session to display the question grid.
        </div>
    `;

    document.getElementById("ansoptEntries").textContent = "0";
    document.getElementById("validationStatus").textContent = "NOT READY";
    downloadStandardBtn.disabled = true;
    consoleBox.textContent = "Waiting for answer session...";

    answerKeyInfoPanel.classList.add("hidden");

    updateSessionPreview();
    updateProgress();
}


// =========================================
// LOGGER
// =========================================

function log(message) {
    if (consoleBox.textContent.trim() === "Waiting for answer session...") {
        consoleBox.textContent = "";
    }
    consoleBox.textContent += message + "\n";
    consoleBox.scrollTop = consoleBox.scrollHeight;
}


// =========================================
// SOURCE MODE
// =========================================

function handleSourceModeChange() {
    if (activeEditSide !== null) {
        alert("Save the currently edited question block before changing file mode.");
        fileCountInput.value = String(sourceMode);
        return;
    }

    sourceMode = Number(fileCountInput.value);
    currentSourceBlockIndex = 0;

    // Mode 1: Single Question TXT
    if (sourceMode === 1) {
        twoFileUploader.classList.remove("hidden");
        threeFileUploader.classList.add("hidden");
        answerKeyUploadBox.classList.add("hidden");

        singleEditorMode.classList.remove("hidden");
        splitEditorMode.classList.add("hidden");

        fileStatus.textContent = "Single TXT mode: Select one question TXT file.";
    } 
    // Mode 2: 2 Files (English + Bengali)
    else if (sourceMode === 2) {
        twoFileUploader.classList.add("hidden");
        threeFileUploader.classList.remove("hidden");
        answerKeyUploadBox.classList.add("hidden");

        singleEditorMode.classList.add("hidden");
        splitEditorMode.classList.remove("hidden");

        fileStatus.textContent = "Bilingual TXT mode: Select matching E.txt and B.txt files.";
    } 
    // Mode 3: 3 Files (English + Bengali + ANS KEY)
    else if (sourceMode === 3) {
        twoFileUploader.classList.add("hidden");
        threeFileUploader.classList.remove("hidden");
        answerKeyUploadBox.classList.remove("hidden");

        singleEditorMode.classList.add("hidden");
        splitEditorMode.classList.remove("hidden");

        fileStatus.textContent = "3-File Mode: Select matching E.txt, B.txt, and ANS KEY TXT files.";
    }

    renderSourceBlock();
}


// =========================================
// QUESTION BLOCK PARSER
// =========================================

function parseSourceBlocks(text, displayMode) {
    const normalized = text.replace(/\r\n/g, "\n");
    const lines = normalized.split("\n");
    const blocks = [];
    let currentLines = [];
    let startLine = null;

    const questionStartMarker = builderMode === "math" ? "QEN|" : "Q|";

    function pushCurrentBlock() {
        if (currentLines.length === 0) return;

        const completeBlock = currentLines.join("\n");
        let displayText = completeBlock;

        if (displayMode === "QUESTION_OPTIONS_ONLY") {
            displayText = currentLines
                .filter(line => {
                    const trimmed = line.trimStart();
                    return (
                        trimmed.startsWith("Q|") ||
                        trimmed.startsWith("A|") ||
                        trimmed.startsWith("B|") ||
                        trimmed.startsWith("C|") ||
                        trimmed.startsWith("D|")
                    );
                })
                .join("\n");
        }

        blocks.push({
            index: blocks.length,
            startLine: startLine,
            originalText: completeBlock,
            displayText: displayText
        });

        currentLines = [];
        startLine = null;
    }

    lines.forEach((line, index) => {
        const trimmed = line.trimStart();

        if (trimmed.startsWith(questionStartMarker)) {
            pushCurrentBlock();
            startLine = index + 1;
            currentLines.push(line);
            return;
        }

        if (currentLines.length === 0) return;
        currentLines.push(line);
    });

    pushCurrentBlock();
    return blocks;
}


// =========================================
// ANS KEY PARSER (Dedicated 3-File Mode)
// =========================================

function parseAnswerKeyText(text) {
    const normalized = text.replace(/\r\n/g, "\n");
    const lines = normalized.split("\n");
    const entries = [];
    let hasError = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === "") continue; // ignore completely blank lines

        const match = line.match(/^([ABCD])\|(.*)$/i);
        if (match) {
            entries.push({
                option: match[1].toUpperCase(),
                value: match[2].trim()
            });
        } else {
            hasError = true;
            alert(`Malformed line found in ANS KEY file at line ${i + 1}:\n"${lines[i]}"\n\nExpected format: A| Value, B| Value, etc.`);
            break;
        }
    }

    if (hasError) return null;
    return entries;
}


// =========================================
// LOAD SINGLE TXT
// =========================================

async function loadSingleTxt() {
    const file = singleTxtInput.files[0];
    if (!file) {
        singleTxtFile = null;
        singleTxtText = "";
        singleBlocks = [];
        renderSourceBlock();
        return;
    }

    try {
        singleTxtFile = file;
        singleTxtText = await file.text();
        singleBlocks = parseSourceBlocks(singleTxtText, "FULL_BLOCK");
        currentSourceBlockIndex = 0;

        singleEditorFileName.textContent = file.name;
        fileStatus.textContent = `${file.name} loaded — ${singleBlocks.length} question blocks found.`;

        renderSourceBlock();
        log(`Question TXT loaded: ${file.name}`);
        log(`Question blocks found: ${singleBlocks.length}`);
    } catch (error) {
        console.error(error);
        fileStatus.textContent = "Unable to read the selected TXT file.";
    }
}


// =========================================
// LOAD ENGLISH TXT
// =========================================

async function loadEnglishTxt() {
    const file = englishTxtInput.files[0];
    if (!file) {
        englishTxtFile = null;
        englishBlocks = [];
        renderSourceBlock();
        return;
    }

    if (!/E\.txt$/i.test(file.name)) {
        alert("English TXT filename must end with E.txt.\nExample: 100E.txt");
        englishTxtInput.value = "";
        return;
    }

    englishTxtFile = file;
    englishTxtText = await file.text();
    englishBlocks = parseSourceBlocks(englishTxtText, "QUESTION_OPTIONS_ONLY");
    currentSourceBlockIndex = 0;

    englishEditorFileName.textContent = file.name;
    updateBilingualFileStatus();
    renderSourceBlock();
}


// =========================================
// LOAD BENGALI TXT
// =========================================

async function loadBengaliTxt() {
    const file = bengaliTxtInput.files[0];
    if (!file) {
        bengaliTxtFile = null;
        bengaliBlocks = [];
        renderSourceBlock();
        return;
    }

    if (!/B\.txt$/i.test(file.name)) {
        alert("Bengali TXT filename must end with B.txt.\nExample: 100B.txt");
        bengaliTxtInput.value = "";
        return;
    }

    bengaliTxtFile = file;
    bengaliTxtText = await file.text();
    bengaliBlocks = parseSourceBlocks(bengaliTxtText, "QUESTION_OPTIONS_ONLY");
    currentSourceBlockIndex = 0;

    bengaliEditorFileName.textContent = file.name;
    updateBilingualFileStatus();
    renderSourceBlock();
}


// =========================================
// LOAD ANS KEY TXT (3-File Mode)
// =========================================

async function loadAnswerKeyTxt() {
    const file = answerKeyTxtInput.files[0];
    if (!file) {
        answerKeyFile = null;
        answerKeyText = "";
        answerKeyEntries = [];
        updateBilingualFileStatus();
        return;
    }

    try {
        const text = await file.text();
        const parsed = parseAnswerKeyText(text);

        if (!parsed) {
            answerKeyTxtInput.value = "";
            answerKeyFile = null;
            answerKeyText = "";
            answerKeyEntries = [];
            updateBilingualFileStatus();
            return;
        }

        answerKeyFile = file;
        answerKeyText = text;
        answerKeyEntries = parsed;

        log(`ANS KEY loaded: ${file.name}`);
        log(`Answer Key entries found: ${answerKeyEntries.length}`);

        updateBilingualFileStatus();
    } catch (err) {
        console.error(err);
        alert("Error loading ANS KEY TXT file.");
    }
}


function updateBilingualFileStatus() {
    if (sourceMode === 2) {
        if (!englishTxtFile || !bengaliTxtFile) {
            fileStatus.textContent = "Waiting for both English and Bengali TXT files.";
            return;
        }

        const englishBase = englishTxtFile.name.replace(/E\.txt$/i, "");
        const bengaliBase = bengaliTxtFile.name.replace(/B\.txt$/i, "");

        if (englishBase.toLowerCase() !== bengaliBase.toLowerCase()) {
            fileStatus.textContent = "⚠ English and Bengali filenames have different base IDs.";
            return;
        }

        if (englishBlocks.length !== bengaliBlocks.length) {
            fileStatus.textContent = `⚠ Block mismatch — English: ${englishBlocks.length}, Bengali: ${bengaliBlocks.length}`;
            return;
        }

        fileStatus.textContent = `✓ Bilingual files aligned — ${englishBlocks.length} blocks found in each file.`;
    } 
    else if (sourceMode === 3) {
        if (!englishTxtFile || !bengaliTxtFile || !answerKeyFile) {
            fileStatus.textContent = "Waiting for English TXT, Bengali TXT, and ANS KEY TXT files.";
            return;
        }

        const englishBase = englishTxtFile.name.replace(/E\.txt$/i, "");
        const bengaliBase = bengaliTxtFile.name.replace(/B\.txt$/i, "");

        if (englishBase.toLowerCase() !== bengaliBase.toLowerCase()) {
            fileStatus.textContent = "⚠ English and Bengali filenames have different base IDs.";
            return;
        }

        const engCount = englishBlocks.length;
        const benCount = bengaliBlocks.length;
        const ansCount = answerKeyEntries.length;

        if (engCount !== benCount || benCount !== ansCount) {
            fileStatus.textContent = `⚠ Source count mismatch — English: ${engCount}, Bengali: ${benCount}, ANS KEY: ${ansCount}. Answer review cannot start.`;
            return;
        }

        fileStatus.textContent = `✓ English blocks: ${engCount}\n✓ Bengali blocks: ${benCount}\n✓ Answer Key entries: ${ansCount}\n✓ All three sources aligned.`;
    }
}


// =========================================
// MASTER QUESTION / BLOCK NAVIGATION
// =========================================

function goToQuestionBlock(index) {
    if (activeEditSide !== null) {
        alert("Please save your edits before switching question blocks.");
        return;
    }

    const sourceTotal = getSourceBlockCount();
    if (index < 0 || index >= totalQuestions) return;
    if (sourceTotal > 0 && index >= sourceTotal) return;

    // goToQuestionBlock strictly navigates and renders without auto-reviewing
    currentIndex = index;
    currentSourceBlockIndex = index;

    renderSourceBlock(false);
    showCurrentQuestion();
}


// =========================================
// RENDER SOURCE BLOCK
// =========================================

function renderSourceBlock(syncAnswer = true) {
    if (sourceMode === 1) {
        renderSingleSourceBlock(syncAnswer);
    } else {
        renderBilingualSourceBlock(syncAnswer);
    }
    updateSourceNavigationButtons();
}


function renderSingleSourceBlock(syncAnswer = true) {
    if (singleBlocks.length === 0) {
        singleBlockEditor.value = "";
        blockPosition.textContent = "Block -- / --";
        singleEditBtn.disabled = true;
        singleSaveBtn.disabled = true;
        return;
    }

    clampSourceBlockIndex(singleBlocks.length);
    const block = singleBlocks[currentSourceBlockIndex];

    singleBlockEditor.value = block.displayText;
    blockPosition.textContent = `Block ${currentSourceBlockIndex + 1} / ${singleBlocks.length}`;
    singleEditBtn.disabled = false;
    singleSaveBtn.disabled = true;

    if (syncAnswer && sessionActive) {
        currentIndex = currentSourceBlockIndex;
        showCurrentQuestion();
    }
}


function renderBilingualSourceBlock(syncAnswer = true) {
    const total = Math.max(englishBlocks.length, bengaliBlocks.length);
    if (total === 0) {
        englishBlockEditor.value = "";
        bengaliBlockEditor.value = "";
        blockPosition.textContent = "Block -- / --";
        englishEditBtn.disabled = true;
        bengaliEditBtn.disabled = true;
        return;
    }

    clampSourceBlockIndex(total);
    const english = englishBlocks[currentSourceBlockIndex];
    const bengali = bengaliBlocks[currentSourceBlockIndex];

    englishBlockEditor.value = english ? english.displayText : "⚠ English block missing";
    bengaliBlockEditor.value = bengali ? bengali.displayText : "⚠ Bengali block missing";

    blockPosition.textContent = `Block ${currentSourceBlockIndex + 1} / ${total}`;
    englishEditBtn.disabled = !english;
    bengaliEditBtn.disabled = !bengali;

    englishSaveBtn.disabled = true;
    bengaliSaveBtn.disabled = true;

    if (syncAnswer && sessionActive) {
        currentIndex = currentSourceBlockIndex;
        showCurrentQuestion();
    }
}


function clampSourceBlockIndex(total) {
    if (currentSourceBlockIndex < 0) currentSourceBlockIndex = 0;
    if (currentSourceBlockIndex >= total) currentSourceBlockIndex = total - 1;
}


// =========================================
// SOURCE NAVIGATION
// =========================================

function getSourceBlockCount() {
    if (sourceMode === 1) return singleBlocks.length;
    return Math.max(englishBlocks.length, bengaliBlocks.length);
}


function goToPreviousSourceBlock() {
    if (activeEditSide !== null) return;
    if (currentSourceBlockIndex <= 0) return;
    goToQuestionBlock(currentSourceBlockIndex - 1);
}


function goToNextSourceBlock() {
    if (activeEditSide !== null) return;
    const total = getSourceBlockCount();
    if (currentSourceBlockIndex >= total - 1) return;
    goToQuestionBlock(currentSourceBlockIndex + 1);
}


function updateSourceNavigationButtons() {
    const total = getSourceBlockCount();
    const locked = activeEditSide !== null;

    const previousDisabled = locked || total === 0 || currentSourceBlockIndex <= 0;
    const nextDisabled = locked || total === 0 || currentSourceBlockIndex >= total - 1;

    singlePreviousBtn.disabled = previousDisabled;
    singleNextBtn.disabled = nextDisabled;

    englishPreviousBtn.disabled = previousDisabled;
    englishNextBtn.disabled = nextDisabled;

    bengaliPreviousBtn.disabled = previousDisabled;
    bengaliNextBtn.disabled = nextDisabled;

    // Lock other global controls during active editing
    if (locked) {
        previousBtn.disabled = true;
        nextBtn.disabled = true;
        answerButtons.forEach(btn => btn.disabled = true);
    } else if (sessionActive) {
        previousBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex === totalQuestions - 1;
        answerButtons.forEach(btn => btn.disabled = false);
    }
}


// =========================================
// BEGIN EDIT
// =========================================

function beginBlockEdit(side) {
    if (activeEditSide !== null) return;

    activeEditSide = side;

    if (side === "single") {
        singleBlockEditor.readOnly = false;
        singleBlockEditor.focus();
        singleEditBtn.disabled = true;
        singleSaveBtn.disabled = false;
    } else if (side === "english") {
        englishBlockEditor.readOnly = false;
        englishBlockEditor.focus();
        englishEditBtn.disabled = true;
        englishSaveBtn.disabled = false;

        bengaliEditBtn.disabled = true;
        bengaliSaveBtn.disabled = true;
    } else if (side === "bengali") {
        bengaliBlockEditor.readOnly = false;
        bengaliBlockEditor.focus();
        bengaliEditBtn.disabled = true;
        bengaliSaveBtn.disabled = false;

        englishEditBtn.disabled = true;
        englishSaveBtn.disabled = true;
    }

    updateSourceNavigationButtons();
}


// =========================================
// SAVE EDITED BLOCK
// =========================================

function saveBlockEdit(side) {
    if (activeEditSide !== side) return;

    if (side === "single") {
        const block = singleBlocks[currentSourceBlockIndex];
        block.displayText = singleBlockEditor.value;
        block.originalText = singleBlockEditor.value;
        singleFileModified = true;
        singleBlockEditor.readOnly = true;
    } else if (side === "english") {
        const block = englishBlocks[currentSourceBlockIndex];
        const updatedVisible = englishBlockEditor.value;
        block.originalText = mergeVisibleQuestionFields(block.originalText, updatedVisible);
        englishFileModified = true;
        block.displayText = extractQuestionOptionLines(block.originalText);
        englishBlockEditor.value = block.displayText;
        englishBlockEditor.readOnly = true;
    } else if (side === "bengali") {
        const block = bengaliBlocks[currentSourceBlockIndex];
        const updatedVisible = bengaliBlockEditor.value;
        block.originalText = mergeVisibleQuestionFields(block.originalText, updatedVisible);
        bengaliFileModified = true;
        block.displayText = extractQuestionOptionLines(block.originalText);
        bengaliBlockEditor.value = block.displayText;
        bengaliBlockEditor.readOnly = true;
    }

    activeEditSide = null;
    rebuildEditedSourceTexts();
    renderSourceBlock();
    validateOutput();
}


// =========================================
// QUESTION FIELD MERGE
// =========================================

function extractQuestionOptionLines(blockText) {
    return blockText
        .split("\n")
        .filter(line => {
            const trimmed = line.trimStart();
            return (
                trimmed.startsWith("Q|") ||
                trimmed.startsWith("A|") ||
                trimmed.startsWith("B|") ||
                trimmed.startsWith("C|") ||
                trimmed.startsWith("D|")
            );
        })
        .join("\n");
}


function mergeVisibleQuestionFields(originalBlock, editedVisibleBlock) {
    const editedMap = {};

    editedVisibleBlock.split("\n").forEach(line => {
        const trimmed = line.trimStart();
        const match = trimmed.match(/^([QABCD])\|(.*)$/i);
        if (match) {
            editedMap[match[1].toUpperCase()] = `${match[1].toUpperCase()}|${match[2]}`;
        }
    });

    return originalBlock
        .split("\n")
        .map(line => {
            const trimmed = line.trimStart();
            const match = trimmed.match(/^([QABCD])\|/i);
            if (!match) return line;

            const key = match[1].toUpperCase();
            return editedMap[key] !== undefined ? editedMap[key] : line;
        })
        .join("\n");
}


function rebuildEditedSourceTexts() {
    if (sourceMode === 1) {
        singleTxtText = singleBlocks.map(block => block.originalText).join("\n\n");
        return;
    }

    englishTxtText = englishBlocks.map(block => block.originalText).join("\n\n");
    bengaliTxtText = bengaliBlocks.map(block => block.originalText).join("\n\n");
}


// Initialize source mode
handleSourceModeChange();
