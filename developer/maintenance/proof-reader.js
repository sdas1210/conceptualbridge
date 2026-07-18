const fileInput =
    document.getElementById("fileInput");

const processBtn =
    document.getElementById("processBtn");

const downloadReportBtn =
    document.getElementById("downloadReportBtn");

const consoleBox =
    document.getElementById("console");


let originalText = "";
let totalLines = 0;


fileInput.addEventListener(
    "change",
    loadFile
);
processBtn.addEventListener(
    "click",
    validateFile
);


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

        totalLines =
            originalText.split(/\r?\n/).length;

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
