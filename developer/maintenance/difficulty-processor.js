// =========================================
// DIFFICULTY PROCESSOR
// Conceptual Bridge Maintenance Suite
// =========================================


// =========================================
// ELEMENTS
// =========================================

const originalFileInput =
    document.getElementById("originalFileInput");

const ratingFileInput =
    document.getElementById("ratingFileInput");

const compareBtn =
    document.getElementById("compareBtn");

const extractBtn =
    document.getElementById("extractBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const consoleBox =
    document.getElementById("console");

const mismatchCard =
    document.getElementById("mismatchCard");

const mismatchReport =
    document.getElementById("mismatchReport");


// =========================================
// STATE
// =========================================

let originalText = "";

let ratingText = "";

let originalFileName = "";

let ratingFileName = "";

let originalQuestions = [];

let ratingQuestions = [];

let difficultyOutput = "";

let comparisonPassed = false;


// =========================================
// EVENTS
// =========================================

originalFileInput.addEventListener(
    "change",
    loadFiles
);

ratingFileInput.addEventListener(
    "change",
    loadFiles
);

compareBtn.addEventListener(
    "click",
    compareFiles
);

extractBtn.addEventListener(
    "click",
    extractDifficulty
);

downloadBtn.addEventListener(
    "click",
    downloadDifficulty
);


// =========================================
// LOAD BOTH FILES
// =========================================

async function loadFiles() {

    resetProcessingState();


    const originalFile =
        originalFileInput.files[0];

    const ratingFile =
        ratingFileInput.files[0];


    if (originalFile) {

        originalFileName =
            originalFile.name;

        document.getElementById(
            "originalFileName"
        ).textContent =
            originalFile.name;
    }


    if (ratingFile) {

        ratingFileName =
            ratingFile.name;

        document.getElementById(
            "ratingFileName"
        ).textContent =
            ratingFile.name;
    }


    if (
        !originalFile ||
        !ratingFile
    ) {

        consoleBox.textContent =
            "Waiting for two TXT files...";

        return;
    }


    try {

        originalText =
            await originalFile.text();

        ratingText =
            await ratingFile.text();


        originalQuestions =
            extractOriginalQuestions(
                originalText
            );


        ratingQuestions =
            extractRatingQuestions(
                ratingText
            );


        document.getElementById(
            "originalQuestionCount"
        ).textContent =
            originalQuestions.length;


        document.getElementById(
            "ratingQuestionCount"
        ).textContent =
            ratingQuestions.length;


        consoleBox.textContent = "";


        log(
            `Original File: ${originalFileName}`
        );

        log(
            `Original Q| questions: ${originalQuestions.length}`
        );

        log(
            `Rating File: ${ratingFileName}`
        );

        log(
            `Question N: entries: ${ratingQuestions.length}`
        );


        if (
            originalQuestions.length === 0
        ) {

            log(
                "ERROR: No Q| questions found in Original file."
            );

            return;
        }


        if (
            ratingQuestions.length === 0
        ) {

            log(
                "ERROR: No Question N: entries found in Rating file."
            );

            return;
        }


        compareBtn.disabled =
            false;


        log(
            "Both files loaded."
        );

        log(
            "Ready for Step 1 comparison."
        );

    } catch (error) {

        consoleBox.textContent =
            "ERROR: Unable to read one or both TXT files.";

        compareBtn.disabled =
            true;
    }
}


// =========================================
// ORIGINAL QUESTION EXTRACTOR
// =========================================

function extractOriginalQuestions(text) {

    const lines =
        text.split(/\r?\n/);

    const questions = [];


    lines.forEach(
        (line, index) => {

            const trimmed =
                line.trim();


            if (
                trimmed
                    .toUpperCase()
                    .startsWith("Q|")
            ) {

                questions.push({

                    questionNumber:
                        questions.length + 1,

                    lineNumber:
                        index + 1,

                    fullLine:
                        trimmed,

                    content:
                        content:
                            trimmed
                                .substring(2)
                                .trimStart()

                });
            }
        }
    );


    return questions;
}


// =========================================
// RATING QUESTION EXTRACTOR
// =========================================

function extractRatingQuestions(text) {

    const lines =
        text.split(/\r?\n/);

    const questions = [];


    lines.forEach(
        (line, index) => {

            const trimmed =
                line.trim();


            /*
                Detect:

                Question 1:
                Question 27:
                Question 100:
            */

            const match =
                trimmed.match(
                    /^Question\s+(\d+):(.*)$/i
                );


            if (!match) {

                return;
            }


            questions.push({

                questionNumber:
                    Number(match[1]),

                lineNumber:
                    index + 1,

                fullLine:
                    trimmed,

                content:
                    match[2]
                       .trimStart()

            });
        }
    );


    return questions;
}


// =========================================
// PYTHON COMPARISON RULE
// =========================================

function getCompareString(content) {

    /*
        Normalize leading whitespace before comparison.

        These are treated identically:

        Q|Which of the following...
        Q| Which of the following...
        Q|   Which of the following...

        Rating:
        Question 1: Which of the following...

        Only leading whitespace is ignored.
        Internal question text is NOT modified.
    */

    return content
        .trimStart()
        .substring(0, 10);
}


// =========================================
// STEP 1 — COMPARE
// =========================================

function compareFiles() {

    comparisonPassed =
        false;

    extractBtn.disabled =
        true;

    downloadBtn.disabled =
        true;

    difficultyOutput =
        "";


    mismatchCard.classList.add(
        "hidden"
    );

    mismatchReport.innerHTML =
        "";


    let matches = 0;

    const mismatches = [];


    log(
        "--------------------------------"
    );

    log(
        "STEP 1: Starting question alignment comparison..."
    );


    /*
        Compare every original Q|
        against matching Question N:
    */

    originalQuestions.forEach(
        originalQuestion => {

            const questionNumber =
                originalQuestion.questionNumber;


            const ratingQuestion =
                ratingQuestions.find(
                    item =>
                        item.questionNumber ===
                        questionNumber
                );


            // Missing Question N:

            if (!ratingQuestion) {

                mismatches.push({

                    questionNumber,

                    type:
                        "MISSING_RATING",

                    original:
                        originalQuestion,

                    rating:
                        null

                });

                return;
            }


            const originalCompare =
                getCompareString(
                    originalQuestion.content
                );


            const ratingCompare =
                getCompareString(
                    ratingQuestion.content
                );


            if (
                originalCompare !==
                ratingCompare
            ) {

                mismatches.push({

                    questionNumber,

                    type:
                        "TEXT_MISMATCH",

                    original:
                        originalQuestion,

                    rating:
                        ratingQuestion,

                    originalCompare,

                    ratingCompare

                });

                return;
            }


            matches++;
        }
    );


    /*
        Detect extra Question N:
        entries beyond original count.
    */

    ratingQuestions.forEach(
        ratingQuestion => {

            const exists =
                originalQuestions.some(
                    item =>
                        item.questionNumber ===
                        ratingQuestion.questionNumber
                );


            if (!exists) {

                mismatches.push({

                    questionNumber:
                        ratingQuestion.questionNumber,

                    type:
                        "EXTRA_RATING",

                    original:
                        null,

                    rating:
                        ratingQuestion

                });
            }
        }
    );


    const compared =
        originalQuestions.length;


    document.getElementById(
        "questionsCompared"
    ).textContent =
        compared;


    document.getElementById(
        "matchCount"
    ).textContent =
        matches;


    document.getElementById(
        "mismatchCount"
    ).textContent =
        mismatches.length;


    // FAILED

    if (
        mismatches.length > 0
    ) {

        document.getElementById(
            "comparisonStatus"
        ).textContent =
            "FAILED";


        document.getElementById(
            "extractionStatus"
        ).textContent =
            "BLOCKED";


        log(
            `Comparison FAILED.`
        );

        log(
            `Matches: ${matches}`
        );

        log(
            `Mismatches: ${mismatches.length}`
        );

        log(
            "Step 2 blocked until files match."
        );


        showMismatchReport(
            mismatches
        );


        return;
    }


    // PASSED

    comparisonPassed =
        true;


    document.getElementById(
        "comparisonStatus"
    ).textContent =
        "PASSED";


    document.getElementById(
        "extractionStatus"
    ).textContent =
        "READY";


    extractBtn.disabled =
        false;


    log(
        `Comparison PASSED.`
    );

    log(
        `All ${matches} questions matched.`
    );

    log(
        "Step 2 unlocked."
    );

    log(
        "Ready to extract difficulty values."
    );
}


// =========================================
// MISMATCH REPORT
// =========================================

function showMismatchReport(
    mismatches
) {

    mismatchCard.classList.remove(
        "hidden"
    );


    mismatchReport.innerHTML =
        "";


    mismatches.forEach(
        mismatch => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "mismatch-item";


            // TEXT MISMATCH

            if (
                mismatch.type ===
                "TEXT_MISMATCH"
            ) {

                item.innerHTML = `

                    <div class="mismatch-title">

                        ❌ Mismatch at Question
                        ${mismatch.questionNumber}

                    </div>

                    <div class="mismatch-line">

                        Original File —
                        <span class="line-number">
                            Line ${mismatch.original.lineNumber}
                        </span>

                        <br>

                        "${escapeHtml(
                            mismatch.originalCompare
                        )}"

                    </div>

                    <div class="mismatch-line">

                        Rating File —
                        <span class="line-number">
                            Line ${mismatch.rating.lineNumber}
                        </span>

                        <br>

                        "${escapeHtml(
                            mismatch.ratingCompare
                        )}"

                    </div>

                    <div class="mismatch-line">

                        Original Full:

                        ${escapeHtml(
                            mismatch.original.fullLine
                        )}

                    </div>

                    <div class="mismatch-line">

                        Rating Full:

                        ${escapeHtml(
                            mismatch.rating.fullLine
                        )}

                    </div>

                `;
            }


            // MISSING RATING QUESTION

            else if (
                mismatch.type ===
                "MISSING_RATING"
            ) {

                item.innerHTML = `

                    <div class="mismatch-title">

                        ❌ Missing Rating Entry —
                        Question ${mismatch.questionNumber}

                    </div>

                    <div class="mismatch-line">

                        Original File —
                        <span class="line-number">

                            Line
                            ${mismatch.original.lineNumber}

                        </span>

                        <br>

                        ${escapeHtml(
                            mismatch.original.fullLine
                        )}

                    </div>

                    <div class="mismatch-line">

                        Rating File:

                        Question
                        ${mismatch.questionNumber}:
                        not found

                    </div>

                `;
            }


            // EXTRA RATING QUESTION

            else {

                item.innerHTML = `

                    <div class="mismatch-title">

                        ❌ Extra Rating Entry —
                        Question ${mismatch.questionNumber}

                    </div>

                    <div class="mismatch-line">

                        Original File:

                        No corresponding Q| question

                    </div>

                    <div class="mismatch-line">

                        Rating File —
                        <span class="line-number">

                            Line
                            ${mismatch.rating.lineNumber}

                        </span>

                        <br>

                        ${escapeHtml(
                            mismatch.rating.fullLine
                        )}

                    </div>

                `;
            }


            mismatchReport.appendChild(
                item
            );
        }
    );
}


