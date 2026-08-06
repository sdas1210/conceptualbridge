/**
 * Conceptual Bridge - Developer Maintenance Suite
 * Module: Knowledge Index Builder (v1.1)
 * Visual Compiler Interface for the Knowledge Index Engine
 */

import { discoverQuestionFiles } from "../../services/questionLibraryEngine.js";

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
        const topicsSet = new Set();
        const subTopicsSet = new Set();
        const levelsSet = new Set();
        const examsSet = new Set();
        const notificationsSet = new Set();

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
        // Group clean files by Topic and SubTopic to build deep tree
        const topicMap = new Map();

        cleanFiles.forEach(file => {
            const topicName = file.topic || "Uncategorized";

            if (!topicMap.has(topicName)) {
                topicMap.set(topicName, {
                    name: topicName,
                    questionCount: 0,
                    sourceFilesSet: new Set(),
                    levelsSet: new Set(),
                    examsSet: new Set(),
                    subTopicMap: new Map()
                });
            }

            const tEntry = topicMap.get(topicName);
            tEntry.questionCount += file.questionCount;
            if (file.filename) tEntry.sourceFilesSet.add(file.filename);
            if (file.level) tEntry.levelsSet.add(file.level);
            if (file.exam) tEntry.examsSet.add(file.exam);

            const subTopicName = file.subTopic || "Uncategorized";
            if (!tEntry.subTopicMap.has(subTopicName)) {
                tEntry.subTopicMap.set(subTopicName, {
                    name: subTopicName,
                    questionCount: 0,
                    sourceFilesSet: new Set(),
                    levelsSet: new Set()
                });
            }

            const stEntry = tEntry.subTopicMap.get(subTopicName);
            stEntry.questionCount += file.questionCount;
            if (file.filename) stEntry.sourceFilesSet.add(file.filename);
            if (file.level) stEntry.levelsSet.add(file.level);
        });

        const compiledTopics = Array.from(topicMap.values()).map(t => {
            // Build subTopics array
            const compiledSubTopics = Array.from(t.subTopicMap.values()).map(st => ({
                name: st.name,
                questionCount: st.questionCount,
                fileCount: st.sourceFilesSet.size,
                levels: sortList(st.levelsSet)
            }));

            // Sort subTopics alphabetically
            compiledSubTopics.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

            return {
                name: t.name,
                questionCount: t.questionCount,
                fileCount: t.sourceFilesSet.size,
                subTopicCount: compiledSubTopics.length,
                levels: sortList(t.levelsSet),
                exams: sortList(t.examsSet),
                sourceFiles: sortFileNames(t.sourceFilesSet),
                subTopics: compiledSubTopics
            };
        });

        // Sort topics alphabetically
        compiledTopics.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));

        // --- 4. SUMMARY & STATISTICS CALCULATIONS ---
        const totalQuestions = cleanFiles.reduce((sum, f) => sum + f.questionCount, 0);
        const totalTopics = compiledTopics.length;
        const totalSubTopics = globalMetadata.subTopics.length;
        const averageQuestionsPerFile = totalFiles > 0 ? parseFloat((totalQuestions / totalFiles).toFixed(2)) : 0;

        let largestTopic = null;
        let largestTopicQuestions = 0;

        compiledTopics.forEach(t => {
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
                builderVersion: "1.1.0",
                engineVersion: "1.0.0",
                schemaVersion: "1.0.0",
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
            topics: compiledTopics,
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

            const engineResult = await discoverQuestionFiles(selectedSubject);

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
