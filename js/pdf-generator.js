/**
 * Conceptual Bridge - PDF Engine Version 2
 * Professional, dynamic, cursor-based PDF generation using pdf-lib and fontkit.
 */

const LAYOUT = {
  PAGE_WIDTH: 595.28,
  PAGE_HEIGHT: 841.89,
  MARGIN_LEFT: 40,
  MARGIN_RIGHT: 40,
  MARGIN_TOP: 40,
  MARGIN_BOTTOM: 40,
  HEADER_HEIGHT: 50,
  FOOTER_HEIGHT: 30,
  CONTENT_WIDTH: 515.28, // 595.28 - 80
  
  FONT_SIZE_TITLE: 18,
  FONT_SIZE_SUBTITLE: 12,
  FONT_SIZE_HEADER: 10,
  FONT_SIZE_BODY: 10,
  FONT_SIZE_SMALL: 8.5,

  LINE_HEIGHT_BODY: 14,
  LINE_HEIGHT_TITLE: 22,
  
  QUESTION_GAP: 16,
  OPTION_GAP: 6,
  SECTION_GAP: 12,
  INFOBOX_PADDING: 10,
  INDENT_OPTION: 15,

  COLOR_PRIMARY: { r: 0.05, g: 0.22, b: 0.40 },   // #0D3B66
  COLOR_SECONDARY: { r: 0.20, g: 0.25, b: 0.30 }, // Dark slate
  COLOR_TEXT: { r: 0.15, g: 0.15, b: 0.15 },      // #262626
  COLOR_MUTED: { r: 0.45, g: 0.45, b: 0.45 },     // Neutral Gray
  COLOR_ACCENT: { r: 0.10, g: 0.55, b: 0.30 },    // Green for correct answers
  COLOR_BG_LIGHT: { r: 0.96, g: 0.97, b: 0.98 },  // Soft light gray
  COLOR_BORDER: { r: 0.82, g: 0.85, b: 0.88 }    // Light border
};

/**
 * Text Wrapping Helper
 * Measures and wraps text based on font width calculation without clipping.
 */
function wrapText(text, font, fontSize, maxWidth) {
  if (!text) return [];
  const normalizedText = String(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const paragraphs = normalizedText.split('\n');
  const lines = [];

  for (let p = 0; p < paragraphs.length; p++) {
    const paragraph = paragraphs[p];
    if (paragraph.trim() === '') {
      lines.push('');
      continue;
    }

    const words = paragraph.split(' ');
    let currentLine = '';

    for (let w = 0; w < words.length; w++) {
      const word = words[w];
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Single word longer than maxWidth: break character by character
          let subWord = '';
          for (let c = 0; c < word.length; c++) {
            const char = word[c];
            const testSub = subWord + char;
            if (font.widthOfTextAtSize(testSub, fontSize) <= maxWidth) {
              subWord = testSub;
            } else {
              if (subWord) lines.push(subWord);
              subWord = char;
            }
          }
          currentLine = subWord;
        }
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Draw Wrapped Text helper block
 */
function drawWrappedText(page, lines, x, startY, font, fontSize, color, lineHeight) {
  let y = startY;
  const rgbColor = PDFLib.rgb(color.r, color.g, color.b);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] !== '') {
      page.drawText(lines[i], {
        x: x,
        y: y,
        size: fontSize,
        font: font,
        color: rgbColor
      });
    }
    y -= lineHeight;
  }
  return y;
}

/**
 * Create a new page and render common header
 */
function createNewPage(pdfDoc, fontBold, fontRegular, mode, state) {
  const page = pdfDoc.addPage([LAYOUT.PAGE_WIDTH, LAYOUT.PAGE_HEIGHT]);
  state.currentPage = page;
  state.pageCount += 1;
  state.currentY = LAYOUT.PAGE_HEIGHT - LAYOUT.MARGIN_TOP;
  
  state.currentY = drawHeader(page, fontBold, fontRegular, mode, state.currentY);
  return page;
}

/**
 * Check remaining space on current page, spawn new page if space is insufficient
 */
function checkRemainingSpace(pdfDoc, fontBold, fontRegular, mode, state, requiredHeight) {
  const minAllowedY = LAYOUT.MARGIN_BOTTOM + LAYOUT.FOOTER_HEIGHT;
  if (state.currentY - requiredHeight < minAllowedY) {
    createNewPage(pdfDoc, fontBold, fontRegular, mode, state);
  }
}

/**
 * Header Renderer
 */
