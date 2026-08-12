import fs from "fs/promises";
import path from "path";

/**
 * Conceptual Bridge - Question Library Engine (v1.1)
 * Phase 2: File Discovery, Metadata Inheritance, Topic/SubTopic/Level Aggregation & Curriculum Validation
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
 * Reads global metadata, detects question format, counts question blocks, and
 * resolves effective metadata for every question.
 *
 * Metadata inheritance rule:
 *   1. A non-blank global value is authoritative.
 *   2. If the global value is blank, the individual question value is used.
 *   3. The rule is evaluated independently for Topic, SubTopic, and Level.
 *
 * Only lightweight question metadata is indexed here; question text/options are
 * intentionally not copied into the Knowledge Library.
 *
 * @param {string} fullFilePath - Absolute or relative file path to read
 * @returns {Promise<Object>} File metadata plus lightweight question profiles
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
        questionFormat: null,
        questionProfiles: []
    };

    const normalizeValue = (value) => {
        const normalized = String(value ?? "").trim();
        return normalized !== "" ? normalized : null;
    };

    const readTagValue = (line, tags) => {
        for (const tag of tags) {
            if (line.startsWith(`${tag}|`)) {
                return normalizeValue(line.substring(tag.length + 1));
            }
        }
        return undefined;
    };

    try {
        const content = await fs.readFile(fullFilePath, "utf8");
        const lines = content.replace(/\r\n/g, "\n").split("\n");

        let firstQuestionReached = false;
        let currentQuestion = null;

        const saveCurrentQuestion = () => {
            if (!currentQuestion) return;

            const effectiveTopic = metadata.topic ?? currentQuestion.topic;
            const effectiveSubTopic = metadata.subTopic ?? currentQuestion.subTopic;
            const effectiveLevel = metadata.level ?? currentQuestion.level;

            metadata.questionProfiles.push({
                index: currentQuestion.index,
                questionID: currentQuestion.questionID ?? null,
                topic: effectiveTopic,
                subTopic: effectiveSubTopic,
                level: effectiveLevel
            });

            currentQuestion = null;
        };

        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;

            const isQTag = line.startsWith("Q|");
            const isQENTag = line.startsWith("QEN|");

            if (isQTag || isQENTag) {
                saveCurrentQuestion();

                if (!firstQuestionReached) {
                    firstQuestionReached = true;
                    metadata.questionFormat = isQENTag ? "QEN" : "Q";
                }

                metadata.questionCount += 1;
                currentQuestion = {
                    index: metadata.questionCount,
                    questionID: null,
                    topic: null,
                    subTopic: null,
                    level: null
                };
                continue;
            }

            if (!firstQuestionReached) {
                // Global/file-level metadata is read only before the first question.
                const globalTagValue = readTagValue(line, ["Exam"]);
                if (globalTagValue !== undefined) metadata.exam = globalTagValue;

                const subjectValue = readTagValue(line, ["Subject"]);
                if (subjectValue !== undefined) metadata.subject = subjectValue;

                const topicValue = readTagValue(line, ["Topic"]);
                if (topicValue !== undefined) metadata.topic = topicValue;

                const subTopicValue = readTagValue(line, ["SubTopic", "Sub-Topic"]);
                if (subTopicValue !== undefined) metadata.subTopic = subTopicValue;

                const levelValue = readTagValue(line, ["Level"]);
                if (levelValue !== undefined) metadata.level = levelValue;

                const notificationValue = readTagValue(line, ["Notification", "Notificaiton"]);
                if (notificationValue !== undefined) metadata.notification = notificationValue;

                const typeValue = readTagValue(line, ["Type"]);
                if (typeValue !== undefined) metadata.type = typeValue;

                const marksValue = readTagValue(line, ["Marks"]);
                if (marksValue !== undefined) {
                    const parsedMarks = parseFloat(marksValue);
                    metadata.marks = !Number.isNaN(parsedMarks) ? parsedMarks : marksValue;
                }

                const qtypeValue = readTagValue(line, ["QType", "QuestionType"]);
                if (qtypeValue !== undefined) metadata.qtype = qtypeValue;

                continue;
            }

            if (!currentQuestion) continue;

            const questionTopic = readTagValue(line, ["Topic"]);
            if (questionTopic !== undefined) currentQuestion.topic = questionTopic;

            const questionSubTopic = readTagValue(line, ["SubTopic", "Sub-Topic"]);
            if (questionSubTopic !== undefined) currentQuestion.subTopic = questionSubTopic;

            const questionLevel = readTagValue(line, ["Level"]);
            if (questionLevel !== undefined) currentQuestion.level = questionLevel;

            const questionID = readTagValue(line, ["QuestionID", "QuestionId"]);
            if (questionID !== undefined) currentQuestion.questionID = questionID;
        }

        saveCurrentQuestion();

        return metadata;
    } catch (readError) {
        return metadata;
    }
}

/**
 * Groups processed question file objects by effective Topic and aggregates
 * Topic → SubTopic → Level question counts.
 *
 * Existing fields such as `subTopics` and `levels` are preserved for
 * compatibility; count-rich structures are additive.
 *
 * @param {Array<Object>} processedFiles - List of file metadata objects
 * @returns {Array<Object>} Sorted list of aggregated Topic objects
 */
