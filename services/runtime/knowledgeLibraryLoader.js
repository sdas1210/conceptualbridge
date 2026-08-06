import fs from "fs/promises";
import path from "path";

/**
 * Conceptual Bridge - Knowledge Runtime v1.0
 * Module: Knowledge Library Loader
 * 
 * Provides runtime loading and validation for subject-specific compiled
 * question library artifacts.
 */

/**
 * Supported runtime subject identifiers.
 * @type {ReadonlySet<string>}
 */
const SUPPORTED_SUBJECTS = new Set(["math", "gaca", "gi", "gs"]);

/**
 * Loads and parses a compiled knowledge library JSON file for a given subject.
 * 
 * @param {string} subject - The subject identifier (math, gaca, gi, or gs).
 * @returns {Promise<{success: true, subject: string, library: Object} | {success: false, subject: string, error: string}>}
 * Object indicating success with the loaded library, or failure with an error code.
 */
export async function loadKnowledgeLibrary(subject) {
    if (typeof subject !== "string") {
        return {
            success: false,
            subject: String(subject),
            error: "INVALID_SUBJECT"
        };
    }

    const normalizedSubject = subject.trim().toLowerCase();

    if (!SUPPORTED_SUBJECTS.has(normalizedSubject)) {
        return {
            success: false,
            subject: normalizedSubject,
            error: "INVALID_SUBJECT"
        };
    }

    const filePath = path.join(
        process.cwd(),
        "knowledge",
        `questionLibrary.${normalizedSubject}.json`
    );

    let rawContent;
    try {
        rawContent = await fs.readFile(filePath, "utf8");
    } catch (err) {
        if (err && err.code === "ENOENT") {
            return {
                success: false,
                subject: normalizedSubject,
                error: "LIBRARY_NOT_FOUND"
            };
        }
        return {
            success: false,
            subject: normalizedSubject,
            error: "READ_FAILED"
        };
    }

    let parsedLibrary;
    try {
        parsedLibrary = JSON.parse(rawContent);
    } catch (err) {
        return {
            success: false,
            subject: normalizedSubject,
            error: "INVALID_JSON"
        };
    }

    return {
        success: true,
        subject: normalizedSubject,
        library: parsedLibrary
    };
}
