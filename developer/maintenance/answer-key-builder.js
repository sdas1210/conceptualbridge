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


// 2-file mode

const twoFileUploader =
    document.getElementById("twoFileUploader");

const singleTxtInput =
    document.getElementById("singleTxtInput");

const singlePdfInput =
    document.getElementById("singlePdfInput");


// 3-file mode

const threeFileUploader =
    document.getElementById("threeFileUploader");

const englishTxtInput =
    document.getElementById("englishTxtInput");

const bengaliTxtInput =
    document.getElementById("bengaliTxtInput");

const bilingualPdfInput =
    document.getElementById("bilingualPdfInput");


// General file status

const fileStatus =
    document.getElementById("fileStatus");


// PDF

const pdfViewer =
    document.getElementById("pdfViewer");

const pdfPlaceholder =
    document.getElementById("pdfPlaceholder");

const pdfZoomInBtn =
    document.getElementById("pdfZoomInBtn");

const pdfZoomOutBtn =
    document.getElementById("pdfZoomOutBtn");

const pdfZoomResetBtn =
    document.getElementById("pdfZoomResetBtn");

const pdfZoomDisplay =
    document.getElementById("pdfZoomDisplay");


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

// =========================================
// SESSION STATE
// =========================================

let totalQuestions = 100;

let initialQuestion = 1;

let currentIndex = 0;

let answers = [];

let sessionActive = false;

let sourceMode = 2;

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


// PDF

let currentPdfUrl = null;

let pdfZoom = 1;


// Edit state

let activeEditSide = null;

/*
    null
    "single"
    "english"
    "bengali"
*/
// =========================================
// EVENT LISTENERS
// =========================================


// Update range before session starts

totalQuestionsInput.addEventListener(
    "input",
    updateSessionPreview
);

initialQuestionInput.addEventListener(
    "input",
    updateSessionPreview
);


// Start session

startSessionBtn.addEventListener(
    "click",
    startAnswerSession
);


// Navigation

previousBtn.addEventListener(
    "click",
    previousQuestion
);

nextBtn.addEventListener(
    "click",
    nextQuestion
);


// Answer buttons

answerButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function() {

                selectAnswer(
                    this.dataset.answer
                );
            }
        );
    }
);


// New session

newSessionBtn.addEventListener(
    "click",
    startNewSession
);


// Downloads

downloadStandardBtn.addEventListener(
    "click",
    downloadStandardFile
);


fileCountInput.addEventListener(
    "change",
    handleSourceModeChange
);


// File uploads

singleTxtInput.addEventListener(
    "change",
    loadSingleTxt
);

singlePdfInput.addEventListener(
    "change",
    handlePdfSelection
);


englishTxtInput.addEventListener(
    "change",
    loadEnglishTxt
);

bengaliTxtInput.addEventListener(
    "change",
    loadBengaliTxt
);

bilingualPdfInput.addEventListener(
    "change",
    handlePdfSelection
);


// Navigation

singlePreviousBtn.addEventListener(
    "click",
    goToPreviousSourceBlock
);

singleNextBtn.addEventListener(
    "click",
    goToNextSourceBlock
);


englishPreviousBtn.addEventListener(
    "click",
    goToPreviousSourceBlock
);

englishNextBtn.addEventListener(
    "click",
    goToNextSourceBlock
);


bengaliPreviousBtn.addEventListener(
    "click",
    goToPreviousSourceBlock
);

bengaliNextBtn.addEventListener(
    "click",
    goToNextSourceBlock
);


// Edit / Save

singleEditBtn.addEventListener(
    "click",
    () => beginBlockEdit("single")
);

singleSaveBtn.addEventListener(
    "click",
    () => saveBlockEdit("single")
);


englishEditBtn.addEventListener(
    "click",
    () => beginBlockEdit("english")
);

englishSaveBtn.addEventListener(
    "click",
    () => saveBlockEdit("english")
);


bengaliEditBtn.addEventListener(
    "click",
    () => beginBlockEdit("bengali")
);

bengaliSaveBtn.addEventListener(
    "click",
    () => saveBlockEdit("bengali")
);


// PDF zoom

pdfZoomInBtn.addEventListener(
    "click",
    () => changePdfZoom(0.1)
);

pdfZoomOutBtn.addEventListener(
    "click",
    () => changePdfZoom(-0.1)
);

pdfZoomResetBtn.addEventListener(
    "click",
    resetPdfZoom
);


// =========================================
// INITIAL PAGE SETUP
// =========================================

updateSessionPreview();

updateProgress();


// =========================================
// SESSION PREVIEW
// =========================================

