async function generateTutorialPDF(testSource, mode) {

    if (!testSource) {
        alert("No Test Source Found.");
        return;
    }

    console.log("========== Tutorial PDF ==========");
    console.log("Mode :", mode);
    console.log("Source :", testSource);
    console.log("==================================");

    alert(
        `PDF Request\n\nMode : ${mode}\nSource : ${testSource}`
    );

}

/*
=========================================================
Conceptual Bridge
PDF Generation System
File : pdf-entry.js
=========================================================

PURPOSE
-------
Entry point for every PDF request.

This file NEVER reads question files.
This file NEVER generates PDFs.

RESPONSIBILITIES
----------------
1. Receive button click.
2. Identify PDF Mode.
   - Study
   - Practice
3. Receive Question Source.
4. Forward request to pdf-loader.js.

CURRENT STATUS
--------------
Phase 1 : Button Routing ✔
Phase 2 : API Connection (In Progress)

Future Notes
------------
This file should remain very small.
Business logic belongs elsewhere.

=========================================================
*/