// =========================================
// STEP 2 — DIFFICULTY EXTRACTION
// =========================================

function extractDifficulty() {

    if (!comparisonPassed) {

        log(
            "Extraction blocked: Comparison has not passed."
        );

        return;
    }


    const lines =
        ratingText.split(/\r?\n/);


    const values = [];

    let difficultyLines =
        0;

    let invalidValues =
        0;


    log(
        "--------------------------------"
    );

    log(
        "STEP 2: Extracting difficulty values..."
    );


    lines.forEach(
        (line, index) => {

            const stripped =
                line.trim();


            /*
                Match original Python behavior:

                Any line beginning with:

                Difficulty

                Then take content after first :
            */

            if (
                !stripped.startsWith(
                    "Difficulty"
                )
            ) {

                return;
            }


            difficultyLines++;


            if (
                !stripped.includes(":")
            ) {

                invalidValues++;

                log(
                    `Ignored invalid Difficulty line ${index + 1}: Missing ":"`
                );

                return;
            }


            const value =
                stripped
                    .split(":", 2)[1]
                    .trim();


            if (
                isValidNumber(value)
            ) {

                values.push(
                    value
                );

            } else {

                invalidValues++;

                log(
                    `Ignored non-numeric Difficulty value at line ${index + 1}: ${value}`
                );
            }
        }
    );


    document.getElementById(
        "difficultyLinesFound"
    ).textContent =
        difficultyLines;


    document.getElementById(
        "validDifficultyCount"
    ).textContent =
        values.length;


    document.getElementById(
        "invalidDifficultyCount"
    ).textContent =
        invalidValues;


    if (
        values.length === 0
    ) {

        document.getElementById(
            "extractionStatus"
        ).textContent =
            "FAILED";


        downloadBtn.disabled =
            true;


        log(
            "Extraction FAILED: No valid difficulty values found."
        );


        return;
    }


    /*
        Exact difficulty.txt style:

        9.03,9.14,6.08
    */

    difficultyOutput =
        values.join(",");


    document.getElementById(
        "extractionStatus"
    ).textContent =
        "COMPLETED";


    downloadBtn.disabled =
        false;


    log(
        `Difficulty lines found: ${difficultyLines}`
    );

    log(
        `Valid numeric values: ${values.length}`
    );

    log(
        `Invalid / ignored: ${invalidValues}`
    );

    log(
        "difficulty.txt is ready for download."
    );
}


