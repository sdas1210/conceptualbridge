/**
 * Conceptual Bridge - Developer Maintenance Suite
 * Module: Knowledge Index Builder (v1.1)
 * Visual Compiler Interface for the Knowledge Index Engine
 */

(function () {
    'use strict';

    // State Variables
    let selectedSubject = "math";
    let compiledLibraryJson = null;
    let buildStartTime = 0;

    // DOM Element Cache
    const btnBuildIndex = document.getElementById("btnBuildIndex");
    const btnDownloadJson = document.getElementById("btnDownloadJson");
    const consoleLogBox = document.getElementById("consoleLogBox");
    const metricStatusBadge = document.getElementById("metricStatusBadge");

    const metricFiles = document.getElementById("metricFiles");
    const metricTopics = document.getElementById("metricTopics");
    const metricSubTopics = document.getElementById("metricSubTopics");
    const metricQuestions = document.getElementById("metricQuestions");
    const metricWarnings = document.getElementById("metricWarnings");
    const metricErrors = document.getElementById("metricErrors");
    const metricBuildTime = document.getElementById("metricBuildTime");

    /**
     * Obtains formatted timestamp string [HH:MM:SS]
     */
    function getTimestamp() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        return `[${h}:${m}:${s}]`;
    }

    /**
     * Logs line messages to the UI console box
     */
    function log(msg, level = 'info') {
        if (!consoleLogBox) return;
        const line = document.createElement('div');
        line.className = 'console-line';

        switch (level) {
            case 'success':
                line.style.color = '#4ade80';
                break;
            case 'error':
                line.style.color = '#f87171';
                break;
            case 'warn':
                line.style.color = '#fb923c';
                break;
            default:
                line.style.color = '#38bdf8';
                break;
        }

        line.textContent = `${getTimestamp()} ${msg}`;
        consoleLogBox.appendChild(line);
        consoleLogBox.scrollTop = consoleLogBox.scrollHeight;
    }

    /**
     * Clears console logs
     */
    function clearConsole() {
        if (consoleLogBox) {
            consoleLogBox.innerHTML = '';
        }
    }

    /**
     * Updates UI badge status
     */
    function updateBadgeStatus(status, text) {
        if (!metricStatusBadge) return;
        metricStatusBadge.className = 'badge';
        if (status === 'pass') {
            metricStatusBadge.classList.add('pass');
        } else if (status === 'fail') {
            metricStatusBadge.classList.add('fail');
        } else if (status === 'building') {
            metricStatusBadge.classList.add('building');
        } else {
            metricStatusBadge.classList.add('waiting');
        }
        metricStatusBadge.textContent = text;
    }

    /**
     * Resets metrics displays
     */
    function resetMetrics() {
        metricFiles.textContent = "0";
        metricTopics.textContent = "0";
        metricSubTopics.textContent = "0";
        metricQuestions.textContent = "0";
        metricWarnings.textContent = "0";
        metricErrors.textContent = "0";
        metricBuildTime.textContent = "0 ms";
    }

    /**
     * Helper to sort array numerically if items are numbers, else alphabetically
     */
    function sortList(list) {
        return Array.from(list).sort((a, b) => {
            const numA = Number(a);
            const numB = Number(b);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
        });
    }

    /**
     * Sorts filenames numerically.
     * Example:
     * 1.txt
     * 2.txt
     * 10.txt
     * 354.txt
     */
    function sortFileNames(files) {
        return Array.from(files).sort((a, b) => {
            const numA = parseInt(String(a), 10);
            const numB = parseInt(String(b), 10);
    
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
    
            return String(a).localeCompare(String(b), undefined, {
                numeric: true,
                sensitivity: "base"
            });
        });
    }

    

    /**
     * Compiles the complete v1.1.0 schema for questionLibrary.<subject>.json
     * 
     * @param {Array} rawFiles - File objects from engine
     * @param {Array} rawTopics - Topic objects from engine
     * @returns {Object} Complete runtime-ready JSON schema
     */
    function compileLibrarySchema(rawFiles, rawTopics) {
        const generatedAt = new Date().toISOString();
        const totalFiles = rawFiles.length;

        // --- 1. CLEAN FILES BUILD ---
        const cleanFiles = [...rawFiles]
            .sort((a, b) => {
                const na = parseInt(a.filename, 10);
                const nb = parseInt(b.filename, 10);
                return na - nb;
            })
            .map(file => ({
            filename: file.filename || null,
            relativePath: file.relativePath || null,
            subject: file.subject || selectedSubject,
            questionFormat: file.questionFormat || null,
            questionCount: file.questionCount || 0,
            topic: file.topic || null,
            subTopic: file.subTopic || null,
            level: file.level !== null && file.level !== undefined ? String(file.level) : null,
            exam: file.exam || null,
            notification: file.notification || null
        }));

        // --- 2. GLOBAL METADATA ARRAYS ---
        // The v1.1 engine now returns effective question-level metadata and
        // count-rich topic aggregates. Prefer those aggregates here so the
        // generated library reflects Topic → SubTopic → Level counts even when
        // file-level global metadata is blank.
        const topicsSet = new Set();
        const subTopicsSet = new Set();
        const levelsSet = new Set();
        const examsSet = new Set();
        const notificationsSet = new Set();

        (rawTopics || []).forEach(topic => {
            if (topic?.topic) topicsSet.add(topic.topic);
            (topic?.subTopics || []).forEach(subTopic => {
                if (subTopic) subTopicsSet.add(subTopic);
            });
            (topic?.levels || []).forEach(level => {
                if (level !== null && level !== undefined && String(level).trim()) {
                    levelsSet.add(String(level));
                }
            });
            (topic?.exams || []).forEach(exam => {
                if (exam) examsSet.add(exam);
            });
        });

        // Preserve file-level metadata as a fallback for legacy files whose
        // engine aggregate contains no effective question-level values.
        cleanFiles.forEach(file => {
            if (file.topic) topicsSet.add(file.topic);
            if (file.subTopic) subTopicsSet.add(file.subTopic);
            if (file.level) levelsSet.add(file.level);
            if (file.exam) examsSet.add(file.exam);
            if (file.notification) notificationsSet.add(file.notification);
        });

        const globalMetadata = {
            topics: sortList(topicsSet),
            subTopics: sortList(subTopicsSet),
            levels: sortList(levelsSet),
            exams: sortList(examsSet),
            notifications: sortList(notificationsSet)
        };

        // --- 3. TOPICS & SUBTOPICS STRUCTURE BUILD ---
        // Use the Knowledge Index Engine's effective aggregates directly.
        // This preserves per-question metadata fallback and Level counts.
        const compiledTopics = (rawTopics || []).map(topic => {
            const subTopicDetails = (topic.subTopicDetails || []).map(detail => ({
                name: detail.subTopic || null,
                questionCount: detail.questionCount || 0,
                fileCount: 0,
                levels: sortList(Object.keys(detail.levelCounts || {})),
                levelCounts: detail.levelCounts || {}
            }));

            const sourceFiles = sortFileNames(topic.files || []);

            // Derive file counts for sub-topics from the source file list when
            // the engine does not provide a separate per-subtopic file count.
            // Keep 0 rather than inventing a count. Runtime counts remain
            // question-accurate.
            return {
                name: topic.topic || null,
                questionCount: topic.totalQuestions || 0,
                fileCount: topic.totalFiles || 0,
                subTopicCount: subTopicDetails.length,
                levels: sortList(topic.levels || []),
                levelCounts: topic.levelCounts || {},
                exams: sortList(topic.exams || []),
                sourceFiles,
                subTopics: subTopicDetails,
                subTopicCounts: topic.subTopicCounts || {}
            };
        });

        // Do not synthesize "Uncategorized" as a curriculum Topic/Sub-Topic.
        // The Knowledge Index is question-metadata driven: when effective
        // Topic/Sub-Topic metadata is absent, the absence remains absent.
        // File-level metadata is retained in `files` for compatibility, but
        // it must not manufacture a hierarchy node that does not exist in
        // the question metadata.

        // Remove incomplete aggregate nodes rather than inventing names.
        const validCompiledTopics = compiledTopics.filter(topic =>
            topic && typeof topic.name === "string" && topic.name.trim()
        );

        validCompiledTopics.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

        // --- 4. SUMMARY & STATISTICS CALCULATIONS ---
        const totalQuestions = cleanFiles.reduce((sum, f) => sum + f.questionCount, 0);
        const totalTopics = validCompiledTopics.length;
        const totalSubTopics = globalMetadata.subTopics.length;
        const averageQuestionsPerFile = totalFiles > 0 ? parseFloat((totalQuestions / totalFiles).toFixed(2)) : 0;

        let largestTopic = null;
        let largestTopicQuestions = 0;

        validCompiledTopics.forEach(t => {
            if (t.questionCount > largestTopicQuestions) {
                largestTopicQuestions = t.questionCount;
                largestTopic = t.name;
            }
        });

        let largestFile = null;
        let largestFileQuestions = 0;
        let smallestFile = null;
        let smallestFileQuestions = totalFiles > 0 ? Infinity : 0;

        cleanFiles.forEach(f => {
            if (f.questionCount > largestFileQuestions) {
                largestFileQuestions = f.questionCount;
                largestFile = f.filename;
            }
            if (f.questionCount < smallestFileQuestions) {
                smallestFileQuestions = f.questionCount;
                smallestFile = f.filename;
            }
        });

        if (smallestFileQuestions === Infinity) {
            smallestFileQuestions = 0;
        }

        const averageTopicSize = totalTopics > 0 ? parseFloat((totalQuestions / totalTopics).toFixed(2)) : 0;
        const averageSubTopicSize = totalSubTopics > 0 ? parseFloat((totalQuestions / totalSubTopics).toFixed(2)) : 0;

        // --- 5. ASSEMBLE FINAL JSON SCHEMA ---
        return {
            build: {
                builder: "Knowledge Index Builder",
                builderVersion: "1.2.1",
                engineVersion: "1.1.0",
                schemaVersion: "1.1.0",
                generatedBy: "Knowledge Index Builder",
                subject: selectedSubject,
                curriculum: `${selectedSubject}.json`,
                generatedAt: generatedAt
            },
            summary: {
                totalFiles: totalFiles,
                totalTopics: totalTopics,
                totalSubTopics: totalSubTopics,
                totalQuestions: totalQuestions,
                averageQuestionsPerFile: averageQuestionsPerFile,
                largestTopic: largestTopic,
                largestTopicQuestions: largestTopicQuestions
            },
            metadata: globalMetadata,
            topics: validCompiledTopics,
            files: cleanFiles,
            statistics: {
                largestFile: largestFile,
                largestFileQuestions: largestFileQuestions,
                smallestFile: smallestFile,
                smallestFileQuestions: smallestFileQuestions,
                averageTopicSize: averageTopicSize,
                averageSubTopicSize: averageSubTopicSize
            }
        };
    }

    /**
     * Main build compilation workflow
     */
    async function handleBuildKnowledgeIndex() {
        clearConsole();
        resetMetrics();
        compiledLibraryJson = null;
        btnDownloadJson.disabled = true;
        btnBuildIndex.disabled = true;

        buildStartTime = performance.now();
        log("Ready", "info");
        updateBadgeStatus("building", "BUILDING");

        try {
            // Lifecycle Step 1
            log("Reading Question Files...", "info");
            
            // Lifecycle Step 2 & 3: Invoking frozen Knowledge Index Engine
            log("Reading Curriculum...", "info");
            log("Aggregating Topics...", "info");
            log("Validating...", "info");

            const response = await fetch(
                `/api/developer/knowledge-index?subject=${encodeURIComponent(selectedSubject)}`,
                {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    },
                    cache: "no-store"
                }
            );

            let engineResult = null;

            try {
                engineResult = await response.json();
            } catch (parseError) {
                throw new Error(
                    `Knowledge Index API returned invalid JSON (HTTP ${response.status}).`
                );
            }

            if (!response.ok) {
                throw new Error(
                    engineResult?.message ||
                    `Knowledge Index API failed with HTTP ${response.status}.`
                );
            }

            // Handle invalid engine response
            if (!engineResult || typeof engineResult !== "object") {
                throw new Error("Invalid Engine Response: Returned payload is null or invalid.");
            }

            if (engineResult.success === false) {
                // Check specific error modes
                if (engineResult.message === "Folder not found" || engineResult.message === "No question files found") {
                    log(`Build Halt: ${engineResult.message}`, "error");
                } else {
                    log(`Engine Error: ${engineResult.message || "Unknown Failure"}`, "error");
                }

                metricErrors.textContent = "1";
                updateBadgeStatus("fail", "FAIL");
                btnBuildIndex.disabled = false;
                return;
            }

            // Extract engine components
            const files = engineResult.files || [];
            const topics = engineResult.topics || [];
            const validation = engineResult.validation || {};
            const valSummary = validation.summary || {};

            // Handle case where files exist but count is zero
            if (files.length === 0) {
                log("Build Warning: No Question Files discovered in target folder.", "warn");
                metricWarnings.textContent = "1";
                updateBadgeStatus("fail", "NO FILES");
                btnBuildIndex.disabled = false;
                return;
            }

            // Lifecycle Step 4: Schema v1.1.0 JSON Compilation
            log("Generating JSON...", "info");

            compiledLibraryJson = compileLibrarySchema(files, topics);

            const buildDuration = Math.round(performance.now() - buildStartTime);

            // Populate Metrics UI
            metricFiles.textContent = compiledLibraryJson.summary.totalFiles;
            metricTopics.textContent = compiledLibraryJson.summary.totalTopics;
            metricSubTopics.textContent = compiledLibraryJson.summary.totalSubTopics;
            metricQuestions.textContent = compiledLibraryJson.summary.totalQuestions;
            metricWarnings.textContent = valSummary.warnings || 0;
            metricErrors.textContent = valSummary.invalidFiles || 0;
            metricBuildTime.textContent = `${buildDuration} ms`;

            // Log validation details
            if (valSummary.invalidFiles > 0) {
                log(`Validation Notice: Discovered ${valSummary.invalidFiles} invalid file record(s).`, "warn");
            }
            if (valSummary.warnings > 0) {
                log(`Validation Notice: Discovered ${valSummary.warnings} file warning(s).`, "warn");
            }

            // Lifecycle Step 5: Complete
            log("Build Complete.", "success");
            updateBadgeStatus("pass", "PASS");
            btnDownloadJson.disabled = false;

        } catch (err) {
            log(`Build Exception: ${err.message}`, "error");
            metricErrors.textContent = "1";
            updateBadgeStatus("fail", "ERROR");
        } finally {
            btnBuildIndex.disabled = false;
        }
    }

    /**
     * Triggers browser file download of questionLibrary.<subject>.json
     */
    function handleDownloadJson() {
        if (!compiledLibraryJson) {
            log("Download failed: No compiled JSON available.", "warn");
            return;
        }

        const jsonFileName = `questionLibrary.${selectedSubject}.json`;
        const jsonString = JSON.stringify(compiledLibraryJson, null, 4);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = jsonFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        log(`Downloaded compiled artifact: '${jsonFileName}'`, "success");
    }

    // Event Bindings
    btnBuildIndex.addEventListener("click", handleBuildKnowledgeIndex);
    btnDownloadJson.addEventListener("click", handleDownloadJson);

    // Initial Startup Log
    log("Knowledge Index Builder v1.1 initialized.", "success");

})();
