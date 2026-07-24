document.addEventListener('DOMContentLoaded', () => {
    const txtFileInput = document.getElementById('txtFileInput');
    const jsonFileInput = document.getElementById('jsonFileInput');
    const processBtn = document.getElementById('processBtn');
    const statusLog = document.getElementById('statusLog');
    const downloadSection = document.getElementById('downloadSection');
    const downloadTxtBtn = document.getElementById('downloadTxtBtn');
    const downloadJsonBtn = document.getElementById('downloadJsonBtn');

    let processedTxtContent = '';
    let updatedJsonData = {};
    let outputTxtFileName = 'processed_questions.txt';

    processBtn.addEventListener('click', async () => {
        const txtFile = txtFileInput.files[0];
        const jsonFile = jsonFileInput.files[0];

        if (!txtFile) {
            showStatus('Please select a .txt file first.', 'error');
            return;
        }

        outputTxtFileName = txtFile.name;
        const selectedMode = document.querySelector('input[name="sectionMode"]:checked').value;

        try {
            // Read TXT File Content
            const txtContent = await readFileAsText(txtFile);

            // Read or Initialize JSON Tracking Data
            let idStore = { GACA: 0, MATH: 0, GI: 0, GS: 0 };
            if (jsonFile) {
                try {
                    const jsonContent = await readFileAsText(jsonFile);
                    const parsedJson = JSON.parse(jsonContent);
                    idStore = { ...idStore, ...parsedJson };
                } catch (e) {
                    showStatus('Warning: Invalid ID.json file. Initializing defaults.', 'error');
                }
            }

            // Process blocks based on mode
            const result = processQuestions(txtContent, selectedMode, idStore);

            processedTxtContent = result.content;
            updatedJsonData = result.updatedStore;

            showStatus(`Success! Processed ${result.addedCount} new IDs. Current ${selectedMode} Last ID: ${selectedMode}-${String(result.updatedStore[selectedMode]).padStart(6, '0')}`, 'success');
            downloadSection.style.display = 'block';

        } catch (err) {
            showStatus('Error processing file: ' + err.message, 'error');
        }
    });

    // Helper: Read File as Text
    function readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    // Process questions line-by-line using block logic
    function processQuestions(text, mode, store) {
        let lines = text.split(/\r?\n/);
        let outputLines = [];
        let inBlock = false;
        let blockLines = [];
        let addedCount = 0;

        let currentIdCounter = store[mode] || 0;

        // Configuration mapping
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

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Detect Block Start
            if (!inBlock && trimmed.startsWith(activeConfig.startTag)) {
                inBlock = true;
                blockLines = [line];
                continue;
            }

            if (inBlock) {
                blockLines.push(line);

                // Check for Block End
                let isEnd = false;
                if (activeConfig.endTag && trimmed.startsWith(activeConfig.endTag)) {
                    isEnd = true;
                } else if (activeConfig.endTagRegex && activeConfig.endTagRegex.test(trimmed)) {
                    isEnd = true;
                }

                if (isEnd) {
                    // Check if QuestionID| is already present in this block
                    const hasQuestionId = blockLines.some(l => l.trim().startsWith('QuestionID|'));

                    if (!hasQuestionId) {
                        currentIdCounter++;
                        const formattedCounter = String(currentIdCounter).padStart(6, '0');
                        const generatedIdTag = `QuestionID| ${mode}-${formattedCounter}`;

                        // Insert QuestionID| directly after the block header tag
                        blockLines.splice(1, 0, generatedIdTag);
                        addedCount++;
                    }

                    // Flush block to output
                    outputLines.push(...blockLines);
                    blockLines = [];
                    inBlock = false;
                }
            } else {
                outputLines.push(line);
            }
        }

        // Flush remaining lines if file ended inside an unclosed block
        if (blockLines.length > 0) {
            outputLines.push(...blockLines);
        }

        store[mode] = currentIdCounter;

        return {
            content: outputLines.join('\n'),
            updatedStore: store,
            addedCount: addedCount
        };
    }

    // Download Actions
    downloadTxtBtn.addEventListener('click', () => {
        downloadBlob(processedTxtContent, outputTxtFileName, 'text/plain');
    });

    downloadJsonBtn.addEventListener('click', () => {
        downloadBlob(JSON.stringify(updatedJsonData, null, 2), 'ID.json', 'application/json');
    });

    function downloadBlob(content, filename, type) {
        const blob = new Blob([content], { type: type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    function showStatus(msg, type) {
        statusLog.style.display = 'block';
        statusLog.textContent = msg;
        statusLog.className = `status-box ${type}`;
    }
});