// =========================================
// NUMBER VALIDATOR
// =========================================

function isValidNumber(text) {

    /*
        Equivalent intention to
        Python float(text).

        Supports:

        9
        9.03
        0.25
        -1.5
    */

    if (
        text === ""
    ) {

        return false;
    }


    const number =
        Number(text);


    return Number.isFinite(
        number
    );
}


// =========================================
// DOWNLOAD
// =========================================

function downloadDifficulty() {

    if (
        !comparisonPassed ||
        !difficultyOutput
    ) {

        log(
            "Download blocked."
        );

        return;
    }


    const blob =
        new Blob(
            [difficultyOutput],
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
        "difficulty.txt";


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


    log(
        "Downloaded: difficulty.txt"
    );
}


// =========================================
// RESET WHEN FILE CHANGES
// =========================================

function resetProcessingState() {

    comparisonPassed =
        false;

    difficultyOutput =
        "";


    compareBtn.disabled =
        true;

    extractBtn.disabled =
        true;

    downloadBtn.disabled =
        true;


    document.getElementById(
        "questionsCompared"
    ).textContent =
        "0";

    document.getElementById(
        "matchCount"
    ).textContent =
        "0";

    document.getElementById(
        "mismatchCount"
    ).textContent =
        "0";

    document.getElementById(
        "comparisonStatus"
    ).textContent =
        "WAITING";


    document.getElementById(
        "difficultyLinesFound"
    ).textContent =
        "0";

    document.getElementById(
        "validDifficultyCount"
    ).textContent =
        "0";

    document.getElementById(
        "invalidDifficultyCount"
    ).textContent =
        "0";

    document.getElementById(
        "extractionStatus"
    ).textContent =
        "LOCKED";


    mismatchCard.classList.add(
        "hidden"
    );

    mismatchReport.innerHTML =
        "";
}


// =========================================
// LOGGER
// =========================================

function log(message) {

    if (
        consoleBox.textContent.trim() ===
        "Waiting for two TXT files..."
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
// HTML ESCAPE
// =========================================

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text;

    return div.innerHTML;
}
