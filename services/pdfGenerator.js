/**
 * Conceptual Bridge - Parser-Independent PDF Generator Module
 * -------------------------------------------------------------
 * Isolated PDF generation service using jsPDF.
 * Consumes ONLY Standard Question Objects produced by questionAdapter.js.
 */

// Global / Module fallback detector for jsPDF instance
function getJsPDFInstance() {
    if (typeof window !== "undefined" && window.jspdf && window.jspdf.jsPDF) {
        return window.jspdf.jsPDF;
    }
    if (typeof jsPDF !== "undefined") {
        return jsPDF;
    }
    return null;
}

/**
 * Helper: Converts integer index (0-3) to letter choice ('A', 'B', 'C', 'D').
 */
function getOptionLetter(index) {
    if (index === 0) return "A";
    if (index === 1) return "B";
    if (index === 2) return "C";
    if (index === 3) return "D";
    return "";
}

/**
 * Generic Helper: Selects localized question text from Standard Question Object.
 */
function getLocalizedQuestionText(standardQuestion, language) {
    if (language === "BEN") {
        return standardQuestion.questionBEN || standardQuestion.questionENG || "";
    }
    return standardQuestion.questionENG || standardQuestion.questionBEN || "";
}

/**
 * Generic Helper: Selects localized options array from Standard Question Object.
 */
function getLocalizedOptions(standardQuestion, language) {
    if (language === "BEN") {
        if (Array.isArray(standardQuestion.optionsBEN) && standardQuestion.optionsBEN.length === 4) {
            return standardQuestion.optionsBEN;
        }
    }
    return Array.isArray(standardQuestion.optionsENG) ? standardQuestion.optionsENG : ["", "", "", ""];
}

/**
 * Generates a Practice Mode PDF from Standard Question Objects.
 * Format:
 * Title Header
 * Question 1...
 * A. ...
 * B. ...
 * C. ...
 * D. ...
 * ...
 * [Answer Key Page]
 * Answer Key
 * 1. A    2. C    3. D ...
 */
export function generatePracticePDF(standardQuestions = [], language = "ENG", title = "Conceptual Bridge Practice Paper") {
    const jsPDFLib = getJsPDFInstance();
    if (!jsPDFLib) {
        console.warn("[pdfGenerator] jsPDF library is not loaded in the runtime environment.");
        return null;
    }

    const doc = new jsPDFLib({ unit: "pt", format: "a4" });

    // Page dimensions & margins (A4: 595.28pt x 841.89pt)
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const leftMargin = 40;
    const rightMargin = 40;
    const topMargin = 40;
    const bottomMargin = 40;
    const contentWidth = pageWidth - leftMargin - rightMargin;
    const maxY = pageHeight - bottomMargin;

    let currentY = topMargin;

    // Page break checking helper
    function checkPageBreak(requiredHeight) {
        if (currentY + requiredHeight > maxY) {
            doc.addPage();
            currentY = topMargin;
            return true;
        }
        return false;
    }

    // ----------------------------------------------------
    // STEP 1: Render Document Title Header
    // ----------------------------------------------------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Conceptual Bridge", pageWidth / 2, currentY, { align: "center" });
    currentY += 24;

    if (title) {
        doc.setFontSize(13);
        doc.setFont("helvetica", "normal");
        const titleLines = doc.splitTextToSize(title, contentWidth);
        doc.text(titleLines, pageWidth / 2, currentY, { align: "center" });
        currentY += (titleLines.length * 16) + 8;
    } else {
        currentY += 8;
    }

    // Divider Line
    doc.setLineWidth(0.75);
    doc.line(leftMargin, currentY, pageWidth - rightMargin, currentY);
    currentY += 20;

    // ----------------------------------------------------
    // STEP 2 & 3 & 4: Render Questions, Options, & Page Breaks
    // ----------------------------------------------------
    const optionPrefixes = ["A. ", "B. ", "C. ", "D. "];

    standardQuestions.forEach((q, idx) => {
        const qNum = idx + 1;
        const questionText = getLocalizedQuestionText(q, language);
        const options = getLocalizedOptions(q, language);

        // Prepare Question text layout
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        const numPrefix = `${qNum}. `;
        const numPrefixWidth = doc.getTextWidth(numPrefix);

        doc.setFont("helvetica", "normal");
        const qLines = doc.splitTextToSize(questionText, contentWidth - numPrefixWidth);
        const qTextHeight = qLines.length * 15;

        // Prepare Options layout
        const optionIndent = leftMargin + 15;
        const optionContentWidth = contentWidth - 15;
        const optLineArray = [];
        let totalOptsHeight = 0;

        options.forEach((optText, optIdx) => {
            const prefix = optionPrefixes[optIdx] || "";
            const fullOptStr = `${prefix}${optText || ""}`;
            const optLines = doc.splitTextToSize(fullOptStr, optionContentWidth);
            optLineArray.push(optLines);
            totalOptsHeight += (optLines.length * 14) + 4;
        });

        const totalQuestionBlockHeight = qTextHeight + totalOptsHeight + 14;

        // Check if page break is needed before rendering this question block
        checkPageBreak(totalQuestionBlockHeight);

        // Render Question Number (Bold) & Question Body
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(numPrefix, leftMargin, currentY);

        doc.setFont("helvetica", "normal");
        doc.text(qLines, leftMargin + numPrefixWidth, currentY);
        currentY += qTextHeight + 6;

        // Render Options (Indented)
        optLineArray.forEach((optLines) => {
            doc.text(optLines, optionIndent, currentY);
            currentY += (optLines.length * 14) + 4;
        });

        currentY += 10; // Gap between questions
    });

    // ----------------------------------------------------
    // STEP 5: Answer Key Page
    // ----------------------------------------------------
    doc.addPage();
    currentY = topMargin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Answer Key", pageWidth / 2, currentY, { align: "center" });
    currentY += 22;

    doc.setLineWidth(0.75);
    doc.line(leftMargin, currentY, pageWidth - rightMargin, currentY);
    currentY += 20;

    // Render Answer Grid (4 Columns)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const colWidth = 110;
    const numCols = 4;
    const colStartX = leftMargin + 20;
    let ansCurrentY = currentY;

    standardQuestions.forEach((q, idx) => {
        const qNum = idx + 1;
        const letter = getOptionLetter(q.correctIndex) || "-";
        const itemText = `${qNum}. ${letter}`;

        const colIdx = idx % numCols;

        if (colIdx === 0 && idx > 0) {
            ansCurrentY += 18;
            if (ansCurrentY + 18 > maxY) {
                doc.addPage();
                ansCurrentY = topMargin;
            }
        }

        const posX = colStartX + (colIdx * colWidth);
        doc.text(itemText, posX, ansCurrentY);
    });

    const pdfData = {
        title: title,
        mode: "practice",
        language: language,
        totalQuestions: standardQuestions.length,
        items: standardQuestions.map((q, idx) => ({
            number: idx + 1,
            questionText: getLocalizedQuestionText(q, language),
            options: getLocalizedOptions(q, language),
            correctLetter: getOptionLetter(q.correctIndex)
        }))
    };

    return { doc, metadata: pdfData };
}

