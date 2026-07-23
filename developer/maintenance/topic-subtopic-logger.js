// =========================================
// TOPIC & SUBTOPIC LOGGER
// =========================================


// =========================================
// SUBJECT REFERENCES
// =========================================

const mathLoggerBtn =
    document.getElementById(
        "mathLoggerBtn"
    );

const giLoggerBtn =
    document.getElementById(
        "giLoggerBtn"
    );

const scienceLoggerBtn =
    document.getElementById(
        "scienceLoggerBtn"
    );


// =========================================
// MATH WORKSPACE REFERENCES
// =========================================

const mathLoggerWorkspace =
    document.getElementById(
        "mathLoggerWorkspace"
    );

const mathQuestionFile =
    document.getElementById(
        "mathQuestionFile"
    );

const loadMathFileBtn =
    document.getElementById(
        "loadMathFileBtn"
    );

const closeMathWorkspaceBtn =
    document.getElementById(
        "closeMathWorkspaceBtn"
    );

const mathFileInfo =
    document.getElementById(
        "mathFileInfo"
    );

const mathBlockViewer =
    document.getElementById(
        "mathBlockViewer"
    );

const mathFileName =
    document.getElementById(
        "mathFileName"
    );

const mathBlockCount =
    document.getElementById(
        "mathBlockCount"
    );

const mathBlockPosition =
    document.getElementById(
        "mathBlockPosition"
    );

const mathBlockContent =
    document.getElementById(
        "mathBlockContent"
    );

const mathBlockCounter =
    document.getElementById(
        "mathBlockCounter"
    );

const previousMathBlockBtn =
    document.getElementById(
        "previousMathBlockBtn"
    );

const nextMathBlockBtn =
    document.getElementById(
        "nextMathBlockBtn"
    );


// =========================================
// DEVELOPMENT STATE
// =========================================

const loggerModes = {

    math: {
        enabled: true
    },

    generalIntelligence: {
        enabled: false
    },

    science: {
        enabled: false
    }

};


// =========================================
// MATH STATE
// =========================================

let mathBlocks = [];

let currentMathBlockIndex = 0;


// =========================================
// INITIALIZE
// =========================================

function initializeTopicSubTopicLogger() {

    mathLoggerBtn.disabled =
        !loggerModes.math.enabled;

    giLoggerBtn.disabled =
        !loggerModes.generalIntelligence.enabled;

    scienceLoggerBtn.disabled =
        !loggerModes.science.enabled;

}


initializeTopicSubTopicLogger();
// =========================================
// MATH LOGGER WORKSPACE
// =========================================

const mathLoggerWorkspace =
    document.getElementById(
        "mathLoggerWorkspace"
    );

const mathQuestionFile =
    document.getElementById(
        "mathQuestionFile"
    );

const loadMathFileBtn =
    document.getElementById(
        "loadMathFileBtn"
    );

const closeMathWorkspaceBtn =
    document.getElementById(
        "closeMathWorkspaceBtn"
    );

const mathFileInfo =
    document.getElementById(
        "mathFileInfo"
    );

const mathBlockViewer =
    document.getElementById(
        "mathBlockViewer"
    );

const mathFileName =
    document.getElementById(
        "mathFileName"
    );

const mathBlockCount =
    document.getElementById(
        "mathBlockCount"
    );

const mathBlockPosition =
    document.getElementById(
        "mathBlockPosition"
    );

const mathBlockContent =
    document.getElementById(
        "mathBlockContent"
    );

const mathBlockCounter =
    document.getElementById(
        "mathBlockCounter"
    );

const previousMathBlockBtn =
    document.getElementById(
        "previousMathBlockBtn"
    );

const nextMathBlockBtn =
    document.getElementById(
        "nextMathBlockBtn"
    );


// =========================================
// MATH STATE
// =========================================

let mathBlocks = [];

let currentMathBlockIndex = 0;


// =========================================
// OPEN MATH WORKSPACE
// =========================================

mathLoggerBtn.addEventListener(
    "click",
    () => {

        mathLoggerWorkspace.classList.remove(
            "hidden"
        );

        mathLoggerWorkspace.scrollIntoView({

            behavior:
                "smooth",

            block:
                "start"

        });

    }
);


// =========================================
// CLOSE MATH WORKSPACE
// =========================================

closeMathWorkspaceBtn.addEventListener(
    "click",
    () => {

        mathLoggerWorkspace.classList.add(
            "hidden"
        );

    }
);


// =========================================
// NORMALIZE TEXT
// =========================================

function normalizeMathText(text) {

    return String(text || "")
        .replace(/\r\n?/g, "\n");

}


// =========================================
// EXTRACT QEN| BLOCKS
//
// RULE:
//
// QEN| always starts a new block.
//
// Blank lines DO NOT determine
// where a question begins or ends.
// =========================================

