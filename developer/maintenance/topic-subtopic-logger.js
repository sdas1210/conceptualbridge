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
// QUESTION METADATA CONTROL REFERENCES
// =========================================

const questionTopicControl =
    document.getElementById(
        "questionTopicControl"
    );

const questionTopicSelect =
    document.getElementById(
        "questionTopicSelect"
    );

const addQuestionTopicBtn =
    document.getElementById(
        "addQuestionTopicBtn"
    );

const questionSubTopicControl =
    document.getElementById(
        "questionSubTopicControl"
    );

const questionSubTopicSelect =
    document.getElementById(
        "questionSubTopicSelect"
    );

const addQuestionSubTopicBtn =
    document.getElementById(
        "addQuestionSubTopicBtn"
    );

const editQuestionMetadataBtn =
    document.getElementById(
        "editQuestionMetadataBtn"
    );

const applyQuestionMetadataBtn =
    document.getElementById(
        "applyQuestionMetadataBtn"
    );

const activeGlobalTopicBar =
    document.getElementById(
        "activeGlobalTopicBar"
    );

const activeGlobalTopicName =
    document.getElementById(
        "activeGlobalTopicName"
    );

const changeGlobalTopicBtn =
    document.getElementById(
        "changeGlobalTopicBtn"
    );




// =========================================
// DOWNLOAD OUTPUT REFERENCES
// =========================================

const mathDownloadArea =
    document.getElementById(
        "mathDownloadArea"
    );


