

async function generatePDF(questionArray, payload, mode) {

    const { jsPDF } = window.jspdf;

    // -----------------------------
    // Create PDF
    // -----------------------------
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    // -----------------------------
    // Global Layout Configuration
    // -----------------------------
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 15;

    // Header & Footer Reserved Areas
    const HEADER_HEIGHT = 30;
    const INFOBOX_HEIGHT = 45;
    const FOOTER_HEIGHT = 15;

    // Printable Area
    const contentStartY = margin + HEADER_HEIGHT;
    const contentEndY = pageHeight - FOOTER_HEIGHT - margin;
    const questionStartY = contentStartY + INFOBOX_HEIGHT;
    // Default Font
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    // -----------------------------
    // Draw Template
    // -----------------------------
    drawHeader(doc, pageWidth, margin, mode);

    drawInformationBox(
        doc,
        payload,
        questionArray,
        mode,
        margin,
        contentStartY
    );

    doc.setDrawColor(180);

    doc.line(
        margin,
        questionStartY - 5,
        pageWidth - margin,
        questionStartY - 5
    );
    let currentY = questionStartY;

    if (questionArray.length > 0) {
        console.log(questionArray[0]);
        currentY = drawQuestion(
            doc,
            questionArray[0],
            currentY,
            margin,
            pageWidth
        );
    
    }

    drawFooter(
        doc,
        pageWidth,
        pageHeight,
        margin
    );

    // -----------------------------
    // Reserved Question Area
    // -----------------------------
    doc.setDrawColor(220);

    

    // -----------------------------
    // Download
    // -----------------------------
    doc.save(
        mode === "study"
            ? "ConceptualBridge_Study.pdf"
            : "ConceptualBridge_Practice.pdf"
    );
}

function drawHeader(doc, pageWidth, margin, mode) {

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");

    doc.text(
        "CONCEPTUAL BRIDGE",
        pageWidth / 2,
        18,
        { align: "center" }
    );

    doc.setFontSize(12);

    doc.text(
        mode === "study"
            ? "Study Material"
            : "Practice Material",
        pageWidth / 2,
        25,
        { align: "center" }
    );

    doc.line(
        margin,
        30,
        pageWidth - margin,
        30
    );
}

function drawInformationBox(doc, payload, questionArray, mode, margin, startY) {

    const meta = payload.paperMeta || {};

    // Generate today's date
    const generatedDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(`Subject : ${meta.subject || "-"}`, margin, startY);

    doc.text(`Topic : ${meta.topic || "-"}`, margin, startY + 7);

    doc.text(`Sub Topic : ${meta.subTopic || "-"}`, margin, startY + 14);

    doc.text(`Questions : ${questionArray.length}`, margin, startY + 21);

    doc.text(
        `Mode : ${mode === "study" ? "Study" : "Practice"}`,
        margin,
        startY + 28
    );

    doc.text(
        `Generated : ${generatedDate}`,
        margin,
        startY + 35
    );
}

function drawQuestion(doc, question, startY, margin, pageWidth) {

    // Heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text(
        "Question 1",
        margin,
        startY
    );

    // Question Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    console.log(question);

    console.log(question.text);
    
    console.log(typeof question.text);
    const questionLines = doc.splitTextToSize(
        question.text,
        pageWidth - (margin * 2)
    );

    // Return the next available Y position
    return startY + 8 + (questionLines.length * 6);
}

function drawFooter(doc, pageWidth, pageHeight, margin) {

    doc.line(
        margin,
        pageHeight - 12,
        pageWidth - margin,
        pageHeight - 12
    );

    doc.setFontSize(9);

    doc.text(
        "Conceptual Bridge",
        margin,
        pageHeight - 6
    );

    doc.text(
        "Page 1",
        pageWidth - margin,
        pageHeight - 6,
        { align: "right" }
    );
}
