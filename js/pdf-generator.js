

async function generatePDF(questionArray, payload, mode) {

    console.log("Question Array:", questionArray);
    console.log("First Question:", questionArray[0]);
    console.log("Payload:", payload);
    console.log("Mode:", mode);

    const { PDFDocument, StandardFonts, rgb } = PDFLib;

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const page = pdfDoc.addPage();

    const fontBytes = await fetch("fonts/NotoSansBengali-Regular.ttf")
        .then(response => response.arrayBuffer());
    
    const font = await pdfDoc.embedFont(fontBytes);

    const { width, height } = page.getSize();

    const pageWidth = width;
    const pageHeight = height;
    

    const margin = 15;

    // Header & Footer Reserved Areas
    const HEADER_HEIGHT = 30;
    const INFOBOX_HEIGHT = 45;
    const FOOTER_HEIGHT = 15;

    // Printable Area
    const contentStartY = margin + HEADER_HEIGHT;
    const contentEndY = pageHeight - FOOTER_HEIGHT - margin;
    const questionStartY = contentStartY + INFOBOX_HEIGHT;
    

    // -----------------------------
    // Draw Template
    // -----------------------------
    drawHeader(
        page,
        font,
        pageWidth,
        margin,
        mode
    );

    drawInformationBox(
        page,
        font,
        payload,
        questionArray,
        mode,
        margin,
        contentStartY
    );

    
    let currentY = questionStartY;

    if (questionArray.length > 0) {
        console.log(
            JSON.stringify(questionArray[0], null, 2)
        );
        
        console.log(
            JSON.stringify(payload, null, 2)
        );
        currentY = drawQuestion(
            page,
            font,
            questionArray[0],
            currentY,
            margin,
            pageWidth
        );
    
    }

    drawFooter(
        page,
        font,
        pageWidth,
        pageHeight,
        margin
    );

    // ---------------------------------
    // Save PDF
    // ---------------------------------
    const pdfBytes = await pdfDoc.save();
    
    // ---------------------------------
    // Download PDF
    // ---------------------------------
    const blob = new Blob([pdfBytes], {
        type: "application/pdf"
    });
    
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    
    a.href = url;
    
    a.download =
        mode === "study"
            ? "ConceptualBridge_Study.pdf"
            : "ConceptualBridge_Practice.pdf";
    
    document.body.appendChild(a);
    
    a.click();
    
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    // -----------------------------
    // Reserved Question Area
    // -----------------------------
    

    

    
}

function drawHeader(page, font, pageWidth, margin, mode) {

    page.drawText("CONCEPTUAL BRIDGE", {
        x: pageWidth / 2 - 90,
        y: 815,
        size: 20,
        font
    });

    page.drawText(
        mode === "study"
            ? "Study Material"
            : "Practice Material",
        {
            x: pageWidth / 2 - 45,
            y: 795,
            size: 12,
            font
        }
    );

    page.drawLine({
        start: {
            x: margin,
            y: 785
        },
        end: {
            x: pageWidth - margin,
            y: 785
        }
    });

}

function drawInformationBox(
    page,
    font,
    payload,
    questionArray,
    mode,
    margin,
    startY
) {

    const meta = payload.paperMeta || {};

    const generatedDate = new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    const baseY = 740;
    const lineGap = 18;

    page.drawText(`Subject : ${meta.subject || "-"}`, {
        x: margin,
        y: baseY,
        size: 11,
        font
    });

    page.drawText(`Topic : ${meta.topic || "-"}`, {
        x: margin,
        y: baseY - lineGap,
        size: 11,
        font
    });

    page.drawText(`Sub Topic : ${meta.subTopic || "-"}`, {
        x: margin,
        y: baseY - (lineGap * 2),
        size: 11,
        font
    });

    page.drawText(`Questions : ${questionArray.length}`, {
        x: margin,
        y: baseY - (lineGap * 3),
        size: 11,
        font
    });

    page.drawText(
        `Mode : ${mode === "study" ? "Study" : "Practice"}`,
        {
            x: margin,
            y: baseY - (lineGap * 4),
            size: 11,
            font
        }
    );

    page.drawText(`Generated : ${generatedDate}`, {
        x: margin,
        y: baseY - (lineGap * 5),
        size: 11,
        font
    });

}

function drawQuestion(
    page,
    font,
    question,
    startY,
    margin,
    pageWidth
) {

    // Question Number
    page.drawText("Question 1", {
        x: margin,
        y: startY,
        size: 12,
        font
    });

    // Temporary single-line rendering
    page.drawText(question.text || "", {
        x: margin,
        y: startY - 20,
        size: 11,
        font
    });

    return startY - 40;
}


function drawFooter(
    page,
    font,
    pageWidth,
    pageHeight,
    margin
) {

    page.drawLine({
        start: {
            x: margin,
            y: 30
        },
        end: {
            x: pageWidth - margin,
            y: 30
        }
    });

    page.drawText("Conceptual Bridge", {
        x: margin,
        y: 15,
        size: 9,
        font
    });

    page.drawText("Page 1", {
        x: pageWidth - 50,
        y: 15,
        size: 9,
        font
    });

}
