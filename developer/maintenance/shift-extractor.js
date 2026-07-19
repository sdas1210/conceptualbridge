// =========================================
// SHIFT EXTRACTOR
// Conceptual Bridge Maintenance Suite
// =========================================


// =========================================
// ELEMENT REFERENCES
// =========================================

const fileInput =
    document.getElementById("fileInput");

const extractBtn =
    document.getElementById("extractBtn");

const downloadShiftBtn =
    document.getElementById("downloadShiftBtn");

const downloadCleanedBtn =
    document.getElementById("downloadCleanedBtn");

const consoleBox =
    document.getElementById("console");


// =========================================
// STATE
// =========================================

let originalText = "";

let originalFileName = "";

let originalLineEnding = "\n";

let extractedShiftText = "";

let cleanedQuestionText = "";

let detectedShiftCount = 0;

let normalizedShiftCount = 0;

// =========================================
// EVENT LISTENERS
// =========================================

fileInput.addEventListener(
    "change",
    loadFile
);

extractBtn.addEventListener(
    "click",
    extractShiftData
);

downloadShiftBtn.addEventListener(
    "click",
    downloadShiftFile
);

downloadCleanedBtn.addEventListener(
    "click",
    downloadCleanedFile
);


// =========================================
// CONSOLE LOGGER
// =========================================

function log(message) {

    consoleBox.textContent +=
        message + "\n";

    consoleBox.scrollTop =
        consoleBox.scrollHeight;
}


// =========================================
// LOAD FILE
// =========================================

function loadFile() {

    const file =
        fileInput.files[0];

    if (!file) {
        return;
    }


    // Reset previous state

    originalText = "";

    originalFileName =
        file.name;
    
    originalLineEnding = "\n";

    extractedShiftText = "";

    cleanedQuestionText = "";

    detectedShiftCount = 0;
    
    normalizedShiftCount = 0;

    extractBtn.disabled = true;

    downloadShiftBtn.disabled = true;

    downloadCleanedBtn.disabled = true;


    document.getElementById(
        "linesScanned"
    ).textContent = "0";

    document.getElementById(
        "shiftCount"
    ).textContent = "0";

    document.getElementById(
        "extractedCount"
    ).textContent = "0";

    document.getElementById(
        "status"
    ).textContent = "Scanning";


    document.getElementById(
        "shiftOutputName"
    ).textContent = "--";

    document.getElementById(
        "cleanedOutputName"
    ).textContent = "--";
    normalizedShiftCount = 0;

    document.getElementById(
        "normalizedCount"
    ).textContent = normalizedShiftCount;

    consoleBox.textContent = "";

    log("Loading TXT file...");


    // File information

    document.getElementById(
        "fileName"
    ).textContent = file.name;

    document.getElementById(
        "fileSize"
    ).textContent =
        formatFileSize(file.size);


    const reader =
        new FileReader();


    reader.onload = function(event) {

        originalText =
            event.target.result;


        // Detect original line-ending style

        if (
            originalText.includes("\r\n")
        ) {

            originalLineEnding = "\r\n";

        } else {

            originalLineEnding = "\n";
        }


        const lines =
            originalText.split(
                /\r?\n/
            );


        document.getElementById(
            "totalLines"
        ).textContent =
            lines.length;


        log(
            `File loaded: ${file.name}`
        );

        log(
            `Total lines: ${lines.length}`
        );

        log(
            "Scanning for SHIFT| metadata..."
        );


        // Detect SHIFT| only

        detectedShiftCount = 0;


        for (
            let i = 0;
            i < lines.length;
            i++
        ) {

            if (
                isShiftLine(lines[i])
            ) {

                detectedShiftCount++;
            }
        }


        document.getElementById(
            "linesScanned"
        ).textContent =
            lines.length;


        document.getElementById(
            "shiftCount"
        ).textContent =
            detectedShiftCount;


        // IMPORTANT:
        // Extraction only allowed if SHIFT| exists

        if (
            detectedShiftCount === 0
        ) {

            document.getElementById(
                "status"
            ).textContent =
                "NO SHIFT DATA FOUND";


            log(
                "No SHIFT| metadata detected."
            );

            log(
                "Extraction blocked."
            );

            log(
                "Original file remains unchanged."
            );


            extractBtn.disabled = true;

            return;
        }


        document.getElementById(
            "status"
        ).textContent =
            "READY";


        log(
            `${detectedShiftCount} SHIFT| tag(s) detected.`
        );

        log(
            "Ready for extraction."
        );


        extractBtn.disabled = false;
    };


    reader.onerror = function() {

        document.getElementById(
            "status"
        ).textContent =
            "ERROR";


        log(
            "Error reading TXT file."
        );


        extractBtn.disabled = true;
    };


    reader.readAsText(
        file,
        "UTF-8"
    );
}


