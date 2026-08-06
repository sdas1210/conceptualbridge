/**
 * Conceptual Bridge - Knowledge Runtime v1.0
 * Module: Candidate Resolver
 * 
 * Resolves question source file candidates from an anchor definition using a compiled
 * knowledge library artifact.
 */

/**
 * Helper to sort filenames numerically if they have numeric stems (e.g., 1.txt, 2.txt, 10.txt),
 * falling back to natural alphanumeric comparison.
 * 
 * @param {string[]} files - Array of filenames to sort.
 * @returns {string[]} Sorted array of unique filenames.
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
 * Validates the anchor object input.
 * 
 * @param {Object} anchor - The anchor specification object.
 * @returns {boolean} True if valid anchor object, false otherwise.
 */
function isValidAnchor(anchor) {
    if (!anchor || typeof anchor !== "object" || Array.isArray(anchor)) {
        return false;
    }

    const testSource = typeof anchor.testSource === "string" ? anchor.testSource.trim() : "";
    const topic = typeof anchor.topic === "string" ? anchor.topic.trim() : "";

    // An anchor must have either a non-empty testSource OR a non-empty topic
    return testSource.length > 0 || topic.length > 0;
}

/**
 * Validates the compiled knowledge library object input.
 * 
 * @param {Object} library - The compiled knowledge library structure.
 * @returns {boolean} True if valid library object, false otherwise.
 */
function isValidLibrary(library) {
    return Boolean(
        library &&
        typeof library === "object" &&
        Array.isArray(library.topics) &&
        Array.isArray(library.files)
    );
}

/**
 * Resolves file candidates matching an anchor specification against a compiled knowledge library.
 * 
 * @param {Object} anchor - Anchor definition (testSource, topic, subTopic, level).
 * @param {Object} library - Compiled knowledge library artifact.
 * @returns {{success: true, mode: string, files: string[]} | {success: false, error: string}}
 * Result payload containing the resolution mode and sorted candidate file list, or error indicator.
 */
export function resolveCandidates(anchor, library) {
    if (!isValidAnchor(anchor)) {
        return {
            success: false,
            error: "INVALID_ANCHOR"
        };
    }

    if (!isValidLibrary(library)) {
        return {
            success: false,
            error: "INVALID_LIBRARY"
        };
    }

    const testSource = typeof anchor.testSource === "string" ? anchor.testSource.trim() : "";
    const topicName = typeof anchor.topic === "string" ? anchor.topic.trim() : "";
    const subTopicName = typeof anchor.subTopic === "string" ? anchor.subTopic.trim() : "";
    const levelVal = anchor.level !== undefined && anchor.level !== null ? String(anchor.level).trim() : "";

    // Mode 1: TEST_SOURCE
    if (testSource.length > 0) {
        let matchedFile = "";
        
        // Extract filename if full path provided (e.g., "questions/math/10.txt" -> "10.txt")
        const filenameCandidate = testSource.split("/").pop();

        for (const fileObj of library.files) {
            if (
                fileObj &&
                (fileObj.filename === testSource || fileObj.filename === filenameCandidate || fileObj.relativePath === testSource)
            ) {
                matchedFile = fileObj.filename;
                break;
            }
        }

        if (!matchedFile) {
            return {
                success: false,
                error: "NO_MATCHING_FILES"
            };
        }

        return {
            success: true,
            mode: "TEST_SOURCE",
            files: [matchedFile]
        };
    }

    // Locate requested Topic in library
    const matchedTopic = library.topics.find(
        t => t && typeof t.name === "string" && t.name.toLowerCase() === topicName.toLowerCase()
    );

    if (!matchedTopic) {
        return {
            success: false,
            error: "TOPIC_NOT_FOUND"
        };
    }

    // Check SubTopic existence if provided
    let matchedSubTopic = null;
    if (subTopicName.length > 0) {
        if (Array.isArray(matchedTopic.subTopics)) {
            matchedSubTopic = matchedTopic.subTopics.find(
                st => st && typeof st.name === "string" && st.name.toLowerCase() === subTopicName.toLowerCase()
            );
        }

        if (!matchedSubTopic) {
            return {
                success: false,
                error: "SUBTOPIC_NOT_FOUND"
            };
        }
    }

    // Check Level existence if provided
    if (levelVal.length > 0) {
        const topicLevels = Array.isArray(matchedTopic.levels) ? matchedTopic.levels.map(String) : [];
        const hasLevelInTopic = topicLevels.includes(levelVal);

        if (!hasLevelInTopic) {
            return {
                success: false,
                error: "LEVEL_NOT_FOUND"
            };
        }
    }

    // Determine Mode and resolve source files
    let mode = "";
    let matchedFiles = [];

    if (subTopicName.length > 0 && levelVal.length > 0) {
        // Mode 5: TOPIC_SUBTOPIC_LEVEL
        mode = "TOPIC_SUBTOPIC_LEVEL";
        matchedFiles = library.files
            .filter(f => 
                f &&
                f.topic && f.topic.toLowerCase() === topicName.toLowerCase() &&
                f.subTopic && f.subTopic.toLowerCase() === subTopicName.toLowerCase() &&
                f.level !== null && f.level !== undefined && String(f.level).trim() === levelVal
            )
            .map(f => f.filename);

    } else if (subTopicName.length > 0) {
        // Mode 3: TOPIC_SUBTOPIC
        mode = "TOPIC_SUBTOPIC";
        matchedFiles = library.files
            .filter(f => 
                f &&
                f.topic && f.topic.toLowerCase() === topicName.toLowerCase() &&
                f.subTopic && f.subTopic.toLowerCase() === subTopicName.toLowerCase()
            )
            .map(f => f.filename);

    } else if (levelVal.length > 0) {
        // Mode 4: TOPIC_LEVEL
        mode = "TOPIC_LEVEL";
        matchedFiles = library.files
            .filter(f => 
                f &&
                f.topic && f.topic.toLowerCase() === topicName.toLowerCase() &&
                f.level !== null && f.level !== undefined && String(f.level).trim() === levelVal
            )
            .map(f => f.filename);

    } else {
        // Mode 2: TOPIC
        mode = "TOPIC";
        matchedFiles = Array.isArray(matchedTopic.sourceFiles) ? matchedTopic.sourceFiles : [];
    }

    if (!matchedFiles || matchedFiles.length === 0) {
        return {
            success: false,
            error: "NO_MATCHING_FILES"
        };
    }

    const sortedCandidates = sortFilesNumerically(matchedFiles);

    return {
        success: true,
        mode: mode,
        files: sortedCandidates
    };
}
