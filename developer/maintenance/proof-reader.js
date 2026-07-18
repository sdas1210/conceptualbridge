const fileInput =
    document.getElementById("fileInput");

const processBtn =
    document.getElementById("processBtn");

const downloadReportBtn =
    document.getElementById("downloadReportBtn");

const consoleBox =
    document.getElementById("console");
const editorLineNo =
    document.getElementById("editorLineNo");

const editorCharacter =
    document.getElementById("editorCharacter");

const editorLineText =
    document.getElementById("editorLineText");

const previousLineBtn =
    document.getElementById("previousLineBtn");

const nextLineBtn =
    document.getElementById("nextLineBtn");

const editLineBtn =
    document.getElementById("editLineBtn");

const saveLineBtn =
    document.getElementById("saveLineBtn");

const passErrorBtn =
    document.getElementById("passErrorBtn");

const revalidateBtn =
    document.getElementById("revalidateBtn");

const editorStatus =
    document.getElementById("editorStatus");

let originalText = "";
let totalLines = 0;
let workingLines = [];

let validationErrors = [];

let currentLineIndex = -1;

let isEditing = false;

// Session-only ignored errors
const passedErrors = new Set();
fileInput.addEventListener(
    "change",
    loadFile
);
processBtn.addEventListener(
    "click",
    validateFile
);

previousLineBtn.addEventListener(
    "click",
    function() {

        if (isEditing) {
            return;
        }

        showLine(
            currentLineIndex - 1
        );
    }
);


nextLineBtn.addEventListener(
    "click",
    function() {

        if (isEditing) {
            return;
        }

        showLine(
            currentLineIndex + 1
        );
    }
);

editLineBtn.addEventListener(
    "click",
    startEditing
);

saveLineBtn.addEventListener(
    "click",
    saveCurrentLine
);
/* Event Listener Section Ended*/
function log(message) {

    const time =
        new Date().toLocaleTimeString();

    consoleBox.textContent +=
        `\n[${time}] ${message}`;

    consoleBox.scrollTop =
        consoleBox.scrollHeight;
}


function loadFile(event) {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }


    // Reset previous state

    originalText = "";

    processBtn.disabled = true;
    downloadReportBtn.disabled = true;

    document.getElementById("scanCount")
        .textContent = "0";

    document.getElementById("invalidCount")
        .textContent = "0";

    document.getElementById("affectedLines")
        .textContent = "0";

    document.getElementById("validationStatus")
        .textContent = "Waiting";

    document.getElementById("errorReport")
        .textContent = "No scan performed yet.";


    // File information

    document.getElementById("fileName")
        .textContent = file.name;

    document.getElementById("fileSize")
        .textContent =
        (file.size / 1024).toFixed(2) + " KB";


    const reader =
        new FileReader();


    reader.onload = function(event) {

        originalText =
            event.target.result;

        workingLines =
            originalText.split(/\r?\n/);
        
        validationErrors = [];
        
        currentLineIndex = -1;
        
        isEditing = false;
        
        passedErrors.clear();
        
        resetEditor();
        totalLines =
            totalLines =

        document.getElementById("totalLines")
            .textContent = totalLines;


        consoleBox.textContent = "";

        log("Proof Reader Ready");
        log("File Loaded");
        log(file.name);
        log(`Total Lines: ${totalLines}`);
        log("Waiting for validation command");


        processBtn.disabled = false;
    };


    reader.readAsText(file);
}

function isValidChar(char) {

    // Allow whitespace
    if (/\s/.test(char)) {
        return true;
    }

    // Allow English letters
    if (/[A-Za-z]/.test(char)) {
        return true;
    }

    // Allow numbers
    if (/[0-9]/.test(char)) {
        return true;
    }

    // Allow standard ASCII punctuation
    if (/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/.test(char)) {
        return true;
    }

    // Allow Bengali Unicode block
    const code = char.codePointAt(0);

    if (code >= 0x0980 && code <= 0x09FF) {
        return true;
    }

    // Additional permitted punctuation
    const extraPunctuation = [
        "।",
        "’",
        "‘",
        "”",
        "“",
        "…",
        "—",
        "–"
    ];

    if (extraPunctuation.includes(char)) {
        return true;
    }

    return false;
}

