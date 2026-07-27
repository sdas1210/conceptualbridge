async function generateTutorialPDF(source, mode) {

    console.clear();

    console.log("==================================");
    console.log("PDF Pipeline Started");
    console.log("==================================");
    console.log("Mode :", mode);
    console.log("Source :", source);

    const questionArray = await loadQuestions(source);

    console.log("Questions Loaded :", questionArray.length);

    console.log(questionArray);
}