function updateSessionPreview() {

    let total =
        parseInt(
            totalQuestionsInput.value,
            10
        );

    let initial =
        parseInt(
            initialQuestionInput.value,
            10
        );


    if (
        !Number.isInteger(total) ||
        total < 1
    ) {

        total = 1;
    }


    if (
        !Number.isInteger(initial) ||
        initial < 1
    ) {

        initial = 1;
    }


    const finalQuestion =
        initial + total - 1;


    questionRange.textContent =
        `${initial} – ${finalQuestion}`;


    // Update preview statistics
    // only before session begins

    if (!sessionActive) {

        document.getElementById(
            "progressTotalQuestions"
        ).textContent =
            total;


        document.getElementById(
            "remainingCount"
        ).textContent =
            total;


        document.getElementById(
            "requiredAnswers"
        ).textContent =
            total;


        document.getElementById(
            "missingAnswers"
        ).textContent =
            total;
    }
}


// =========================================
// START ANSWER SESSION
// =========================================

function startAnswerSession() {

    const total =
        parseInt(
            totalQuestionsInput.value,
            10
        );

    const initial =
        parseInt(
            initialQuestionInput.value,
            10
        );


    // Validate total questions

    if (
        !Number.isInteger(total) ||
        total < 1
    ) {

        alert(
            "Total Questions must be a positive whole number."
        );

        totalQuestionsInput.focus();

        return;
    }


    // Validate initial question

    if (
        !Number.isInteger(initial) ||
        initial < 1
    ) {

        alert(
            "Initial Question No. must be a positive whole number."
        );

        initialQuestionInput.focus();

        return;
    }


    totalQuestions =
        total;

    initialQuestion =
        initial;

    currentIndex =
        0;


    // Create empty answer array

    answers =
        new Array(
            totalQuestions
        ).fill(null);


    sessionActive =
        true;


    // Lock configuration

    totalQuestionsInput.disabled =
        true;

    initialQuestionInput.disabled =
        true;

    startSessionBtn.disabled =
        true;


    // Enable workspace

    answerWorkspace.classList.remove(
        "disabled-workspace"
    );


    answerButtons.forEach(
        button => {

            button.disabled =
                false;
        }
    );


    newSessionBtn.disabled =
        false;


    // Reset console

    consoleBox.textContent = "";


    log(
        "Answer session started."
    );

    log(
        `Total Questions: ${totalQuestions}`
    );

    log(
        `Initial Question No.: ${initialQuestion}`
    );

    log(
        `Question Range: ${initialQuestion} – ${initialQuestion + totalQuestions - 1}`
    );


    renderAnswerGrid();

    showCurrentQuestion();

    updateProgress();

    validateOutput();
}


// =========================================
// SHOW CURRENT QUESTION
// =========================================

function showCurrentQuestion() {

    if (!sessionActive) {

        return;
    }


    const displayedQuestion =
        initialQuestion +
        currentIndex;


    currentQuestionNumber.textContent =
        displayedQuestion;


    questionPosition.textContent =
        `${currentIndex + 1} of ${totalQuestions}`;


    document.getElementById(
        "progressCurrentQuestion"
    ).textContent =
        displayedQuestion;


    // Navigation buttons

    previousBtn.disabled =
        currentIndex === 0;


    nextBtn.disabled =
        currentIndex ===
        totalQuestions - 1;


    // Show selected answer

    answerButtons.forEach(
        button => {

            button.classList.remove(
                "selected"
            );


            if (
                answers[currentIndex] ===
                button.dataset.answer
            ) {

                button.classList.add(
                    "selected"
                );
            }
        }
    );


    updateCurrentGridItem();
}


// =========================================
// SELECT ANSWER
// =========================================
function selectAnswer(answer) {

    if (!sessionActive) {

        return;
    }


    /*
        Save answer against current block/question.

        Block 1 = answers[0]
        Block 2 = answers[1]
        etc.
    */

    answers[
        currentIndex
    ] =
        answer;


    log(
        `Question ${
            initialQuestion +
            currentIndex
        } answered: ${answer}`
    );


    /*
        Auto advance both Question
        and TXT block together.
    */

    if (
        currentIndex <
        totalQuestions - 1
    ) {

        const nextIndex =
            currentIndex + 1;


        const sourceTotal =
            getSourceBlockCount();


        if (
            sourceTotal === 0 ||
            nextIndex < sourceTotal
        ) {

            goToQuestionBlock(
                nextIndex
            );

        } else {

            currentIndex =
                nextIndex;

            showCurrentQuestion();
        }

    } else {

        showCurrentQuestion();
    }
}



// =========================================
// PREVIOUS QUESTION
// =========================================

function previousQuestion() {

    if (
        !sessionActive ||
        currentIndex <= 0
    ) {

        return;
    }


    currentIndex--;

    showCurrentQuestion();
}


// =========================================
// NEXT QUESTION
// =========================================

function nextQuestion() {

    if (
        !sessionActive ||
        currentIndex >=
        totalQuestions - 1
    ) {

        return;
    }


    currentIndex++;

    showCurrentQuestion();
}


// =========================================
// ANSWER GRID
// =========================================