function validateFile() {

    if (!originalText) {
        log("No file loaded");
        return;
    }

    log("Starting Character Validation...");

    let scannedCount = 0;
    let invalidCount = 0;

    const affectedLineNumbers = new Set();
    validationErrors = [];
    const lines = workingLines;

    for (let i = 0; i < lines.length; i++) {

        scannedCount++;

        const line = lines[i];

        for (const char of line) {

            if (!isValidChar(char)) {

    invalidCount++;

    affectedLineNumbers.add(i + 1);

    const unicode =
        "U+" +
        char
            .codePointAt(0)
            .toString(16)
            .toUpperCase()
            .padStart(4, "0");

            validationErrors.push({
                lineNumber: i + 1,
                character: char,
                unicode: unicode,
                lineText: line
            });
        
            console.log(
                `Invalid Character — Line ${i + 1}:`,
                char,
                unicode
            );
        }
        }

        // Progress every 100 lines
        if (i % 100 === 0) {

            log(
                `Scanning Line ${i + 1}`
            );
        }
    }


    // Update statistics

    document.getElementById("scanCount")
        .textContent = scannedCount;

    document.getElementById("invalidCount")
        .textContent = invalidCount;

    document.getElementById("affectedLines")
        .textContent = affectedLineNumbers.size;


    if (invalidCount === 0) {

        document.getElementById("validationStatus")
            .textContent = "PASSED";

        log("Validation Completed");
        log("No invalid characters detected");
        log("Validation Status: PASSED");

    } else {

        document.getElementById("validationStatus")
            .textContent = "FAILED";

        log("Validation Completed");

        log(
            `Invalid Characters Found: ${invalidCount}`
        );

        log(
            `Affected Lines: ${affectedLineNumbers.size}`
        );

        log("Validation Status: FAILED");
    }
    generateErrorReport(validationErrors);
        if (validationErrors.length > 0) {
    
        const firstError =
            validationErrors[0];
    
        showLine(
            firstError.lineNumber - 1
        );
    
    } else {
    
        resetEditor();
    
        editorStatus.textContent =
            "Validation Passed — No errors found.";
    }
}
function generateErrorReport(errors) {

    const reportBox =
        document.getElementById("errorReport");

    reportBox.innerHTML = "";

    if (errors.length === 0) {

        reportBox.textContent =
            "Validation Passed — No invalid characters detected.";

        return;
    }


    for (const error of errors) {

        const item =
            document.createElement("div");

        item.className = "error-item";


        const header =
            document.createElement("div");

        header.className = "error-header";

        header.textContent =
            `Line ${error.lineNumber} | ` +
            `Character: "${error.character}" | ` +
            `${error.unicode}`;


        const context =
            document.createElement("div");

        context.className = "error-context";

        context.textContent =
            error.lineText;


        item.appendChild(header);
        item.appendChild(context);

        reportBox.appendChild(item);
    }
}

function showLine(lineIndex) {

    if (
        lineIndex < 0 ||
        lineIndex >= workingLines.length
    ) {
        return;
    }

    currentLineIndex = lineIndex;

    const lineNumber =
        lineIndex + 1;

    const lineText =
        workingLines[lineIndex];


    // Find errors belonging to this line

    const lineErrors =
        validationErrors.filter(
            error =>
                error.lineNumber === lineNumber
        );


    editorLineNo.textContent =
        lineNumber;


    if (lineErrors.length > 0) {

        const characters =
            [...new Set(
                lineErrors.map(
                    error => error.character
                )
            )];

        editorCharacter.textContent =
            characters
                .map(char => `"${char}"`)
                .join(", ");

        editorStatus.textContent =
            `Validation error detected on Line ${lineNumber}`;

    } else {

        editorCharacter.textContent =
            "--";

        editorStatus.textContent =
            `No validation error detected on Line ${lineNumber}`;
    }


    editorLineText.value =
        lineText;


    // Navigation availability

    previousLineBtn.disabled =
        lineIndex === 0;

    nextLineBtn.disabled =
        lineIndex ===
        workingLines.length - 1;


    // Editing will be implemented next

    editLineBtn.disabled = false;

    saveLineBtn.disabled = true;


    // Pass only makes sense if this line has an error

    passErrorBtn.disabled =
        lineErrors.length === 0;

    revalidateBtn.disabled = false;
}
function resetEditor() {

    currentLineIndex = -1;

    editorLineNo.textContent =
        "--";

    editorCharacter.textContent =
        "--";

    editorLineText.value =
        "";

    editorLineText.readOnly =
        true;

    previousLineBtn.disabled =
        true;

    nextLineBtn.disabled =
        true;

    editLineBtn.disabled =
        true;

    saveLineBtn.disabled =
        true;

    passErrorBtn.disabled =
        true;

    revalidateBtn.disabled =
        true;

    editorStatus.textContent =
        "No validation error selected.";
}

function startEditing() {

    if (currentLineIndex < 0) {
        return;
    }

    isEditing = true;

    // Make textarea editable
    editorLineText.readOnly = false;

    editorLineText.focus();


    // Lock navigation while editing
    previousLineBtn.disabled = true;
    nextLineBtn.disabled = true;

    editLineBtn.disabled = true;

    passErrorBtn.disabled = true;
    revalidateBtn.disabled = true;


    // Only Save is available
    saveLineBtn.disabled = false;


    editorStatus.textContent =
        `Editing Line ${currentLineIndex + 1} — Save before leaving this line.`;
}

function saveCurrentLine() {

    if (
        !isEditing ||
        currentLineIndex < 0
    ) {
        return;
    }


    // Save edited text into working copy
    workingLines[currentLineIndex] =
        editorLineText.value;


    isEditing = false;

    editorLineText.readOnly = true;


    // Lock Save again
    saveLineBtn.disabled = true;


    editorStatus.textContent =
        `Line ${currentLineIndex + 1} saved to working copy. Re-Validate to verify changes.`;


    // Restore navigation
    previousLineBtn.disabled =
        currentLineIndex === 0;

    nextLineBtn.disabled =
        currentLineIndex ===
        workingLines.length - 1;


    editLineBtn.disabled = false;

    revalidateBtn.disabled = false;


    /*
        IMPORTANT:

        Do NOT recalculate the error here.

        The displayed Character still represents
        the result of the LAST validation scan.

        Re-Validate will determine whether the
        correction actually fixed the problem.
    */


    const currentLineNumber =
        currentLineIndex + 1;

    const oldErrors =
        validationErrors.filter(
            error =>
                error.lineNumber ===
                currentLineNumber
        );

    passErrorBtn.disabled =
        oldErrors.length === 0;
}
