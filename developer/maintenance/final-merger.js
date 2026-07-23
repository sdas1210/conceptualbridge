// =========================================
// FINAL MERGER
// Conceptual Bridge Maintenance Suite
// =========================================


// =========================================
// ELEMENT REFERENCES
// =========================================

const englishFileInput =
    document.getElementById("englishFileInput");

const bengaliFileInput =
    document.getElementById("bengaliFileInput");

const answerFileInput =
    document.getElementById("answerFileInput");

const difficultyFileInput =
    document.getElementById("difficultyFileInput");

const validateBtn =
    document.getElementById("validateBtn");

const mergeBtn =
    document.getElementById("mergeBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const consoleBox =
    document.getElementById("console");

const issueCard =
    document.getElementById("issueCard");

const issueReport =
    document.getElementById("issueReport");

// =========================================
// FINAL MERGER MODE SELECTION
// =========================================

const mergerModeSelector =
    document.getElementById(
        "mergerModeSelector"
    );


const gacaMergerWorkspace =
    document.getElementById(
        "gacaMergerWorkspace"
    );


const mathPlaceholder =
    document.getElementById(
        "mathPlaceholder"
    );


const gacaModeBtn =
    document.getElementById(
        "gacaModeBtn"
    );


const mathModeBtn =
    document.getElementById(
        "mathModeBtn"
    );


const backToModeBtn =
    document.getElementById(
        "backToModeBtn"
    );

const mergerModeSelector =
    document.getElementById(
        "mergerModeSelector"
    );

const gacaMergerWorkspace =
    document.getElementById(
        "gacaMergerWorkspace"
    );

const mathPlaceholder =
    document.getElementById(
        "mathPlaceholder"
    );

const gacaModeBtn =
    document.getElementById(
        "gacaModeBtn"
    );

const mathModeBtn =
    document.getElementById(
        "mathModeBtn"
    );

const backToModeBtn =
    document.getElementById(
        "backToModeBtn"
    );
// =========================================
// STATE
// =========================================

let englishText = "";
let bengaliText = "";
let answerText = "";
let difficultyText = "";

let englishBlocks = [];
let bengaliBlocks = [];
let answers = [];
let difficultyRecords = [];

let validationPassed = false;

let finalOutput = "";

let normalizedShiftCountValue = 0;


// =========================================
// FILE EVENTS
// =========================================

englishFileInput.addEventListener(
    "change",
    loadAllFiles
);

bengaliFileInput.addEventListener(
    "change",
    loadAllFiles
);

answerFileInput.addEventListener(
    "change",
    loadAllFiles
);

difficultyFileInput.addEventListener(
    "change",
    loadAllFiles
);


validateBtn.addEventListener(
    "click",
    validateAllData
);

mergeBtn.addEventListener(
    "click",
    generateFinalOutput
);

downloadBtn.addEventListener(
    "click",
    downloadFinalFile
);
// =========================================
// GACA MODE
// =========================================

gacaModeBtn.addEventListener(
    "click",
    () => {

        /*
            Hide mode selector.
        */

        mergerModeSelector.classList.add(
            "hidden"
        );


        /*
            Make sure Math is hidden.
        */

        mathPlaceholder.classList.add(
            "hidden"
        );


        /*
            Show the complete existing
            GACA Final Merger.
        */

        gacaMergerWorkspace.classList.remove(
            "hidden"
        );

    }
);


// =========================================
// MATH MODE
// =========================================

mathModeBtn.addEventListener(
    "click",
    () => {

        /*
            Hide selector.
        */

        mergerModeSelector.classList.add(
            "hidden"
        );


        /*
            Hide GACA workflow.
        */

        gacaMergerWorkspace.classList.add(
            "hidden"
        );


        /*
            Show Math placeholder.
        */

        mathPlaceholder.classList.remove(
            "hidden"
        );

    }
);


gacaModeBtn.addEventListener(
    "click",
    () => {

        mergerModeSelector.classList.add(
            "hidden"
        );

        mathPlaceholder.classList.add(
            "hidden"
        );

        gacaMergerWorkspace.classList.remove(
            "hidden"
        );

    }
);


mathModeBtn.addEventListener(
    "click",
    () => {

        mergerModeSelector.classList.add(
            "hidden"
        );

        gacaMergerWorkspace.classList.add(
            "hidden"
        );

        mathPlaceholder.classList.remove(
            "hidden"
        );

    }
);


backToModeBtn.addEventListener(
    "click",
    () => {

        mathPlaceholder.classList.add(
            "hidden"
        );

        gacaMergerWorkspace.classList.add(
            "hidden"
        );

        mergerModeSelector.classList.remove(
            "hidden"
        );

    }
);
// =========================================
// BACK TO MODE SELECTION
// =========================================

backToModeBtn.addEventListener(
    "click",
    () => {

        mathPlaceholder.classList.add(
            "hidden"
        );


        gacaMergerWorkspace.classList.add(
            "hidden"
        );


        mergerModeSelector.classList.remove(
            "hidden"
        );

    }
);

// =========================================
// LOAD FOUR FILES
// =========================================

async function loadAllFiles() {

    resetProcessingState();


    const englishFile =
        englishFileInput.files[0];

    const bengaliFile =
        bengaliFileInput.files[0];

    const answerFile =
        answerFileInput.files[0];

    const difficultyFile =
        difficultyFileInput.files[0];


    // Display selected filenames

    document.getElementById(
        "englishFileName"
    ).textContent =
        englishFile
            ? englishFile.name
            : "--";


    document.getElementById(
        "bengaliFileName"
    ).textContent =
        bengaliFile
            ? bengaliFile.name
            : "--";


    document.getElementById(
        "answerFileName"
    ).textContent =
        answerFile
            ? answerFile.name
            : "--";


    document.getElementById(
        "difficultyFileName"
    ).textContent =
        difficultyFile
            ? difficultyFile.name
            : "--";


    // Wait until all 4 exist

    if (
        !englishFile ||
        !bengaliFile ||
        !answerFile ||
        !difficultyFile
    ) {

        consoleBox.textContent =
            "Waiting for four TXT files...";

        return;
    }


    try {

        // Validate E/B filenames

        const englishInfo =
            parseLanguageFileName(
                englishFile.name,
                "E"
            );

        const bengaliInfo =
            parseLanguageFileName(
                bengaliFile.name,
                "B"
            );


        if (!englishInfo.valid) {

            consoleBox.textContent =
                "ERROR: English filename must end with E before .txt.\nExample: 100E.txt";

            return;
        }


        if (!bengaliInfo.valid) {

            consoleBox.textContent =
                "ERROR: Bengali filename must end with B before .txt.\nExample: 100B.txt";

            return;
        }


        if (
            englishInfo.baseName !==
            bengaliInfo.baseName
        ) {

            consoleBox.textContent =
                "ERROR: English and Bengali filenames do not share the same base ID.\n" +
                `English: ${englishFile.name}\n` +
                `Bengali: ${bengaliFile.name}`;

            return;
        }


        // Read all files

        englishText =
            await englishFile.text();

        bengaliText =
            await bengaliFile.text();

        answerText =
            await answerFile.text();

        difficultyText =
            await difficultyFile.text();


        // Parse

        englishBlocks =
            parseQuestionBlocks(
                englishText,
                true
            );

        bengaliBlocks =
            parseQuestionBlocks(
                bengaliText,
                false
            );

        answers =
            parseAnswers(
                answerText
            );

        difficultyRecords =
            parseDifficultyFile(
                difficultyText
            );


        // File information

        document.getElementById(
            "englishBlockCount"
        ).textContent =
            englishBlocks.length;


        document.getElementById(
            "bengaliBlockCount"
        ).textContent =
            bengaliBlocks.length;


        document.getElementById(
            "answerCount"
        ).textContent =
            answers.length;


        document.getElementById(
            "difficultyQuestionCount"
        ).textContent =
            difficultyRecords.length;


        document.getElementById(
            "difficultyValueCount"
        ).textContent =
            difficultyRecords.filter(
                item =>
                    item.difficulty !== null
            ).length;


        document.getElementById(
            "expectedOutputCount"
        ).textContent =
            englishBlocks.length;


        consoleBox.textContent = "";


        log(
            "All four files loaded."
        );

        log(
            `English: ${englishFile.name}`
        );

        log(
            `Bengali: ${bengaliFile.name}`
        );

        log(
            `Base ID matched: ${englishInfo.baseName}`
        );

        log(
            `English Blocks: ${englishBlocks.length}`
        );

        log(
            `Bengali Blocks: ${bengaliBlocks.length}`
        );

        log(
            `Answers: ${answers.length}`
        );

        log(
            `Difficulty Questions: ${difficultyRecords.length}`
        );


        validateBtn.disabled =
            false;


        log(
            "Ready for structural and alignment validation."
        );

    } catch (error) {

        console.error(error);

        consoleBox.textContent =
            "ERROR: Unable to process one or more TXT files.\n" +
            error.message;
    }
}


// =========================================
// E / B FILENAME VALIDATION
// =========================================

function parseLanguageFileName(
    fileName,
    suffix
) {

    const escapedSuffix =
        suffix.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    const regex =
        new RegExp(
            `^(.*)${escapedSuffix}\\.txt$`,
            "i"
        );


    const match =
        fileName.match(regex);


    if (!match) {

        return {
            valid: false,
            baseName: ""
        };
    }


    return {
        valid: true,
        baseName:
            match[1]
                .trim()
                .toLowerCase()
    };
}


// =========================================
// QUESTION BLOCK PARSER
// =========================================

function parseQuestionBlocks(
    text,
    includeShift
) {

    const normalized =
        text.replace(
            /\r\n/g,
            "\n"
        );


    const lines =
        normalized.split("\n");


    const blocks = [];

    let currentBlock =
        null;


    lines.forEach(
        (rawLine, index) => {

            const trimmed =
                rawLine.trim();


            // New Q| begins a new block

            if (
                trimmed
                    .toUpperCase()
                    .startsWith("Q|")
            ) {

                if (currentBlock) {

                    blocks.push(
                        currentBlock
                    );
                }


                currentBlock = {

                    blockNumber:
                        blocks.length + 1,

                    startLine:
                        index + 1,

                    Q:
                        getTagValue(
                            trimmed,
                            "Q|"
                        ),

                    A: null,
                    B: null,
                    C: null,
                    D: null,

                    Shift: null,

                    lineNumbers: {

                        Q:
                            index + 1,

                        A: null,
                        B: null,
                        C: null,
                        D: null,

                        Shift: null

                    }

                };


                return;
            }


            // Ignore content before first Q|

            if (!currentBlock) {

                return;
            }


            const upper =
                trimmed.toUpperCase();


            if (
                upper.startsWith("A|")
            ) {

                currentBlock.A =
                    getTagValue(
                        trimmed,
                        "A|"
                    );

                currentBlock
                    .lineNumbers
                    .A =
                    index + 1;

            } else if (
                upper.startsWith("B|")
            ) {

                currentBlock.B =
                    getTagValue(
                        trimmed,
                        "B|"
                    );

                currentBlock
                    .lineNumbers
                    .B =
                    index + 1;

            } else if (
                upper.startsWith("C|")
            ) {

                currentBlock.C =
                    getTagValue(
                        trimmed,
                        "C|"
                    );

                currentBlock
                    .lineNumbers
                    .C =
                    index + 1;

            } else if (
                upper.startsWith("D|")
            ) {

                currentBlock.D =
                    getTagValue(
                        trimmed,
                        "D|"
                    );

                currentBlock
                    .lineNumbers
                    .D =
                    index + 1;

            } else if (
                includeShift &&
                upper.startsWith(
                    "SHIFT|"
                )
            ) {

                currentBlock.Shift =
                    getTagValue(
                        trimmed,
                        "Shift|"
                    );

                currentBlock
                    .lineNumbers
                    .Shift =
                    index + 1;
            }
        }
    );


    // Push final block

    if (currentBlock) {

        blocks.push(
            currentBlock
        );
    }


    return blocks;
}


// =========================================
// TAG VALUE
// =========================================

function getTagValue(
    line,
    tag
) {

    return line
        .substring(
            tag.length
        )
        .trimStart();
}


// =========================================
// ANSWER PARSER
// =========================================

function parseAnswers(text) {

    /*
        Supports standard Ansopt format:

        A

        C

        B

        D

        Also tolerates ordinary line-based
        A/B/C/D files.
    */

    const normalized =
        text.replace(
            /\r\n/g,
            "\n"
        );


    return normalized
        .split(/\s+/)
        .map(
            item =>
                item
                    .trim()
                    .toUpperCase()
        )
        .filter(
            item =>
                item !== ""
        );
}


// =========================================
// DIFFICULTY FILE PARSER
// =========================================

function parseDifficultyFile(text) {

    const lines =
        text
            .replace(
                /\r\n/g,
                "\n"
            )
            .split("\n");


    const records = [];

    let currentRecord =
        null;


    lines.forEach(
        (rawLine, index) => {

            const trimmed =
                rawLine.trim();


            /*
                =====================================
                FORMAT 1 — OLD FORMAT
                =====================================

                Question 1: What is the capital...
                Difficulty Rating: 7.25

                Question 2: Who invented...
                Difficulty Rating: 5.80
            */

            const numberedQuestionMatch =
                trimmed.match(
                    /^Question\s+(\d+):(.*)$/i
                );


            if (numberedQuestionMatch) {

                if (currentRecord) {

                    records.push(
                        currentRecord
                    );
                }


                currentRecord = {

                    questionNumber:
                        Number(
                            numberedQuestionMatch[1]
                        ),

                    questionText:
                        numberedQuestionMatch[2]
                            .trimStart(),

                    questionLine:
                        index + 1,

                    difficulty:
                        null,

                    difficultyLine:
                        null,

                    sourceFormat:
                        "NUMBERED"

                };


                return;
            }


            /*
                =====================================
                FORMAT 2 — NEW Q| FORMAT
                =====================================

                Q| What is the capital...
                Difficulty Rating: 7.25

                Q| Who invented...
                Difficulty Rating: 5.80

                Question number is assigned
                sequentially according to Q| order.
            */

            if (
                trimmed
                    .toUpperCase()
                    .startsWith("Q|")
            ) {

                if (currentRecord) {

                    records.push(
                        currentRecord
                    );
                }


                currentRecord = {

                    questionNumber:
                        records.length + 1,

                    questionText:
                        trimmed
                            .substring(2)
                            .trimStart(),

                    questionLine:
                        index + 1,

                    difficulty:
                        null,

                    difficultyLine:
                        null,

                    sourceFormat:
                        "Q_PIPE"

                };


                return;
            }


            /*
                Ignore everything until
                a valid question entry exists.
            */

            if (!currentRecord) {

                return;
            }


            /*
                =====================================
                DIFFICULTY VALUE
                =====================================

                Supports:

                Difficulty Rating: 7.88
                Difficulty: 7.88

                Any line beginning with
                "Difficulty" followed by ":"
            */

            if (
                /^Difficulty/i.test(
                    trimmed
                )
            ) {

                const colonIndex =
                    trimmed.indexOf(":");


                if (
                    colonIndex === -1
                ) {

                    return;
                }


                const value =
                    trimmed
                        .substring(
                            colonIndex + 1
                        )
                        .trim();


                if (
                    value !== "" &&
                    Number.isFinite(
                        Number(value)
                    )
                ) {

                    currentRecord.difficulty =
                        value;

                    currentRecord.difficultyLine =
                        index + 1;
                }
            }
        }
    );


    /*
        Push final record
    */

    if (currentRecord) {

        records.push(
            currentRecord
        );
    }


    return records;
}


// =========================================
// MAIN VALIDATION
// =========================================

function validateAllData() {

    validationPassed =
        false;

    finalOutput =
        "";

    mergeBtn.disabled =
        true;

    downloadBtn.disabled =
        true;


    issueCard.classList.add(
        "hidden"
    );

    issueReport.innerHTML =
        "";


    const issues = [];

    let englishComplete =
        0;

    let bengaliComplete =
        0;

    let shiftCount =
        0;

    let validAnswers =
        0;

    let difficultyAlignments =
        0;

    normalizedShiftCountValue =
        0;


    log(
        "--------------------------------"
    );

    log(
        "Starting complete validation..."
    );


    // =====================================
    // GLOBAL COUNT CHECKS
    // =====================================

    const expected =
        englishBlocks.length;


    if (
        bengaliBlocks.length !==
        expected
    ) {

        issues.push({

            title:
                "Question Block Count Mismatch",

            details:
                `English blocks: ${expected}\n` +
                `Bengali blocks: ${bengaliBlocks.length}`

        });
    }


    if (
        answers.length !==
        expected
    ) {

        issues.push({

            title:
                "Answer Count Mismatch",

            details:
                `English blocks: ${expected}\n` +
                `Answers found: ${answers.length}`

        });
    }


    if (
        difficultyRecords.length !==
        expected
    ) {

        issues.push({

            title:
                "Difficulty Question Count Mismatch",

            details:
                `English blocks: ${expected}\n` +
                `Difficulty questions: ${difficultyRecords.length}`

        });
    }


    // =====================================
    // QUESTION-BY-QUESTION VALIDATION
    // =====================================

    for (
        let i = 0;
        i < expected;
        i++
    ) {

        const questionNumber =
            i + 1;


        const english =
            englishBlocks[i];

        const bengali =
            bengaliBlocks[i];

        const answer =
            answers[i];

        const difficulty =
            difficultyRecords.find(
                record =>
                    record.questionNumber ===
                    questionNumber
            );


        // -----------------------------
        // ENGLISH STRUCTURE
        // -----------------------------

        const missingEnglish =
            getMissingFields(
                english,
                true
            );


        if (
            missingEnglish.length === 0
        ) {

            englishComplete++;

        } else {

            issues.push({

                title:
                    `Question ${questionNumber} — English Block Incomplete`,

                details:
                    `English block starts at line ${english.startLine}\n` +
                    `Missing: ${missingEnglish.join(", ")}`

            });
        }


        // -----------------------------
        // BENGALI STRUCTURE
        // -----------------------------

        if (!bengali) {

            issues.push({

                title:
                    `Question ${questionNumber} — Bengali Block Missing`,

                details:
                    "No corresponding Bengali question block was found."

            });

        } else {

            const missingBengali =
                getMissingFields(
                    bengali,
                    false
                );


            if (
                missingBengali.length === 0
            ) {

                bengaliComplete++;

            } else {

                issues.push({

                    title:
                        `Question ${questionNumber} — Bengali Block Incomplete`,

                    details:
                        `Bengali block starts at line ${bengali.startLine}\n` +
                        `Missing: ${missingBengali.join(", ")}`

                });
            }
        }


        // -----------------------------
        // SHIFT
        // -----------------------------

        if (
            english.Shift !== null &&
            english.Shift.trim() !== ""
        ) {

            shiftCount++;


            const shiftResult =
                normalizeShiftValue(
                    english.Shift
                );


            if (
                shiftResult.recognized
            ) {

                english.normalizedShift =
                    shiftResult.value;


                if (
                    shiftResult.changed
                ) {

                    normalizedShiftCountValue++;
                }

            } else {

                issues.push({

                    title:
                        `Question ${questionNumber} — Shift Format Not Recognized`,

                    details:
                        `English line ${english.lineNumbers.Shift}\n` +
                        `Shift| ${english.Shift}`

                });
            }
        }


        // -----------------------------
        // ANSWER
        // -----------------------------

        if (
            ["A", "B", "C", "D"]
                .includes(answer)
        ) {

            validAnswers++;

        } else {

            issues.push({

                title:
                    `Question ${questionNumber} — Invalid or Missing Answer`,

                details:
                    answer === undefined

                        ? "No answer entry found."

                        : `Answer value: "${answer}"`

            });
        }


        // -----------------------------
        // DIFFICULTY
        // -----------------------------

        if (!difficulty) {

            issues.push({

                title:
                    `Question ${questionNumber} — Difficulty Record Missing`,

                details:
                    `No Question ${questionNumber}: entry found in difficulty file.`

            });

            continue;
        }


        if (
            difficulty.difficulty ===
            null
        ) {

            issues.push({

                title:
                    `Question ${questionNumber} — Difficulty Value Missing`,

                details:
                    `Difficulty question line: ${difficulty.questionLine}`

            });

            continue;
        }


        // English ↔ Difficulty question alignment

        const englishCompare =
            getCompareString(
                english.Q
            );


        const difficultyCompare =
            getCompareString(
                difficulty.questionText
            );


        if (
            englishCompare !==
            difficultyCompare
        ) {

            issues.push({

                title:
                    `Question ${questionNumber} — Difficulty Alignment Failed`,

                details:
                    `English File — Line ${english.lineNumbers.Q}\n` +
                    `"${englishCompare}"\n\n` +
                    `Difficulty File — Line ${difficulty.questionLine}\n` +
                    `"${difficultyCompare}"\n\n` +
                    `English Full:\nQ|${english.Q}\n\n` +
                    `Difficulty Full:\nQuestion ${difficulty.questionNumber}: ${difficulty.questionText}`

            });

        } else {

            difficultyAlignments++;
        }
    }


    // =====================================
    // UPDATE STATISTICS
    // =====================================

    document.getElementById(
        "englishCompleteCount"
    ).textContent =
        `${englishComplete}/${expected}`;


    document.getElementById(
        "bengaliCompleteCount"
    ).textContent =
        `${bengaliComplete}/${expected}`;


    document.getElementById(
        "shiftCount"
    ).textContent =
        `${shiftCount}/${expected}`;


    document.getElementById(
        "normalizedShiftCount"
    ).textContent =
        normalizedShiftCountValue;


    document.getElementById(
        "validAnswerCount"
    ).textContent =
        `${validAnswers}/${expected}`;


    document.getElementById(
        "difficultyAlignmentCount"
    ).textContent =
        `${difficultyAlignments}/${expected}`;


    document.getElementById(
        "validationIssueCount"
    ).textContent =
        issues.length;


    // =====================================
    // RESULT
    // =====================================

    if (
        issues.length > 0
    ) {

        document.getElementById(
            "validationStatus"
        ).textContent =
            "FAILED";


        document.getElementById(
            "finalStatus"
        ).textContent =
            "BLOCKED";


        showIssues(
            issues
        );


        log(
            "VALIDATION FAILED."
        );

        log(
            `Issues found: ${issues.length}`
        );

        log(
            "Final merge has been blocked."
        );


        return;
    }


    validationPassed =
        true;


    document.getElementById(
        "validationStatus"
    ).textContent =
        "PASSED";


    document.getElementById(
        "finalStatus"
    ).textContent =
        "READY";


    mergeBtn.disabled =
        false;


    log(
        "VALIDATION PASSED."
    );

    log(
        `All ${expected} question blocks are complete.`
    );

    log(
        `Shift entries: ${shiftCount}/${expected}`
    );

    log(
        `Shift values modified: ${normalizedShiftCountValue}`
    );

    log(
        `Answers validated: ${validAnswers}/${expected}`
    );

    log(
        `Difficulty alignments: ${difficultyAlignments}/${expected}`
    );

    log(
        "Final merger is ready."
    );
}


// =========================================
// REQUIRED FIELD CHECK
// =========================================

function getMissingFields(
    block,
    requireShift
) {

    if (!block) {

        return [
            "Q|",
            "A|",
            "B|",
            "C|",
            "D|"
        ];
    }


    const fields =
        ["Q", "A", "B", "C", "D"];


    if (requireShift) {

        fields.push(
            "Shift"
        );
    }


    return fields
        .filter(
            field =>
                block[field] === null ||
                block[field] === undefined ||
                block[field].trim() === ""
        )
        .map(
            field =>
                field === "Shift"
                    ? "Shift|"
                    : `${field}|`
        );
}


// =========================================
// DIFFICULTY COMPARISON
// =========================================

function getCompareString(content) {

    /*
        Preserve existing comparer logic:

        - Ignore leading whitespace
        - Compare first 10 characters

        Q| Which...
        Q|Which...

        are treated identically.
    */

    return String(
        content || ""
    )
        .trimStart()
        .substring(0, 10);
}


// =========================================
// SHIFT NORMALIZATION
// =========================================

function normalizeShiftValue(value) {

    const original =
        String(value)
            .trim();


    /*
        Examples accepted:

        27/11/2025 9:00 AM 10:30 AM

        27/11/2025 9:00 AM - 10:30 AM

        27/11/2025 09:00AM--10:30am

        Output:

        27/11/2025 9:00 AM - 10:30 AM
    */


    const match =
        original.match(

            /^(.+?)\s+(\d{1,2}:\d{2})\s*(AM|PM)\s*(?:-+\s*)?(\d{1,2}:\d{2})\s*(AM|PM)$/i

        );


    if (!match) {

        return {

            recognized:
                false,

            changed:
                false,

            value:
                original

        };
    }


    const datePart =
        match[1]
            .trim();


    const startTime =
        match[2];


    const startModifier =
        match[3]
            .toUpperCase();


    const endTime =
        match[4];


    const endModifier =
        match[5]
            .toUpperCase();


    const normalized =
        `${datePart} ${startTime} ${startModifier} - ${endTime} ${endModifier}`;


    return {

        recognized:
            true,

        changed:
            normalized !== original,

        value:
            normalized

    };
}


// =========================================
// GENERATE FINAL OUTPUT
// =========================================

function generateFinalOutput() {

    if (!validationPassed) {

        log(
            "Merge blocked: Validation has not passed."
        );

        return;
    }


    const outputBlocks = [];


    for (
        let i = 0;
        i < englishBlocks.length;
        i++
    ) {

        const questionNumber =
            i + 1;


        const english =
            englishBlocks[i];

        const bengali =
            bengaliBlocks[i];

        const answer =
            answers[i];


        const difficulty =
            difficultyRecords.find(
                item =>
                    item.questionNumber ===
                    questionNumber
            );


        const shift =
            english.normalizedShift ||
            normalizeShiftValue(
                english.Shift
            ).value;


        /*
            Preserve GA Writer merge format:

            English / Bengali

            Then:

            Shift|
            Correct|
            Difficulty|
        */

        const block = [

            `Q|${english.Q} / ${bengali.Q}`,

            `A|${english.A} / ${bengali.A}`,

            `B|${english.B} / ${bengali.B}`,

            `C|${english.C} / ${bengali.C}`,

            `D|${english.D} / ${bengali.D}`,

            `Shift| ${shift}`,

            `Correct|${answer}`,

            `Difficulty|${difficulty.difficulty}`

        ].join("\n");


        outputBlocks.push(
            block
        );
    }


    finalOutput =
        outputBlocks.join(
            "\n\n"
        );


    // Final integrity checks

    const generatedCount =
        outputBlocks.length;


    const correctCount =
        (
            finalOutput.match(
                /^Correct\|/gm
            ) || []
        ).length;


    const difficultyCount =
        (
            finalOutput.match(
                /^Difficulty\|/gm
            ) || []
        ).length;


    document.getElementById(
        "generatedBlockCount"
    ).textContent =
        generatedCount;


    document.getElementById(
        "finalCorrectCount"
    ).textContent =
        correctCount;


    document.getElementById(
        "finalDifficultyCount"
    ).textContent =
        difficultyCount;


    const finalPassed =

        generatedCount ===
            englishBlocks.length &&

        correctCount ===
            englishBlocks.length &&

        difficultyCount ===
            englishBlocks.length;


    if (!finalPassed) {

        document.getElementById(
            "finalStatus"
        ).textContent =
            "FAILED";


        downloadBtn.disabled =
            true;


        log(
            "FINAL VALIDATION FAILED."
        );

        return;
    }


    document.getElementById(
        "finalStatus"
    ).textContent =
        "PASSED";


    downloadBtn.disabled =
        false;


    log(
        "--------------------------------"
    );

    log(
        "FINAL MERGE COMPLETED."
    );

    log(
        `Generated Blocks: ${generatedCount}`
    );

    log(
        `Correct| Entries: ${correctCount}`
    );

    log(
        `Difficulty| Entries: ${difficultyCount}`
    );

    log(
        "Final.txt is ready for download."
    );
}


// =========================================
// ISSUE REPORT
// =========================================

function showIssues(issues) {

    issueCard.classList.remove(
        "hidden"
    );


    issueReport.innerHTML =
        "";


    issues.forEach(
        issue => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "mismatch-item";


            const title =
                document.createElement(
                    "div"
                );


            title.className =
                "mismatch-title";


            title.textContent =
                `❌ ${issue.title}`;


            const details =
                document.createElement(
                    "pre"
                );


            details.className =
                "mismatch-line";


            details.textContent =
                issue.details;


            item.appendChild(
                title
            );

            item.appendChild(
                details
            );


            issueReport.appendChild(
                item
            );
        }
    );
}