function renderAnswerGrid() {

    answerGrid.innerHTML = "";


    for (
        let i = 0;
        i < totalQuestions;
        i++
    ) {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "answer-grid-item";


        item.dataset.index =
            i;


        const displayedQuestion =
            initialQuestion + i;


        item.innerHTML = `

            <span class="grid-question">

                ${displayedQuestion}

            </span>

            <span class="grid-answer">

                ${answers[i] || "–"}

            </span>

        `;


        if (answers[i]) {

            item.classList.add(
                "answered"
            );
        }


        if (
            i === currentIndex
        ) {

            item.classList.add(
                "current"
            );
        }

        item.addEventListener(
            "click",
            function() {
        
                const selectedIndex =
                    Number(
                        this.dataset.index
                    );
        
        
                goToQuestionBlock(
                    selectedIndex
                );
            }
        );
        


        answerGrid.appendChild(
            item
        );
    }
}


// =========================================
// UPDATE ONE GRID ITEM
// =========================================

function updateGridItem(index) {

    const item =
        answerGrid.querySelector(
            `[data-index="${index}"]`
        );


    if (!item) {

        return;
    }


    const answerDisplay =
        item.querySelector(
            ".grid-answer"
        );


    answerDisplay.textContent =
        answers[index] || "–";


    if (answers[index]) {

        item.classList.add(
            "answered"
        );

    } else {

        item.classList.remove(
            "answered"
        );
    }
}


// =========================================
// UPDATE CURRENT GRID HIGHLIGHT
// =========================================

function updateCurrentGridItem() {

    const items =
        answerGrid.querySelectorAll(
            ".answer-grid-item"
        );


    items.forEach(
        item => {

            item.classList.remove(
                "current"
            );
        }
    );


    const currentItem =
        answerGrid.querySelector(
            `[data-index="${currentIndex}"]`
        );


    if (currentItem) {

        currentItem.classList.add(
            "current"
        );


        currentItem.scrollIntoView(
            {
                block: "nearest"
            }
        );
    }
}


// =========================================
// UPDATE PROGRESS
// =========================================

function updateProgress() {

    const answered =
        answers.filter(
            answer =>
                answer !== null
        ).length;


    const remaining =
        sessionActive
            ? totalQuestions - answered
            : parseInt(
                totalQuestionsInput.value,
                10
            ) || 100;


    const percentage =
        sessionActive &&
        totalQuestions > 0

            ? Math.round(
                (
                    answered /
                    totalQuestions
                ) * 100
            )

            : 0;


    document.getElementById(
        "progressTotalQuestions"
    ).textContent =
        sessionActive
            ? totalQuestions
            : totalQuestionsInput.value;


    document.getElementById(
        "answeredCount"
    ).textContent =
        answered;


    document.getElementById(
        "remainingCount"
    ).textContent =
        remaining;


    document.getElementById(
        "selectedAnswers"
    ).textContent =
        answered;


    document.getElementById(
        "missingAnswers"
    ).textContent =
        remaining;


    progressBar.style.width =
        `${percentage}%`;


    progressPercent.textContent =
        `${percentage}%`;


    // Status

    let statusText;


    if (!sessionActive) {

        statusText =
            "0% — NOT STARTED";

    } else if (
        answered === 0
    ) {

        statusText =
            "0% — NOT STARTED";

    } else if (
        answered === totalQuestions
    ) {

        statusText =
            "100% — COMPLETED";

    } else {

        statusText =
            `${percentage}% — IN PROGRESS`;
    }


    document.getElementById(
        "progressStatus"
    ).textContent =
        statusText;
}


// =========================================
// OUTPUT VALIDATION
// =========================================

function validateOutput() {

    if (!sessionActive) {

        return;
    }


    const selectedAnswers =
        answers.filter(
            answer =>
                ["A", "B", "C", "D"]
                    .includes(answer)
        );


    const selectedCount =
        selectedAnswers.length;


    const missingCount =
        totalQuestions -
        selectedCount;


    /*
        STANDARD FORMAT

        A

        C

        B

        D
    */

    const standardEntries =
        selectedCount;


    /*
        DEVELOPMENT FORMAT

        ACBDA...

        One character per answer
    */

    


    document.getElementById(
        "requiredAnswers"
    ).textContent =
        totalQuestions;


    document.getElementById(
        "selectedAnswers"
    ).textContent =
        selectedCount;


    document.getElementById(
        "missingAnswers"
    ).textContent =
        missingCount;


    document.getElementById(
        "ansoptEntries"
    ).textContent =
        standardEntries;

    const valid =
    selectedCount ===
        totalQuestions &&

    standardEntries ===
        totalQuestions &&

    answers.every(
        answer =>
            ["A", "B", "C", "D"]
                .includes(answer)
    );
    

    


    if (valid) {

        document.getElementById(
            "validationStatus"
        ).textContent =
            "PASSED";


        downloadStandardBtn.disabled =
            false;

        
        logCompletionOnce();

    } else {

        document.getElementById(
            "validationStatus"
        ).textContent =
            "NOT READY";


        downloadStandardBtn.disabled =
            true;

        
    }
}