const downloadMathOutputBtn =
    document.getElementById(
        "downloadMathOutputBtn"
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
// QUESTION LOGGING STATE
// =========================================

let originalMathText = "";

let mathQuestionAssignments = [];

let originalGlobalSection = "";

let mathSourceFileName = "";

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

        populateQuestionTopicSelect();


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
// POPULATE QUESTION TOPIC DROPDOWN
// =========================================

function populateQuestionTopicSelect() {

    questionTopicSelect.innerHTML = "";


    const defaultOption =
        document.createElement(
            "option"
        );

    defaultOption.value = "";

    defaultOption.textContent =
        "Topic";


    questionTopicSelect.appendChild(
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


        questionTopicSelect.appendChild(
            option
        );

    }

}

// =========================================
// POPULATE SUBTOPICS FOR A TOPIC
// =========================================

function populateQuestionSubTopicSelect(
    topicName
) {

    questionSubTopicSelect.innerHTML = "";


    const defaultOption =
        document.createElement(
            "option"
        );

    defaultOption.value = "";

    defaultOption.textContent =
        "SubTopic";


    questionSubTopicSelect.appendChild(
        defaultOption
    );


    if (!topicName) {

        return;

    }


    const topic =
        mathTopicCatalogue.topics.find(

            item =>
                item.name === topicName

        );


    if (
        !topic ||
        !Array.isArray(topic.subtopics)
    ) {

        return;

    }


    const sortedSubTopics =

        [...topic.subtopics]

            .sort(
                (a, b) =>

                    String(a)
                        .localeCompare(
                            String(b)
                        )
            );


    for (
        const subTopic
        of sortedSubTopics
    ) {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            subTopic;

        option.textContent =
            subTopic;


        questionSubTopicSelect.appendChild(
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

        questionTopicControl.classList.remove(
            "hidden"
        );
        
        activeGlobalTopicBar.classList.add(
            "hidden"
        );
        
        questionTopicSelect.value =
            "";
        
        populateQuestionSubTopicSelect(
            ""
        );


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

        activeGlobalTopicName.textContent =
            selectedGlobalTopic;
        
        
        activeGlobalTopicBar.classList.remove(
            "hidden"
        );
        
        
        questionTopicControl.classList.add(
            "hidden"
        );
        
        
        populateQuestionSubTopicSelect(
            selectedGlobalTopic
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

questionTopicSelect.addEventListener(
    "change",
    () => {

        populateQuestionSubTopicSelect(
            questionTopicSelect.value
        );

    }
);

// =========================================
// CHANGE GLOBAL TOPIC
// =========================================

changeGlobalTopicBtn.addEventListener(
    "click",
    () => {

        globalTopicSelect.value =
            selectedGlobalTopic;


        mathBlockViewer.classList.add(
            "hidden"
        );


        globalTopicSetup.classList.remove(
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
// EXTRACT GLOBAL SECTION
// =========================================

function extractMathGlobalSection(text) {

    const normalized =
        normalizeMathText(text);

    const lines =
        normalized.split("\n");

    const globalLines = [];


    for (const line of lines) {

        if (
            /^\s*QEN\|/i.test(line)
        ) {

            break;

        }


        globalLines.push(
            line
        );

    }


    return globalLines
        .join("\n")
        .trim();

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
// SET / REPLACE QUESTION METADATA
// =========================================

function setQuestionMetadata(
    block,
    topic,
    subTopic
) {

    let lines =
        normalizeMathText(block)
            .split("\n");


    // Remove any existing question-level
    // Topic or SubTopic metadata.
    //
    // Supports both:
    // SubTopic|
    // Sub-Topic|

    lines =
        lines.filter(
            line =>

                !/^\s*Topic\|/i.test(line) &&

                !/^\s*(SubTopic|Sub-Topic)\|/i.test(line)
        );


    // Remove trailing blank lines
    // before adding fresh metadata.

    while (
        lines.length > 0 &&
        lines[
            lines.length - 1
        ].trim() === ""
    ) {

        lines.pop();

    }


    // Add fresh metadata.

    lines.push(
        "Topic| " + topic
    );


    lines.push(
        "SubTopic| " + subTopic
    );


    return lines.join("\n");

}

// =========================================
// BUILD / UPDATE GLOBAL METADATA SECTION
// =========================================

function buildMathGlobalSection() {

    let globalText =
        originalGlobalSection;


    // =====================================
    // MODE 1
    // Topic + SubTopic are question-level.
    // Do not modify global Topic.
    // =====================================

    if (
        mathLoggingMode !==
        "subtopic-only"
    ) {

        return globalText;

    }


    // =====================================
    // MODE 2
    // Global Topic is required.
    // =====================================

    if (!selectedGlobalTopic) {

        return globalText;

    }


    // =====================================
    // NO GLOBAL METADATA EXISTS
    // =====================================

    if (!globalText.trim()) {

        return (
            "Topic| " +
            selectedGlobalTopic
        );

    }


    let lines =
        normalizeMathText(
            globalText
        ).split("\n");


    let topicFound =
        false;


    // =====================================
    // REPLACE EXISTING GLOBAL Topic|
    // =====================================

    lines =
        lines.map(
            line => {

                if (
                    /^\s*Topic\|/i.test(
                        line
                    )
                ) {

                    topicFound =
                        true;


                    return (
                        "Topic| " +
                        selectedGlobalTopic
                    );

                }


                return line;

            }
        );


    // =====================================
    // IF Topic| DOES NOT EXIST,
    // ADD IT TO GLOBAL METADATA
    // =====================================

    if (!topicFound) {

        /*
         * Prefer inserting Topic immediately
         * after Subject| when possible.
         */

        const subjectIndex =
            lines.findIndex(
                line =>
                    /^\s*Subject\|/i.test(
                        line
                    )
            );


        if (
            subjectIndex !== -1
        ) {

            lines.splice(
                subjectIndex + 1,
                0,
                "Topic| " +
                selectedGlobalTopic
            );

        }

        else {

            lines.push(
                "Topic| " +
                selectedGlobalTopic
            );

        }

    }


    return lines.join("\n");

}

// =========================================
// BUILD FINAL MATH TXT
// =========================================

function buildFinalMathText() {

    const globalSection =
        buildMathGlobalSection();


    const questionSection =
        mathBlocks
            .map(
                block =>
                    normalizeMathText(block)
                        .trim()
            )
            .filter(
                block =>
                    block !== ""
            )
            .join("\n\n");


    // =====================================
    // GLOBAL METADATA + QUESTIONS
    // =====================================

    if (
        globalSection &&
        globalSection.trim()
    ) {

        return (

            globalSection.trim() +

            "\n\n" +

            questionSection +

            "\n"

        );

    }


    // =====================================
    // QUESTIONS ONLY
    // =====================================

    return (

        questionSection +

        "\n"

    );

}

// =========================================
// UPDATE MATH COMPLETION STATUS
// =========================================

function updateMathCompletionStatus() {

    const allCompleted =

        mathQuestionAssignments.length > 0 &&

        mathQuestionAssignments.every(
            assignment =>
                assignment.completed === true
        );


    if (allCompleted) {

        mathDownloadArea.classList.remove(
            "hidden"
        );

    }

    else {

        mathDownloadArea.classList.add(
            "hidden"
        );

    }

}

// =========================================
// DOWNLOAD UPDATED MATH TXT
// =========================================

downloadMathOutputBtn.addEventListener(
    "click",
    () => {

        const finalText =
            buildFinalMathText();


        const blob =
            new Blob(
                [finalText],
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


        // Remove only the .txt extension

        const baseName =

            mathSourceFileName.replace(
                /\.txt$/i,
                ""
            );


        link.href =
            url;


        link.download =

            baseName +

            "-topic-logged.txt";


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

        // Preserve original source data.

        originalMathText =
            normalizeMathText(text);
        
        
        originalGlobalSection =
            extractMathGlobalSection(text);
        
        
        mathSourceFileName =
            file.name;


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

        mathQuestionAssignments =

        mathBlocks.map(
            () => ({
    
                topic: "",
    
                subTopic: "",
    
                completed: false
    
            })
        );
        currentMathBlockIndex =
            0;

        // A newly loaded file has not yet
        // completed the logging process.
        
        mathDownloadArea.classList.add(
            "hidden"
        );


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

    // =========================================
    // RESTORE SAVED QUESTION ASSIGNMENT
    // =========================================
    
    const assignment =
    
        mathQuestionAssignments[
            currentMathBlockIndex
        ];
    
    
    if (!assignment) {
    
        return;
    
    }
    
    
    // -----------------------------------------
    // MODE 1
    // TOPIC + SUBTOPIC PER QUESTION
    // -----------------------------------------
    
    if (
        mathLoggingMode === "both"
    ) {
    
        // Restore Topic.
    
        questionTopicSelect.value =
            assignment.topic || "";
    
    
        // Rebuild SubTopic options
        // according to restored Topic.
    
        populateQuestionSubTopicSelect(
            assignment.topic || ""
        );
    
    
        // Restore SubTopic.
    
        questionSubTopicSelect.value =
            assignment.subTopic || "";
    
    }
    
    
    // -----------------------------------------
    // MODE 2
    // GLOBAL TOPIC + QUESTION SUBTOPIC
    // -----------------------------------------
    
    else if (
        mathLoggingMode ===
        "subtopic-only"
    ) {
    
        // Topic comes from the global selection.
    
        populateQuestionSubTopicSelect(
            selectedGlobalTopic
        );
    
    
        // Restore this question's SubTopic.
    
        questionSubTopicSelect.value =
            assignment.subTopic || "";
    
    }

}

// =========================================
// APPLY QUESTION METADATA
// =========================================

applyQuestionMetadataBtn.addEventListener(
    "click",
    () => {

        // ---------------------------------
        // SAFETY CHECK
        // ---------------------------------

        if (
            mathBlocks.length === 0
        ) {

            return;

        }


        let topic = "";

        let subTopic = "";


        // =================================
        // MODE 1
        // TOPIC + SUBTOPIC PER QUESTION
        // =================================

        if (
            mathLoggingMode === "both"
        ) {

            topic =
                questionTopicSelect
                    .value
                    .trim();


            subTopic =
                questionSubTopicSelect
                    .value
                    .trim();


            if (!topic) {

                alert(
                    "Please select a Topic."
                );

                return;

            }


            if (!subTopic) {

                alert(
                    "Please select a SubTopic."
                );

                return;

            }

        }


        // =================================
        // MODE 2
        // GLOBAL TOPIC + SUBTOPIC PER QUESTION
        // =================================

        else if (
            mathLoggingMode ===
            "subtopic-only"
        ) {

            if (!selectedGlobalTopic) {

                alert(
                    "Global Topic is missing."
                );

                return;

            }


            // Question-level Topic remains blank.
            // Global Topic will be written later
            // into the global metadata section.

            topic = "";


            subTopic =
                questionSubTopicSelect
                    .value
                    .trim();


            if (!subTopic) {

                alert(
                    "Please select a SubTopic."
                );

                return;

            }

        }


        // =================================
        // NO VALID MODE
        // =================================

        else {

            alert(
                "Please choose a logging mode."
            );

            return;

        }


        // =================================
        // SAVE ASSIGNMENT
        // =================================

        mathQuestionAssignments[
            currentMathBlockIndex
        ] = {

            topic:
                topic,

            subTopic:
                subTopic,

            completed:
                true

        };

        // Check whether every question
        // has now been logged.
        
        updateMathCompletionStatus();


        // =================================
        // MODIFY CURRENT QUESTION BLOCK
        // =================================

        mathBlocks[
            currentMathBlockIndex
        ] =

            setQuestionMetadata(

                mathBlocks[
                    currentMathBlockIndex
                ],

                topic,

                subTopic

            );


        // =================================
        // AUTO ADVANCE
        // =================================

        if (

            currentMathBlockIndex <

            mathBlocks.length - 1

        ) {

            currentMathBlockIndex++;


            renderMathBlock();

        }


        // =================================
        // LAST QUESTION
        // =================================

        else {

            renderMathBlock();


            alert(
                "You have reached the last question. " +
                "You can use the navigation buttons " +
                "to review your logged questions."
            );

        }

    }
);


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

