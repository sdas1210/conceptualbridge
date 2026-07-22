// =========================================
// CHARACTER INTRODUCER
// Conceptual Bridge Maintenance Suite
// UI Foundation
// =========================================


// =========================================
// ELEMENT REFERENCES
// =========================================

const txtFileInput =
    document.getElementById(
        "txtFileInput"
    );

const fileStatus =
    document.getElementById(
        "fileStatus"
    );

const operationSelector =
    document.getElementById(
        "operationSelector"
    );

const operationCards =
    document.querySelectorAll(
        ".operation-card"
    );

const operationWorkspace =
    document.getElementById(
        "operationWorkspace"
    );

const workspacePlaceholder =
    document.getElementById(
        "workspacePlaceholder"
    );

const selectedOperationBadge =
    document.getElementById(
        "selectedOperationBadge"
    );


const writeWorkspace =
    document.getElementById(
        "writeWorkspace"
    );

const createWorkspace =
    document.getElementById(
        "createWorkspace"
    );

const deleteWorkspace =
    document.getElementById(
        "deleteWorkspace"
    );


const infoFileName =
    document.getElementById(
        "infoFileName"
    );

const infoTotalLines =
    document.getElementById(
        "infoTotalLines"
    );

const infoOperation =
    document.getElementById(
        "infoOperation"
    );

const infoStatus =
    document.getElementById(
        "infoStatus"
    );


const consoleBox =
    document.getElementById(
        "console"
    );

const newSessionBtn =
    document.getElementById(
        "newSessionBtn"
    );

const downloadBtn =
    document.getElementById(
        "downloadBtn"
    );

const writeModeSelection =
    document.getElementById(
        "writeModeSelection"
    );

const writeStartBtn =
    document.getElementById(
        "writeStartBtn"
    );

const payloadSection =
    document.getElementById(
        "payloadSection"
    );

const payloadInput =
    document.getElementById(
        "payloadInput"
    );

const payloadOkBtn =
    document.getElementById(
        "payloadOkBtn"
    );

const lineNavigator =
    document.getElementById(
        "lineNavigator"
    );

const currentLineLabel =
    document.getElementById(
        "currentLineLabel"
    );

const currentLineViewer =
    document.getElementById(
        "currentLineViewer"
    );

const previousLineBtn =
    document.getElementById(
        "previousLineBtn"
    );

const nextLineBtn =
    document.getElementById(
        "nextLineBtn"
    );

const firstAnchorBtn =
    document.getElementById(
        "firstAnchorBtn"
    );

const secondAnchorBtn =
    document.getElementById(
        "secondAnchorBtn"
    );

const adjustAnchorsBtn =
    document.getElementById(
        "adjustAnchorsBtn"
    );

const runOperationBtn =
    document.getElementById(
        "runOperationBtn"
    );

const firstAnchorDisplay =
    document.getElementById(
        "firstAnchorDisplay"
    );

const secondAnchorDisplay =
    document.getElementById(
        "secondAnchorDisplay"
    );

const gapDisplay =
    document.getElementById(
        "gapDisplay"
    );

const targetCountDisplay =
    document.getElementById(
        "targetCountDisplay"
    );

const anchorStatus =
    document.getElementById(
        "anchorStatus"
    );
const createModeSelection =
    document.getElementById(
        "createModeSelection"
    );

const createBlankLineBtn =
    document.getElementById(
        "createBlankLineBtn"
    );

const createPayloadLineBtn =
    document.getElementById(
        "createPayloadLineBtn"
    );

const createPayloadSection =
    document.getElementById(
        "createPayloadSection"
    );

const createPayloadInput =
    document.getElementById(
        "createPayloadInput"
    );

const createPayloadOkBtn =
    document.getElementById(
        "createPayloadOkBtn"
    );

const createLineNavigator =
    document.getElementById(
        "createLineNavigator"
    );

const createCurrentLineLabel =
    document.getElementById(
        "createCurrentLineLabel"
    );

const createCurrentLineViewer =
    document.getElementById(
        "createCurrentLineViewer"
    );

const createPreviousLineBtn =
    document.getElementById(
        "createPreviousLineBtn"
    );

const createNextLineBtn =
    document.getElementById(
        "createNextLineBtn"
    );

const createFirstAnchorBtn =
    document.getElementById(
        "createFirstAnchorBtn"
    );

const createSecondAnchorBtn =
    document.getElementById(
        "createSecondAnchorBtn"
    );

const createAdjustAnchorsBtn =
    document.getElementById(
        "createAdjustAnchorsBtn"
    );

const createRunOperationBtn =
    document.getElementById(
        "createRunOperationBtn"
    );

const createFirstAnchorDisplay =
    document.getElementById(
        "createFirstAnchorDisplay"
    );

const createSecondAnchorDisplay =
    document.getElementById(
        "createSecondAnchorDisplay"
    );

const createGapDisplay =
    document.getElementById(
        "createGapDisplay"
    );