function extractMathBlocks(text) {

    const lines =
        normalizeMathText(text)
            .split("\n");


    const blocks = [];

    let currentBlock = [];


    for (const line of lines) {

        if (
            /^\s*QEN\|/i.test(line)
        ) {

            // Save previous block.

            if (
                currentBlock.length > 0
            ) {

                blocks.push(

                    currentBlock
                        .join("\n")
                        .trim()

                );

            }


            // Start new block.

            currentBlock = [
                line
            ];

        }

        else if (
            currentBlock.length > 0
        ) {

            currentBlock.push(
                line
            );

        }

    }


    // Save final block.

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
// LOAD TXT FILE
// =========================================

loadMathFileBtn.addEventListener(
    "click",
    async () => {

        const file =
            mathQuestionFile.files[0];


        if (!file) {

            alert(
                "Please select one Math TXT file."
            );

            return;

        }


        const text =
            await file.text();


        const detectedBlocks =
            extractMathBlocks(text);


        if (
            detectedBlocks.length === 0
        ) {

            alert(
                "No QEN| question blocks were found."
            );

            return;

        }


        mathBlocks =
            detectedBlocks;


        currentMathBlockIndex =
            0;


        // Show file information.

        mathFileName.textContent =
            file.name;


        mathBlockCount.textContent =
            mathBlocks.length;


        mathFileInfo.classList.remove(
            "hidden"
        );


        mathBlockViewer.classList.remove(
            "hidden"
        );


        renderMathBlock();

    }
);


// =========================================
// DISPLAY CURRENT QUESTION BLOCK
// =========================================

function renderMathBlock() {

    if (
        mathBlocks.length === 0
    ) {

        return;

    }


    const questionNumber =
        currentMathBlockIndex + 1;


    mathBlockContent.textContent =

        mathBlocks[
            currentMathBlockIndex
        ];


    mathBlockPosition.textContent =

        "Question " +
        questionNumber +
        " of " +
        mathBlocks.length;


    mathBlockCounter.textContent =

        questionNumber +
        " / " +
        mathBlocks.length;


    previousMathBlockBtn.disabled =

        currentMathBlockIndex === 0;


    nextMathBlockBtn.disabled =

        currentMathBlockIndex ===
        mathBlocks.length - 1;

}


// =========================================
// PREVIOUS QUESTION
// =========================================

previousMathBlockBtn.addEventListener(
    "click",
    () => {

        if (
            currentMathBlockIndex > 0
        ) {

            currentMathBlockIndex--;

            renderMathBlock();

        }

    }
);


// =========================================
// NEXT QUESTION
// =========================================

nextMathBlockBtn.addEventListener(
    "click",
    () => {

        if (

            currentMathBlockIndex <

            mathBlocks.length - 1

        ) {

            currentMathBlockIndex++;

            renderMathBlock();

        }

    }
);

// =========================================
// OPEN MATH WORKSPACE
// =========================================

mathLoggerBtn.addEventListener(
    "click",
    () => {

        mathLoggerWorkspace.classList.remove(
            "hidden"
        );

        mathLoggerWorkspace.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


// =========================================
// CLOSE MATH WORKSPACE
// =========================================

closeMathWorkspaceBtn.addEventListener(
    "click",
    () => {

        mathLoggerWorkspace.classList.add(
            "hidden"
        );

    }
);


// =========================================
// NORMALIZE TXT
// =========================================

function normalizeMathText(text) {

    return String(text || "")
        .replace(/\r\n?/g, "\n");

}


// =========================================
// EXTRACT QEN| BLOCKS
//
// IMPORTANT:
//
// Blank lines do NOT define blocks.
//
// Every QEN| starts a new block.
//
// The block continues until:
// - the next QEN|
// - or end of file
// =========================================

function extractMathBlocks(text) {

    const lines =
        normalizeMathText(text)
            .split("\n");

    const blocks = [];

    let currentBlock = [];


    for (const line of lines) {

        if (
            /^\s*QEN\|/i.test(line)
        ) {

            // Save previous block.

            if (
                currentBlock.length > 0
            ) {

                blocks.push(
                    currentBlock
                        .join("\n")
                        .trim()
                );

            }


            // Start new block.

            currentBlock = [
                line
            ];

        }

        else if (
            currentBlock.length > 0
        ) {

            // Continue current block.

            currentBlock.push(
                line
            );

        }

    }


    // Save final block.

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
// LOAD TXT FILE
// =========================================

loadMathFileBtn.addEventListener(
    "click",
    async () => {

        const file =
            mathQuestionFile.files[0];


        if (!file) {

            alert(
                "Please select one Math TXT file."
            );

            return;

        }


        const text =
            await file.text();


        const detectedBlocks =
            extractMathBlocks(text);


        if (
            detectedBlocks.length === 0
        ) {

            alert(
                "No QEN| question blocks were found in this TXT file."
            );

            return;

        }


        mathBlocks =
            detectedBlocks;


        currentMathBlockIndex =
            0;


        // FILE INFORMATION

        mathFileName.textContent =
            file.name;


        mathBlockCount.textContent =
            mathBlocks.length;


        mathFileInfo.classList.remove(
            "hidden"
        );


        mathBlockViewer.classList.remove(
            "hidden"
        );


        renderMathBlock();

    }
);


// =========================================
// RENDER CURRENT BLOCK
// =========================================

function renderMathBlock() {

    if (
        mathBlocks.length === 0
    ) {

        return;

    }


    const displayNumber =
        currentMathBlockIndex + 1;


    mathBlockContent.textContent =
        mathBlocks[
            currentMathBlockIndex
        ];


    mathBlockPosition.textContent =

        "Question " +
        displayNumber +
        " of " +
        mathBlocks.length;


    mathBlockCounter.textContent =

        displayNumber +
        " / " +
        mathBlocks.length;


    // Navigation limits.

    previousMathBlockBtn.disabled =
        currentMathBlockIndex === 0;


    nextMathBlockBtn.disabled =

        currentMathBlockIndex ===
        mathBlocks.length - 1;

}


// =========================================
// PREVIOUS BLOCK
// =========================================

previousMathBlockBtn.addEventListener(
    "click",
    () => {

        if (
            currentMathBlockIndex > 0
        ) {

            currentMathBlockIndex--;

            renderMathBlock();

        }

    }
);


// =========================================
// NEXT BLOCK
// =========================================

nextMathBlockBtn.addEventListener(
    "click",
    () => {

        if (

            currentMathBlockIndex <

            mathBlocks.length - 1

        ) {

            currentMathBlockIndex++;

            renderMathBlock();

        }

    }
);