// =========================================
// COMPLETION LOG
// =========================================

let completionLogged = false;


function logCompletionOnce() {
    if (completionLogged) {
        return;
    }

    completionLogged = true;

    log(
        "All required answers completed."
    );

    log(
        "Output Validation: PASSED"
    );

    log(
        `Ansopt Entries: ${totalQuestions}`
    );

    log(
        "Ansopt.txt is ready for download."
    );
    
}


// =========================================
// STANDARD OUTPUT
// Ansopt.txt
// =========================================

function createStandardOutput() {

    /*
        IMPORTANT:

        This preserves the original
        Python format:

        A

        C

        B

        D

        Equivalent:

        A\n\nC\n\nB\n\nD\n\n
    */

    return (
        answers.join("\n\n") +
        "\n\n"
    );
}


// =========================================
// DEVELOPMENT OUTPUT
// AnsDev.txt
// =========================================




// =========================================
// DOWNLOAD STANDARD FILE
// =========================================

function downloadStandardFile() {

    if (
        !isOutputReady()
    ) {

        log(
            "Download blocked: Answer key is incomplete."
        );

        return;
    }


    const content =
        createStandardOutput();


    downloadTextFile(
        content,
        "Ansopt.txt"
    );


    log(
        "Downloaded Standard Answer Key: Ansopt.txt"
    );
}


// =========================================
// DOWNLOAD DEVELOPMENT FILE
// =========================================


// =========================================
// OUTPUT READY CHECK
// =========================================

function isOutputReady() {

    return (

        sessionActive &&

        answers.length ===
            totalQuestions &&

        answers.every(
            answer =>
                ["A", "B", "C", "D"]
                    .includes(answer)
        )

    );
}


// =========================================
// GENERIC TXT DOWNLOAD
// =========================================

