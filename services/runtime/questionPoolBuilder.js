import fs from "fs/promises";
import path from "path";

/**
 * Conceptual Bridge - Knowledge Runtime v1.0
 * Module: Question Pool Builder
 * 
 * Reads candidate question TXT files for a subject, parses them using subject-specific
 * parser modules, and merges them into a single deterministic question pool array.
 */

/**
 * Registry mapping subject identifiers to their respective parser module paths.
 * @type {Readonly<Record<string, string>>}
 */
const PARSER_REGISTRY = Object.freeze({
    math: "../mathParser.js",
    gaca: "../questionParser.js",
    gi: "../questionParser.js",
    gs: "../questionParser.js"
});

/**
 * Dynamically loads and returns the parse function for a given subject.
 * 
 * @param {string} subject - Subject identifier.
 * @returns {Promise<Function|null>} The parse function or null if parser module not found/invalid.
 */
async function loadSubjectParser(subject) {
    const parserPath = PARSER_REGISTRY[subject];
    if (!parserPath) {
        return null;
    }

    try {
        const parserModule = await import(parserPath);
        
        // Resolve parse function from default export or named export conventions
        if (typeof parserModule.default === "function") {
            return parserModule.default;
        }
        if (typeof parserModule.parse === "function") {
            return parserModule.parse;
        }
        if (typeof parserModule.parseQuestions === "function") {
            return parserModule.parseQuestions;
        }
        if (typeof parserModule.parseTextFileData === "function") {
            return parserModule.parseTextFileData;
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Helper to sort filenames numerically if they have numeric stems, falling back
 * to natural alphanumeric sorting.
 * 
 * @param {string[]} files - Array of filenames.
 * @returns {string[]} Numerically sorted array of unique filenames.
 */
function sortFilesNumerically(files) {
    const uniqueFiles = Array.from(new Set(files));

    return uniqueFiles.sort((a, b) => {
        const stemA = a.replace(/\.txt$/i, "");
        const stemB = b.replace(/\.txt$/i, "");

        const numA = Number(stemA);
        const numB = Number(stemB);

        const isNumA = !isNaN(numA) && stemA.trim() !== "";
        const isNumB = !isNaN(numB) && stemB.trim() !== "";

        if (isNumA && isNumB) {
            return numA - numB;
        }
        if (isNumA && !isNumB) {
            return -1;
        }
        if (!isNumA && isNumB) {
            return 1;
        }

        return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
    });
}

/**
 * Validates the pool builder request object.
 * 
 * @param {Object} request - Request object.
 * @returns {boolean} True if request is valid, false otherwise.
 */
function isValidRequest(request) {
    if (!request || typeof request !== "object" || Array.isArray(request)) {
        return false;
    }

    const subject = typeof request.subject === "string" ? request.subject.trim() : "";
    const mode = typeof request.mode === "string" ? request.mode.trim() : "";
    const files = Array.isArray(request.files) ? request.files : null;

    return subject.length > 0 && mode.length > 0 && files !== null && files.length > 0;
}

/**
 * Builds a deterministic question pool by reading and parsing specified candidate files.
 * 
 * @param {Object} request - Pool builder request ({ subject, mode, files }).
 * @returns {Promise<{
 *   success: true,
 *   subject: string,
 *   mode: string,
 *   sourceFiles: string[],
 *   totalSourceFiles: number,
 *   totalQuestions: number,
 *   generatedAt: string,
 *   questions: Array
 * } | {
 *   success: false,
 *   error: string
 * }>} Result payload containing the merged question pool or an error indicator.
 */
export async function buildQuestionPool(request) {
    if (!isValidRequest(request)) {
        return {
            success: false,
            error: "INVALID_REQUEST"
        };
    }

    const normalizedSubject = request.subject.trim().toLowerCase();
    const mode = request.mode.trim();
    const sortedFiles = sortFilesNumerically(request.files);

    if (sortedFiles.length === 0) {
        return {
            success: false,
            error: "INVALID_REQUEST"
        };
    }

    const parseFunc = await loadSubjectParser(normalizedSubject);
    if (!parseFunc) {
        return {
            success: false,
            error: "PARSER_NOT_FOUND"
        };
    }

    const baseDir = path.join(process.cwd(), "questions", normalizedSubject);

    // Read all candidate files in parallel using Promise.all()
    let fileContents;
    try {
        fileContents = await Promise.all(
            sortedFiles.map(filename => {
                const fullPath = path.join(baseDir, filename);
                return fs.readFile(fullPath, "utf8");
            })
        );
    } catch (err) {
        if (err && err.code === "ENOENT") {
            return {
                success: false,
                error: "FILE_NOT_FOUND"
            };
        }
        return {
            success: false,
            error: "FILE_NOT_FOUND"
        };
    }

    // Parse each file and merge results while preserving strict deterministic file order
    const mergedQuestions = [];

    for (let i = 0; i < sortedFiles.length; i++) {
        const rawContent = fileContents[i];
        const filename = sortedFiles[i];

        let parsedResult;
        try {
            parsedResult = parseFunc(rawContent, filename);
        } catch {
            return {
                success: false,
                error: "PARSE_FAILED"
            };
        }

        if (!parsedResult) {
            return {
                success: false,
                error: "PARSE_FAILED"
            };
        }

        // Normalize parsed result into an array of question items
        const questionArray = Array.isArray(parsedResult)
            ? parsedResult
            : (parsedResult.questions && Array.isArray(parsedResult.questions) ? parsedResult.questions : null);

        if (!questionArray) {
            return {
                success: false,
                error: "PARSE_FAILED"
            };
        }

        for (const q of questionArray) {
            mergedQuestions.push(q);
        }
    }

    if (mergedQuestions.length === 0) {
        return {
            success: false,
            error: "EMPTY_POOL"
        };
    }

    return {
        success: true,
        subject: normalizedSubject,
        mode: mode,
        sourceFiles: sortedFiles,
        totalSourceFiles: sortedFiles.length,
        totalQuestions: mergedQuestions.length,
        generatedAt: new Date().toISOString(),
        questions: mergedQuestions
    };
}
