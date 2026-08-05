import fs from "fs/promises";
import path from "path";

/**
 * Conceptual Bridge - Question Library Engine
 * Phase 1: File Discovery Engine
 * 
 * Dynamically discovers, validates, and sorts subject-specific question TXT files.
 */

/**
 * Discovers and returns all sorted .txt question files for a given subject.
 * 
 * @param {string} subject - The subject key (e.g., 'math', 'gaca', 'gi', 'gs')
 * @returns {Promise<Object>} Status object containing success state, subject, totalFiles, and files array
 */
export async function discoverQuestionFiles(subject) {
    try {
        // Step 1: Input Validation
        if (!subject || typeof subject !== "string" || subject.trim() === "") {
            return {
                success: false,
                message: "Subject parameter is required"
            };
        }

        const normalizedSubject = subject.trim().toLowerCase();
        
        // Step 2: Resolve target directory path relative to project root
        const targetDir = path.join(process.cwd(), "questions", normalizedSubject);

        // Step 3: Verify directory existence and read directory entries
        let entries;
        try {
            entries = await fs.readdir(targetDir, { withFileTypes: true });
        } catch (dirError) {
            if (dirError.code === "ENOENT") {
                return {
                    success: false,
                    message: "Folder not found"
                };
            }
            return {
                success: false,
                message: `Error accessing folder: ${dirError.message}`
            };
        }

        // Step 4: Filter entries (only files, ignoring directories, hidden files, and non-txt files)
        const discoveredFiles = [];

        for (const entry of entries) {
            // Ignore subdirectories and non-file entries
            if (!entry.isFile()) continue;

            const filename = entry.name;

            // Ignore hidden files (starting with '.')
            if (filename.startsWith(".")) continue;

            // Filter strictly for .txt extensions
            if (!filename.toLowerCase().endsWith(".txt")) continue;

            // Extract numeric ID from filename (e.g., "354.txt" -> 354)
            const nameWithoutExt = path.basename(filename, ".txt");
            const parsedId = parseInt(nameWithoutExt, 10);

            discoveredFiles.push({
                id: isNaN(parsedId) ? nameWithoutExt : parsedId,
                filename: filename,
                filepath: `questions/${normalizedSubject}/${filename}`,
                isNumeric: /^\d+$/.test(nameWithoutExt) && !isNaN(parsedId)
            });
        }

        // Step 5: Check if any valid TXT files were found
        if (discoveredFiles.length === 0) {
            return {
                success: false,
                message: "No question files found"
            };
        }

        // Step 6: Sort files numerically (ascending by ID), falling back to alphabetical for non-numeric files
        discoveredFiles.sort((a, b) => {
            if (a.isNumeric && b.isNumeric) {
                return a.id - b.id;
            }
            if (a.isNumeric && !b.isNumeric) {
                return -1; // Numeric files come first
            }
            if (!a.isNumeric && b.isNumeric) {
                return 1; // Non-numeric files come after
            }
            return String(a.id).localeCompare(String(b.id), undefined, { numeric: true, sensitivity: "base" });
        });

        // Step 7: Format output array (strip temporary helper property)
        const formattedFiles = discoveredFiles.map(({ isNumeric, ...fileData }) => fileData);

        // Step 8: Return structured success payload
        return {
            success: true,
            subject: normalizedSubject,
            totalFiles: formattedFiles.length,
            files: formattedFiles
        };

    } catch (error) {
        // Safe catch-all to prevent throwing unhandled raw exceptions
        return {
            success: false,
            message: `Internal File Discovery Engine error: ${error.message}`
        };
    }
}
