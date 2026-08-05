import fs from "fs/promises";
import path from "path";

/**
 * Conceptual Bridge - Question Library Engine
 * Phase 1 & 2: File Discovery & Metadata Extraction Engine
 * 
 * Dynamically discovers, validates, and sorts subject-specific question TXT files,
 * extracting global metadata headers and counting question blocks per file.
 */

/**
 * Reads global metadata header and counts total question blocks in a question TXT file.
 * Stops scanning metadata immediately upon encountering the first question block marker (Q| or QEN|).
 * 
 * @param {string} fullFilePath - Absolute or relative file path to read
 * @returns {Promise<Object>} Object containing extracted metadata fields and questionCount
 */
async function extractFileMetadata(fullFilePath) {
    const metadata = {
        exam: null,
        subject: null,
        topic: null,
        subTopic: null,
        level: null,
        notification: null,
        type: null,
        marks: null,
        qtype: null,
        questionCount: 0
    };

    try {
        const content = await fs.readFile(fullFilePath, "utf8");
        const lines = content.replace(/\r\n/g, "\n").split("\n");

        let firstQuestionReached = false;

        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;

            const isQuestionMarker = line.startsWith("Q|") || line.startsWith("QEN|");

            if (isQuestionMarker) {
                firstQuestionReached = true;
                metadata.questionCount++;
                continue;
            }

            // After first question block marker, only count subsequent question blocks
            if (firstQuestionReached) {
                continue;
            }

            // Parse Global Metadata tags prior to the first question block
            if (line.startsWith("Exam|")) {
                const val = line.substring(5).trim();
                metadata.exam = val !== "" ? val : null;
            } else if (line.startsWith("Subject|")) {
                const val = line.substring(8).trim();
                metadata.subject = val !== "" ? val : null;
            } else if (line.startsWith("Topic|")) {
                const val = line.substring(6).trim();
                metadata.topic = val !== "" ? val : null;
            } else if (line.startsWith("SubTopic|")) {
                const val = line.substring(9).trim();
                metadata.subTopic = val !== "" ? val : null;
            } else if (line.startsWith("Level|")) {
                const val = line.substring(6).trim();
                metadata.level = val !== "" ? val : null;
            } else if (line.startsWith("Notification|") || line.startsWith("Notificaiton|")) {
                const val = line.substring(line.indexOf("|") + 1).trim();
                metadata.notification = val !== "" ? val : null;
            } else if (line.startsWith("Type|")) {
                const val = line.substring(5).trim();
                metadata.type = val !== "" ? val : null;
            } else if (line.startsWith("Marks|")) {
                const val = line.substring(6).trim();
                if (val !== "") {
                    const parsedMarks = parseFloat(val);
                    metadata.marks = !isNaN(parsedMarks) ? parsedMarks : val;
                }
            } else if (line.startsWith("QType|") || line.startsWith("QuestionType|")) {
                const val = line.substring(line.indexOf("|") + 1).trim();
                metadata.qtype = val !== "" ? val : null;
            }
        }

        return metadata;
    } catch (readError) {
        // Safe fallback if file reading fails
        return metadata;
    }
}

/**
 * Discovers, parses metadata, and returns all sorted .txt question files for a given subject.
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
            const numericId = isNaN(parsedId) ? nameWithoutExt : parsedId;

            discoveredFiles.push({
                filename: filename,
                numericId: numericId,
                fullPath: path.join(targetDir, filename),
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

        // Step 6: Sort files numerically (ascending by numericId), falling back to alphabetical for non-numeric files
        discoveredFiles.sort((a, b) => {
            if (a.isNumeric && b.isNumeric) {
                return a.numericId - b.numericId;
            }
            if (a.isNumeric && !b.isNumeric) {
                return -1; // Numeric files come first
            }
            if (!a.isNumeric && b.isNumeric) {
                return 1; // Non-numeric files come after
            }
            return String(a.numericId).localeCompare(String(b.numericId), undefined, { numeric: true, sensitivity: "base" });
        });

        // Step 7: Read global metadata and count question blocks for each discovered file
        const processedFiles = [];

        for (const fileItem of discoveredFiles) {
            const meta = await extractFileMetadata(fileItem.fullPath);

            processedFiles.push({
                filename: fileItem.filename,
                numericId: fileItem.numericId,
                exam: meta.exam,
                subject: meta.subject,
                topic: meta.topic,
                subTopic: meta.subTopic,
                level: meta.level,
                notification: meta.notification,
                type: meta.type,
                marks: meta.marks,
                qtype: meta.qtype,
                questionCount: meta.questionCount
            });
        }

        // Step 8: Return structured success payload
        return {
            success: true,
            subject: normalizedSubject,
            totalFiles: processedFiles.length,
            files: processedFiles
        };

    } catch (error) {
        // Safe catch-all to prevent throwing unhandled raw exceptions
        return {
            success: false,
            message: `Internal File Discovery Engine error: ${error.message}`
        };
    }
}
