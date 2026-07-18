const fileInput = document.getElementById("fileInput");

const processBtn = document.getElementById("processBtn");
const downloadBtn = document.getElementById("downloadBtn");
const consoleBox = document.getElementById("console");
let originalText = "";
let cleanedText = "";

let totalLines = 0;

let removedCount = 0;
let scannedCount = 0;


fileInput.addEventListener("change", loadFile);

function log(message){

    const time = new Date().toLocaleTimeString();

    consoleBox.textContent += `\n[${time}] ${message}`;

    consoleBox.scrollTop = consoleBox.scrollHeight;
}



function loadFile(e){

    const file = e.target.files[0];

    if(!file)
        return;
    cleanedText = "";
    removedCount = 0;
    scannedCount = 0;
    
    downloadBtn.disabled = true;
    
    document.getElementById("scanCount").textContent = "0";
    document.getElementById("removedCount").textContent = "0";
    document.getElementById("outputFile").textContent = "--";

    document.getElementById("fileName").textContent=file.name;

    document.getElementById("fileSize").textContent=
        (file.size/1024).toFixed(2)+" KB";

    const reader=new FileReader();

   reader.onload = function(event){

    originalText = event.target.result;

    totalLines = originalText.split(/\r?\n/).length;

    document.getElementById("totalLines").textContent = totalLines;

    consoleBox.textContent="";

    log("Developer Maintenance Suite Ready");

    log("File Loaded");

    log(file.name);

    log("Reading metadata...");

    log("Completed");

    log("Waiting for processing command");

    processBtn.disabled = false;

}

    reader.readAsText(file);

}

processBtn.addEventListener("click", processFile);
downloadBtn.addEventListener("click", downloadOutput);

function processFile(){

    log("Starting Processing...");

    removedCount = 0;
    scannedCount = 0;

    const lines = originalText.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {

        scannedCount++;
    
        const line = lines[i];
    
        // Detect possible citation lines
               
        const trimmedLine = line.trim();
        
       if (trimmedLine.endsWith("]")) {

            console.log(
                `ENDS WITH ] — Line ${i + 1}:`,
                trimmedLine
            );
        
            const lastOpenBracket = trimmedLine.lastIndexOf("[");
        
            if (lastOpenBracket !== -1) {

                const finalBracketBlock =
                    trimmedLine.substring(lastOpenBracket);
            
                console.log(
                    `FINAL BLOCK — Line ${i + 1}:`,
                    finalBracketBlock
                );
            
                if (finalBracketBlock.toLowerCase().startsWith("[cite:")) {

                    console.log(
                        `CONFIRMED CITATION — Line ${i + 1}:`,
                        finalBracketBlock
                    );
                
                    // Remove only the trailing citation
                    lines[i] = trimmedLine
                        .substring(0, lastOpenBracket)
                        .trimEnd();
                
                    removedCount++;
                }
            }
        }
    
        // Show progress every 100 lines
        if (i % 100 === 0) {
            log(`Scanning Line ${i + 1}`);
        }
    }
    

    // Rebuild the complete text after citation removal
    cleanedText = lines.join("\n");

    // Integrity checks
    const remainingCitations =
        (cleanedText.match(/\[cite:/gi) || []).length;
    
    log(`Citations Remaining: ${remainingCitations}`);
    
    if (remainingCitations === 0) {
        log("Integrity Check: PASSED");
    } else {
        log("Integrity Check: WARNING - Citations still remain");
    }

   // Structural integrity check
function countTag(text, tag) {

    return text
        .split(/\r?\n/)
        .filter(line => line.trim().startsWith(tag))
        .length;
}

const structureTags = [
    "Q|",
    "A|",
    "B|",
    "C|",
    "D|",
    "Shift|"
];

let structurePassed = true;

for (const tag of structureTags) {

    const originalCount = countTag(originalText, tag);
    const cleanedCount = countTag(cleanedText, tag);

    console.log(
        `${tag} Original: ${originalCount}, Cleaned: ${cleanedCount}`
    );

    if (originalCount !== cleanedCount) {

        structurePassed = false;

        log(
            `Structure Mismatch: ${tag} ` +
            `${originalCount} → ${cleanedCount}`
        );
    }
}

if (structurePassed) {
    log("Structure Check: PASSED");
} else {
    log("Structure Check: FAILED");
}

// DOWNLOAD SAFETY GATE

if (remainingCitations === 0 && structurePassed) {

    downloadBtn.disabled = false;

    document.getElementById("outputFile").textContent = "Ready";

    log("Output File Ready for Download");

} else {

    downloadBtn.disabled = true;

    document.getElementById("outputFile").textContent =
        "Validation Failed";

    log("Output blocked due to validation failure");
}


// Update statistics
document.getElementById("scanCount").textContent = scannedCount;
document.getElementById("removedCount").textContent = removedCount;

log("Scan Completed");
log(`Total Lines Scanned: ${scannedCount}`);
log(`Citations Removed: ${removedCount}`);

} // processFile() ends here





function downloadOutput() {

    if (!cleanedText) {
        log("No processed output available");
        return;
    }

    const blob = new Blob(
        [cleanedText],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "citation-cleaned-output.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    log("Output File Downloaded");
}
