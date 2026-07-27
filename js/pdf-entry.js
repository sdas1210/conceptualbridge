async function generateTutorialPDF(source, mode) {

    console.clear();

    console.log("==============================");
    console.log("PDF Pipeline Started");
    console.log("==============================");
    console.log("Mode :", mode);
    console.log("Source :", source);

    const payload = await loadQuestions(source);

    console.log(payload);

    const questionArray = payload.data || [];

    console.log("Questions Loaded :", questionArray.length);

    console.log(questionArray);
}
