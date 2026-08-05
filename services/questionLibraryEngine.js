import fs from "fs/promises";
import path from "path";

/**
 * Conceptual Bridge - Question Library Engine (v1.0)
 * Phase 1: File Discovery, Metadata Extraction, Topic Aggregation & Curriculum Validation
 * 
 * Dynamically discovers, validates, and reads question TXT files, extracting metadata,
 * detecting question format, aggregating statistics by Topic, and validating against curriculum standards.
 */

/**
 * Normalizes any supported curriculum JSON structure into a standard internal map.
 * 
 * Supported Formats:
 * - Format A: { "topics": [ { "topic": "Name", "subTopics": [...] } ] }
 * - Format B: [ { "topic": "Name", "subTopics": [...] } ]
 * - Format C: Flexible / dictionary objects or raw lists
 * 
 * @param {Object|Array} rawCurriculum - Parsed JSON object or array from curriculum file
 * @returns {Map<string, Set<string>>} Normalized Map where key is topicName and value is a Set of subTopics
 */
function parseCurriculumStructure(rawCurriculum) {
    const validTopicsMap = new Map();

    if (!rawCurriculum) {
        return validTopicsMap;
    }

    let topicsList = [];

    if (Array.isArray(rawCurriculum)) {
        // Format B
        topicsList = rawCurriculum;
    } else if (typeof rawCurriculum === "object") {
        if (Array.isArray(rawCurriculum.topics)) {
            // Format A
            topicsList = rawCurriculum.topics;
        } else {
            // Format C / Dictionary Fallback
            topicsList = Object.keys(rawCurriculum).map(key => {
                const val = rawCurriculum[key];
                if (typeof val === "object" && val !== null) {
                    return {
                        topic: val.topic || key,
                        subTopics: Array.isArray(val.subTopics) ? val.subTopics : []
                    };
                }
                return {
                    topic: key,
                    subTopics: Array.isArray(val) ? val : []
                };
            });
        }
    }

    for (const item of topicsList) {
        if (item && typeof item === "object" && item.topic) {
            const topicName = String(item.topic).trim();
            const subTopicsSet = new Set(
                Array.isArray(item.subTopics)
                    ? item.subTopics.map(st => String(subTopicName(st)).trim())
                    : []
            );
            validTopicsMap.set(topicName, subTopicsSet);
        }
    }

    return validTopicsMap;
}

/**
 * Helper to safely resolve subTopic string name from array elements
 */
function subTopicName(st) {
    if (typeof st === "string") return st;
    if (st && typeof st === "object" && st.name) return st.name;
    if (st && typeof st === "object" && st.subTopic) return st.subTopic;
    return String(st);
}

/**
 * Reads global metadata header, detects question format (Q vs QEN), and counts total question blocks in a TXT file.
 * Stops scanning metadata immediately upon encountering the first question block marker (Q| or QEN|).
 * 
 * @param {string} fullFilePath - Absolute or relative file path to read
 * @returns {Promise<Object>} Object containing extracted metadata fields, questionCount, and questionFormat
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
        questionCount: 0,
        questionFormat: null
    };

    try {
        const content = await fs.readFile(fullFilePath, "utf8");
        const lines = content.replace(/\r\n/g, "\n").split("\n");

        let firstQuestionReached = false;

        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;

            const isQTag = line.startsWith("Q|");
            const isQENTag = line.startsWith("QEN|");
            const isQuestionMarker = isQTag || isQENTag;

            if (isQuestionMarker) {
                if (!firstQuestionReached) {
                    firstQuestionReached = true;
                    metadata.questionFormat = isQENTag ? "QEN" : "Q";
                }
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
 * Groups processed question file objects by Topic and aggregates metadata metrics.
 * 
 * @param {Array<Object>} processedFiles - List of file metadata objects
 * @returns {Array<Object>} Sorted list of aggregated Topic objects
 */
