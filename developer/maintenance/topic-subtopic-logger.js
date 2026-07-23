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

const mathLoggingModeSelector =
    document.getElementById(
        "mathLoggingModeSelector"
    );

const logBothModeBtn =
    document.getElementById(
        "logBothModeBtn"
    );

const logSubTopicOnlyModeBtn =
    document.getElementById(
        "logSubTopicOnlyModeBtn"
    );

const globalTopicSetup =
    document.getElementById(
        "globalTopicSetup"
    );

const globalTopicSelect =
    document.getElementById(
        "globalTopicSelect"
    );

const addGlobalTopicBtn =
    document.getElementById(
        "addGlobalTopicBtn"
    );

const editGlobalTopicBtn =
    document.getElementById(
        "editGlobalTopicBtn"
    );

const confirmGlobalTopicBtn =
    document.getElementById(
        "confirmGlobalTopicBtn"
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

let mathLoggingMode = null;

let selectedGlobalTopic = "";

// =========================================
// MATH TOPIC CATALOGUE STATE
// =========================================

let mathTopicCatalogue = {

    version: 1,

    topics: []

};

let mathCatalogueChanged = false;
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
// LOAD MATH TOPIC CATALOGUE
// =========================================

async function loadMathTopicCatalogue() {

    try {

        const response =
            await fetch(
                "math.json",
                {
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load math.json"
            );

        }


        const data =
            await response.json();


        if (
            !data ||
            !Array.isArray(data.topics)
        ) {

            throw new Error(
                "Invalid math.json structure"
            );

        }


        mathTopicCatalogue =
            data;


        populateGlobalTopicSelect();


        console.log(

            "Math catalogue loaded:",

            mathTopicCatalogue.topics.length,

            "topics"

        );

    }

    catch (error) {

        console.error(

            "Math catalogue error:",

            error

        );


        alert(

            "math.json could not be loaded. " +

            "Make sure math.json is in the same folder " +

            "as the Topic & SubTopic Logger."

        );

    }

}

// =========================================
// POPULATE GLOBAL TOPIC DROPDOWN
// =========================================

function populateGlobalTopicSelect() {

    globalTopicSelect.innerHTML = "";


    const defaultOption =
        document.createElement(
            "option"
        );


    defaultOption.value = "";

    defaultOption.textContent =
        "Select Topic";


    globalTopicSelect.appendChild(
        defaultOption
    );


    const sortedTopics =

        [...mathTopicCatalogue.topics]

            .sort(
                (a, b) =>

                    String(a.name)
                        .localeCompare(
                            String(b.name)
                        )
            );


    for (
        const topic
        of sortedTopics
    ) {

        if (
            !topic ||
            !topic.name
        ) {

            continue;

        }


        const option =
            document.createElement(
                "option"
            );


        option.value =
            topic.name;


        option.textContent =
            topic.name;


        globalTopicSelect.appendChild(
            option
        );

    }

}

// =========================================
// OPEN MATH WORKSPACE
// =========================================
mathLoggerBtn.addEventListener(
    "click",
    async () => {

        mathLoggerWorkspace.classList.remove(
            "hidden"
        );


        await loadMathTopicCatalogue();


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
// MODE 1
// TOPIC + SUBTOPIC PER QUESTION
// =========================================

logBothModeBtn.addEventListener(
    "click",
    () => {

        mathLoggingMode =
            "both";


        selectedGlobalTopic =
            "";


        mathLoggingModeSelector.classList.add(
            "hidden"
        );


        globalTopicSetup.classList.add(
            "hidden"
        );


        mathBlockViewer.classList.remove(
            "hidden"
        );


        currentMathBlockIndex =
            0;


        renderMathBlock();

    }
);

// =========================================
// MODE 2
// GLOBAL TOPIC + PER-QUESTION SUBTOPIC
// =========================================

logSubTopicOnlyModeBtn.addEventListener(
    "click",
    () => {

        mathLoggingMode =
            "subtopic-only";


        mathLoggingModeSelector.classList.add(
            "hidden"
        );


        globalTopicSetup.classList.remove(
            "hidden"
        );


        mathBlockViewer.classList.add(
            "hidden"
        );

    }
);

confirmGlobalTopicBtn.addEventListener(
    "click",
    () => {

        const topic =
            globalTopicSelect.value.trim();


        if (!topic) {

            alert(
                "Please select a Topic."
            );

            return;

        }


        selectedGlobalTopic =
            topic;


        globalTopicSetup.classList.add(
            "hidden"
        );


        mathBlockViewer.classList.remove(
            "hidden"
        );


        currentMathBlockIndex =
            0;


        renderMathBlock();

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
        
        mathLoggingModeSelector.classList.remove(
            "hidden"
        );
        
        mathBlockViewer.classList.add(
            "hidden"
        );
        
        globalTopicSetup.classList.add(
            "hidden"
        );

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

