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