// =========================================
// DOWNLOAD
// =========================================

function downloadFinalFile() {

    if (
        !validationPassed ||
        !finalOutput
    ) {

        log(
            "Download blocked."
        );

        return;
    }


    const blob =
        new Blob(
            [finalOutput],
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
        "Final.txt";


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
        "Downloaded: Final.txt"
    );
}


// =========================================
// RESET PROCESSING STATE
// =========================================

function resetProcessingState() {

    validationPassed =
        false;

    finalOutput =
        "";

    normalizedShiftCountValue =
        0;


    validateBtn.disabled =
        true;

    mergeBtn.disabled =
        true;

    downloadBtn.disabled =
        true;


    issueCard.classList.add(
        "hidden"
    );

    issueReport.innerHTML =
        "";


    document.getElementById(
        "englishCompleteCount"
    ).textContent =
        "0";


    document.getElementById(
        "bengaliCompleteCount"
    ).textContent =
        "0";


    document.getElementById(
        "shiftCount"
    ).textContent =
        "0";


    document.getElementById(
        "normalizedShiftCount"
    ).textContent =
        "0";


    document.getElementById(
        "validAnswerCount"
    ).textContent =
        "0";


    document.getElementById(
        "difficultyAlignmentCount"
    ).textContent =
        "0";


    document.getElementById(
        "validationIssueCount"
    ).textContent =
        "0";


    document.getElementById(
        "validationStatus"
    ).textContent =
        "WAITING";


    document.getElementById(
        "generatedBlockCount"
    ).textContent =
        "0";


    document.getElementById(
        "finalCorrectCount"
    ).textContent =
        "0";


    document.getElementById(
        "finalDifficultyCount"
    ).textContent =
        "0";


    document.getElementById(
        "finalStatus"
    ).textContent =
        "LOCKED";
}