function aggregateTopics(processedFiles) {
    const topicMap = new Map();

    const ensureTopic = (topicName) => {
        if (!topicMap.has(topicName)) {
            topicMap.set(topicName, {
                topic: topicName,
                totalFiles: 0,
                totalQuestions: 0,
                files: [],
                subTopicsSet: new Set(),
                levelsSet: new Set(),
                examsSet: new Set(),
                subTopicCounts: new Map(),
                levelCounts: new Map()
            });
        }
        return topicMap.get(topicName);
    };

    for (const file of processedFiles) {
        const fallbackTopic = file.topic || "Uncategorized";
        const topicNamesInFile = new Set(
            (file.questionProfiles || [])
                .map(profile => profile.topic || fallbackTopic)
        );

        // Preserve one-file/one-topic accounting when no question-level profile
        // supplies a more specific effective topic.
        if (topicNamesInFile.size === 0) topicNamesInFile.add(fallbackTopic);

        // File totals are assigned to the topic(s) represented by effective
        // question metadata. If a file contains mixed topics, its question
        // counts are distributed by actual question profiles.
        const profiles = file.questionProfiles || [];
        const profilesByTopic = new Map();

        for (const profile of profiles) {
            const topicName = profile.topic || fallbackTopic;
            if (!profilesByTopic.has(topicName)) profilesByTopic.set(topicName, []);
            profilesByTopic.get(topicName).push(profile);
        }

        if (profilesByTopic.size === 0) {
            const topicEntry = ensureTopic(fallbackTopic);
            topicEntry.totalFiles += 1;
            topicEntry.totalQuestions += file.questionCount || 0;
            topicEntry.files.push(file.numericId);
            if (file.subTopic) topicEntry.subTopicsSet.add(file.subTopic);
            if (file.level) topicEntry.levelsSet.add(String(file.level));
            if (file.exam) topicEntry.examsSet.add(file.exam);
            continue;
        }

        for (const [topicName, topicProfiles] of profilesByTopic.entries()) {
            const topicEntry = ensureTopic(topicName);
            topicEntry.totalFiles += 1;
            topicEntry.totalQuestions += topicProfiles.length;
            topicEntry.files.push(file.numericId);
            if (file.exam) topicEntry.examsSet.add(file.exam);

            for (const profile of topicProfiles) {
                const subTopicName = profile.subTopic || "Uncategorized";
                const levelName = profile.level != null && String(profile.level).trim() !== ""
                    ? String(profile.level).trim()
                    : "Unspecified";

                topicEntry.subTopicsSet.add(subTopicName);
                topicEntry.levelsSet.add(levelName);

                topicEntry.subTopicCounts.set(
                    subTopicName,
                    (topicEntry.subTopicCounts.get(subTopicName) || 0) + 1
                );

                if (!topicEntry.levelCounts.has(levelName)) {
                    topicEntry.levelCounts.set(levelName, 0);
                }
                topicEntry.levelCounts.set(
                    levelName,
                    topicEntry.levelCounts.get(levelName) + 1
                );

                // Rich hierarchy: sub-topic → level → question count.
                if (!topicEntry.levelCountsBySubTopic) {
                    topicEntry.levelCountsBySubTopic = new Map();
                }
                if (!topicEntry.levelCountsBySubTopic.has(subTopicName)) {
                    topicEntry.levelCountsBySubTopic.set(subTopicName, new Map());
                }
                const subLevelMap = topicEntry.levelCountsBySubTopic.get(subTopicName);
                subLevelMap.set(levelName, (subLevelMap.get(levelName) || 0) + 1);
            }
        }
    }

    const aggregatedTopics = Array.from(topicMap.values()).map(entry => {
        entry.files.sort((a, b) => {
            const isANum = typeof a === "number";
            const isBNum = typeof b === "number";
            if (isANum && isBNum) return a - b;
            if (isANum && !isBNum) return -1;
            if (!isANum && isBNum) return 1;
            return String(a).localeCompare(String(b), undefined, {
                numeric: true,
                sensitivity: "base"
            });
        });

        const subTopicCounts = Object.fromEntries(
            Array.from(entry.subTopicCounts.entries())
                .sort(([a], [b]) => a.localeCompare(b))
        );

        const levelCounts = Object.fromEntries(
            Array.from(entry.levelCounts.entries())
                .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
        );

        const subTopics = Array.from(entry.subTopicsSet)
            .sort((a, b) => a.localeCompare(b));

        const subTopicDetails = subTopics.map(subTopic => {
            const levelMap = entry.levelCountsBySubTopic?.get(subTopic) || new Map();
            const levelCountsForSubTopic = Object.fromEntries(
                Array.from(levelMap.entries())
                    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
            );

            return {
                subTopic,
                questionCount: entry.subTopicCounts.get(subTopic) || 0,
                levelCounts: levelCountsForSubTopic
            };
        });

        return {
            topic: entry.topic,
            totalFiles: new Set(entry.files.map(String)).size,
            totalQuestions: entry.totalQuestions,
            files: entry.files,
            subTopics,
            subTopicCounts,
            subTopicDetails,
            levels: Array.from(entry.levelsSet)
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
            levelCounts,
            exams: Array.from(entry.examsSet)
                .sort((a, b) => a.localeCompare(b))
        };
    });

    aggregatedTopics.sort((a, b) => a.topic.localeCompare(b));
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

        // Validate effective metadata, not merely the file-level header.
        // When global metadata is blank, questionProfiles provide the fallback.
        const effectiveProfiles = Array.isArray(file.questionProfiles) && file.questionProfiles.length > 0
            ? file.questionProfiles
            : [{
                topic: file.topic,
                subTopic: file.subTopic,
                level: file.level
            }];

        const effectiveTopicPairs = [];
        const seenPairs = new Set();

        for (const profile of effectiveProfiles) {
            const effectiveTopic = profile.topic ?? null;
            const effectiveSubTopic = profile.subTopic ?? null;
            const pairKey = `${effectiveTopic ?? ""}|${effectiveSubTopic ?? ""}`;

            if (!seenPairs.has(pairKey)) {
                seenPairs.add(pairKey);
                effectiveTopicPairs.push({
                    topic: effectiveTopic,
                    subTopic: effectiveSubTopic
                });
            }
        }

        if (effectiveTopicPairs.length === 0) {
            effectiveTopicPairs.push({
                topic: file.topic,
                subTopic: file.subTopic
            });
        }

        for (const pair of effectiveTopicPairs) {
            const hasTopic = pair.topic !== null && String(pair.topic).trim() !== "";
            const hasSubTopic = pair.subTopic !== null && String(pair.subTopic).trim() !== "";

            if (!hasTopic) {
                topicStatus = "FAIL";
                if (!messages.includes("Blank Topic")) messages.push("Blank Topic");
                continue;
            }

            if (!hasSubTopic) {
                if (subTopicStatus !== "FAIL") subTopicStatus = "WARNING";
                if (!messages.includes("Blank SubTopic")) messages.push("Blank SubTopic");
            }

            if (validTopicsMap.size > 0 && hasTopic) {
                if (!validTopicsMap.has(pair.topic)) {
                    topicStatus = "FAIL";
                    if (!messages.includes("Unknown Topic")) messages.push("Unknown Topic");
                    unknownTopicsSet.add(pair.topic);
                } else {
                    const validSubSet = validTopicsMap.get(pair.topic);

                    if (hasSubTopic) {
                        if (!validSubSet.has(pair.subTopic)) {
                            subTopicStatus = "FAIL";
                            if (!messages.includes("SubTopic does not belong to Topic")) {
                                messages.push("SubTopic does not belong to Topic");
                            }

                            const key = `${pair.topic}|${pair.subTopic}`;
                            if (!unknownSubTopicsMap.has(key)) {
                                unknownSubTopicsMap.set(key, {
                                    topic: pair.topic,
                                    subTopic: pair.subTopic
                                });
                            }
                        } else {
                            if (!usedSubTopicsMap.has(pair.topic)) {
                                usedSubTopicsMap.set(pair.topic, new Set());
                            }
                            usedSubTopicsMap.get(pair.topic).add(pair.subTopic);
                        }
                    }
                }
            }
        }

        fileResults.push({
            filename: file.filename,
            numericId: file.numericId,
            topicStatus,
            subTopicStatus,
            validationMessage: messages.length > 0 ? messages.join(", ") : "PASS"
        });

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
                questionCount: meta.questionCount,
                questionProfiles: meta.questionProfiles
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
