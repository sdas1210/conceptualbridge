async function generatePDF(questionArray, payload, mode) {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.text("Conceptual Bridge", 20, 20);

    if (mode === "study") {
        doc.save("ConceptualBridge_Study.pdf");
    } else {
        doc.save("ConceptualBridge_Practice.pdf");
    }
}
