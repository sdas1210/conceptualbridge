import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const { topic, limit } = req.query;
    const totalNeeded = parseInt(limit) || 10;

    try {
        // Define directory structures inside your Vercel workspace root safely
        const questionsDir = path.join(process.cwd(), 'questions');

        // Helper engine to load and split data from file targets safely
        const readSubjectFile = (filename) => {
            const targetPath = path.join(questionsDir, filename);
            if (!fs.existsSync(targetPath)) return [];
            
            const content = fs.readFileSync(targetPath, 'utf8');
            // Splitting entries assuming questions are separated by double newline breaks
            return content.split('\n\n').filter(q => q.trim().length > 0).map(qBlock => {
                const lines = qBlock.split('\n');
                let parsed = {};
                lines.forEach(l => {
                    if(l.startsWith('Q|')) parsed.text = l.replace('Q|', '');
                    if(l.startsWith('A|')) parsed.a = l.replace('A|', '');
                    if(l.startsWith('B|')) parsed.b = l.replace('B|', '');
                    if(l.startsWith('C|')) parsed.c = l.replace('C|', '');
                    if(l.startsWith('D|')) parsed.d = l.replace('D|', '');
                    if(l.startsWith('Correct|')) {
                        const ansStr = l.replace('Correct|', '').trim().toUpperCase();
                        parsed.correct = ansStr === 'A' ? 0 : ansStr === 'B' ? 1 : ansStr === 'C' ? 2 : 3;
                    }
                });
                return parsed;
            });
        };

        let finalPool = [];

        if (topic === 'ALL') {
            // Process specialized 3:3:1:3 ratio tracking array bounds (3 Math, 3 GI, 1 GS, 3 GACA total units out of 10)
            const factor = totalNeeded / 10;
            const mathCount = 3 * factor;
            const giCount = 3 * factor;
            const gsCount = 1 * factor;
            const gacaCount = 3 * factor;

            const mathQuestions = shuffleArray(readSubjectFile('math.txt')).slice(0, mathCount);
            const giQuestions = shuffleArray(readSubjectFile('gi.txt')).slice(0, giCount);
            const gsQuestions = shuffleArray(readSubjectFile('gs.txt')).slice(0, gsCount);
            const gacaQuestions = shuffleArray(readSubjectFile('gaca.txt')).slice(0, gacaCount);

            // Verify if any single vital asset route core failed to load from file structure completely
            if (mathQuestions.length === 0 && giQuestions.length === 0 && gsQuestions.length === 0 && gacaQuestions.length === 0) {
                return res.status(404).json({ status: 'not_found' });
            }

            finalPool = [...mathQuestions, ...giQuestions, ...gsQuestions, ...gacaQuestions];
        } else {
            // Single target route processor lookup map rules
            let targetFile = 'math.txt';
            if (topic === 'GI') targetFile = 'gi.txt';
            if (topic === 'GS') targetFile = 'gs.txt';
            if (topic === 'GACA') targetFile = 'gaca.txt';

            const questions = readSubjectFile(targetFile);
            if (questions.length === 0) {
                return res.status(404).json({ status: 'not_found' });
            }
            finalPool = shuffleArray(questions).slice(0, totalNeeded);
        }

        return res.status(200).json({ status: 'ok', data: shuffleArray(finalPool) });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}

function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}
