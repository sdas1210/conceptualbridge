document.addEventListener('DOMContentLoaded', () => {
    const txtFileInput = document.getElementById('txtFileInput');
    const processBtn = document.getElementById('processBtn');
    const statusLog = document.getElementById('statusLog');
    const downloadSection = document.getElementById('downloadSection');
    const downloadTxtBtn = document.getElementById('downloadTxtBtn');
    const downloadJsonBtn = document.getElementById('downloadJsonBtn');

    let processedTxtContent = '';
    let updatedJsonData = {};
    let outputTxtFileName = 'processed_questions.txt';

    let idStore = null;
    let idRegistryLoaded = false;

    // Prevent processing until the permanent ID.json registry is loaded.
    processBtn.disabled = true;

    loadIdRegistry();

    async function loadIdRegistry() {
        try {
            // Cache-busting query ensures the latest deployed ID.json is read.
            const response = await fetch(`ID.json?ts=${Date.now()}`, {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const parsedJson = await response.json();

            // Validate required registry keys and values.
            const requiredSections = ['GACA', 'MATH', 'GI', 'GS'];

            for (const section of requiredSections) {
                if (
                    !Object.prototype.hasOwnProperty.call(parsedJson, section) ||
                    !Number.isInteger(parsedJson[section]) ||
                    parsedJson[section] < 0
                ) {
                    throw new Error(`Invalid or missing ${section} counter`);
                }
            }

            idStore = {
                GACA: parsedJson.GACA,
                MATH: parsedJson.MATH,
                GI: parsedJson.GI,
                GS: parsedJson.GS
            };

            idRegistryLoaded = true;
            processBtn.disabled = false;

            showStatus(
                `ID Registry Loaded | ` +
                `GACA: GACA-${String(idStore.GACA).padStart(6, '0')} | ` +
                `MATH: MATH-${String(idStore.MATH).padStart(6, '0')} | ` +
                `GI: Inactive | GS: Inactive`,
                'success'
            );

        } catch (err) {
            idRegistryLoaded = false;
            idStore = null;
            processBtn.disabled = true;
            downloadSection.style.display = 'none';

            showStatus(
                `ID Registry Error: ID.json could not be loaded or is invalid. ` +
                `Question ID generation is blocked. (${err.message})`,
                'error'
            );
        }
    }

    processBtn.addEventListener('click', async () => {
        if (!idRegistryLoaded || !idStore) {
            showStatus(
                'ID.json is not loaded. Question ID generation is blocked.',
                'error'
            );
            return;
        }

        const txtFile = txtFileInput.files[0];

        if (!txtFile) {
            showStatus('Please select a .txt file first.', 'error');
            return;
        }

        const selectedModeInput =
            document.querySelector('input[name="sectionMode"]:checked');

        if (!selectedModeInput) {
            showStatus('Please select a section mode.', 'error');
            return;
        }

        const selectedMode = selectedModeInput.value;

        if (!['GACA', 'MATH'].includes(selectedMode)) {
            showStatus(`${selectedMode} is currently inactive.`, 'error');
            return;
        }

        outputTxtFileName = txtFile.name;

        try {
            const txtContent = await readFileAsText(txtFile);

            // Work on a copy so the loaded registry remains unchanged
            // until processing completes successfully.
            const workingStore = { ...idStore };

            const result = processQuestions(
                txtContent,
                selectedMode,
                workingStore
            );

            processedTxtContent = result.content;
            updatedJsonData = result.updatedStore;

            const previousLastId =
                `${selectedMode}-${String(result.previousCounter).padStart(6, '0')}`;

            const newLastId =
                `${selectedMode}-${String(result.updatedStore[selectedMode]).padStart(6, '0')}`;

            const report =
                `PROCESSING COMPLETE\n\n` +
                `Section: ${selectedMode}\n` +
                `Questions Detected: ${result.questionCount}\n` +
                `Existing Question IDs: ${result.existingIdCount}\n` +
                `New Question IDs Added: ${result.addedCount}\n` +
                `Duplicate IDs Detected: ${result.duplicateIds.length}\n` +
                `Invalid/Incomplete Blocks: ${result.incompleteBlocks}\n\n` +
                `Previous Last ID: ${previousLastId}\n` +
                `New Last ID: ${newLastId}\n\n` +
                `STATUS: READY\n\n` +
                `IMPORTANT: Download the updated ID.json and replace the ` +
                `deployed ID.json before processing another file.`;

            showStatus(report, 'success');
            statusLog.style.whiteSpace = 'pre-line';
            downloadSection.style.display = 'block';

            // Lock this session after successful generation.
            // Reload after replacing deployed ID.json before processing again.
            processBtn.disabled = true;
            txtFileInput.disabled = true;

        } catch (err) {
            downloadSection.style.display = 'none';
            showStatus('Error processing file: ' + err.message, 'error');
        }
    });

    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    function processQuestions(text, mode, store) {
        const lines = text.split(/\r?\n/);
        const outputLines = [];

        let inBlock = false;
        let blockLines = [];

        let questionCount = 0;
        let addedCount = 0;
        let existingIdCount = 0;
        let incompleteBlocks = 0;

        const duplicateIds = [];
        const seenIds = new Set();

        const previousCounter = store[mode] || 0;
        let currentIdCounter = previousCounter;

        const config = {
            GACA: {
                startTag: 'Q|',
                endTag: 'Difficulty|'
            },
            MATH: {
                startTag: 'QEN|',
                endTagRegex: /^Sub-?Topic\|/i
            }
        };

        const activeConfig = config[mode];

        if (!activeConfig) {
            throw new Error(`Unsupported section mode: ${mode}`);
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            if (!inBlock && trimmed.startsWith(activeConfig.startTag)) {
                inBlock = true;
                blockLines = [line];
                questionCount++;
                continue;
            }

            if (inBlock) {
                blockLines.push(line);

                let isEnd = false;

                if (
                    activeConfig.endTag &&
                    trimmed.startsWith(activeConfig.endTag)
                ) {
                    isEnd = true;
                } else if (
                    activeConfig.endTagRegex &&
                    activeConfig.endTagRegex.test(trimmed)
                ) {
                    isEnd = true;
                }

                if (isEnd) {
                    const existingIdLines = blockLines.filter(line =>
                        /^QuestionID\|/i.test(line.trim())
                    );

                    if (existingIdLines.length > 0) {
                        existingIdCount += existingIdLines.length;

                        for (const idLine of existingIdLines) {
                            const idValue =
                                idLine.trim().substring('QuestionID|'.length).trim();

                            if (idValue) {
                                if (seenIds.has(idValue)) {
                                    duplicateIds.push(idValue);
                                }
                                seenIds.add(idValue);
                            }
                        }
                    } else {
                        currentIdCounter++;

                        const formattedCounter =
                            String(currentIdCounter).padStart(6, '0');

                        const generatedId =
                            `${mode}-${formattedCounter}`;

                        const generatedIdTag =
                            `QuestionID| ${generatedId}`;

                        // Append QuestionID AFTER the block end metadata:
                        // GACA -> after Difficulty|
                        // MATH -> after SubTopic| / Sub-Topic|
                        blockLines.push(generatedIdTag);

                        seenIds.add(generatedId);
                        addedCount++;
                    }

                    outputLines.push(...blockLines);

                    blockLines = [];
                    inBlock = false;
                }

            } else {
                outputLines.push(line);
            }
        }

        if (blockLines.length > 0) {
            incompleteBlocks++;
            outputLines.push(...blockLines);
        }

        if (questionCount === 0) {
            throw new Error(
                `No valid ${mode} question blocks were detected in the TXT file.`
            );
        }

        if (duplicateIds.length > 0) {
            throw new Error(
                `Duplicate QuestionID values detected: ` +
                `${[...new Set(duplicateIds)].join(', ')}`
            );
        }

        if (incompleteBlocks > 0) {
            throw new Error(
                `${incompleteBlocks} incomplete question block(s) detected. ` +
                `Processing has been blocked.`
            );
        }

        store[mode] = currentIdCounter;

        return {
            content: outputLines.join('\n'),
            updatedStore: store,
            previousCounter,
            questionCount,
            existingIdCount,
            addedCount,
            duplicateIds,
            incompleteBlocks
        };
    }

    downloadTxtBtn.addEventListener('click', () => {
        downloadBlob(
            processedTxtContent,
            outputTxtFileName,
            'text/plain'
        );
    });

    downloadJsonBtn.addEventListener('click', () => {
        downloadBlob(
            JSON.stringify(updatedJsonData, null, 2),
            'ID.json',
            'application/json'
        );
    });

    function downloadBlob(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        a.href = url;
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);
    }

    function showStatus(msg, type) {
        statusLog.style.display = 'block';
        statusLog.textContent = msg;
        statusLog.className = `status-box ${type}`;
    }
});
