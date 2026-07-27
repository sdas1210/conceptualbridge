function generateTutorialPDF(testSource, mode) {

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