function downloadTextFile(
    content,
    fileName
) {

    const blob =
        new Blob(
            [content],
            {
                type:
                    "text/plain;charset=utf-8"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        fileName;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );
}


// =========================================
// NEW SESSION
// =========================================

function startNewSession() {

    if (!sessionActive) {

        return;
    }


    const answered =
        answers.filter(
            answer =>
                answer !== null
        ).length;


    let message =
        "Start a new answer session?";


    if (answered > 0) {

        message +=
            "\n\nCurrent answers will be cleared.";
    }


    const confirmed =
        window.confirm(
            message
        );


    if (!confirmed) {

        return;
    }


    // Reset state

    sessionActive =
        false;

    totalQuestions =
        100;

    initialQuestion =
        1;

    currentIndex =
        0;

    answers =
        [];

    completionLogged =
        false;


    // Restore default configuration

    totalQuestionsInput.disabled =
        false;

    initialQuestionInput.disabled =
        false;


    totalQuestionsInput.value =
        100;

    initialQuestionInput.value =
        1;


    startSessionBtn.disabled =
        false;

    newSessionBtn.disabled =
        true;


    // Disable workspace

    answerWorkspace.classList.add(
        "disabled-workspace"
    );


    answerButtons.forEach(
        button => {

            button.disabled =
                true;

            button.classList.remove(
                "selected"
            );
        }
    );


    previousBtn.disabled =
        true;

    nextBtn.disabled =
        true;


    currentQuestionNumber.textContent =
        "--";

    questionPosition.textContent =
        "-- of --";


    document.getElementById(
        "progressCurrentQuestion"
    ).textContent =
        "--";


    // Reset grid

    answerGrid.innerHTML = `

        <div class="empty-grid-message">

            Start an answer session to display
            the question grid.

        </div>

    `;


    // Reset validation

    document.getElementById(
        "ansoptEntries"
    ).textContent =
        "0";

   

    document.getElementById(
        "validationStatus"
    ).textContent =
        "NOT READY";


    downloadStandardBtn.disabled =
        true;

    

    consoleBox.textContent =
        "Waiting for answer session...";


    updateSessionPreview();

    updateProgress();
}


// =========================================
// LOGGER
// =========================================

function log(message) {

    /*
        Remove initial placeholder
        when first real message arrives.
    */

    if (
        consoleBox.textContent.trim() ===
        "Waiting for answer session..."
    ) {

        consoleBox.textContent =
            "";
    }


    consoleBox.textContent +=
        message + "\n";


    consoleBox.scrollTop =
        consoleBox.scrollHeight;
}

// =========================================
// SOURCE MODE
// =========================================

function handleSourceModeChange() {

    if (activeEditSide !== null) {

        alert(
            "Save the currently edited question block before changing file mode."
        );

        fileCountInput.value =
            String(sourceMode);

        return;
    }


    sourceMode =
        Number(
            fileCountInput.value
        );


    currentSourceBlockIndex =
        0;


    if (sourceMode === 2) {

        twoFileUploader.classList.remove(
            "hidden"
        );

        threeFileUploader.classList.add(
            "hidden"
        );


        singleEditorMode.classList.remove(
            "hidden"
        );

        splitEditorMode.classList.add(
            "hidden"
        );


        fileStatus.textContent =
            "2-file mode: Select one TXT file and one reference PDF.";

    } else {

        twoFileUploader.classList.add(
            "hidden"
        );

        threeFileUploader.classList.remove(
            "hidden"
        );


        singleEditorMode.classList.add(
            "hidden"
        );

        splitEditorMode.classList.remove(
            "hidden"
        );


        fileStatus.textContent =
            "3-file mode: Select E.txt, B.txt and one reference PDF.";
    }


    renderSourceBlock();
}
// =========================================
// QUESTION BLOCK PARSER
// =========================================

function parseSourceBlocks(
    text,
    displayMode
) {

    const normalized =
        text.replace(
            /\r\n/g,
            "\n"
        );


    const lines =
        normalized.split("\n");


    const blocks = [];

    let currentLines = [];

    let startLine = null;


    function pushCurrentBlock() {

        if (
            currentLines.length === 0
        ) {

            return;
        }


        const completeBlock =
            currentLines.join("\n");


        let displayText =
            completeBlock;


        /*
            In bilingual 3-file mode,
            show only Q| through D|.

            Other lines such as:

            Shift|
            Correct|
            Difficulty|

            remain preserved in the source block
            but are not shown in the bilingual editor.
        */

        if (
            displayMode === "QUESTION_OPTIONS_ONLY"
        ) {

            displayText =
                currentLines
                    .filter(
                        line => {

                            const trimmed =
                                line.trimStart();

                            return (
                                trimmed.startsWith("Q|") ||
                                trimmed.startsWith("A|") ||
                                trimmed.startsWith("B|") ||
                                trimmed.startsWith("C|") ||
                                trimmed.startsWith("D|")
                            );
                        }
                    )
                    .join("\n");
        }


        blocks.push({

            index:
                blocks.length,

            startLine:
                startLine,

            originalText:
                completeBlock,

            displayText:
                displayText

        });


        currentLines = [];

        startLine = null;
    }


    lines.forEach(
        (line, index) => {

            const trimmed =
                line.trimStart();


            /*
                Every Q| begins a new block.
            */

            if (
                trimmed.startsWith("Q|")
            ) {

                pushCurrentBlock();

                startLine =
                    index + 1;

                currentLines.push(
                    line
                );

                return;
            }


            /*
                Ignore content before first Q|
            */

            if (
                currentLines.length === 0
            ) {

                return;
            }


            currentLines.push(
                line
            );
        }
    );


    pushCurrentBlock();


    return blocks;
}

// =========================================
// LOAD SINGLE TXT
// =========================================

async function loadSingleTxt() {

    const file =
        singleTxtInput.files[0];


    if (!file) {

        singleTxtFile =
            null;

        singleTxtText =
            "";

        singleBlocks =
            [];

        renderSourceBlock();

        return;
    }


    try {

        singleTxtFile =
            file;


        singleTxtText =
            await file.text();


        singleBlocks =
            parseSourceBlocks(
                singleTxtText,
                "FULL_BLOCK"
            );


        currentSourceBlockIndex =
            0;


        singleEditorFileName.textContent =
            file.name;


        fileStatus.textContent =
            `${file.name} loaded — ${singleBlocks.length} question blocks found.`;


        renderSourceBlock();


        log(
            `Question TXT loaded: ${file.name}`
        );

        log(
            `Question blocks found: ${singleBlocks.length}`
        );

    } catch (error) {

        console.error(error);

        fileStatus.textContent =
            "Unable to read the selected TXT file.";
    }
}

// =========================================
// LOAD ENGLISH TXT
// =========================================

async function loadEnglishTxt() {

    const file =
        englishTxtInput.files[0];


    if (!file) {

        englishTxtFile =
            null;

        englishBlocks =
            [];

        renderSourceBlock();

        return;
    }


    if (
        !/E\.txt$/i.test(
            file.name
        )
    ) {

        alert(
            "English TXT filename must end with E.txt.\nExample: 100E.txt"
        );

        englishTxtInput.value =
            "";

        return;
    }


    englishTxtFile =
        file;


    englishTxtText =
        await file.text();


    englishBlocks =
        parseSourceBlocks(
            englishTxtText,
            "QUESTION_OPTIONS_ONLY"
        );


    currentSourceBlockIndex =
        0;


    englishEditorFileName.textContent =
        file.name;


    updateBilingualFileStatus();

    renderSourceBlock();
}


// =========================================
// LOAD BENGALI TXT
// =========================================

async function loadBengaliTxt() {

    const file =
        bengaliTxtInput.files[0];


    if (!file) {

        bengaliTxtFile =
            null;

        bengaliBlocks =
            [];

        renderSourceBlock();

        return;
    }


    if (
        !/B\.txt$/i.test(
            file.name
        )
    ) {

        alert(
            "Bengali TXT filename must end with B.txt.\nExample: 100B.txt"
        );

        bengaliTxtInput.value =
            "";

        return;
    }


    bengaliTxtFile =
        file;


    bengaliTxtText =
        await file.text();


    bengaliBlocks =
        parseSourceBlocks(
            bengaliTxtText,
            "QUESTION_OPTIONS_ONLY"
        );


    currentSourceBlockIndex =
        0;


    bengaliEditorFileName.textContent =
        file.name;


    updateBilingualFileStatus();

    renderSourceBlock();
}

function updateBilingualFileStatus() {

    if (
        !englishTxtFile ||
        !bengaliTxtFile
    ) {

        fileStatus.textContent =
            "Waiting for both English and Bengali TXT files.";

        return;
    }


    const englishBase =
        englishTxtFile.name
            .replace(
                /E\.txt$/i,
                ""
            );


    const bengaliBase =
        bengaliTxtFile.name
            .replace(
                /B\.txt$/i,
                ""
            );


    if (
        englishBase.toLowerCase() !==
        bengaliBase.toLowerCase()
    ) {

        fileStatus.textContent =
            "⚠ English and Bengali filenames have different base IDs.";

        return;
    }


    if (
        englishBlocks.length !==
        bengaliBlocks.length
    ) {

        fileStatus.textContent =
            `⚠ Block mismatch — English: ${englishBlocks.length}, Bengali: ${bengaliBlocks.length}`;

        return;
    }


    fileStatus.textContent =
        `✓ Bilingual files aligned — ${englishBlocks.length} blocks found in each file.`;
}
// =========================================
// MASTER QUESTION / BLOCK NAVIGATION
// =========================================

function goToQuestionBlock(index) {

    const sourceTotal =
        getSourceBlockCount();


    /*
        Valid answer-session range
    */

    if (
        index < 0 ||
        index >= totalQuestions
    ) {

        return;
    }


    /*
        If TXT blocks are loaded,
        the requested block must exist.
    */

    if (
        sourceTotal > 0 &&
        index >= sourceTotal
    ) {

        return;
    }


    /*
        One shared index:

        index 0 = Block 1 = Question 1
        index 1 = Block 2 = Question 2
        etc.
    */

    currentIndex =
        index;

    currentSourceBlockIndex =
        index;


    /*
        Render TXT block
    */

    renderSourceBlock(false);


    /*
        Render Answer Selection,
        Answer Grid and progress.
    */

    showCurrentQuestion();
}



// =========================================
// RENDER SOURCE BLOCK
// =========================================

function renderSourceBlock(
    syncAnswer = true
) {

    if (sourceMode === 2) {

        renderSingleSourceBlock(
            syncAnswer
        );

    } else {

        renderBilingualSourceBlock(
            syncAnswer
        );
    }


    updateSourceNavigationButtons();
}



function renderSingleSourceBlock(
    syncAnswer = true
) {

    if (
        singleBlocks.length === 0
    ) {

        singleBlockEditor.value =
            "";

        blockPosition.textContent =
            "Block -- / --";

        singleEditBtn.disabled =
            true;

        singleSaveBtn.disabled =
            true;

        return;
    }


    clampSourceBlockIndex(
        singleBlocks.length
    );


    const block =
        singleBlocks[
            currentSourceBlockIndex
        ];


    singleBlockEditor.value =
        block.displayText;


    blockPosition.textContent =
        `Block ${currentSourceBlockIndex + 1} / ${singleBlocks.length}`;


    singleEditBtn.disabled =
        false;

    singleSaveBtn.disabled =
        true;


    if (
    syncAnswer &&
    sessionActive
) {

    currentIndex =
        currentSourceBlockIndex;

    showCurrentQuestion();
}
}

function renderBilingualSourceBlock(
    syncAnswer = true
) {

    const total =
        Math.max(
            englishBlocks.length,
            bengaliBlocks.length
        );


    if (total === 0) {

        englishBlockEditor.value =
            "";

        bengaliBlockEditor.value =
            "";

        blockPosition.textContent =
            "Block -- / --";

        englishEditBtn.disabled =
            true;

        bengaliEditBtn.disabled =
            true;

        return;
    }


    clampSourceBlockIndex(
        total
    );


    const english =
        englishBlocks[
            currentSourceBlockIndex
        ];


    const bengali =
        bengaliBlocks[
            currentSourceBlockIndex
        ];


    englishBlockEditor.value =
        english
            ? english.displayText
            : "⚠ English block missing";


    bengaliBlockEditor.value =
        bengali
            ? bengali.displayText
            : "⚠ Bengali block missing";


    blockPosition.textContent =
        `Block ${currentSourceBlockIndex + 1} / ${total}`;


    englishEditBtn.disabled =
        !english;

    bengaliEditBtn.disabled =
        !bengali;


    englishSaveBtn.disabled =
        true;

    bengaliSaveBtn.disabled =
        true;


    if (
    syncAnswer &&
    sessionActive
) {

    currentIndex =
        currentSourceBlockIndex;

    showCurrentQuestion();
}
}

function clampSourceBlockIndex(
    total
) {

    if (
        currentSourceBlockIndex < 0
    ) {

        currentSourceBlockIndex =
            0;
    }


    if (
        currentSourceBlockIndex >= total
    ) {

        currentSourceBlockIndex =
            total - 1;
    }
}

// =========================================
// SOURCE NAVIGATION
// =========================================

function getSourceBlockCount() {

    if (sourceMode === 2) {

        return singleBlocks.length;
    }


    return Math.max(
        englishBlocks.length,
        bengaliBlocks.length
    );
}


function goToPreviousSourceBlock() {

    if (
        activeEditSide !== null
    ) {

        return;
    }


    if (
        currentSourceBlockIndex <= 0
    ) {

        return;
    }


    goToQuestionBlock(
        currentSourceBlockIndex - 1
    );
}


function goToNextSourceBlock() {

    if (
        activeEditSide !== null
    ) {

        return;
    }


    const total =
        getSourceBlockCount();


    if (
        currentSourceBlockIndex >=
        total - 1
    ) {

        return;
    }


    goToQuestionBlock(
        currentSourceBlockIndex + 1
    );
}

function updateSourceNavigationButtons() {

    const total =
        getSourceBlockCount();


    const locked =
        activeEditSide !== null;


    const previousDisabled =

        locked ||
        total === 0 ||
        currentSourceBlockIndex <= 0;


    const nextDisabled =

        locked ||
        total === 0 ||
        currentSourceBlockIndex >=
            total - 1;


    singlePreviousBtn.disabled =
        previousDisabled;

    singleNextBtn.disabled =
        nextDisabled;


    englishPreviousBtn.disabled =
        previousDisabled;

    englishNextBtn.disabled =
        nextDisabled;


    bengaliPreviousBtn.disabled =
        previousDisabled;

    bengaliNextBtn.disabled =
        nextDisabled;
}

// =========================================
// BEGIN EDIT
// =========================================

function beginBlockEdit(side) {

    if (
        activeEditSide !== null
    ) {

        return;
    }


    activeEditSide =
        side;


    if (side === "single") {

        singleBlockEditor.readOnly =
            false;

        singleBlockEditor.focus();

        singleEditBtn.disabled =
            true;

        singleSaveBtn.disabled =
            false;

    } else if (
        side === "english"
    ) {

        englishBlockEditor.readOnly =
            false;

        englishBlockEditor.focus();

        englishEditBtn.disabled =
            true;

        englishSaveBtn.disabled =
            false;


        bengaliEditBtn.disabled =
            true;

    } else if (
        side === "bengali"
    ) {

        bengaliBlockEditor.readOnly =
            false;

        bengaliBlockEditor.focus();

        bengaliEditBtn.disabled =
            true;

        bengaliSaveBtn.disabled =
            false;


        englishEditBtn.disabled =
            true;
    }


    updateSourceNavigationButtons();
}

// =========================================
// SAVE EDITED BLOCK
// =========================================

function saveBlockEdit(side) {

    if (
        activeEditSide !== side
    ) {

        return;
    }


    if (side === "single") {

        const block =
            singleBlocks[
                currentSourceBlockIndex
            ];


        block.displayText =
            singleBlockEditor.value;

        block.originalText =
            singleBlockEditor.value;


        singleBlockEditor.readOnly =
            true;


    } else if (
        side === "english"
    ) {

        const block =
            englishBlocks[
                currentSourceBlockIndex
            ];


        const updatedVisible =
            englishBlockEditor.value;


        block.originalText =
            mergeVisibleQuestionFields(
                block.originalText,
                updatedVisible
            );


        block.displayText =
            extractQuestionOptionLines(
                block.originalText
            );


        englishBlockEditor.value =
            block.displayText;


        englishBlockEditor.readOnly =
            true;


    } else if (
        side === "bengali"
    ) {

        const block =
            bengaliBlocks[
                currentSourceBlockIndex
            ];


        const updatedVisible =
            bengaliBlockEditor.value;


        block.originalText =
            mergeVisibleQuestionFields(
                block.originalText,
                updatedVisible
            );


        block.displayText =
            extractQuestionOptionLines(
                block.originalText
            );


        bengaliBlockEditor.value =
            block.displayText;


        bengaliBlockEditor.readOnly =
            true;
    }


    activeEditSide =
        null;


    rebuildEditedSourceTexts();


    renderSourceBlock();
}

// =========================================
// QUESTION FIELD MERGE
// =========================================

function extractQuestionOptionLines(
    blockText
) {

    return blockText
        .split("\n")
        .filter(
            line => {

                const trimmed =
                    line.trimStart();

                return (
                    trimmed.startsWith("Q|") ||
                    trimmed.startsWith("A|") ||
                    trimmed.startsWith("B|") ||
                    trimmed.startsWith("C|") ||
                    trimmed.startsWith("D|")
                );
            }
        )
        .join("\n");
}

function mergeVisibleQuestionFields(
    originalBlock,
    editedVisibleBlock
) {

    const editedMap =
        {};


    editedVisibleBlock
        .split("\n")
        .forEach(
            line => {

                const trimmed =
                    line.trimStart();


                const match =
                    trimmed.match(
                        /^([QABCD])\|(.*)$/i
                    );


                if (match) {

                    editedMap[
                        match[1]
                            .toUpperCase()
                    ] =
                        `${match[1].toUpperCase()}|${match[2]}`;
                }
            }
        );


    return originalBlock
        .split("\n")
        .map(
            line => {

                const trimmed =
                    line.trimStart();


                const match =
                    trimmed.match(
                        /^([QABCD])\|/i
                    );


                if (!match) {

                    /*
                        Preserve:

                        Shift|
                        Correct|
                        Difficulty|
                        Image|
                        etc.
                    */

                    return line;
                }


                const key =
                    match[1]
                        .toUpperCase();


                return (
                    editedMap[key] !==
                    undefined
                )
                    ? editedMap[key]
                    : line;
            }
        )
        .join("\n");
}

function rebuildEditedSourceTexts() {

    if (sourceMode === 2) {

        singleTxtText =
            singleBlocks
                .map(
                    block =>
                        block.originalText
                )
                .join("\n\n");

        return;
    }


    englishTxtText =
        englishBlocks
            .map(
                block =>
                    block.originalText
            )
            .join("\n\n");


    bengaliTxtText =
        bengaliBlocks
            .map(
                block =>
                    block.originalText
            )
            .join("\n\n");
}

// =========================================
// PDF VIEWER
// =========================================

function handlePdfSelection(event) {

    const file =
        event.target.files[0];


    if (!file) {

        clearPdfViewer();

        return;
    }


    if (
        file.type !==
        "application/pdf" &&
        !file.name
            .toLowerCase()
            .endsWith(".pdf")
    ) {

        alert(
            "Please select a PDF file."
        );

        event.target.value =
            "";

        return;
    }


    if (currentPdfUrl) {

        URL.revokeObjectURL(
            currentPdfUrl
        );
    }


    currentPdfUrl =
        URL.createObjectURL(
            file
        );


    pdfViewer.src =
        currentPdfUrl;


    pdfViewer.classList.remove(
        "hidden"
    );

    pdfPlaceholder.classList.add(
        "hidden"
    );


    pdfZoom =
        1;


    applyPdfZoom();


    pdfZoomInBtn.disabled =
        false;

    pdfZoomOutBtn.disabled =
        false;

    pdfZoomResetBtn.disabled =
        false;
}

function clearPdfViewer() {

    if (currentPdfUrl) {

        URL.revokeObjectURL(
            currentPdfUrl
        );

        currentPdfUrl =
            null;
    }


    pdfViewer.src =
        "";


    pdfViewer.classList.add(
        "hidden"
    );

    pdfPlaceholder.classList.remove(
        "hidden"
    );


    pdfZoom =
        1;


    pdfZoomDisplay.textContent =
        "100%";


    pdfZoomInBtn.disabled =
        true;

    pdfZoomOutBtn.disabled =
        true;

    pdfZoomResetBtn.disabled =
        true;
}

function changePdfZoom(amount) {

    if (!currentPdfUrl) {

        return;
    }


    pdfZoom +=
        amount;


    pdfZoom =
        Math.max(
            0.5,
            Math.min(
                2,
                pdfZoom
            )
        );


    applyPdfZoom();
}


function resetPdfZoom() {

    pdfZoom =
        1;

    applyPdfZoom();
}


function applyPdfZoom() {

    pdfZoomDisplay.textContent =
        `${Math.round(
            pdfZoom * 100
        )}%`;


    pdfViewer.style.width =
        `${100 / pdfZoom}%`;


    pdfViewer.style.height =
        `${100 / pdfZoom}%`;


    pdfViewer.style.transform =
        `scale(${pdfZoom})`;
}

// =========================================
// SOURCE ↔ ANSWER SYNCHRONIZATION
// =========================================
// =========================================
// SOURCE ↔ ANSWER SYNCHRONIZATION
// =========================================



handleSourceModeChange();
