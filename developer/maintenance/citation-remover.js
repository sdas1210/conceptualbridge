const fileInput = document.getElementById("fileInput");

const processBtn = document.getElementById("processBtn");

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


function processFile(){

    log("Starting Processing...");

    removedCount = 0;
    scannedCount = 0;

    const lines = originalText.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {

        scannedCount++;
    
        const line = lines[i];
    
        // Detect possible citation lines
        if (line.trim().endsWith("]")) {
    
            console.log(
                `Candidate Citation Line ${i + 1}:`,
                line
            );
        }
    
        // Show progress every 100 lines
        if (i % 100 === 0) {
            log(`Scanning Line ${i + 1}`);
        }
    }

    document.getElementById("scannedLines").textContent = scannedCount;

    log(`Scan Completed`);
    log(`Total Lines Scanned: ${scannedCount}`);
}