function drawHeader(page, fontBold, fontRegular, mode, startY) {
  let y = startY;

  const title = "CONCEPTUAL BRIDGE";
  const titleWidth = fontBold.widthOfTextAtSize(title, LAYOUT.FONT_SIZE_TITLE);
  page.drawText(title, {
    x: (LAYOUT.PAGE_WIDTH - titleWidth) / 2,
    y: y,
    size: LAYOUT.FONT_SIZE_TITLE,
    font: fontBold,
    color: PDFLib.rgb(LAYOUT.COLOR_PRIMARY.r, LAYOUT.COLOR_PRIMARY.g, LAYOUT.COLOR_PRIMARY.b)
  });
  y -= 16;

  const subTitle = mode === "study" ? "Study Material & Concept Series" : "Practice Question Paper";
  const subTitleWidth = fontRegular.widthOfTextAtSize(subTitle, LAYOUT.FONT_SIZE_SUBTITLE);
  page.drawText(subTitle, {
    x: (LAYOUT.PAGE_WIDTH - subTitleWidth) / 2,
    y: y,
    size: LAYOUT.FONT_SIZE_SUBTITLE,
    font: fontRegular,
    color: PDFLib.rgb(LAYOUT.COLOR_SECONDARY.r, LAYOUT.COLOR_SECONDARY.g, LAYOUT.COLOR_SECONDARY.b)
  });
  y -= 12;

  // Divider Line
  page.drawLine({
    start: { x: LAYOUT.MARGIN_LEFT, y: y },
    end: { x: LAYOUT.PAGE_WIDTH - LAYOUT.MARGIN_RIGHT, y: y },
    thickness: 1,
    color: PDFLib.rgb(LAYOUT.COLOR_BORDER.r, LAYOUT.COLOR_BORDER.g, LAYOUT.COLOR_BORDER.b)
  });
  y -= 14;

  return y;
}

/**
 * Information Box Renderer
 */
function drawInformationBox(page, fontBold, fontRegular, payload, totalQuestions, mode, startY) {
  let y = startY;
  const paperMeta = (payload && payload.paperMeta) ? payload.paperMeta : {};

  const subject = paperMeta.subject || payload.subject || "General Studies";
  const topic = paperMeta.topic || payload.topic || "Comprehensive Assessment";
  const subTopic = paperMeta.subTopic || payload.subTopic || "All Subtopics";
  const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const infoLines = [
    `Subject: ${subject}`,
    `Topic: ${topic}${subTopic ? ' | ' + subTopic : ''}`,
    `Total Questions: ${totalQuestions}   |   Mode: ${mode === 'study' ? 'Study' : 'Practice'}   |   Date: ${dateStr}`
  ];

  let calculatedHeight = LAYOUT.INFOBOX_PADDING * 2;
  const lineHeights = [];

  for (let i = 0; i < infoLines.length; i++) {
    const wrapped = wrapText(infoLines[i], fontRegular, LAYOUT.FONT_SIZE_SMALL, LAYOUT.CONTENT_WIDTH - (LAYOUT.INFOBOX_PADDING * 2));
    lineHeights.push(wrapped);
    calculatedHeight += wrapped.length * (LAYOUT.LINE_HEIGHT_BODY - 2);
  }

  // Draw background card
  page.drawRectangle({
    x: LAYOUT.MARGIN_LEFT,
    y: y - calculatedHeight,
    width: LAYOUT.CONTENT_WIDTH,
    height: calculatedHeight,
    color: PDFLib.rgb(LAYOUT.COLOR_BG_LIGHT.r, LAYOUT.COLOR_BG_LIGHT.g, LAYOUT.COLOR_BG_LIGHT.b),
    borderColor: PDFLib.rgb(LAYOUT.COLOR_BORDER.r, LAYOUT.COLOR_BORDER.g, LAYOUT.COLOR_BORDER.b),
    borderWidth: 0.75
  });

  let textY = y - LAYOUT.INFOBOX_PADDING - LAYOUT.FONT_SIZE_SMALL;

  for (let i = 0; i < lineHeights.length; i++) {
    const lines = lineHeights[i];
    const useFont = i === 0 ? fontBold : fontRegular;
    const useColor = i === 0 ? LAYOUT.COLOR_PRIMARY : LAYOUT.COLOR_TEXT;

    textY = drawWrappedText(
      page,
      lines,
      LAYOUT.MARGIN_LEFT + LAYOUT.INFOBOX_PADDING,
      textY,
      useFont,
      LAYOUT.FONT_SIZE_SMALL,
      useColor,
      LAYOUT.LINE_HEIGHT_BODY - 2
    );
  }

  return y - calculatedHeight - LAYOUT.SECTION_GAP;
}

/**
 * Question Renderer
 */