const createTargetCountDisplay =
    document.getElementById(
        "createTargetCountDisplay"
    );

const createAnchorStatus =
    document.getElementById(
        "createAnchorStatus"
    );

const deleteModeSelection =
    document.getElementById(
        "deleteModeSelection"
    );

const deleteCompleteBtn =
    document.getElementById(
        "deleteCompleteBtn"
    );

const deleteBackspaceBtn =
    document.getElementById(
        "deleteBackspaceBtn"
    );

const deleteLineNavigator =
    document.getElementById(
        "deleteLineNavigator"
    );

const deleteCurrentLineLabel =
    document.getElementById(
        "deleteCurrentLineLabel"
    );

const deleteCurrentLineViewer =
    document.getElementById(
        "deleteCurrentLineViewer"
    );

const deletePreviousLineBtn =
    document.getElementById(
        "deletePreviousLineBtn"
    );

const deleteNextLineBtn =
    document.getElementById(
        "deleteNextLineBtn"
    );

const deleteFirstAnchorBtn =
    document.getElementById(
        "deleteFirstAnchorBtn"
    );

const deleteSecondAnchorBtn =
    document.getElementById(
        "deleteSecondAnchorBtn"
    );

const deleteAdjustAnchorsBtn =
    document.getElementById(
        "deleteAdjustAnchorsBtn"
    );

const deleteRunOperationBtn =
    document.getElementById(
        "deleteRunOperationBtn"
    );

const deleteFirstAnchorDisplay =
    document.getElementById(
        "deleteFirstAnchorDisplay"
    );

const deleteSecondAnchorDisplay =
    document.getElementById(
        "deleteSecondAnchorDisplay"
    );

const deleteGapDisplay =
    document.getElementById(
        "deleteGapDisplay"
    );

const deleteTargetCountDisplay =
    document.getElementById(
        "deleteTargetCountDisplay"
    );

const deleteAnchorStatus =
    document.getElementById(
        "deleteAnchorStatus"
    );

// =========================================
// STATE
// =========================================

let selectedFile =
    null;

let originalText =
    "";

let workingText =
    "";

let lines =
    [];

let selectedOperation =
    null;

let writeMode =
    null;

let payload =
    "";

let currentLineIndex =
    0;

let firstAnchorIndex =
    null;

let secondAnchorIndex =
    null;

let targetIndexes =
    [];

let operationCompleted =
    false;

let createMode =
    null;

let createPayload =
    "";

let createCurrentLineIndex =
    0;

let createFirstAnchorIndex =
    null;

let createSecondAnchorIndex =
    null;

let createTargetIndexes =
    [];

let deleteMode =
    null;

let deleteCurrentLineIndex =
    0;

let deleteFirstAnchorIndex =
    null;

let deleteSecondAnchorIndex =
    null;

let deleteTargetIndexes =
    [];
// =========================================
// EVENTS
// =========================================

txtFileInput.addEventListener(
    "change",
    loadTxtFile
);


operationCards.forEach(
    card => {

        card.addEventListener(
            "click",
            function() {

                selectOperation(
                    this.dataset.operation
                );
            }
        );

    }
);


newSessionBtn.addEventListener(
    "click",
    resetSession
);

writeStartBtn.addEventListener(
    "click",
    beginWriteAtStart
);


payloadOkBtn.addEventListener(
    "click",
    confirmPayload
);


previousLineBtn.addEventListener(
    "click",
    () => {

        navigateLine(
            -1
        );
    }
);


nextLineBtn.addEventListener(
    "click",
    () => {

        navigateLine(
            1
        );
    }
);


firstAnchorBtn.addEventListener(
    "click",
    setFirstAnchor
);


secondAnchorBtn.addEventListener(
    "click",
    setSecondAnchor
);


adjustAnchorsBtn.addEventListener(
    "click",
    resetAnchors
);


runOperationBtn.addEventListener(
    "click",
    runWriteAtStart
);


downloadBtn.addEventListener(
    "click",
    downloadModifiedTxt
);

createBlankLineBtn.addEventListener(
    "click",
    beginCreateBlankLine
);


createPayloadLineBtn.addEventListener(
    "click",
    beginCreatePayloadLine
);


createPayloadOkBtn.addEventListener(
    "click",
    confirmCreatePayload
);


createPreviousLineBtn.addEventListener(
    "click",
    () => navigateCreateLine(-1)
);


createNextLineBtn.addEventListener(
    "click",
    () => navigateCreateLine(1)
);


createFirstAnchorBtn.addEventListener(
    "click",
    setCreateFirstAnchor
);


createSecondAnchorBtn.addEventListener(
    "click",
    setCreateSecondAnchor
);


createAdjustAnchorsBtn.addEventListener(
    "click",
    resetCreateAnchors
);


createRunOperationBtn.addEventListener(
    "click",
    runCreateNewLine
);

deleteCompleteBtn.addEventListener(
    "click",
    beginDeleteComplete
);