function aggregateTopics(processedFiles) {
    const topicMap = new Map();

    for (const file of processedFiles) {
        const topicName = file.topic || "Uncategorized";

        if (!topicMap.has(topicName)) {
            topicMap.set(topicName, {
                topic: topicName,
                totalFiles: 0,
                totalQuestions: 0,
                files: [],
                subTopicsSet: new Set(),
                levelsSet: new Set(),
                examsSet: new Set()
            });
        }

        const topicEntry = topicMap.get(topicName);

        topicEntry.totalFiles += 1;
        topicEntry.totalQuestions += file.questionCount || 0;

        // Push numeric file ID (or filename if non-numeric)
        topicEntry.files.push(file.numericId);

        // Collect unique metadata attributes
        if (file.subTopic) topicEntry.subTopicsSet.add(file.subTopic);
        if (file.level) topicEntry.levelsSet.add(String(file.level));
        if (file.exam) topicEntry.examsSet.add(file.exam);
    }

    // Transform Map entries into final JSON structures and apply required sorting
    const aggregatedTopics = Array.from(topicMap.values()).map(entry => {
        // Sort files numerically if numeric, otherwise alphabetically
        entry.files.sort((a, b) => {
            const isANum = typeof a === "number";
            const isBNum = typeof b === "number";
            if (isANum && isBNum) return a - b;
            if (isANum && !isBNum) return -1;
            if (!isANum && isBNum) return 1;
            return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
        });

        return {
            topic: entry.topic,
            totalFiles: entry.totalFiles,
            totalQuestions: entry.totalQuestions,
            files: entry.files,
            subTopics: Array.from(entry.subTopicsSet).sort((a, b) => a.localeCompare(b)),
            levels: Array.from(entry.levelsSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
            exams: Array.from(entry.examsSet).sort((a, b) => a.localeCompare(b))
        };
    });

    // Sort Topics alphabetically
    aggregatedTopics.sort((a, b) => a.topic.localeCompare(b.topic));

    return aggregatedTopics;
}

/**
 * Validates extracted file metadata against normalized standard curriculum structures.
 * 
 * @param {Array<Object>} processedFiles - Array of clean file metadata objects
 * @param {string} subject - Subject identifier
 * @returns {Promise<Object>} Curriculum validation payload containing summary, fileResults, unknownTopics, unknownSubTopics, and unusedCurriculum
 */
async function validateCurriculum(processedFiles, subject) {
    const summary = {
        totalFiles: processedFiles.length,
        validFiles: 0,
        invalidFiles: 0,
        warnings: 0
    };

    const unknownTopicsSet = new Set();
    const unknownSubTopicsMap = new Map(); // "topic|subTopic" -> { topic, subTopic }
    const usedSubTopicsMap = new Map(); // topicName -> Set of subTopics used
    const fileResults = [];

    const curriculumPath = path.join(process.cwd(), "developer", "maintenance", `${subject}.json`);
    let validTopicsMap = new Map();

    try {
        const rawCurriculumText = await fs.readFile(curriculumPath, "utf8");
        const rawCurriculum = JSON.parse(rawCurriculumText);
        validTopicsMap = parseCurriculumStructure(rawCurriculum);
    } catch (e) {
        // Curriculum file missing or unreadable
        validTopicsMap = new Map();
    }

    for (const file of processedFiles) {
        let topicStatus = "PASS";
        let subTopicStatus = "PASS";
        const messages = [];

        const hasTopic = file.topic !== null && file.topic.trim() !== "";
        const hasSubTopic = file.subTopic !== null && file.subTopic.trim() !== "";

        // Check Blank Topic
        if (!hasTopic) {
            topicStatus = "FAIL";
            messages.push("Blank Topic");
        }

        // Check Blank SubTopic
        if (!hasSubTopic) {
            subTopicStatus = "WARNING";
            messages.push("Blank SubTopic");
        }

        if (validTopicsMap.size > 0) {
            if (hasTopic) {
                if (!validTopicsMap.has(file.topic)) {
                    topicStatus = "FAIL";
                    messages.push("Unknown Topic");
                    unknownTopicsSet.add(file.topic);
                } else {
                    const validSubSet = validTopicsMap.get(file.topic);

                    if (hasSubTopic) {
                        if (!validSubSet.has(file.subTopic)) {
                            subTopicStatus = "FAIL";
                            messages.push("SubTopic does not belong to Topic");
                            const key = `${file.topic}|${file.subTopic}`;
                            if (!unknownSubTopicsMap.has(key)) {
                                unknownSubTopicsMap.set(key, {
                                    topic: file.topic,
                                    subTopic: file.subTopic
                                });
                            }
                        } else {
                            // Record usage for unused curriculum detection
                            if (!usedSubTopicsMap.has(file.topic)) {
                                usedSubTopicsMap.set(file.topic, new Set());
                            }
                            usedSubTopicsMap.get(file.topic).add(file.subTopic);
                        }
                    }
                }
            }
        }

        fileResults.push({
            filename: file.filename,
            numericId: file.numericId,
            topicStatus: topicStatus,
            subTopicStatus: subTopicStatus,
            validationMessage: messages.length > 0 ? messages.join(", ") : "PASS"
        });

        // Tally summary counts
        if (topicStatus === "FAIL" || subTopicStatus === "FAIL") {
            summary.invalidFiles++;
        } else if (subTopicStatus === "WARNING") {
            summary.validFiles++;
            summary.warnings++;
        } else {
            summary.validFiles++;
        }
    }

    // Determine unused curriculum from standard validTopicsMap
    const unusedCurriculum = [];
    for (const [topName, subSet] of validTopicsMap.entries()) {
        const usedSubs = usedSubTopicsMap.get(topName) || new Set();

        for (const subName of subSet) {
            if (!usedSubs.has(subName)) {
                unusedCurriculum.push({
                    topic: topName,
                    subTopic: subName
                });
            }
        }
    }

    // Format unknown subtopics list
    const unknownSubTopics = Array.from(unknownSubTopicsMap.values()).sort((a, b) => {
        const comp = a.topic.localeCompare(b.topic);
        if (comp !== 0) return comp;
        return a.subTopic.localeCompare(b.subTopic);
    });

    return {
        summary,
        fileResults,
        unknownTopics: Array.from(unknownTopicsSet).sort(),
        unknownSubTopics,
        unusedCurriculum
    };
}

/**
 * Discovers, parses metadata, aggregates topics, validates curriculum, and returns knowledge index payload.
 * Orchestrates all modular engine steps.
 * 
 * @param {string} subject - The subject key (e.g., 'math', 'gaca', 'gi', 'gs')
 * @returns {Promise<Object>} Final structured payload containing success state, metadata, topics, and separate validation payload
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
                relativePath: `questions/${normalizedSubject}/${filename}`,
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
                relativePath: fileItem.relativePath,
                questionFormat: meta.questionFormat,
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

        // Step 8: Aggregate files into topic groups
        const topics = aggregateTopics(processedFiles);

        // Step 9: Validate Curriculum against maintenance JSON
        const validationPayload = await validateCurriculum(processedFiles, normalizedSubject);

        // Step 10: Return clean files array, topics array, and isolated validation payload
        return {
            success: true,
            subject: normalizedSubject,
            totalFiles: processedFiles.length,
            totalTopics: topics.length,
            files: processedFiles,
            topics: topics,
            validation: validationPayload
        };

    } catch (error) {
        // Safe catch-all to prevent throwing unhandled raw exceptions
        return {
            success: false,
            message: `Internal File Discovery Engine error: ${error.message}`
        };
    }
}
