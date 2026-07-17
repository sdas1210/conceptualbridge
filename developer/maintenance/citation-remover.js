const fileInput = document.getElementById("fileInput");

const processBtn = document.getElementById("processBtn");

const consoleBox = document.getElementById("console");

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

    reader.onload=function(event){

        const text=event.target.result;

        const totalLines=text.split(/\r?\n/).length;

        document.getElementById("totalLines").textContent=totalLines;

        consoleBox.textContent="";

        log("Developer Maintenance Suite Ready");

        log("File Loaded");

        log(file.name);

        log("Reading metadata...");

        log("Completed");

        log("Waiting for processing command");

        processBtn.disabled=false;

    };

    reader.readAsText(file);

}
