/**
 * Conceptual Bridge - Question Adapter / Normalization Layer
 * -----------------------------------------------------------
 * Normalizes parser outputs from various subjects (GACA, Math, GI, GS)
 * into a single Standard Question Object required by downstream modules (e.g., PDF Generator).
 */

/**
 * Helper: Splits bilingual slash-separated text ("English / Bengali") into language properties.
 */
function splitBilingualText(rawText = "") {
    if (!rawText) return { eng: "", ben: "" };
    
    if (rawText.includes("/")) {
        const parts = rawText.split("/");
        return {
            eng: parts[0].trim(),
            ben: parts.slice(1).join("/").trim()
        };
    }
    
    return {
        eng: rawText.trim(),
        ben: rawText.trim()
    };
}

/**
 * Normalizes a raw question object output by questionParser.js (GACA).
 * * @param {Object} rawQuestion - Un-adapted GACA question object
 * @returns {Object} Standard Question Object
 */
export function adaptGACAQuestion(rawQuestion = {}) {
    // Extract main question text
    const qText = rawQuestion.text || "";
    const parsedQText = splitBilingualText(qText);

    const questionENG = rawQuestion.textEng || parsedQText.eng;
    const questionBEN = rawQuestion.textBn || parsedQText.ben;

    // Extract options
    const rawOptions = [
        rawQuestion.a || "",
        rawQuestion.b || "",
        rawQuestion.c || "",
        rawQuestion.d || ""
    ];

    const optionsENG = [];
    const optionsBEN = [];

    rawOptions.forEach((optStr, idx) => {
        const keyEng = `aEng`, keyBn = `aBn`;
        const specificEng = rawQuestion[keyEng]; // fallback check if parser provides aEng/aBn
        const specificBn = rawQuestion[keyBn];

        if (specificEng || specificBn) {
            optionsENG.push(specificEng || optStr);
            optionsBEN.push(specificBn || optStr);
        } else {
            const parsedOpt = splitBilingualText(optStr);
            optionsENG.push(parsedOpt.eng);
            optionsBEN.push(parsedOpt.ben);
        }
    });

    return {
        id: rawQuestion.QuestionID || rawQuestion.id || "",
        subject: rawQuestion.subject || "GACA",

        questionENG,
        questionBEN,

        optionsENG,
        optionsBEN,

        correctIndex: typeof rawQuestion.correct === "number" ? rawQuestion.correct : null,

        metadata: {
            topic: rawQuestion.topic || "",
            subTopic: rawQuestion.subTopic || "",
            difficulty: typeof rawQuestion.difficulty === "number" ? rawQuestion.difficulty : 5,
            questionType: rawQuestion.qType || rawQuestion.type || "MCQ",
            level: rawQuestion.level || "",
            marks: typeof rawQuestion.marks === "number" ? rawQuestion.marks : 1,
            image: rawQuestion.image || "",

            extra: {
                shift: rawQuestion.shift || "",
                exam: rawQuestion.exam || "",
                notification: rawQuestion.notification || "",
                sourceFile: rawQuestion.sourceFile || "",
                folder: rawQuestion.folder || ""
            }
        }
    };
}

/**
 * Normalizes a raw question object output by mathParser.js (Mathematics).
 * TODO: Implement when Mathematics parser integration is executed.
 */
export function adaptMathQuestion(rawQuestion = {}) {
    // TODO: Implement Mathematics parser normalization
    return adaptGACAQuestion(rawQuestion);
}

/**
 * Normalizes a raw question object output by giParser.js (General Intelligence).
 * TODO: Implement when GI parser integration is executed.
 */
export function adaptGIQuestion(rawQuestion = {}) {
    // TODO: Implement GI parser normalization
    return adaptGACAQuestion(rawQuestion);
}

/**
 * Normalizes a raw question object output by gsParser.js (General Science).
 * TODO: Implement when GS parser integration is executed.
 */
export function adaptGSQuestion(rawQuestion = {}) {
    // TODO: Implement GS parser normalization
    return adaptGACAQuestion(rawQuestion);
}

/**
 * Master Router Normalizer Function.
 * Accepts a raw question object and subject key, then returns a Standard Question Object.
 * * @param {Object} rawQuestion - Un-adapted raw question object
 * @param {string} subject - Subject identifier ("GACA", "Mathematics", "GI", "GS")
 * @returns {Object} Standard Question Object
 */
export function normalizeQuestion(rawQuestion = {}, subject = "") {
    const subjUpper = (subject || rawQuestion.subject || "").toUpperCase();

    if (subjUpper.includes("MATH")) {
        return adaptMathQuestion(rawQuestion);
    }
    if (subjUpper.includes("GI") || subjUpper.includes("INTELLIGENCE")) {
        return adaptGIQuestion(rawQuestion);
    }
    if (subjUpper.includes("GS") || subjUpper.includes("SCIENCE")) {
        return adaptGSQuestion(rawQuestion);
    }

    // Default to GACA Adapter
    return adaptGACAQuestion(rawQuestion);
}