// =========================================
// SHIFT LINE DETECTOR
// =========================================

function isShiftLine(line) {

    /*
        ACCEPTED:

        SHIFT|data
        Shift|data
        shift|data

        NOT ACCEPTED:

        SHIFT |data
        MYSHIFT|data
        SHIFTED|data
    */

    return /^SHIFT\|/i.test(
        line.trim()
    );
}
// =========================================
// SHIFT DATE/TIME NORMALIZER
// Ported from AMPM Modifier.py
// =========================================

function normalizeShiftTime(line) {

    const trimmedLine =
        line.trim();

    if (!trimmedLine) {
        return line;
    }


    /*
        STEP 1
        Shift must begin with:

        DD/MM/YYYY

        Accepted examples:

        8/1/2026
        08/01/2026
    */

    const dateMatch =
        trimmedLine.match(
            /^(\d{1,2}\/\d{1,2}\/\d{4})/
        );


    if (!dateMatch) {

        // No valid starting date.
        // Preserve original data.

        return line;
    }


    const datePart =
        dateMatch[1];


    const timePart =
        trimmedLine
            .slice(
                dateMatch[0].length
            )
            .trim();


    /*
        STEP 2

        Find:

        Time 1
        AM / PM
        separator
        Time 2
        AM / PM

        Examples accepted:

        09:00AM-10:30AM

        09:00 AM - 10:30 AM

        09:00 AM TO 10:30 AM

        9:00am -- 10:30am
    */

    const timeMatch =
        timePart.match(
            /(\d{1,2}:\d{2})\s*(AM|PM).+?(\d{1,2}:\d{2})\s*(AM|PM)/i
        );


    if (!timeMatch) {

        // Could not safely understand
        // the time structure.

        // Do NOT modify the original value.

        return line;
    }


    const time1 =
        timeMatch[1];

    const ampm1 =
        timeMatch[2]
            .toUpperCase();

    const time2 =
        timeMatch[3];

    const ampm2 =
        timeMatch[4]
            .toUpperCase();


    /*
        STEP 3

        Standard output:

        DD/MM/YYYY HH:MM AM - HH:MM PM
    */

    return (
        `${datePart} ` +
        `${time1} ${ampm1} - ` +
        `${time2} ${ampm2}`
    );
}




    // =========================================
    // EXTRACT SHIFT DATA
    // =========================================
    
    function extractShiftData() {
    
        if (
            !originalText ||
            detectedShiftCount === 0
        ) {
    
            log(
                "Extraction blocked: No SHIFT| data available."
            );
    
            return;
        }
    
    
        extractBtn.disabled = true;
    
        downloadShiftBtn.disabled = true;
    
        downloadCleanedBtn.disabled = true;
    
    
        log(
            "Starting SHIFT| extraction..."
        );
    
    
        const lines =
            originalText.split(
                /\r?\n/
            );
    
    
        const shiftValues = [];
    
        const cleanedLines = [];
    
    
        for (
            let i = 0;
            i < lines.length;
            i++
        ) {
    
            const line =
                lines[i];
    
    
            if (
                isShiftLine(line)
            ) {
    
                // Remove only the SHIFT| prefix
                // Extract raw SHIFT| value
        
        const rawShiftValue =
            line
                .trim()
                .replace(
                    /^SHIFT\|/i,
                    ""
                )
                .trim();
        
        
        // Automatically apply
        // AM/PM normalization
        
        const normalizedShiftValue =
            normalizeShiftTime(
                rawShiftValue
            );
        
        
        // Store normalized value
        
        shiftValues.push(
            normalizedShiftValue
        );
        
        
        // Report normalization
                if (
            normalizedShiftValue !==
            rawShiftValue
        ) {
        
            normalizedShiftCount++;
        
            log(
                `Line ${i + 1}: SHIFT extracted and time normalized`
            );
        
        } else {
        
            log(
                `Line ${i + 1}: SHIFT extracted — no normalization required`
            );
        }
        
        
            

            


            // Do NOT copy SHIFT line
            // into cleaned output

            continue;
        }


        // Preserve every non-SHIFT line

        cleanedLines.push(
            line
        );
    }


    // Build Shift.txt
    // Blank line between shift entries,
    // matching old Python behavior

    extractedShiftText =
        shiftValues.join(
            originalLineEnding +
            originalLineEnding
        );


    if (
        extractedShiftText.length > 0
    ) {

        extractedShiftText +=
            originalLineEnding;
    }


    // Build cleaned question TXT

    cleanedQuestionText =
        cleanedLines.join(
            originalLineEnding
        );


    document.getElementById(
        "extractedCount"
    ).textContent =
        shiftValues.length;

        
    document.getElementById(
        "normalizedCount"
    ).textContent =
        normalizedShiftCount;

    // Integrity check

    const remainingShiftTags =
        cleanedLines.filter(
            line =>
                isShiftLine(line)
        ).length;


    log(
        "Running extraction integrity check..."
    );


    if (
        remainingShiftTags > 0
    ) {

        document.getElementById(
            "status"
        ).textContent =
            "FAILED";


        log(
            `Integrity Check FAILED: ${remainingShiftTags} SHIFT| tag(s) remain.`
        );

        log(
            "Downloads blocked."
        );


        return;
    }


    if (
        shiftValues.length !==
        detectedShiftCount
    ) {

        document.getElementById(
            "status"
        ).textContent =
            "FAILED";


        log(
            "Integrity Check FAILED: Detected and extracted SHIFT counts do not match."
        );

        log(
            "Downloads blocked."
        );


        return;
    }


    // Successful extraction

    document.getElementById(
        "status"
    ).textContent =
        "COMPLETED";


    document.getElementById(
        "shiftOutputName"
    ).textContent =
        "Shift.txt";


    const cleanedFileName =
        createCleanedFileName();


    document.getElementById(
        "cleanedOutputName"
    ).textContent =
        cleanedFileName;


    log(
        "Extraction completed successfully."
    );

    log(
        `SHIFT| tags extracted: ${shiftValues.length}`
    );

    log(
        "Integrity Check: PASSED"
    );

    log(
        "Cleaned question file contains no SHIFT| lines."
    );


    // Enable downloads only after
    // successful integrity validation

    downloadShiftBtn.disabled = false;

    downloadCleanedBtn.disabled = false;
}