/**
 * Foundation: Generates a Study Mode PDF from Standard Question Objects.
 * (Preserved as structural foundation - rendering to be implemented in Phase 3)
 */
export function generateStudyPDF(standardQuestions = [], language = "ENG", title = "Conceptual Bridge Study Guide") {
    const jsPDFLib = getJsPDFInstance();
    if (!jsPDFLib) {
        console.warn("[pdfGenerator] jsPDF library is not loaded in the runtime environment.");
        return null;
    }

    const doc = new jsPDFLib({ unit: "pt", format: "a4" });

    const pdfData = {
        title: title,
        mode: "study",
        language: language,
        totalQuestions: standardQuestions.length,
        items: standardQuestions.map((q, idx) => {
            const options = getLocalizedOptions(q, language);
            const correctLetter = getOptionLetter(q.correctIndex);
            const correctText = options[q.correctIndex] || "";

            return {
                number: idx + 1,
                questionText: getLocalizedQuestionText(q, language),
                correctLetter: correctLetter,
                correctAnswerText: `(${correctLetter}) ${correctText}`
            };
        })
    };

    return { doc, metadata: pdfData };
}

/**
 * Public Orchestrator API Function.
 * Prepares the PDF document and returns { doc, metadata, filename }
 * WITHOUT triggering automatic disk downloads.
 */
export function downloadTutorialPDF(mode = "practice", standardQuestions = [], language = "ENG", title = "Tutorial Module") {
    if (!standardQuestions || standardQuestions.length === 0) {
        console.warn("[pdfGenerator] No standard question objects provided for PDF generation.");
        return null;
    }

    const sanitizedMode = mode.toLowerCase() === "study" ? "study" : "practice";
    const sanitizedLang = language === "BEN" ? "BEN" : "ENG";

    let result = null;

    if (sanitizedMode === "practice") {
        result = generatePracticePDF(standardQuestions, sanitizedLang, title);
    } else if (sanitizedMode === "study") {
        result = generateStudyPDF(standardQuestions, sanitizedLang, title);
    }

    if (result && result.doc) {
        const filename = `${title.replace(/[^a-zA-Z0-9]/g, "_")}_${sanitizedMode}_${sanitizedLang}.pdf`;
        return {
            doc: result.doc,
            metadata: result.metadata,
            filename: filename
        };
    }

    return null;
}
