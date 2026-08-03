/**
 * Conceptual Bridge - Developer Maintenance Suite
 * Module: Question Format Converter Engine (Version 2 - Step 5 Production Polish)
 * Offline browser-native logic for converting legacy question formats to universal schema.
 */

(function () {
    'use strict';

    // ==========================================================================
    // 1. STATE & DOM ELEMENT CACHE
    // ==========================================================================
    let currentConvertedFileName = "converted_questions.txt";

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const sourceTextarea = document.getElementById('raw-source-input');
    const outputTextarea = document.getElementById('converted-output');
    const consoleLogBox = document.getElementById('console-log-box');

    const btnConvert = document.getElementById('btn-convert');
    const btnClear = document.getElementById('btn-clear');
    const btnCopy = document.getElementById('btn-copy');
    const btnDownload = document.getElementById('btn-download');

    const metricQuestions = document.getElementById('metric-questions-count');
    const metricTranslations = document.getElementById('metric-translations-count');
    const metricMetadata = document.getElementById('metric-metadata-count');
    const metricStatusBadge = document.getElementById('metric-status-badge');

    // ==========================================================================
    // 2. LOGGING & METRIC UTILITIES
    // ==========================================================================
    function getTimestamp() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        return `[${h}:${m}:${s}]`;
    }

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
     * Updates the status badge UI element for a test row.
     * @param {'READY' | 'READING' | 'VALIDATING' | 'CONVERTING' | 'PASS' | 'FAIL' | 'ERROR'} status 
     */
    function updateBadgeStatus(status) {
        if (!metricStatusBadge) return;
        metricStatusBadge.className = 'badge';

        switch (status) {
            case 'PASS':
                metricStatusBadge.classList.add('pass');
                metricStatusBadge.textContent = 'PASS';
                break;
            case 'FAIL':
            case 'ERROR':
                metricStatusBadge.classList.add('fail');
                metricStatusBadge.textContent = status;
                break;
            case 'READING':
            case 'VALIDATING':
            case 'CONVERTING':
            case 'READY':
            default:
                metricStatusBadge.classList.add('waiting');
                metricStatusBadge.textContent = status;
                break;
        }
    }

    /**
     * Controls button disabled states dynamically based on input and output state.
     */
    function updateButtonStates() {
        const hasInput = sourceTextarea && sourceTextarea.value.trim().length > 0;
        const hasOutput = outputTextarea && outputTextarea.value.trim().length > 0;

        if (btnConvert) btnConvert.disabled = !hasInput;
        if (btnCopy) btnCopy.disabled = !hasOutput;
        if (btnDownload) btnDownload.disabled = !hasOutput;
    }

    // ==========================================================================
    // 3. CORE PARSING & CONVERSION ENGINE
    // ==========================================================================

    /**
     * Helper to parse slash-separated strings ("English / Bengali / Extra")
     * Splits strictly on the FIRST slash.
     */
    function splitSlashValue(rawStr) {
        if (!rawStr) return { eng: "", bng: "" };
        if (rawStr.includes("/")) {
            const idx = rawStr.indexOf("/");
            const eng = rawStr.substring(0, idx).trim();
            const bng = rawStr.substring(idx + 1).trim();
            return { eng, bng };
        }
        return { eng: rawStr.trim(), bng: "" };
    }

    /**
     * Step 1: Validates required global metadata tags prior to question block scanning
     * @param {Array<string>} lines 
     * @returns {{ metaPassed: number, metaFailed: number, allPassed: boolean }}
     */
    function validateGlobalMetadata(lines) {
        const requiredMetadata = {
            Exam: false,
            Subject: false,
            Topic: false,
            SubTopic: false,
            Level: false,
            Notification: false,
            Type: false,
            Marks: false,
            QType: false,
            ImageFolder: false
        };

        log("Checking Global Metadata...", "info");

        // Scan lines up until the first question block starts
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            if (line.startsWith("Q|") || line.startsWith("QEN|")) {
                break;
            }

            if (const tag = line.split("|")[0].trim().toLowerCase();) requiredMetadata.Exam = true;
            else if (line.startsWith("Subject|")) requiredMetadata.Subject = true;
            else if (line.startsWith("Topic|")) requiredMetadata.Topic = true;
            else if (line.startsWith("SubTopic|")) requiredMetadata.SubTopic = true;
            else if (line.startsWith("Level|")) requiredMetadata.Level = true;
            else if (line.startsWith("Notification|") || line.startsWith("Notificaiton|")) requiredMetadata.Notification = true;
            else if (line.startsWith("Type|")) requiredMetadata.Type = true;
            else if (line.startsWith("Marks|")) requiredMetadata.Marks = true;
            else if (line.startsWith("QType|") || line.startsWith("QuestionType|")) requiredMetadata.QType = true;
            else if (line.startsWith("ImageFolder|")) requiredMetadata.ImageFolder = true;
        }

        let metaPassed = 0;
        let metaFailed = 0;

        for (const [key, isPresent] of Object.entries(requiredMetadata)) {
            if (isPresent) {
                metaPassed++;
                log(`✓ ${key}`, "success");
            } else {
                metaFailed++;
                log(`✗ ${key}`, "error");
            }
        }

        const allPassed = metaFailed === 0;
        log(`Metadata Audit Result: ${metaPassed} Passed, ${metaFailed} Failed. Status: ${allPassed ? "PASS" : "FAIL"}`, allPassed ? "success" : "warn");

        return { metaPassed, metaFailed, allPassed };
    }

    /**
     * Step 2: Validates question blocks for presence and uniqueness of required tags
     * @param {Array<string>} lines 
     * @returns {{ blocksPassed: number, blocksFailed: number, totalBlocks: number, allPassed: boolean }}
     */
    function validateQuestionBlocks(lines) {
        log("Checking Question Blocks...", "info");

        // Extract raw blocks with their metadata (block number, line number, and lines)
        const rawBlocks = [];
        let currentBlock = null;
        let blockCounter = 0;

        for (let i = 0; i < lines.length; i++) {
            const rawLine = lines[i];
            const line = rawLine.trim();
            if (!line) continue;

            const isStart = line.startsWith('Q|') || line.startsWith('QEN|');

            if (isStart) {
                if (currentBlock) {
                    rawBlocks.push(currentBlock);
                }
                blockCounter++;
                currentBlock = {
                    number: blockCounter,
                    startLine: i + 1,
                    lines: [line]
                };
            } else if (currentBlock) {
                currentBlock.lines.push(line);
            }
        }

        if (currentBlock) {
            rawBlocks.push(currentBlock);
        }

        let blocksPassed = 0;
        let blocksFailed = 0;

        // Tags to validate in each block
        const requiredTagKeys = ['QuestionTag', 'A|', 'B|', 'C|', 'D|', 'Shift|', 'Correct|', 'Difficulty|'];

        for (let i = 0; i < rawBlocks.length; i++) {
            const block = rawBlocks[i];
            const tagCounts = {
                'QuestionTag': 0,
                'A|': 0,
                'B|': 0,
                'C|': 0,
                'D|': 0,
                'Shift|': 0,
                'Correct|': 0,
                'Difficulty|': 0
            };

            for (let j = 0; j < block.lines.length; j++) {
                const l = block.lines[j];
                if (l.startsWith('Q|') || l.startsWith('QEN|')) tagCounts['QuestionTag']++;
                else if (l.startsWith('A|')) tagCounts['A|']++;
                else if (l.startsWith('B|')) tagCounts['B|']++;
                else if (l.startsWith('C|')) tagCounts['C|']++;
                else if (l.startsWith('D|')) tagCounts['D|']++;
                else if (l.startsWith('Shift|')) tagCounts['Shift|']++;
                else if (l.startsWith('Correct|')) tagCounts['Correct|']++;
                else if (l.startsWith('Difficulty|')) tagCounts['Difficulty|']++;
            }

            const missingTags = [];
            const duplicateTags = [];

            for (const key of requiredTagKeys) {
                const count = tagCounts[key];
                const displayName = key === 'QuestionTag' ? 'Q| (or QEN|)' : key;

                if (count === 0) {
                    missingTags.push(displayName);
                } else if (count > 1) {
                    duplicateTags.push(displayName);
                }
            }

            const isBlockValid = missingTags.length === 0 && duplicateTags.length === 0;

            if (isBlockValid) {
                blocksPassed++;
                log(`Checking Block ${block.number} - PASS`, "success");
            } else {
                blocksFailed++;
                log(`Checking Block ${block.number} - FAIL`, "error");
                log(`   Block ${block.number} | Question ${block.number} | Line ${block.startLine}`, "warn");

                if (missingTags.length > 0) {
                    log(`   Missing: ${missingTags.join(', ')}`, "error");
                }
                if (duplicateTags.length > 0) {
                    log(`   Duplicate: ${duplicateTags.join(', ')}`, "error");
                }
            }
        }

        const allPassed = blocksFailed === 0 && rawBlocks.length > 0;
        log(`Question Block Validation Result: ${blocksPassed} Passed, ${blocksFailed} Failed (Total: ${rawBlocks.length}). Status: ${allPassed ? "PASS" : "FAIL"}`, allPassed ? "success" : "warn");

        return {
            blocksPassed,
            blocksFailed,
            totalBlocks: rawBlocks.length,
            allPassed
        };
    }

    /**
     * Parses source raw text into structured metadata and block arrays.
     * Enforces idempotent conversion to the Conceptual Bridge Standard Question Format.
     */
    function parseAndConvertFormat(rawContent) {
        if (!rawContent || !rawContent.trim()) {
            return {
                convertedText: "",
                questionsCount: 0,
                translationsCount: 0,
                metaPassed: 0,
                metaFailed: 0,
                allMetaPassed: false,
                blocksPassed: 0,
                blocksFailed: 0,
                allBlocksPassed: false,
                qIdPresentCount: 0,
                qIdMissingCount: 0,
                legacyBlocksCount: 0,
                alreadyConvertedBlocksCount: 0
            };
        }

        const normalized = rawContent.replace(/\r\n/g, '\n');
        const lines = normalized.split('\n');

        // Step 1: Global Metadata Tag Audit
        updateBadgeStatus("VALIDATING");
        const { metaPassed, metaFailed, allPassed: allMetaPassed } = validateGlobalMetadata(lines);

        // Step 2: Question Block Validation
        const { blocksPassed, blocksFailed, totalBlocks, allPassed: allBlocksPassed } = validateQuestionBlocks(lines);

        updateBadgeStatus("CONVERTING");
        log("Converting Question Blocks...", "info");

        let globalMetadataLines = [];
        let rawBlocks = [];
        let currentBlockLines = [];
        let inQuestionBlock = false;

        let translationsCount = 0;
        let qIdPresentCount = 0;
        let qIdMissingCount = 0;
        let legacyBlocksCount = 0;
        let alreadyConvertedBlocksCount = 0;

        // Step 3: Line by Line Scan for Global Metadata and Question Blocks for Conversion
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const isNewQuestion = line.startsWith('Q|') || line.startsWith('QEN|');
            const isGlobalMeta = /^(Exam|Subject|Topic|SubTopic|Level|Notification|Notificaiton|Type|Marks|QType|QuestionType|ImageFolder)\|/i.test(line);

            if (isGlobalMeta && !inQuestionBlock) {
                globalMetadataLines.push(line);
                continue;
            }

            if (isNewQuestion) {
                if (currentBlockLines.length > 0) {
                    rawBlocks.push(currentBlockLines);
                }
                currentBlockLines = [line];
                inQuestionBlock = true;
            } else if (inQuestionBlock) {
                currentBlockLines.push(line);
            }
        }

        if (currentBlockLines.length > 0) {
            rawBlocks.push(currentBlockLines);
        }

        // Step 4: Convert Each Block into Universal Bilingual Schema
        let convertedBlocks = [];

        for (let b = 0; b < rawBlocks.length; b++) {
            const blockLines = rawBlocks[b];
            let blockObj = {
                qEn: "",
                qBn: "",
                common: "",
                image: "",
                a: "",
                b: "",
                c: "",
                d: "",
                shift: "",
                correct: "",
                difficulty: "",
                topic: "",
                subTopic: "",
                questionId: "",
                hasQuestionId: false
            };

            let isLegacyBlock = false;

            for (let l = 0; l < blockLines.length; l++) {
                const line = blockLines[l];

                if (line.startsWith('Q|')) {
                    isLegacyBlock = true;
                    const val = line.substring(2).trim();
                    const { eng, bng } = splitSlashValue(val);
                    blockObj.qEn = eng;
                    blockObj.qBn = bng;
                    if (bng) translationsCount++;
                } else if (line.startsWith('QEN|')) {
                    blockObj.qEn = line.substring(4).trim();
                } else if (line.startsWith('QBN|')) {
                    blockObj.qBn = line.substring(4).trim();
                    if (blockObj.qBn) translationsCount++;
                } else if (line.startsWith('Common|') || line.startsWith('Equation|')) {
                    blockObj.common = line.substring(line.indexOf('|') + 1).trim();
                } else if (line.startsWith('Image|')) {
                    blockObj.image = line.substring(6).trim();
                } else if (line.startsWith('A|')) {
                    blockObj.a = line.substring(2).trim();
                    if (blockObj.a.includes('/')) translationsCount++;
                } else if (line.startsWith('B|')) {
                    blockObj.b = line.substring(2).trim();
                    if (blockObj.b.includes('/')) translationsCount++;
                } else if (line.startsWith('C|')) {
                    blockObj.c = line.substring(2).trim();
                    if (blockObj.c.includes('/')) translationsCount++;
                } else if (line.startsWith('D|')) {
                    blockObj.d = line.substring(2).trim();
                    if (blockObj.d.includes('/')) translationsCount++;
                } else if (line.startsWith('Shift|')) {
                    blockObj.shift = line.substring(6).trim();
                } else if (line.startsWith('Correct|')) {
                    blockObj.correct = line.substring(8).trim();
                } else if (line.startsWith('Difficulty|')) {
                    blockObj.difficulty = line.substring(11).trim();
                } else if (line.startsWith('Topic|')) {
                    blockObj.topic = line.substring(6).trim();
                } else if (line.startsWith('SubTopic|')) {
                    blockObj.subTopic = line.substring(9).trim();
                } else if (line.startsWith('QuestionID|')) {
                    blockObj.questionId = line.substring(11).trim();
                    blockObj.hasQuestionId = true;
                }
            }

            if (isLegacyBlock) {
                legacyBlocksCount++;
            } else {
                alreadyConvertedBlocksCount++;
            }

            if (blockObj.hasQuestionId) {
                qIdPresentCount++;
            } else {
                qIdMissingCount++;
            }

            // Construct Clean Standard Output String Block following strict order & idempotency rules
            let formattedBlock = [];
            
            // QEN| & QBN|
            formattedBlock.push(`QEN| ${blockObj.qEn}`);
            formattedBlock.push(`QBN| ${blockObj.qBn}`);

            // Common| & Image|
            formattedBlock.push(`Common| ${blockObj.common}`);
            formattedBlock.push(`Image| ${blockObj.image}`);

            // A|, B|, C|, D|, Shift|, Correct|, Difficulty|
            formattedBlock.push(`A| ${blockObj.a}`);
            formattedBlock.push(`B| ${blockObj.b}`);
            formattedBlock.push(`C| ${blockObj.c}`);
            formattedBlock.push(`D| ${blockObj.d}`);
            formattedBlock.push(`Shift| ${blockObj.shift}`);
            formattedBlock.push(`Correct| ${blockObj.correct}`);
            formattedBlock.push(`Difficulty| ${blockObj.difficulty}`);

            // Topic| & SubTopic|
            formattedBlock.push(`Topic| ${blockObj.topic}`);
            formattedBlock.push(`SubTopic| ${blockObj.subTopic}`);

            // QuestionID| (Only if originally present in source input)
            if (blockObj.hasQuestionId) {
                formattedBlock.push(`QuestionID| ${blockObj.questionId}`);
            }

            convertedBlocks.push(formattedBlock.join('\n'));
        }

        log("Generating Output...", "info");

        // Combine Global Metadata and Formatted Question Blocks
        let resultText = "";
        if (globalMetadataLines.length > 0) {
            resultText += globalMetadataLines.join('\n') + '\n\n';
        }
        resultText += convertedBlocks.join('\n\n');

        return {
            convertedText: resultText,
            questionsCount: rawBlocks.length,
            translationsCount: translationsCount,
            metaPassed: metaPassed,
            metaFailed: metaFailed,
            allMetaPassed: allMetaPassed,
            blocksPassed: blocksPassed,
            blocksFailed: blocksFailed,
            allBlocksPassed: allBlocksPassed,
            qIdPresentCount: qIdPresentCount,
            qIdMissingCount: qIdMissingCount,
            legacyBlocksCount: legacyBlocksCount,
            alreadyConvertedBlocksCount: alreadyConvertedBlocksCount
        };
    }

    // ==========================================================================
    // 4. EVENT HANDLERS & WORKFLOW
    // ==========================================================================

    function handleConversion() {
        const rawContent = sourceTextarea.value;
        if (!rawContent || !rawContent.trim()) {
            log("Conversion warning: Input content is empty.", "warn");
            updateBadgeStatus("READY");
            outputTextarea.value = "";
            metricQuestions.textContent = "0 (P: 0 | F: 0)";
            metricTranslations.textContent = "0";
            metricMetadata.textContent = "P: 0 | F: 0";
            updateButtonStates();
            return;
        }

        try {
            log("Starting format conversion pass...", "info");
            const res = parseAndConvertFormat(rawContent);

            if (res.questionsCount === 0) {
                log("File rejected: TXT contains zero question blocks.", "error");
                updateBadgeStatus("FAIL");
                outputTextarea.value = "";
                updateButtonStates();
                return;
            }

            outputTextarea.value = res.convertedText;
            metricQuestions.textContent = `${res.questionsCount} (P: ${res.blocksPassed} | F: ${res.blocksFailed})`;
            metricTranslations.textContent = res.translationsCount;
            metricMetadata.textContent = `P: ${res.metaPassed} | F: ${res.metaFailed}`;

            const overallPassed = res.allMetaPassed && res.allBlocksPassed;

            log(`Detailed Metrics Breakdown: Total Blocks: ${res.questionsCount} (Converted: ${res.questionsCount}, Legacy: ${res.legacyBlocksCount}, Already Converted: ${res.alreadyConvertedBlocksCount}) | QuestionID Present: ${res.qIdPresentCount}, Missing: ${res.qIdMissingCount} | Blocks Passed: ${res.blocksPassed}, Failed: ${res.blocksFailed} | Metadata Passed: ${res.metaPassed}, Failed: ${res.metaFailed}`, "info");

            if (overallPassed) {
                log(`Successfully converted ${res.questionsCount} question block(s) with ${res.translationsCount} translations.`, "success");
                log("Ready for Download.", "success");
                updateBadgeStatus("PASS");
            } else {
                log(`Converted ${res.questionsCount} question block(s), but validation warnings exist (Meta Pass: ${res.allMetaPassed}, Blocks Pass: ${res.allBlocksPassed}).`, "warn");
                log("Ready for Download.", "warn");
                updateBadgeStatus("FAIL");
            }

            updateButtonStates();
        } catch (err) {
            log(`Conversion Error: ${err.message}`, "error");
            updateBadgeStatus("ERROR");
            updateButtonStates();
        }
    }

    function handleFileUpload(file) {
        if (!file) return;

        log("Reading file...", "info");
        updateBadgeStatus("READING");

        if (!file.name.toLowerCase().endsWith('.txt')) {
            log(`File rejected: '${file.name}' is not a .txt file.`, "error");
            updateBadgeStatus("FAIL");
            alert("Only .txt files are supported.");
            return;
        }

        if (file.size === 0) {
            log(`File rejected: '${file.name}' is empty (0 bytes).`, "error");
            updateBadgeStatus("FAIL");
            alert("The selected file is empty.");
            return;
        }

        currentConvertedFileName = file.name.replace(/\.txt$/i, '_converted.txt');

        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            if (!content || !content.trim()) {
                log(`File rejected: '${file.name}' contains no readable content.`, "error");
                updateBadgeStatus("FAIL");
                alert("The selected file contains no text.");
                return;
            }
            sourceTextarea.value = content;
            log(`File '${file.name}' loaded into source pane. Triggering conversion...`, "info");
            updateButtonStates();
            handleConversion();
        };
        reader.onerror = function () {
            log(`Failed to read file '${file.name}'.`, "error");
            updateBadgeStatus("ERROR");
        };
        reader.readAsText(file, "UTF-8");
    }

    function handleClear() {
        sourceTextarea.value = "";
        outputTextarea.value = "";
        fileInput.value = "";
        currentConvertedFileName = "converted_questions.txt";

        metricQuestions.textContent = "0";
        metricTranslations.textContent = "0";
        metricMetadata.textContent = "0";

        updateBadgeStatus("READY");

        if (consoleLogBox) {
            consoleLogBox.innerHTML = '';
        }

        updateButtonStates();
        log("Workspace reset. Ready for new input.", "info");
    }

    function handleCopy() {
        if (!outputTextarea.value || !outputTextarea.value.trim()) {
            log("Copy failed: Output pane is empty.", "warn");
            return;
        }
        navigator.clipboard.writeText(outputTextarea.value)
            .then(() => {
                log("Converted output copied to clipboard successfully.", "success");
                alert("Converted text copied to clipboard!");
            })
            .catch(err => {
                log(`Clipboard write failed: ${err.message}`, "error");
            });
    }

    function handleDownload() {
        const text = outputTextarea.value;
        if (!text || !text.trim()) {
            log("Download failed: Output pane is empty.", "warn");
            alert("No converted content available to download.");
            return;
        }

        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = currentConvertedFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        log(`Downloaded converted file: '${currentConvertedFileName}'`, "success");
    }

    // ==========================================================================
    // 5. INITIALIZATION & BINDINGS
    // ==========================================================================

    btnConvert.addEventListener('click', handleConversion);
    btnClear.addEventListener('click', handleClear);
    btnCopy.addEventListener('click', handleCopy);
    btnDownload.addEventListener('click', handleDownload);

    sourceTextarea.addEventListener('input', updateButtonStates);

    fileInput.addEventListener('change', function (e) {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    });

    dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove('dragover');

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    // Initial startup state setup
    updateBadgeStatus("READY");
    updateButtonStates();
    log("Question Format Converter Engine initialized.", "success");

})();