function drawQuestion(pdfDoc, fontBold, fontRegular, question, index, mode, state) {
  const qNumText = `Q${index + 1}. `;
  const qNumWidth = fontBold.widthOfTextAtSize(qNumText, LAYOUT.FONT_SIZE_BODY);
  const qTextWidth = LAYOUT.CONTENT_WIDTH - qNumWidth;

  const questionText = question.text || "";
  const qLines = wrapText(questionText, fontRegular, LAYOUT.FONT_SIZE_BODY, qTextWidth);
  const qTextHeight = Math.max(1, qLines.length) * LAYOUT.LINE_HEIGHT_BODY;

  // Calculate options
  const optionKeys = ['a', 'b', 'c', 'd'];
  const optionLabels = ['A', 'B', 'C', 'D'];
  const preparedOptions = [];
  let totalOptionsHeight = 0;

  for (let i = 0; i < optionKeys.length; i++) {
    const key = optionKeys[i];
    const optValue = question[key];
    if (optValue !== undefined && optValue !== null && String(optValue).trim() !== '') {
      const labelStr = `(${optionLabels[i]}) `;
      const labelWidth = fontBold.widthOfTextAtSize(labelStr, LAYOUT.FONT_SIZE_BODY);
      const optTextWidth = LAYOUT.CONTENT_WIDTH - LAYOUT.INDENT_OPTION - labelWidth;
      
      const wrappedOpt = wrapText(String(optValue), fontRegular, LAYOUT.FONT_SIZE_BODY, optTextWidth);
      const optHeight = wrappedOpt.length * LAYOUT.LINE_HEIGHT_BODY;

      let isCorrect = false;
      if (mode === 'study') {
        if (typeof question.correct === 'number' && question.correct === i) {
          isCorrect = true;
        } else if (typeof question.correct === 'string' && question.correct.toUpperCase() === optionLabels[i]) {
          isCorrect = true;
        } else if (question.answer && String(question.answer).trim().toUpperCase() === optionLabels[i]) {
          isCorrect = true;
        }
      }

      preparedOptions.push({
        label: labelStr,
        labelWidth: labelWidth,
        lines: wrappedOpt,
        height: optHeight,
        isCorrect: isCorrect
      });

      totalOptionsHeight += optHeight + LAYOUT.OPTION_GAP;
    }
  }

  // Explanation block for study mode
  let expLines = [];
  let expHeight = 0;
  if (mode === 'study' && question.explanation && String(question.explanation).trim() !== '') {
    expLines = wrapText(`Explanation: ${question.explanation}`, fontRegular, LAYOUT.FONT_SIZE_SMALL, LAYOUT.CONTENT_WIDTH - LAYOUT.INDENT_OPTION);
    expHeight = (expLines.length * (LAYOUT.LINE_HEIGHT_BODY - 2)) + 6;
  }

  const blockRequiredHeight = qTextHeight + totalOptionsHeight + expHeight + LAYOUT.QUESTION_GAP;

  checkRemainingSpace(pdfDoc, fontBold, fontRegular, mode, state, blockRequiredHeight);

  let page = state.currentPage;
  let y = state.currentY;

  // Draw Question Number
  page.drawText(qNumText, {
    x: LAYOUT.MARGIN_LEFT,
    y: y,
    size: LAYOUT.FONT_SIZE_BODY,
    font: fontBold,
    color: PDFLib.rgb(LAYOUT.COLOR_PRIMARY.r, LAYOUT.COLOR_PRIMARY.g, LAYOUT.COLOR_PRIMARY.b)
  });

  // Draw Question Text
  y = drawWrappedText(
    page,
    qLines,
    LAYOUT.MARGIN_LEFT + qNumWidth,
    y,
    fontRegular,
    LAYOUT.FONT_SIZE_BODY,
    LAYOUT.COLOR_TEXT,
    LAYOUT.LINE_HEIGHT_BODY
  );

  y -= LAYOUT.OPTION_GAP;

  // Draw Options
  for (let i = 0; i < preparedOptions.length; i++) {
    const opt = preparedOptions[i];
    const optX = LAYOUT.MARGIN_LEFT + LAYOUT.INDENT_OPTION;
    const optColor = opt.isCorrect ? LAYOUT.COLOR_ACCENT : LAYOUT.COLOR_TEXT;
    const optFont = opt.isCorrect ? fontBold : fontRegular;

    page.drawText(opt.label, {
      x: optX,
      y: y,
      size: LAYOUT.FONT_SIZE_BODY,
      font: fontBold,
      color: PDFLib.rgb(optColor.r, optColor.g, optColor.b)
    });

    y = drawWrappedText(
      page,
      opt.lines,
      optX + opt.labelWidth,
      y,
      optFont,
      LAYOUT.FONT_SIZE_BODY,
      optColor,
      LAYOUT.LINE_HEIGHT_BODY
    );

    y -= LAYOUT.OPTION_GAP;
  }

  // Draw Explanation
  if (expLines.length > 0) {
    y -= 2;
    y = drawWrappedText(
      page,
      expLines,
      LAYOUT.MARGIN_LEFT + LAYOUT.INDENT_OPTION,
      y,
      fontRegular,
      LAYOUT.FONT_SIZE_SMALL,
      LAYOUT.COLOR_MUTED,
      LAYOUT.LINE_HEIGHT_BODY - 2
    );
  }

  state.currentY = y - LAYOUT.QUESTION_GAP;
}