// =========================================
// CREATE CLEANED FILE NAME
// =========================================

function createCleanedFileName() {

    const baseName =
        originalFileName.replace(
            /\.txt$/i,
            ""
        );


    return (
        baseName +
        "_cleaned.txt"
    );
}


// =========================================
// DOWNLOAD SHIFT.TXT
// =========================================

function downloadShiftFile() {

    if (
        !extractedShiftText
    ) {

        log(
            "No extracted Shift data available."
        );

        return;
    }


    downloadTextFile(
        extractedShiftText,
        "Shift.txt"
    );


    log(
        "Downloaded: Shift.txt"
    );
}


// =========================================
// DOWNLOAD CLEANED QUESTION TXT
// =========================================

function downloadCleanedFile() {

    if (
        !cleanedQuestionText
    ) {

        log(
            "No cleaned question file available."
        );

        return;
    }


    const fileName =
        createCleanedFileName();


    downloadTextFile(
        cleanedQuestionText,
        fileName
    );


    log(
        `Downloaded: ${fileName}`
    );
}


// =========================================
// GENERIC TXT DOWNLOAD
// =========================================

function downloadTextFile(
    text,
    fileName
) {

    const blob =
        new Blob(
            [text],
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
        fileName;


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
}


// =========================================
// FILE SIZE FORMATTER
// =========================================

function formatFileSize(bytes) {

    if (
        bytes < 1024
    ) {

        return (
            bytes +
            " Bytes"
        );
    }


    if (
        bytes <
        1024 * 1024
    ) {

        return (
            (
                bytes / 1024
            ).toFixed(2) +
            " KB"
        );
    }


    return (
        (
            bytes /
            (
                1024 *
                1024
            )
        ).toFixed(2) +
        " MB"
    );
}
