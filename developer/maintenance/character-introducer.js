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
