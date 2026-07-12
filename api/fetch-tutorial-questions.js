import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // 1. Get the file path sent from the frontend (e.g., questions/gaca/1.txt)
    const { source } = req.query;

    if (!source) {
        return res.status(400).json({ error: 'Missing source file parameter' });
    }

    try {
        // 2. Locate and read the file safely on the server
        const filePath = path.join(process.cwd(), source);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Question asset file not found' });
        }

        const rawText = fs.readFileSync(filePath, 'utf-8');
        const lines = rawText.split('\n').map(l => l.trim());

        let parsedQuestions = [];
        let currentBlock = null;

        // 3. Process your exact multiline block format smoothly
        lines.forEach(line => {
            if (!line) return;
            
            // Clean out hidden tags if present
            let cleanLine = line.replace(/\/gi, '').trim();
            if (!cleanLine) return;

            const pipeIdx = cleanLine.indexOf('|');
            if (pipeIdx === -1) {
                // Continuation line support for text extensions/translations
                if (currentBlock && cleanLine.startsWith('/')) {
                    currentBlock.text += ` ${cleanLine}`;
                }
                return;
            }

            const key = cleanLine.substring(0, pipeIdx).trim().toUpperCase();
            const value = cleanLine.substring(pipeIdx + 1).trim();

            if (key === 'Q') {
                currentBlock = { text: value, a: '', b: '', c: '', d: '', correct: 0, exam: 'Tutorial Quiz', shift: '' };
            } else if (currentBlock) {
                if (key === 'A' || key === 'B' || key === 'C' || key === 'D') {
                    currentBlock[key.toLowerCase()] = value;
                } else if (key === 'SHIFT') {
                    currentBlock.shift = value;
                } else if (key === 'CORRECT') {
                    const letter = value.toUpperCase();
                    currentBlock.correct = letter.charCodeAt(0) - 65; // Convert A->0, B->1...
                    
                    if (currentBlock.text && currentBlock.a && currentBlock.b && currentBlock.c && currentBlock.d) {
                        parsedQuestions.push(currentBlock);
                    }
                }
            }
        });

        // 4. Randomize the array entirely on the server side
        for (let i = parsedQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [parsedQuestions[i], parsedQuestions[j]] = [parsedQuestions[j], parsedQuestions[i]];
        }

       // 5. Slice down to exactly 10 questions
            const testSet = parsedQuestions.slice(0, 10);
            
            // Random Tutorial Pass Percentage
            // Between 80% and 95%
            const passPercentage = Number(
                (80 + Math.random() * 15).toFixed(2)
            );
            
            return res.status(200).json({
            
                status: "ok",
            
                passPercentage,
            
                data: testSet
            
            });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server processing error' });
    }
}