deleteBackspaceBtn.addEventListener(
    "click",
    beginDeleteBackspace
);


deletePreviousLineBtn.addEventListener(
    "click",
    () => navigateDeleteLine(-1)
);


deleteNextLineBtn.addEventListener(
    "click",
    () => navigateDeleteLine(1)
);


deleteFirstAnchorBtn.addEventListener(
    "click",
    setDeleteFirstAnchor
);


deleteSecondAnchorBtn.addEventListener(
    "click",
    setDeleteSecondAnchor
);


deleteAdjustAnchorsBtn.addEventListener(
    "click",
    resetDeleteAnchors
);


deleteRunOperationBtn.addEventListener(
    "click",
    runDeleteOperation
);
// =========================================
// LOAD TXT
// =========================================

async function loadTxtFile() {

    const file =
        txtFileInput.files[0];


    if (!file) {

        return;
    }


    try {

        selectedFile =
            file;


        originalText =
            await file.text();


        workingText =
            originalText;


        const normalized =
            originalText.replace(
                /\r\n/g,
                "\n"
            );


        lines =
            normalized.split("\n");


        /*
            Avoid counting a final empty array
            item caused only by a trailing newline.
        */

        let totalLines =
            lines.length;


        if (
            totalLines > 0 &&
            lines[
                totalLines - 1
            ] === ""
        ) {

            totalLines--;
        }


        fileStatus.textContent =
            `${file.name} loaded successfully.`;


        infoFileName.textContent =
            file.name;


        infoTotalLines.textContent =
            totalLines;


        infoStatus.textContent =
            "FILE LOADED";


        enableOperations();


        newSessionBtn.disabled =
            false;


        log(
            `TXT file loaded: ${file.name}`
        );


        log(
            `Total lines detected: ${totalLines}`
        );


        log(
            "Select an operation."
        );


    } catch (error) {

        console.error(
            error
        );


        fileStatus.textContent =
            "Unable to read the selected TXT file.";


        infoStatus.textContent =
            "LOAD ERROR";
    }
}


// =========================================
// ENABLE OPERATIONS
// =========================================

function enableOperations() {

    operationSelector.classList.remove(
        "disabled-section"
    );


    operationCards.forEach(
        card => {

            card.disabled =
                false;
        }
    );
}


// =========================================
// SELECT OPERATION
// =========================================

function selectOperation(
    operation
) {

    if (!selectedFile) {

        return;
    }


    selectedOperation =
        operation;


    operationCards.forEach(
        card => {

            card.classList.toggle(
                "active",
                card.dataset.operation ===
                    operation
            );
        }
    );


    workspacePlaceholder.classList.add(
        "hidden"
    );


    writeWorkspace.classList.add(
        "hidden"
    );

    createWorkspace.classList.add(
        "hidden"
    );

    deleteWorkspace.classList.add(
        "hidden"
    );


    operationWorkspace.classList.remove(
        "disabled-workspace"
    );


    let label =
        "";


    if (
        operation === "write"
    ) {

        label =
            "WRITE IN A LINE";

        writeWorkspace.classList.remove(
            "hidden"
        );
        writeModeSelection.classList.remove(
            "hidden"
        );
    
        payloadSection.classList.add(
            "hidden"
        );
    
        lineNavigator.classList.add(
            "hidden"
        );

    } else if (
        operation === "create"
    ) {

        label =
            "CREATE A NEW LINE";

        createWorkspace.classList.remove(
            "hidden"
        );

    } else if (
        operation === "delete"
    ) {

        label =
            "DELETE A LINE";

        deleteWorkspace.classList.remove(
            "hidden"
        );
    }


    selectedOperationBadge.textContent =
        label;


    infoOperation.textContent =
        label;


    infoStatus.textContent =
        "OPERATION SELECTED";


    log(
        `Operation selected: ${label}`
    );
}


// =========================================
// RESET SESSION
// =========================================

function resetSession() {

    const confirmed =
        window.confirm(
            "Start a new Character Introducer session?"
        );


    if (!confirmed) {

        return;
    }


    selectedFile =
        null;

    originalText =
        "";

    workingText =
        "";

    lines =
        [];

    selectedOperation =
        null;
    writeMode =
    null;

    payload =
        "";
    
    currentLineIndex =
        0;
    
    firstAnchorIndex =
        null;
    
    secondAnchorIndex =
        null;
    
    targetIndexes =
        [];
    
    operationCompleted =
        false;
    
    
    payloadInput.value =
        "";
    
    
    writeModeSelection.classList.remove(
        "hidden"
    );
    
    payloadSection.classList.add(
        "hidden"
    );
    
    lineNavigator.classList.add(
        "hidden"
    );
    
    
    firstAnchorDisplay.textContent =
        "—";
    
    secondAnchorDisplay.textContent =
        "—";
    
    gapDisplay.textContent =
        "—";
    
    targetCountDisplay.textContent =
        "—";


    txtFileInput.value =
        "";


    fileStatus.textContent =
        "No TXT file selected.";


    infoFileName.textContent =
        "—";

    infoTotalLines.textContent =
        "0";

    infoOperation.textContent =
        "—";

    infoStatus.textContent =
        "WAITING FOR FILE";


    selectedOperationBadge.textContent =
        "NO OPERATION SELECTED";


    operationCards.forEach(
        card => {

            card.disabled =
                true;

            card.classList.remove(
                "active"
            );
        }
    );


    operationSelector.classList.add(
        "disabled-section"
    );


    operationWorkspace.classList.add(
        "disabled-workspace"
    );


    workspacePlaceholder.classList.remove(
        "hidden"
    );


    writeWorkspace.classList.add(
        "hidden"
    );

    createWorkspace.classList.add(
        "hidden"
    );

    deleteWorkspace.classList.add(
        "hidden"
    );


    newSessionBtn.disabled =
        true;

    downloadBtn.disabled =
        true;


    consoleBox.textContent =
        "Waiting for TXT file...";
}