// =========================================
// LOGGER
// =========================================

function log(message) {

    if (
        consoleBox.textContent.trim() ===
        "Waiting for four TXT files..."
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
// MATH FINAL MERGER
// =========================================

const mathFile1 =
    document.getElementById("mathFile1");

const mathFile2 =
    document.getElementById("mathFile2");

const mathFile3 =
    document.getElementById("mathFile3");

const mathAnalyzeBtn =
    document.getElementById("mathAnalyzeBtn");

const mathMergeBtn =
    document.getElementById("mathMergeBtn");

const mathDownloadBtn =
    document.getElementById("mathDownloadBtn");


let mathQuestionFile = null;

let mathAnswerFile = null;

let mathDifficultyFile = null;


let mathQuestionBlocks = [];

let mathAnswers = [];

let mathDifficultyRecords = [];


let mathValidationPassed = false;

let mathFinalOutput = "";


// =========================================
// NORMALIZE LINE ENDINGS
// =========================================

function normalizeMathText(text) {

    return String(text || "")
        .replace(/\r\n?/g, "\n");
}


// =========================================
// READ FILE
// =========================================

async function readMathFile(file) {

    return {

        name:
            file.name,

        text:
            await file.text()

    };
}


// =========================================
// PARSE QUESTION FILE
//
// Every QEN| starts a new block.
// =========================================

function parseMathQuestionBlocks(text) {

    const lines =
        normalizeMathText(text)
            .split("\n");


    const blocks = [];

    let currentBlock = [];


    for (const line of lines) {

        if (
            /^\s*QEN\|/i.test(line)
        ) {

            if (
                currentBlock.length > 0
            ) {

                blocks.push(
                    currentBlock
                        .join("\n")
                        .trim()
                );
            }


            currentBlock = [
                line
            ];

        } else if (
            currentBlock.length > 0
        ) {

            currentBlock.push(
                line
            );
        }

    }


    if (
        currentBlock.length > 0
    ) {

        blocks.push(
            currentBlock
                .join("\n")
                .trim()
        );
    }


    return blocks.filter(Boolean);
}


// =========================================
// PARSE ANSWER FILE
//
// Only standalone A / B / C / D lines count.
// =========================================

function parseMathAnswers(text) {

    return normalizeMathText(text)

        .split("\n")

        .map(
            line =>
                line
                    .trim()
                    .toUpperCase()
        )

        .filter(
            line =>
                /^[ABCD]$/.test(line)
        );
}


// =========================================
// PARSE DIFFICULTY FILE
//
// Expected:
//
// Question: Simplify:
// Difficulty: 8.35
// =========================================

function parseMathDifficulty(text) {

    const lines =
        normalizeMathText(text)
            .split("\n");


    const records = [];

    let question = null;


    for (const rawLine of lines) {

        const line =
            rawLine.trim();


        if (
            /^Question\s*:/i.test(line)
        ) {

            question =
                line.replace(
                    /^Question\s*:\s*/i,
                    ""
                ).trim();

            continue;
        }


        if (
            /^Difficulty\s*:/i.test(line) &&
            question !== null
        ) {

            const difficulty =
                line.replace(
                    /^Difficulty\s*:\s*/i,
                    ""
                ).trim();


            records.push({

                question:
                    question,

                difficulty:
                    difficulty

            });


            question = null;
        }

    }


    return records;
}


// =========================================
// AUTO DETECT FILE TYPE
// =========================================

function detectMathFileType(
    name,
    text
) {

    const normalized =
        normalizeMathText(text);


    // QUESTION FILE

    if (
        /^\s*QEN\|/im.test(
            normalized
        )
    ) {

        return {

            type:
                "question",

            name:
                name,

            text:
                normalized,

            data:
                parseMathQuestionBlocks(
                    normalized
                )

        };
    }


    // DIFFICULTY FILE

    if (
        /^\s*Question\s*:/im.test(
            normalized
        ) &&
        /^\s*Difficulty\s*:/im.test(
            normalized
        )
    ) {

        return {

            type:
                "difficulty",

            name:
                name,

            text:
                normalized,

            data:
                parseMathDifficulty(
                    normalized
                )

        };
    }


    // ANSWER FILE

    const nonBlankLines =
        normalized

            .split("\n")

            .map(
                line =>
                    line.trim()
            )

            .filter(Boolean);


    const answerFile =

        nonBlankLines.length > 0 &&

        nonBlankLines.every(
            line =>
                /^[ABCD]$/i.test(
                    line
                )
        );


    if (answerFile) {

        return {

            type:
                "answer",

            name:
                name,

            text:
                normalized,

            data:
                parseMathAnswers(
                    normalized
                )

        };
    }


    return {

        type:
            "unknown",

        name:
            name,

        text:
            normalized,

        data:
            []

    };
}


// =========================================
// NORMALIZE QUESTION FOR COMPARISON
// =========================================

function normalizeMathQuestion(
    question
) {

    return String(
        question || ""
    )

        .replace(
            /^\s*QEN\|\s*/i,
            ""
        )

        .replace(
            /^\s*Question\s*:\s*/i,
            ""
        )

        .trim()

        .replace(
            /\s+/g,
            " "
        )

        .toLowerCase();
}


// =========================================
// ANALYZE THREE FILES
// =========================================

mathAnalyzeBtn.addEventListener(

    "click",

    async () => {

        const files = [

            mathFile1.files[0],

            mathFile2.files[0],

            mathFile3.files[0]

        ];


        if (
            files.some(
                file => !file
            )
        ) {

            alert(
                "Please upload all three Math TXT files."
            );

            return;
        }


        mathValidationPassed =
            false;

        mathFinalOutput =
            "";

        mathMergeBtn.disabled =
            true;

        mathDownloadBtn.disabled =
            true;


        document.getElementById(
            "mathIssueReport"
        ).classList.add(
            "hidden"
        );


        document.getElementById(
            "mathConsole"
        ).textContent =
            "Reading Math files...\n";


        const loadedFiles =
            await Promise.all(

                files.map(
                    readMathFile
                )

            );


        const detectedFiles =
            loadedFiles.map(

                file =>
                    detectMathFileType(
                        file.name,
                        file.text
                    )

            );


        const questionFiles =
            detectedFiles.filter(
                file =>
                    file.type ===
                    "question"
            );


        const answerFiles =
            detectedFiles.filter(
                file =>
                    file.type ===
                    "answer"
            );


        const difficultyFiles =
            detectedFiles.filter(
                file =>
                    file.type ===
                    "difficulty"
            );


        const unknownFiles =
            detectedFiles.filter(
                file =>
                    file.type ===
                    "unknown"
            );


        // Must detect exactly one of each.

        if (

            questionFiles.length !== 1 ||

            answerFiles.length !== 1 ||

            difficultyFiles.length !== 1 ||

            unknownFiles.length !== 0

        ) {

            document.getElementById(
                "mathDetectionStatus"
            ).textContent =
                "FAILED";


            document.getElementById(
                "mathValidationStatus"
            ).textContent =
                "FAILED";


            const report =
                document.getElementById(
                    "mathIssueReport"
                );


            report.textContent =

                "❌ File auto-detection failed.\n\n" +

                "Question files detected: " +
                questionFiles.length +
                "\n" +

                "Answer files detected: " +
                answerFiles.length +
                "\n" +

                "Difficulty files detected: " +
                difficultyFiles.length +
                "\n" +

                "Unknown files: " +
                unknownFiles.length;


            report.classList.remove(
                "hidden"
            );


            return;
        }


        mathQuestionFile =
            questionFiles[0];

        mathAnswerFile =
            answerFiles[0];

        mathDifficultyFile =
            difficultyFiles[0];


        mathQuestionBlocks =
            mathQuestionFile.data;

        mathAnswers =
            mathAnswerFile.data;

        mathDifficultyRecords =
            mathDifficultyFile.data;


        // DISPLAY FILE INFORMATION

        document.getElementById(
            "mathQuestionFileName"
        ).textContent =
            mathQuestionFile.name;


        document.getElementById(
            "mathQuestionCount"
        ).textContent =
            mathQuestionBlocks.length;


        document.getElementById(
            "mathAnswerFileName"
        ).textContent =
            mathAnswerFile.name;


        document.getElementById(
            "mathAnswerCount"
        ).textContent =
            mathAnswers.length;


        document.getElementById(
            "mathDifficultyFileName"
        ).textContent =
            mathDifficultyFile.name;


        document.getElementById(
            "mathDifficultyCount"
        ).textContent =
            mathDifficultyRecords.length;


        document.getElementById(
            "mathDetectionStatus"
        ).textContent =
            "PASSED";


        // =================================
        // COUNT VALIDATION
        // =================================

        const sameCount =

            mathQuestionBlocks.length ===
                mathAnswers.length &&

            mathAnswers.length ===
                mathDifficultyRecords.length;


        if (!sameCount) {

            document.getElementById(
                "mathCountStatus"
            ).textContent =
                "FAILED";


            document.getElementById(
                "mathValidationStatus"
            ).textContent =
                "FAILED";


            const report =
                document.getElementById(
                    "mathIssueReport"
                );


            report.textContent =

                "❌ Block count mismatch.\n\n" +

                "Question Blocks: " +
                mathQuestionBlocks.length +
                "\n" +

                "Answers: " +
                mathAnswers.length +
                "\n" +

                "Difficulty Blocks: " +
                mathDifficultyRecords.length;


            report.classList.remove(
                "hidden"
            );


            return;
        }


        document.getElementById(
            "mathCountStatus"
        ).textContent =
            "PASSED";


        // =================================
        // QUESTION ALIGNMENT VALIDATION
        // =================================

        for (

            let i = 0;

            i <
            mathQuestionBlocks.length;

            i++

        ) {

            const questionLine =

                mathQuestionBlocks[i]

                    .split("\n")

                    .find(
                        line =>
                            /^\s*QEN\|/i.test(
                                line
                            )
                    );


            const questionText =
                normalizeMathQuestion(
                    questionLine
                );


            const difficultyQuestion =
                normalizeMathQuestion(
                    mathDifficultyRecords[i]
                        .question
                );


            if (
                questionText !==
                difficultyQuestion
            ) {

                document.getElementById(
                    "mathAlignmentStatus"
                ).textContent =
                    "FAILED";


                document.getElementById(
                    "mathValidationStatus"
                ).textContent =
                    "FAILED";


                const report =
                    document.getElementById(
                        "mathIssueReport"
                    );


                report.textContent =

                    "❌ Question Alignment Mismatch\n\n" +

                    "Block: " +
                    (i + 1) +
                    "\n\n" +

                    "Question File:\n" +
                    questionLine +
                    "\n\n" +

                    "Difficulty File:\n" +

                    "Question: " +

                    mathDifficultyRecords[i]
                        .question;


                report.classList.remove(
                    "hidden"
                );


                return;
            }

        }


        document.getElementById(
            "mathAlignmentStatus"
        ).textContent =
            "PASSED";


        document.getElementById(
            "mathValidationStatus"
        ).textContent =
            "READY";


        mathValidationPassed =
            true;


        mathMergeBtn.disabled =
            false;


        document.getElementById(
            "mathConsole"
        ).textContent =

            "Math file analysis complete.\n\n" +

            "Question Blocks: " +
            mathQuestionBlocks.length +
            "\n" +

            "Answers: " +
            mathAnswers.length +
            "\n" +

            "Difficulty Blocks: " +
            mathDifficultyRecords.length +
            "\n\n" +

            "All validation checks passed.\n" +

            "Ready to generate Final.txt.";

    }

);


// =========================================
// REMOVE OLD GENERATED FIELDS
// =========================================

function cleanMathBlock(block) {

    return block

        .split("\n")

        .filter(

            line =>

                !/^\s*Correct\|/i.test(
                    line
                ) &&

                !/^\s*Difficulty\|/i.test(
                    line
                )

        )

        .join("\n")

        .trim();
}


// =========================================
// GENERATE FINAL MATH OUTPUT
// =========================================

mathMergeBtn.addEventListener(

    "click",

    () => {

        if (
            !mathValidationPassed
        ) {

            return;
        }


        const outputBlocks = [];


        for (

            let i = 0;

            i <
            mathQuestionBlocks.length;

            i++

        ) {

            const block =
                cleanMathBlock(
                    mathQuestionBlocks[i]
                );


            const lines =
                block.split("\n");


            const shiftIndex =
                lines.findIndex(

                    line =>
                        /^\s*Shift\|/i.test(
                            line
                        )

                );


            const newFields = [

                "Correct| " +
                mathAnswers[i],

                "Difficulty| " +
                mathDifficultyRecords[i]
                    .difficulty

            ];


            // Insert after Shift|

            if (
                shiftIndex !== -1
            ) {

                lines.splice(

                    shiftIndex + 1,

                    0,

                    ...newFields

                );

            } else {

                // Safety fallback

                lines.push(
                    ...newFields
                );
            }


            outputBlocks.push(

                lines
                    .join("\n")
                    .trim()

            );

        }


        mathFinalOutput =

            outputBlocks.join(
                "\n\n"
            );


        const generatedCount =
            outputBlocks.length;


        const correctCount =
            (
                mathFinalOutput.match(
                    /^Correct\|/gm
                ) || []
            ).length;


        const difficultyCount =
            (
                mathFinalOutput.match(
                    /^Difficulty\|/gm
                ) || []
            ).length;


        document.getElementById(
            "mathGeneratedCount"
        ).textContent =
            generatedCount;


        document.getElementById(
            "mathCorrectCount"
        ).textContent =
            correctCount;


        document.getElementById(
            "mathMergedDifficultyCount"
        ).textContent =
            difficultyCount;


        const finalPassed =

            generatedCount ===
                mathQuestionBlocks.length &&

            correctCount ===
                mathQuestionBlocks.length &&

            difficultyCount ===
                mathQuestionBlocks.length;


        if (!finalPassed) {

            document.getElementById(
                "mathMergeStatus"
            ).textContent =
                "FAILED";


            mathDownloadBtn.disabled =
                true;


            return;
        }


        document.getElementById(
            "mathMergeStatus"
        ).textContent =
            "COMPLETE";


        mathDownloadBtn.disabled =
            false;


        document.getElementById(
            "mathConsole"
        ).textContent +=

            "\n\nMerge complete.\n" +

            "Generated Blocks: " +
            generatedCount +
            "\n" +

            "Correct| Entries: " +
            correctCount +
            "\n" +

            "Difficulty| Entries: " +
            difficultyCount +
            "\n\n" +

            "Final.txt is ready.";

    }

);


// =========================================
// DOWNLOAD FINAL.TXT
// =========================================

mathDownloadBtn.addEventListener(

    "click",

    () => {

        if (
            !mathFinalOutput
        ) {

            return;
        }


        const blob =
            new Blob(

                [
                    mathFinalOutput
                ],

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
            "Final.txt";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );

    }

);
