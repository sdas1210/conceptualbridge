/**
 * Conceptual Bridge - Developer Maintenance Suite
 * Module: Question Format Converter Engine
 * Completely offline browser-native logic for converting legacy question formats to universal schema.
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

    function updateBadgeStatus(status, text) {
        if (!metricStatusBadge) return;
        metricStatusBadge.className = 'badge';
        if (status === 'pass') {
            metricStatusBadge.classList.add('pass');
        } else if (status === 'fail') {
            metricStatusBadge.classList.add('fail');
        } else {
            metricStatusBadge.classList.add('waiting');
        }
        metricStatusBadge.textContent = text;
    }

    // ==========================================================================
    // 3. CORE PARSING & CONVERSION ENGINE
    // ==========================================================================

    /**
     * Helper to parse slash-separated strings ("English / Bengali")
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
     * Parses source raw text into structured metadata and block arrays
     */
    function parseAndConvertFormat(rawContent) {
        if (!rawContent || !rawContent.trim()) {
            return { convertedText: "", questionsCount: 0, translationsCount: 0, metadataCount: 0 };
        }

        const normalized = rawContent.replace(/\r\n/g, '\n');
        const lines = normalized.split('\n');

        let globalMetadataLines = [];
        let rawBlocks = [];
        let currentBlockLines = [];
        let inQuestionBlock = false;

        let globalMetaCount = 0;
        let translationsCount = 0;

        // Step 1: Line by Line Scan for Global Metadata and Question Blocks
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const isNewQuestion = line.startsWith('Q|') || line.startsWith('QEN|');
            const isGlobalMeta = /^(Exam|Subject|Topic|SubTopic|Level|Notification|Notificaiton|Type|Marks|QType|QuestionType|ImageFolder)\|/i.test(line);

            if (isGlobalMeta && !inQuestionBlock) {
                globalMetadataLines.push(line);
                globalMetaCount++;
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

        // Step 2: Convert Each Block into Universal Bilingual Schema
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
                questionId: ""
            };

            for (let l = 0; b < blockLines.length && l < blockLines.length; l++) {
                const line = blockLines[l];

                if (line.startsWith('Q|')) {
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
                }
            }

            // Construct Clean Standard Output String Block
            let formattedBlock = [];
            formattedBlock.push(`QEN| ${blockObj.qEn}`);
            if (blockObj.qBn) {
                formattedBlock.push(`QBN| ${blockObj.qBn}`);
            }
            if (blockObj.common) {
                formattedBlock.push(`Common| ${blockObj.common}`);
            }
            if (blockObj.image) {
                formattedBlock.push(`Image| ${blockObj.image}`);
            }
            if (blockObj.a) formattedBlock.push(`A| ${blockObj.a}`);
            if (blockObj.b) formattedBlock.push(`B| ${blockObj.b}`);
            if (blockObj.c) formattedBlock.push(`C| ${blockObj.c}`);
            if (blockObj.d) formattedBlock.push(`D| ${blockObj.d}`);
            if (blockObj.shift) formattedBlock.push(`Shift| ${blockObj.shift}`);
            if (blockObj.correct) formattedBlock.push(`Correct| ${blockObj.correct}`);
            if (blockObj.difficulty) formattedBlock.push(`Difficulty| ${blockObj.difficulty}`);
            if (blockObj.topic) formattedBlock.push(`Topic| ${blockObj.topic}`);
            if (blockObj.subTopic) formattedBlock.push(`SubTopic| ${blockObj.subTopic}`);
            if (blockObj.questionId) formattedBlock.push(`QuestionID| ${blockObj.questionId}`);

            convertedBlocks.push(formattedBlock.join('\n'));
        }

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
            metadataCount: globalMetaCount
        };
    }

    // ==========================================================================
    // 4. EVENT HANDLERS & WORKFLOW
    // ==========================================================================

    function handleConversion() {
        const rawContent = sourceTextarea.value;
        if (!rawContent || !rawContent.trim()) {
            log("Conversion warning: Input textarea is empty.", "warn");
            updateBadgeStatus("waiting", "Empty");
            outputTextarea.value = "";
            metricQuestions.textContent = "0";
            metricTranslations.textContent = "0";
            metricMetadata.textContent = "0";
            return;
        }

        try {
            log("Starting format conversion pass...", "info");
            const res = parseAndConvertFormat(rawContent);

            outputTextarea.value = res.convertedText;
            metricQuestions.textContent = res.questionsCount;
            metricTranslations.textContent = res.translationsCount;
            metricMetadata.textContent = res.metadataCount;

            if (res.questionsCount > 0) {
                log(`Successfully converted ${res.questionsCount} question block(s) with ${res.translationsCount} translations.`, "success");
                updateBadgeStatus("pass", "Success");
            } else {
                log("Warning: No valid question blocks (Q| or QEN|) detected in input.", "warn");
                updateBadgeStatus("fail", "No Blocks");
            }
        } catch (err) {
            log(`Conversion Error: ${err.message}`, "error");
            updateBadgeStatus("fail", "Error");
        }
    }

    function handleFileUpload(file) {
        if (!file) return;
        if (!file.name.endsWith('.txt')) {
            log(`File rejected: '${file.name}' is not a .txt file.`, "error");
            alert("Only .txt files are supported.");
            return;
        }

        currentConvertedFileName = file.name.replace('.txt', '_converted.txt');
        log(`Reading file '${file.name}'...`, "info");

        const reader = new FileReader();
        reader.onload = function (e) {
            sourceTextarea.value = e.target.result;
            log(`File '${file.name}' loaded into source pane. Triggering conversion...`, "info");
            handleConversion();
        };
        reader.onerror = function () {
            log(`Failed to read file '${file.name}'.`, "error");
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
        updateBadgeStatus("waiting", "Ready");
        log("Workspace reset. Ready for new input.", "info");
    }

    function handleCopy() {
        if (!outputTextarea.value) {
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
        if (!text) {
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
    // 5. INITIALIZATION & DRAG-AND-DROP BINDINGS
    // ==========================================================================

    btnConvert.addEventListener('click', handleConversion);
    btnClear.addEventListener('click', handleClear);
    btnCopy.addEventListener('click', handleCopy);
    btnDownload.addEventListener('click', handleDownload);

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

    log("Question Format Converter Engine loaded successfully.", "success");

})();