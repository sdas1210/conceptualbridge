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
    const headerHeight = 30;
    const footerHeight = 15;

    // Printable Area
    const contentStartY = margin + headerHeight;
    const contentEndY = pageHeight - footerHeight - margin;

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
        margin,
        contentStartY
    );

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

    doc.rect(
        margin,
        contentStartY + 35,
        pageWidth - (margin * 2),
        contentEndY - (contentStartY + 35)
    );

    doc.text(
        "Question Area (Reserved)",
        margin + 5,
        contentStartY + 45
    );

    // -----------------------------
    // Download
    // -----------------------------
    doc.save(
        mode === "study"
            ? "ConceptualBridge_Study.pdf"
            : "ConceptualBridge_Practice.pdf"
    );
}
