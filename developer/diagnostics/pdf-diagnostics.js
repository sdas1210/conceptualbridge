/**
 * Conceptual Bridge - Developer Diagnostics Suite
 * Subsystem: PDF Diagnostics Engine (Browser-Native)
 */

(function () {
    'use strict';

    // ==========================================================================
    // 1. STATE & UTILITIES
    // ==========================================================================
    let isRunning = false;

    /**
     * Formats current time as [HH:MM:SS] timestamp for console logs.
     * @returns {string} Formatted timestamp
     */
    function getTimestamp() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `[${hours}:${minutes}:${seconds}]`;
    }

    /**
     * Writes timestamped messages to the Diagnostic Console DOM element.
     * @param {string} text - Message text to append
     * @param {'info' | 'success' | 'error' | 'warn'} level - Log severity level
     */
    function logToConsole(text, level = 'info') {
        const consoleBox = document.getElementById('console-output');
        if (!consoleBox) return;

        const line = document.createElement('div');
        line.className = 'console-line';

        // Color coding console log outputs
        switch (level) {
            case 'success':
                line.style.color = '#4ade80'; // Green
                break;
            case 'error':
                line.style.color = '#f87171'; // Red
                break;
            case 'warn':
                line.style.color = '#fb923c'; // Orange
                break;
            case 'info':
            default:
                line.style.color = '#38bdf8'; // Blue
                break;
        }

        line.textContent = `${getTimestamp()} ${text}`;
        consoleBox.appendChild(line);
        consoleBox.scrollTop = consoleBox.scrollHeight;
    }

    /**
     * Updates the status badge UI element for a test row.
     * @param {string} elementId - DOM ID of the badge element
     * @param {'PASS' | 'FAIL' | 'WAITING' | 'RUNNING'} status - Status string
     */
    function updateBadge(elementId, status) {
        const badge = document.getElementById(elementId);
        if (!badge) return;

        badge.className = 'badge';

        switch (status) {
            case 'PASS':
                badge.classList.add('pass');
                badge.textContent = 'PASS';
                break;
            case 'FAIL':
                badge.classList.add('fail');
                badge.textContent = 'FAIL';
                break;
            case 'RUNNING':
                badge.classList.add('waiting');
                badge.textContent = 'RUNNING...';
                break;
            case 'WAITING':
            default:
                badge.classList.add('waiting');
                badge.textContent = 'Waiting';
                break;
        }
    }

    /**
     * Resets all status badges to default WAITING state.
     */
    function resetAllBadges() {
        const badges = [
            'status-pdf-lib',
            'status-fontkit',
            'status-font-file',
            'status-unicode',
            'status-generation',
            'status-download'
        ];
        badges.forEach(id => updateBadge(id, 'WAITING'));
    }

    /**
     * Helper delay function to yield execution thread for UI re-renders.
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise<void>}
     */
    function delay(ms = 150) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ==========================================================================
    // 2. INDIVIDUAL DIAGNOSTIC TEST SUITE
    // ==========================================================================

    /**
     * Test 1: PDF Library (pdf-lib) Availability
     */
    async function runPDFLibraryTest() {
        logToConsole('Testing PDF Library (pdf-lib)...', 'info');
        updateBadge('status-pdf-lib', 'RUNNING');
        await delay();

        try {
            if (typeof window.PDFLib === 'undefined' || !window.PDFLib.PDFDocument) {
                throw new Error('PDFLib object or PDFDocument API is not defined globally.');
            }

            // Create a lightweight instance test
            const doc = await window.PDFLib.PDFDocument.create();
            if (!doc) {
                throw new Error('PDFDocument.create() returned null or undefined.');
            }

            logToConsole('-> PASS: PDFLib is loaded and functional.', 'success');
            updateBadge('status-pdf-lib', 'PASS');
            return true;
        } catch (error) {
            logToConsole(`-> FAIL: PDF Library error - ${error.message}`, 'error');
            updateBadge('status-pdf-lib', 'FAIL');
            return false;
        }
    }

    /**
     * Test 2: FontKit Font Engine Availability
     */
    async function runFontKitTest() {
        logToConsole('Testing FontKit Engine (@pdf-lib/fontkit)...', 'info');
        updateBadge('status-fontkit', 'RUNNING');
        await delay();

        try {
            if (typeof window.fontkit === 'undefined') {
                throw new Error('Global fontkit object is not defined.');
            }

            if (typeof window.fontkit.open !== 'function' && typeof window.fontkit.create !== 'function') {
                throw new Error('FontKit object exists but missing core font parsing methods.');
            }

            logToConsole('-> PASS: FontKit engine is available.', 'success');
            updateBadge('status-fontkit', 'PASS');
            return true;
        } catch (error) {
            logToConsole(`-> FAIL: FontKit error - ${error.message}`, 'error');
            updateBadge('status-fontkit', 'FAIL');
            return false;
        }
    }

    /**
     * Test 3: Font Files (TTF) HTTP Fetching
     */
    async function runFontFileTest() {
        logToConsole('Testing Bengali Font Files HTTP Fetch...', 'info');
        updateBadge('status-font-file', 'RUNNING');
        await delay();

        const regularFontPath = 'fonts/NotoSansBengali-Regular.ttf';
        const boldFontPath = 'fonts/NotoSansBengali-Bold.ttf';

        try {
            logToConsole(`Fetching: ${regularFontPath}`, 'info');
            const resRegular = await fetch(regularFontPath);
            if (!resRegular.ok) {
                throw new Error(`Failed to fetch ${regularFontPath} (HTTP ${resRegular.status})`);
            }
            const bufferRegular = await resRegular.arrayBuffer();
            if (bufferRegular.byteLength === 0) {
                throw new Error(`${regularFontPath} is empty (0 bytes)`);
            }

            logToConsole(`Fetching: ${boldFontPath}`, 'info');
            const resBold = await fetch(boldFontPath);
            if (!resBold.ok) {
                throw new Error(`Failed to fetch ${boldFontPath} (HTTP ${resBold.status})`);
            }
            const bufferBold = await resBold.arrayBuffer();
            if (bufferBold.byteLength === 0) {
                throw new Error(`${boldFontPath} is empty (0 bytes)`);
            }

            // Store buffers on window scope for subsequent generation & unicode tests
            window.__diagFontRegularBuffer = bufferRegular;
            window.__diagFontBoldBuffer = bufferBold;

            logToConsole(`-> PASS: Both TrueType fonts fetched successfully (${Math.round(bufferRegular.byteLength / 1024)} KB / ${Math.round(bufferBold.byteLength / 1024)} KB).`, 'success');
            updateBadge('status-font-file', 'PASS');
            return true;
        } catch (error) {
            logToConsole(`-> FAIL: Font file fetch error - ${error.message}`, 'error');
            updateBadge('status-font-file', 'FAIL');
            return false;
        }
    }

    /**
     * Test 4: Unicode Bengali Canvas Measurement & FontFace API
     */
    async function runUnicodeTest() {
        logToConsole('Testing Native Browser Unicode & FontFace Engine...', 'info');
        updateBadge('status-unicode', 'RUNNING');
        await delay();

        try {
            if (!window.__diagFontRegularBuffer) {
                throw new Error('Font buffers missing. Font file test must pass first.');
            }

            if (typeof window.FontFace === 'undefined') {
                throw new Error('Browser does not support FontFace API.');
            }

            // Test FontFace construction and browser DOM font loading
            const testFontFace = new FontFace('DiagBengaliTest', window.__diagFontRegularBuffer.slice(0));
            await testFontFace.load();
            document.fonts.add(testFontFace);

            // Test HTML5 Canvas 2D measurement for Bengali Unicode glyphs
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.font = '16px "DiagBengaliTest", sans-serif';

            const testBengaliText = 'কনসেপ্টচুয়াল ব্রিজ - বাংলা টেস্ট';
            const textMetrics = ctx.measureText(testBengaliText);

            if (!textMetrics || textMetrics.width <= 0) {
                throw new Error('Canvas 2D measureText() failed for Bengali string.');
            }

            logToConsole(`-> PASS: Unicode FontFace loaded and Bengali text measured (${Math.round(textMetrics.width)}px width).`, 'success');
            updateBadge('status-unicode', 'PASS');
            return true;
        } catch (error) {
            logToConsole(`-> FAIL: Unicode rendering test error - ${error.message}`, 'error');
            updateBadge('status-unicode', 'FAIL');
            return false;
        }
    }

    /**
     * Test 5: End-to-End PDF Document Generation
     */
    async function runPDFGenerationTest() {
        logToConsole('Testing PDF Generation & Embedding Routine...', 'info');
        updateBadge('status-generation', 'RUNNING');
        await delay();

        try {
            if (!window.PDFLib || !window.fontkit || !window.__diagFontRegularBuffer) {
                throw new Error('Missing dependencies or font buffers for PDF generation.');
            }

            const { PDFDocument, rgb } = window.PDFLib;
            const pdfDoc = await PDFDocument.create();
            pdfDoc.registerFontkit(window.fontkit);

            // Embed custom Bengali font
            const font = await pdfDoc.embedFont(window.__diagFontRegularBuffer.slice(0));

            // Create page and draw sample text
            const page = pdfDoc.addPage([595.28, 841.89]);
            page.drawText('Conceptual Bridge Diagnostic PDF Engine', {
                x: 40,
                y: 800,
                size: 16,
                font: font,
                color: rgb(0.05, 0.22, 0.40)
            });

            const pdfBytes = await pdfDoc.save();
            if (!pdfBytes || pdfBytes.length === 0) {
                throw new Error('Generated PDF byte array is empty.');
            }

            window.__diagGeneratedPdfBytes = pdfBytes;

            logToConsole(`-> PASS: PDF document compiled successfully (${Math.round(pdfBytes.length / 1024)} KB).`, 'success');
            updateBadge('status-generation', 'PASS');
            return true;
        } catch (error) {
            logToConsole(`-> FAIL: PDF Generation error - ${error.message}`, 'error');
            updateBadge('status-generation', 'FAIL');
            return false;
        }
    }

    /**
     * Test 6: Browser Blob & Download Trigger Readiness
     */
    async function runDownloadEngineTest() {
        logToConsole('Testing Browser Blob & Download Engine APIs...', 'info');
        updateBadge('status-download', 'RUNNING');
        await delay();

        try {
            if (!window.Blob || !window.URL || typeof window.URL.createObjectURL !== 'function') {
                throw new Error('Browser lacks required Blob or URL.createObjectURL APIs.');
            }

            const sampleData = window.__diagGeneratedPdfBytes || new Uint8Array([37, 80, 68, 70]); // %PDF
            const blob = new Blob([sampleData], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            if (!blobUrl || !blobUrl.startsWith('blob:')) {
                throw new Error('URL.createObjectURL failed to generate valid blob URL.');
            }

            // Clean up temporary blob URL
            URL.revokeObjectURL(blobUrl);

            logToConsole('-> PASS: Blob generation and Download URL creation fully supported.', 'success');
            updateBadge('status-download', 'PASS');
            return true;
        } catch (error) {
            logToConsole(`-> FAIL: Download Engine error - ${error.message}`, 'error');
            updateBadge('status-download', 'FAIL');
            return false;
        }
    }

    // ==========================================================================
    // 3. MAIN ORCHESTRATOR & CONTROLLER
    // ==========================================================================

    /**
     * Main controller function to execute all diagnostic tests in sequence.
     */
    async function runDiagnostics() {
        if (isRunning) return;
        isRunning = true;

        const primaryBtn = document.getElementById('runDiagnosticBtn');
        if (primaryBtn) {
            primaryBtn.disabled = true;
            primaryBtn.style.opacity = '0.5';
            primaryBtn.style.cursor = 'not-allowed';
        }

        // Reset Console & Badges
        clearConsole();
        resetAllBadges();

        logToConsole('=== STARTING SUBSYSTEM DIAGNOSTICS SUITE ===', 'info');
        logToConsole(`User Agent: ${navigator.userAgent}`, 'info');

        let passedCount = 0;
        let failedCount = 0;

        // Sequential Execution Pipeline
        const tests = [
            { name: 'PDF Library', fn: runPDFLibraryTest },
            { name: 'FontKit Engine', fn: runFontKitTest },
            { name: 'Font Files Fetch', fn: runFontFileTest },
            { name: 'Unicode Engine', fn: runUnicodeTest },
            { name: 'PDF Generation', fn: runPDFGenerationTest },
            { name: 'Download Engine', fn: runDownloadEngineTest }
        ];

        for (const test of tests) {
            try {
                const passed = await test.fn();
                if (passed) {
                    passedCount++;
                } else {
                    failedCount++;
                }
            } catch (err) {
                failedCount++;
                logToConsole(`Unexpected exception in ${test.name}: ${err.message}`, 'error');
            }
            await delay(100);
        }

        logToConsole('=== DIAGNOSTICS EXECUTION COMPLETED ===', 'info');

        // Render Summary
        const summaryBox = document.getElementById('summary-content');
        if (summaryBox) {
            if (failedCount === 0) {
                summaryBox.innerHTML = `
                    <div style="color: #4ade80; font-weight: 600; font-size: 1.05rem; margin-bottom: 6px;">
                        ✓ All Subsystems Functional (${passedCount}/${tests.length} Passed)
                    </div>
                    <div style="color: #94a3b8; font-size: 0.9rem;">
                        The PDF Generation Engine V2 is ready for deployment on GitHub Pages / Vercel.
                    </div>
                `;
            } else {
                summaryBox.innerHTML = `
                    <div style="color: #f87171; font-weight: 600; font-size: 1.05rem; margin-bottom: 6px;">
                        ⚠️ Diagnostics Failed (${passedCount} Passed, ${failedCount} Failed)
                    </div>
                    <div style="color: #94a3b8; font-size: 0.9rem;">
                        Review the detailed execution log above to isolate and resolve subsystem failures.
                    </div>
                `;
            }
        }

        // Re-enable Run Button
        if (primaryBtn) {
            primaryBtn.disabled = false;
            primaryBtn.style.opacity = '1';
            primaryBtn.style.cursor = 'pointer';
        }

        isRunning = false;
    }

    /**
     * Resets the console output container and summary message.
     */
    function clearConsole() {
        const consoleBox = document.getElementById('console-output');
        if (consoleBox) {
            consoleBox.innerHTML = '';
        }

        const summaryBox = document.getElementById('summary-content');
        if (summaryBox) {
            summaryBox.textContent = 'No diagnostic has been executed.';
        }
    }

    /**
     * Navigates back to the main diagnostics suite home page.
     */
    function goBack() {
        window.location.href = 'diagnostics.html';
    }

    // Export functions globally to match HTML onclick listeners
    window.runDiagnostic = runDiagnostics;
    window.clearConsole = clearConsole;
    window.goBack = goBack;

})();