// =========================================
// LOGGER
// =========================================

function log(
    message
) {

    if (
        consoleBox.textContent.trim() ===
        "Waiting for TXT file..."
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
// WRITE AT START
// =========================================

function beginWriteAtStart() {

    writeMode =
        "start";


    writeModeSelection.classList.add(
        "hidden"
    );


    payloadSection.classList.remove(
        "hidden"
    );


    payloadInput.value =
        "";


    payloadInput.focus();


    log(
        "Write at Start of Line selected."
    );

    log(
        "Enter the payload and press OK."
    );
}
function confirmPayload() {

    const value =
        payloadInput.value;


    if (
        value.length === 0
    ) {

        alert(
            "Enter the payload first."
        );

        payloadInput.focus();

        return;
    }


    /*
        Keep payload EXACTLY as entered.

        Do not trim spaces.
        Leading/trailing characters may be intentional.
    */

    payload =
        value;


    payloadSection.classList.add(
        "hidden"
    );


    lineNavigator.classList.remove(
        "hidden"
    );


    currentLineIndex =
        0;


    resetAnchors();


    renderCurrentLine();


    log(
        `Payload accepted: ${JSON.stringify(payload)}`
    );


    log(
        "Navigate to the first target line and press 1️⃣."
    );
}
function renderCurrentLine() {

    if (
        !lines.length
    ) {

        return;
    }


    currentLineLabel.textContent =
        `Line ${currentLineIndex + 1}`;


    currentLineViewer.value =
        lines[currentLineIndex] ?? "";


    previousLineBtn.disabled =
        currentLineIndex === 0;


    nextLineBtn.disabled =
        currentLineIndex >=
        lines.length - 1;


    firstAnchorBtn.classList.toggle(
        "anchor-selected",
        firstAnchorIndex ===
            currentLineIndex
    );


    secondAnchorBtn.classList.toggle(
        "anchor-selected",
        secondAnchorIndex ===
            currentLineIndex
    );
}


function navigateLine(
    direction
) {

    const nextIndex =
        currentLineIndex +
        direction;


    if (
        nextIndex < 0 ||
        nextIndex >=
            lines.length
    ) {

        return;
    }


    currentLineIndex =
        nextIndex;


    renderCurrentLine();
}
function setFirstAnchor() {

    firstAnchorIndex =
        currentLineIndex;


    /*
        If changing the first anchor invalidates
        the second anchor, clear the second.
    */

    if (
        secondAnchorIndex !== null &&
        secondAnchorIndex <=
            firstAnchorIndex
    ) {

        secondAnchorIndex =
            null;
    }


    calculateTargets();


    renderCurrentLine();


    log(
        `First anchor selected: Line ${firstAnchorIndex + 1}`
    );
}


function setSecondAnchor() {

    if (
        firstAnchorIndex === null
    ) {

        alert(
            "Select the first anchor line using 1️⃣ first."
        );

        return;
    }


    if (
        currentLineIndex <=
        firstAnchorIndex
    ) {

        alert(
            "The second anchor must be after the first anchor."
        );

        return;
    }


    secondAnchorIndex =
        currentLineIndex;


    calculateTargets();


    renderCurrentLine();


    log(
        `Second anchor selected: Line ${secondAnchorIndex + 1}`
    );
}

function calculateTargets() {

    targetIndexes =
        [];


    firstAnchorDisplay.textContent =
        firstAnchorIndex === null
            ? "—"
            : `Line ${firstAnchorIndex + 1}`;


    secondAnchorDisplay.textContent =
        secondAnchorIndex === null
            ? "—"
            : `Line ${secondAnchorIndex + 1}`;


    if (
        firstAnchorIndex === null ||
        secondAnchorIndex === null
    ) {

        gapDisplay.textContent =
            "—";

        targetCountDisplay.textContent =
            "—";

        runOperationBtn.disabled =
            true;

        anchorStatus.textContent =
            "Select first and second anchor lines";

        return;
    }


    const gap =
        secondAnchorIndex -
        firstAnchorIndex;


    if (
        gap <= 0
    ) {

        runOperationBtn.disabled =
            true;

        return;
    }


    /*
        Calculate all targets BEFORE modifying text.

        Example:
        First = Line 10
        Second = Line 17

        Gap = 7

        Targets:
        10, 17, 24, 31...
    */

    for (
        let index =
            firstAnchorIndex;

        index <
            lines.length;

        index += gap
    ) {

        targetIndexes.push(
            index
        );
    }


    gapDisplay.textContent =
        `${gap} line${gap === 1 ? "" : "s"}`;


    targetCountDisplay.textContent =
        String(
            targetIndexes.length
        );


    anchorStatus.textContent =
        `Ready — ${targetIndexes.length} target line(s)`;


    runOperationBtn.disabled =
        false;


    log(
        `Gap calculated: ${gap} line(s).`
    );


    log(
        `Targets detected: ${targetIndexes.length}.`
    );
}

function resetAnchors() {

    firstAnchorIndex =
        null;

    secondAnchorIndex =
        null;

    targetIndexes =
        [];


    firstAnchorDisplay.textContent =
        "—";

    secondAnchorDisplay.textContent =
        "—";

    gapDisplay.textContent =
        "—";

    targetCountDisplay.textContent =
        "—";


    anchorStatus.textContent =
        "Select first and second anchor lines";


    runOperationBtn.disabled =
        true;


    renderCurrentLine();
}

function runWriteAtStart() {

    if (
        writeMode !== "start" ||
        !payload ||
        targetIndexes.length === 0
    ) {

        return;
    }


    const confirmed =
        window.confirm(
            `Apply the payload to ${targetIndexes.length} target line(s)?`
        );


    if (!confirmed) {

        return;
    }


    /*
        Modify a COPY first.
        Line count does not change.
    */

    const modifiedLines =
        [...lines];


    targetIndexes.forEach(
        index => {

            modifiedLines[index] =
                payload +
                modifiedLines[index];
        }
    );


    lines =
        modifiedLines;


    workingText =
        lines.join(
            "\n"
        );


    operationCompleted =
        true;


    infoStatus.textContent =
        "MODIFICATION COMPLETE";


    downloadBtn.disabled =
        false;


    runOperationBtn.disabled =
        true;


    anchorStatus.textContent =
        "OPERATION COMPLETED";


    renderCurrentLine();


    log(
        "Write at Start operation completed."
    );


    log(
        `${targetIndexes.length} line(s) modified.`
    );


    log(
        "Modified TXT is ready for download."
    );
}

function downloadModifiedTxt() {

    if (
        !operationCompleted
    ) {

        return;
    }


    const blob =
        new Blob(
            [workingText],
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


    /*
        Preserve original filename.
    */

    link.href =
        url;


    const outputName =
    selectedFile
        ? selectedFile.name
        : "modified.txt";

    link.download =
        outputName;
    
        

    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


    log(
        `Downloaded: ${link.download}`
    );
}

function beginCreateBlankLine() {

    createMode =
        "blank";

    createPayload =
        "";


    createModeSelection.classList.add(
        "hidden"
    );

    createPayloadSection.classList.add(
        "hidden"
    );

    createLineNavigator.classList.remove(
        "hidden"
    );


    createCurrentLineIndex =
        0;


    resetCreateAnchors();

    renderCreateCurrentLine();


    log(
        "Only New Line selected."
    );

    log(
        "Select the first target line using 1️⃣."
    );
}

function beginCreatePayloadLine() {

    createMode =
        "payload";


    createModeSelection.classList.add(
        "hidden"
    );

    createLineNavigator.classList.add(
        "hidden"
    );

    createPayloadSection.classList.remove(
        "hidden"
    );


    createPayloadInput.value =
        "";

    createPayloadInput.focus();


    log(
        "New Line with Payload selected."
    );

    log(
        "Enter the payload for the new line."
    );
}

function confirmCreatePayload() {

    const value =
        createPayloadInput.value;


    if (
        value.length === 0
    ) {

        alert(
            "Enter the payload first."
        );

        return;
    }


    /*
        Preserve payload exactly.
        No trim().
    */

    createPayload =
        value;


    createPayloadSection.classList.add(
        "hidden"
    );

    createLineNavigator.classList.remove(
        "hidden"
    );


    createCurrentLineIndex =
        0;


    resetCreateAnchors();

    renderCreateCurrentLine();


    log(
        `New-line payload accepted: ${JSON.stringify(createPayload)}`
    );

    log(
        "Select the first target line using 1️⃣."
    );
}

function renderCreateCurrentLine() {

    if (!lines.length) {

        return;
    }


    createCurrentLineLabel.textContent =
        `Line ${createCurrentLineIndex + 1}`;


    createCurrentLineViewer.value =
        lines[
            createCurrentLineIndex
        ] ?? "";


    createPreviousLineBtn.disabled =
        createCurrentLineIndex === 0;


    createNextLineBtn.disabled =
        createCurrentLineIndex >=
        lines.length - 1;


    createFirstAnchorBtn.classList.toggle(
        "anchor-selected",
        createFirstAnchorIndex ===
            createCurrentLineIndex
    );


    createSecondAnchorBtn.classList.toggle(
        "anchor-selected",
        createSecondAnchorIndex ===
            createCurrentLineIndex
    );
}


function navigateCreateLine(
    direction
) {

    const nextIndex =
        createCurrentLineIndex +
        direction;


    if (
        nextIndex < 0 ||
        nextIndex >= lines.length
    ) {

        return;
    }


    createCurrentLineIndex =
        nextIndex;


    renderCreateCurrentLine();
}

function setCreateFirstAnchor() {

    createFirstAnchorIndex =
        createCurrentLineIndex;


    if (
        createSecondAnchorIndex !== null &&
        createSecondAnchorIndex <=
            createFirstAnchorIndex
    ) {

        createSecondAnchorIndex =
            null;
    }


    calculateCreateTargets();

    renderCreateCurrentLine();


    log(
        `Create-line first target: Line ${createFirstAnchorIndex + 1}`
    );
}


function setCreateSecondAnchor() {

    if (
        createFirstAnchorIndex === null
    ) {

        alert(
            "Select the first target using 1️⃣ first."
        );

        return;
    }


    if (
        createCurrentLineIndex <=
        createFirstAnchorIndex
    ) {

        alert(
            "The second target must be after the first target."
        );

        return;
    }


    createSecondAnchorIndex =
        createCurrentLineIndex;


    calculateCreateTargets();

    renderCreateCurrentLine();


    log(
        `Create-line second target: Line ${createSecondAnchorIndex + 1}`
    );
}

function calculateCreateTargets() {

    createTargetIndexes =
        [];


    createFirstAnchorDisplay.textContent =
        createFirstAnchorIndex === null
            ? "—"
            : `Line ${createFirstAnchorIndex + 1}`;


    createSecondAnchorDisplay.textContent =
        createSecondAnchorIndex === null
            ? "—"
            : `Line ${createSecondAnchorIndex + 1}`;


    if (
        createFirstAnchorIndex === null ||
        createSecondAnchorIndex === null
    ) {

        createGapDisplay.textContent =
            "—";

        createTargetCountDisplay.textContent =
            "—";

        createRunOperationBtn.disabled =
            true;

        createAnchorStatus.textContent =
            "Select first and second target lines";

        return;
    }


    const gap =
        createSecondAnchorIndex -
        createFirstAnchorIndex;


    for (
        let index =
            createFirstAnchorIndex;

        index < lines.length;

        index += gap
    ) {

        createTargetIndexes.push(
            index
        );
    }


    createGapDisplay.textContent =
        `${gap} line${gap === 1 ? "" : "s"}`;


    createTargetCountDisplay.textContent =
        String(
            createTargetIndexes.length
        );


    createAnchorStatus.textContent =
        `Ready — ${createTargetIndexes.length} new line(s)`;


    createRunOperationBtn.disabled =
        false;


    log(
        `Original target gap: ${gap} line(s).`
    );

    log(
        `${createTargetIndexes.length} insertion target(s) calculated.`
    );
}

function resetCreateAnchors() {

    createFirstAnchorIndex =
        null;

    createSecondAnchorIndex =
        null;

    createTargetIndexes =
        [];


    createFirstAnchorDisplay.textContent =
        "—";

    createSecondAnchorDisplay.textContent =
        "—";

    createGapDisplay.textContent =
        "—";

    createTargetCountDisplay.textContent =
        "—";


    createAnchorStatus.textContent =
        "Select first and second target lines";


    createRunOperationBtn.disabled =
        true;


    renderCreateCurrentLine();
}

function runCreateNewLine() {

    if (
        !createMode ||
        createTargetIndexes.length === 0
    ) {

        return;
    }


    const confirmed =
        window.confirm(
            `Create ${createTargetIndexes.length} new line(s)?`
        );


    if (!confirmed) {

        return;
    }


    const modifiedLines =
        [...lines];


    /*
        CRITICAL:

        Targets were calculated against the ORIGINAL
        line positions.

        Insert from BOTTOM → TOP.

        Therefore inserting a line later in the file
        cannot shift any earlier target that still
        needs processing.
    */

    const targetsDescending =
        [...createTargetIndexes]
            .sort(
                (a, b) => b - a
            );


    targetsDescending.forEach(
        targetIndex => {

            const newLine =
                createMode === "payload"
                    ? createPayload
                    : "";


            /*
                targetIndex + 1 means:
                insert AFTER the target line.
            */

            modifiedLines.splice(
                targetIndex + 1,
                0,
                newLine
            );
        }
    );


    lines =
        modifiedLines;


    workingText =
        lines.join(
            "\n"
        );


    operationCompleted =
        true;


    infoTotalLines.textContent =
        String(
            lines.length
        );


    infoStatus.textContent =
        "MODIFICATION COMPLETE";


    downloadBtn.disabled =
        false;


    createRunOperationBtn.disabled =
        true;


    createAnchorStatus.textContent =
        "OPERATION COMPLETED";


    renderCreateCurrentLine();


    log(
        `Create New Line completed: ${createTargetIndexes.length} line(s) inserted.`
    );


    if (
        createMode === "payload"
    ) {

        log(
            `Inserted payload: ${JSON.stringify(createPayload)}`
        );

    } else {

        log(
            "Inserted blank lines only."
        );
    }


    log(
        "Modified TXT is ready for download."
    );
}

function beginDeleteComplete() {

    deleteMode =
        "complete";


    deleteModeSelection.classList.add(
        "hidden"
    );

    deleteLineNavigator.classList.remove(
        "hidden"
    );


    deleteCurrentLineIndex =
        0;


    resetDeleteAnchors();

    renderDeleteCurrentLine();


    log(
        "Delete Completely selected."
    );

    log(
        "Navigate to the first target line and press 1️⃣."
    );
}


function beginDeleteBackspace() {

    deleteMode =
        "backspace";


    deleteModeSelection.classList.add(
        "hidden"
    );

    deleteLineNavigator.classList.remove(
        "hidden"
    );


    deleteCurrentLineIndex =
        0;


    resetDeleteAnchors();

    renderDeleteCurrentLine();


    log(
        "Use Backspace selected."
    );

    log(
        "The targeted line will be joined to its previous line with one separating space."
    );

    log(
        "Navigate to the first target line and press 1️⃣."
    );
}
function renderDeleteCurrentLine() {

    if (!lines.length) {

        return;
    }


    deleteCurrentLineLabel.textContent =
        `Line ${deleteCurrentLineIndex + 1}`;


    deleteCurrentLineViewer.value =
        lines[
            deleteCurrentLineIndex
        ] ?? "";


    deletePreviousLineBtn.disabled =
        deleteCurrentLineIndex === 0;


    deleteNextLineBtn.disabled =
        deleteCurrentLineIndex >=
        lines.length - 1;


    deleteFirstAnchorBtn.classList.toggle(
        "anchor-selected",
        deleteFirstAnchorIndex ===
            deleteCurrentLineIndex
    );


    deleteSecondAnchorBtn.classList.toggle(
        "anchor-selected",
        deleteSecondAnchorIndex ===
            deleteCurrentLineIndex
    );
}


function navigateDeleteLine(
    direction
) {

    const nextIndex =
        deleteCurrentLineIndex +
        direction;


    if (
        nextIndex < 0 ||
        nextIndex >= lines.length
    ) {

        return;
    }


    deleteCurrentLineIndex =
        nextIndex;


    renderDeleteCurrentLine();
}

function setDeleteFirstAnchor() {

    /*
        Backspace cannot operate on physical Line 1
        because there is no previous line.
    */

    if (
        deleteMode === "backspace" &&
        deleteCurrentLineIndex === 0
    ) {

        alert(
            "Line 1 cannot use Backspace because it has no previous line."
        );

        return;
    }


    deleteFirstAnchorIndex =
        deleteCurrentLineIndex;


    if (
        deleteSecondAnchorIndex !== null &&
        deleteSecondAnchorIndex <=
            deleteFirstAnchorIndex
    ) {

        deleteSecondAnchorIndex =
            null;
    }


    calculateDeleteTargets();

    renderDeleteCurrentLine();


    log(
        `Delete first target: Line ${deleteFirstAnchorIndex + 1}`
    );
}


function setDeleteSecondAnchor() {

    if (
        deleteFirstAnchorIndex === null
    ) {

        alert(
            "Select the first target using 1️⃣ first."
        );

        return;
    }


    if (
        deleteCurrentLineIndex <=
        deleteFirstAnchorIndex
    ) {

        alert(
            "The second target must be after the first target."
        );

        return;
    }


    deleteSecondAnchorIndex =
        deleteCurrentLineIndex;


    calculateDeleteTargets();

    renderDeleteCurrentLine();


    log(
        `Delete second target: Line ${deleteSecondAnchorIndex + 1}`
    );
}

function calculateDeleteTargets() {

    deleteTargetIndexes =
        [];


    deleteFirstAnchorDisplay.textContent =
        deleteFirstAnchorIndex === null
            ? "—"
            : `Line ${deleteFirstAnchorIndex + 1}`;


    deleteSecondAnchorDisplay.textContent =
        deleteSecondAnchorIndex === null
            ? "—"
            : `Line ${deleteSecondAnchorIndex + 1}`;


    if (
        deleteFirstAnchorIndex === null ||
        deleteSecondAnchorIndex === null
    ) {

        deleteGapDisplay.textContent =
            "—";

        deleteTargetCountDisplay.textContent =
            "—";

        deleteRunOperationBtn.disabled =
            true;

        deleteAnchorStatus.textContent =
            "Select first and second target lines";

        return;
    }


    const gap =
        deleteSecondAnchorIndex -
        deleteFirstAnchorIndex;


    if (gap <= 0) {

        deleteRunOperationBtn.disabled =
            true;

        return;
    }


    /*
        IMPORTANT:

        Calculate target indexes against the
        ORIGINAL current file structure before
        deleting or merging anything.
    */

    for (
        let index =
            deleteFirstAnchorIndex;

        index < lines.length;

        index += gap
    ) {

        deleteTargetIndexes.push(
            index
        );
    }


    deleteGapDisplay.textContent =
        `${gap} line${gap === 1 ? "" : "s"}`;


    deleteTargetCountDisplay.textContent =
        String(
            deleteTargetIndexes.length
        );


    deleteAnchorStatus.textContent =
        `Ready — ${deleteTargetIndexes.length} target line(s)`;


    deleteRunOperationBtn.disabled =
        false;


    log(
        `Delete target gap: ${gap} line(s).`
    );


    log(
        `${deleteTargetIndexes.length} target line(s) calculated.`
    );
}


function resetDeleteAnchors() {

    deleteFirstAnchorIndex =
        null;

    deleteSecondAnchorIndex =
        null;

    deleteTargetIndexes =
        [];


    deleteFirstAnchorDisplay.textContent =
        "—";

    deleteSecondAnchorDisplay.textContent =
        "—";

    deleteGapDisplay.textContent =
        "—";

    deleteTargetCountDisplay.textContent =
        "—";


    deleteAnchorStatus.textContent =
        "Select first and second target lines";


    deleteRunOperationBtn.disabled =
        true;


    renderDeleteCurrentLine();
}

function runDeleteOperation() {

    if (
        !deleteMode ||
        deleteTargetIndexes.length === 0
    ) {

        return;
    }


    const actionName =
        deleteMode === "complete"
            ? "delete completely"
            : "apply backspace to";


    const confirmed =
        window.confirm(
            `Are you sure you want to ${actionName} ${deleteTargetIndexes.length} target line(s)?`
        );


    if (!confirmed) {

        return;
    }


    const modifiedLines =
        [...lines];


    /*
        CRITICAL:

        Process targets BOTTOM → TOP.

        If target indexes are:

        5, 19, 33

        process:

        33 → 19 → 5

        Therefore deletion of a later line
        never changes the index of an earlier
        target that still needs processing.
    */

    const targetsDescending =
        [...deleteTargetIndexes]
            .sort(
                (a, b) => b - a
            );


    if (
        deleteMode === "complete"
    ) {

        targetsDescending.forEach(
            targetIndex => {

                modifiedLines.splice(
                    targetIndex,
                    1
                );
            }
        );

    } else if (
        deleteMode === "backspace"
    ) {

        targetsDescending.forEach(
            targetIndex => {

                /*
                    Safety:
                    physical first line has
                    no previous line.
                */

                if (
                    targetIndex <= 0 ||
                    targetIndex >=
                        modifiedLines.length
                ) {

                    return;
                }


                const previousLine =
                    modifiedLines[
                        targetIndex - 1
                    ];


                const targetLine =
                    modifiedLines[
                        targetIndex
                    ];


                /*
                    Remove trailing whitespace from
                    previous line and leading whitespace
                    from target line.

                    Then insert EXACTLY ONE separating
                    space between them.
                */

                const mergedLine =
                    previousLine.replace(
                        /\s+$/,
                        ""
                    ) +
                    " " +
                    targetLine.replace(
                        /^\s+/,
                        ""
                    );


                modifiedLines[
                    targetIndex - 1
                ] =
                    mergedLine;


                /*
                    Remove the original target line
                    because its content now exists
                    on the previous line.
                */

                modifiedLines.splice(
                    targetIndex,
                    1
                );
            }
        );
    }


    lines =
        modifiedLines;


    workingText =
        lines.join(
            "\n"
        );


    operationCompleted =
        true;


    infoTotalLines.textContent =
        String(
            lines.length
        );


    infoStatus.textContent =
        "MODIFICATION COMPLETE";


    downloadBtn.disabled =
        false;


    deleteRunOperationBtn.disabled =
        true;


    deleteAnchorStatus.textContent =
        "OPERATION COMPLETED";


    /*
        Ensure navigator index remains valid
        after line count decreases.
    */

    if (
        deleteCurrentLineIndex >=
        lines.length
    ) {

        deleteCurrentLineIndex =
            Math.max(
                0,
                lines.length - 1
            );
    }


    renderDeleteCurrentLine();


    if (
        deleteMode === "complete"
    ) {

        log(
            `${deleteTargetIndexes.length} line(s) deleted completely.`
        );

    } else {

        log(
            `${deleteTargetIndexes.length} line break(s) removed using Backspace.`
        );
    }


    log(
        `Updated total lines: ${lines.length}`
    );


    log(
        "Modified TXT is ready for download."
    );
}

