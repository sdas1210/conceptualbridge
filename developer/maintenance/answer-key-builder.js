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

const downloadDevelopmentBtn =
    document.getElementById("downloadDevelopmentBtn");


// =========================================
// SESSION STATE
// =========================================

let totalQuestions = 100;

let initialQuestion = 1;

let currentIndex = 0;

let answers = [];

let sessionActive = false;


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

downloadDevelopmentBtn.addEventListener(
    "click",
    downloadDevelopmentFile
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


    const questionNumber =
        initialQuestion +
        currentIndex;


    const previousAnswer =
        answers[currentIndex];


    answers[currentIndex] =
        answer;


    if (
        previousAnswer &&
        previousAnswer !== answer
    ) {

        log(
            `Question ${questionNumber}: ${previousAnswer} → ${answer}`
        );

    } else if (!previousAnswer) {

        log(
            `Question ${questionNumber}: ${answer}`
        );
    }


    updateGridItem(
        currentIndex
    );


    updateProgress();

    validateOutput();


    /*
        AUTO ADVANCE

        If not on final question,
        automatically move forward.

        The user can still return using:
        - Previous
        - Next
        - Answer Grid
    */

    if (
        currentIndex <
        totalQuestions - 1
    ) {

        currentIndex++;

        showCurrentQuestion();

    } else {

        // Stay on final question

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

                currentIndex =
                    Number(
                        this.dataset.index
                    );

                showCurrentQuestion();
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

    const developmentCharacters =
        selectedAnswers
            .join("")
            .length;


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


    document.getElementById(
        "ansdevCharacters"
    ).textContent =
        developmentCharacters;


    const valid =
        selectedCount ===
            totalQuestions &&

        standardEntries ===
            totalQuestions &&

        developmentCharacters ===
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

        downloadDevelopmentBtn.disabled =
            false;


        logCompletionOnce();

    } else {

        document.getElementById(
            "validationStatus"
        ).textContent =
            "NOT READY";


        downloadStandardBtn.disabled =
            true;

        downloadDevelopmentBtn.disabled =
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


    completionLogged =
        true;


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
        `AnsDev Characters: ${totalQuestions}`
    );

    log(
        "Both answer files are ready for download."
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

function createDevelopmentOutput() {

    /*
        Original Python format:

        ACBDA...

        No:
        - spaces
        - commas
        - line breaks
    */

    return answers.join("");
}


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

function downloadDevelopmentFile() {

    if (
        !isOutputReady()
    ) {

        log(
            "Download blocked: Answer key is incomplete."
        );

        return;
    }


    const content =
        createDevelopmentOutput();


    downloadTextFile(
        content,
        "AnsDev.txt"
    );


    log(
        "Downloaded Development Answer Key: AnsDev.txt"
    );
}


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
        "ansdevCharacters"
    ).textContent =
        "0";

    document.getElementById(
        "validationStatus"
    ).textContent =
        "NOT READY";


    downloadStandardBtn.disabled =
        true;

    downloadDevelopmentBtn.disabled =
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
