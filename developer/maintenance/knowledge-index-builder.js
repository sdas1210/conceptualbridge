/**
 * Conceptual Bridge - Developer Maintenance Suite
 * Module: Knowledge Index Builder (v1.0)
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
     * Computes unique SubTopics across all topics in the engine payload
     */
    function countTotalSubTopics(topics) {
        if (!Array.isArray(topics)) return 0;
        const uniqueSubTopics = new Set();
        for (const top of topics) {
            if (Array.isArray(top.subTopics)) {
                for (const st of top.subTopics) {
                    uniqueSubTopics.add(st);
                }
            }
        }
        return uniqueSubTopics.size;
    }

    /**
     * Computes total question count across all files in the engine payload
     */
    function countTotalQuestions(files) {
        if (!Array.isArray(files)) return 0;
        return files.reduce((sum, file) => sum + (file.questionCount || 0), 0);
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

            // Lifecycle Step 4: JSON Generation
            log("Generating JSON...", "info");

            const totalSubTopicsCount = countTotalSubTopics(topics);
            const totalQuestionsCount = countTotalQuestions(files);

            // Construct standard questionLibrary.json object without validation node
            compiledLibraryJson = {
                build: {
                    builder: "Knowledge Index Builder",
                    builderVersion: "1.0.0",
                    engineVersion: "1.0.0",
                    schemaVersion: "1.0.0",
                    generatedBy: "Knowledge Index Builder",
                    curriculum: `${selectedSubject}.json`,
                    generatedAt: new Date().toISOString(),
                    subject: selectedSubject
                },
                summary: {
                  totalFiles: files.length,
                  totalTopics: topics.length,
                  totalSubTopics: totalSubTopicsCount,
                  totalQuestions: totalQuestionsCount,
              
                  validFiles: valSummary.validFiles || 0,
                  invalidFiles: valSummary.invalidFiles || 0,
                  warnings: valSummary.warnings || 0
              }
                topics: topics,
                files: files
            };

            const buildDuration = Math.round(performance.now() - buildStartTime);

            // Populate Metrics UI
            metricFiles.textContent = files.length;
            metricTopics.textContent = topics.length;
            metricSubTopics.textContent = totalSubTopicsCount;
            metricQuestions.textContent = totalQuestionsCount;
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
     * Triggers browser file download of questionLibrary.json
     */
    function handleDownloadJson() {
        if (!compiledLibraryJson) {
            log("Download failed: No compiled JSON available.", "warn");
            return;
        }

        const jsonString = JSON.stringify(compiledLibraryJson, null, 4);
        const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedSubject}.questionLibrary.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        log("Downloaded compiled artifact: 'questionLibrary.json'", "success");
    }

    // Event Bindings
    btnBuildIndex.addEventListener("click", handleBuildKnowledgeIndex);
    btnDownloadJson.addEventListener("click", handleDownloadJson);

    // Initial Startup Log
    log("Knowledge Index Builder initialized.", "success");

})();