/**
 * Footer Renderer across all generated pages
 */
function drawFooter(pdfDoc, fontRegular) {
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  for (let i = 0; i < totalPages; i++) {
    const page = pages[i];
    const footerY = LAYOUT.MARGIN_BOTTOM;

    page.drawLine({
      start: { x: LAYOUT.MARGIN_LEFT, y: footerY + 12 },
      end: { x: LAYOUT.PAGE_WIDTH - LAYOUT.MARGIN_RIGHT, y: footerY + 12 },
      thickness: 0.5,
      color: PDFLib.rgb(LAYOUT.COLOR_BORDER.r, LAYOUT.COLOR_BORDER.g, LAYOUT.COLOR_BORDER.b)
    });

    page.drawText("Conceptual Bridge Assessment Engine", {
      x: LAYOUT.MARGIN_LEFT,
      y: footerY,
      size: LAYOUT.FONT_SIZE_SMALL,
      font: fontRegular,
      color: PDFLib.rgb(LAYOUT.COLOR_MUTED.r, LAYOUT.COLOR_MUTED.g, LAYOUT.COLOR_MUTED.b)
    });

    const pageNumText = `Page ${i + 1} of ${totalPages}`;
    const pageNumWidth = fontRegular.widthOfTextAtSize(pageNumText, LAYOUT.FONT_SIZE_SMALL);

    page.drawText(pageNumText, {
      x: LAYOUT.PAGE_WIDTH - LAYOUT.MARGIN_RIGHT - pageNumWidth,
      y: footerY,
      size: LAYOUT.FONT_SIZE_SMALL,
      font: fontRegular,
      color: PDFLib.rgb(LAYOUT.COLOR_MUTED.r, LAYOUT.COLOR_MUTED.g, LAYOUT.COLOR_MUTED.b)
    });
  }
}

/**
 * Trigger PDF Save and Browser Download
 */
async function savePDF(pdfDoc, filename) {
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Main Exported Entry Point
 * Signature must match existing project API: generatePDF(questionArray, payload, mode)
 */
async function generatePDF(questionArray, payload, mode) {
  try {
    const { PDFDocument } = PDFLib;

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Fetch and embed Bengali TrueType fonts
    const [regularFontBytes, boldFontBytes] = await Promise.all([
      fetch("fonts/NotoSansBengali-Regular.ttf").then(res => {
        if (!res.ok) throw new Error("Failed to load NotoSansBengali-Regular.ttf");
        return res.arrayBuffer();
      }),
      fetch("fonts/NotoSansBengali-Bold.ttf").then(res => {
        if (!res.ok) throw new Error("Failed to load NotoSansBengali-Bold.ttf");
        return res.arrayBuffer();
      })
    ]);

    const fontRegular = await pdfDoc.embedFont(regularFontBytes);
    const fontBold = await pdfDoc.embedFont(boldFontBytes);

    const questions = Array.isArray(questionArray) ? questionArray : [];
    const sanitizedMode = (mode && String(mode).toLowerCase() === "study") ? "study" : "practice";

    const state = {
      currentPage: null,
      currentY: 0,
      pageCount: 0
    };

    // Initialize Page 1
    createNewPage(pdfDoc, fontBold, fontRegular, sanitizedMode, state);

    // Draw Information Card
    state.currentY = drawInformationBox(
      state.currentPage,
      fontBold,
      fontRegular,
      payload || {},
      questions.length,
      sanitizedMode,
      state.currentY
    );

    // Render all questions sequentially
    for (let i = 0; i < questions.length; i++) {
      drawQuestion(pdfDoc, fontBold, fontRegular, questions[i], i, sanitizedMode, state);
    }

    // Apply header & footers on all generated pages
    drawFooter(pdfDoc, fontRegular);

    // Generate output file title
    const topicTitle = (payload && payload.paperMeta && payload.paperMeta.topic) 
      ? payload.paperMeta.topic.replace(/[^a-zA-Z0-9]/g, "_") 
      : "Tutorial";
    const filename = `Conceptual_Bridge_${topicTitle}_${sanitizedMode}.pdf`;

    await savePDF(pdfDoc, filename);
    return true;

  } catch (error) {
    console.error("PDF Generation Engine V2 Error:", error);
    if (typeof alert === "function") {
      alert("Failed to generate PDF document. Please check console logs.");
    }
    throw error;
  }
}