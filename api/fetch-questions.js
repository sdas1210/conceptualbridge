import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    // Expected queries: ?topic=math&chapter=Profit_Loss&limit=10
    const { topic, chapter, limit } = req.query;
    const totalNeeded = parseInt(limit) || 10;
    const targetFolder = topic ? topic.toLowerCase() : 'math';

    try {
        const questionsDir = path.join(process.cwd(), 'questions', targetFolder);

        // Safety wall: Check if the folder exists
        if (!fs.existsSync(questionsDir)) {
            return res.status(404).json({ status: 'not_found' });
        }

        const files = fs.readdirSync(questionsDir);
        let combinedPool = [];

        // Loop through 1.txt, 2.txt, etc.
        files.forEach(file => {
            if (path.extname(file) === '.txt') {
                const filePath = path.join(questionsDir, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Parse individual blocks separated by an empty line row
                const parsedBlocks = content.split('\n\n').filter(q => q.trim().length > 0);

                parsedBlocks.forEach(qBlock => {
                    const lines = qBlock.split('\n');
                    let parsed = {};
                    let matchesChapter = false;

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
                        // Check if the inner topic tag matches the student's request
                        if(l.startsWith('Topic|')) {
                            const currentTag = l.replace('Topic|', '').trim();
                            if (!chapter || currentTag === chapter) {
                                matchesChapter = true;
                            }
                        }
                    });

                    // Only push into our pool if it matches the selected chapter category
                    if (matchesChapter && parsed.text) {
                        combinedPool.push(parsed);
                    }
                });
            }
        });

        if (combinedPool.length === 0) {
            return res.status(404).json({ status: 'not_found' });
        }

        // Shuffle the matched pool and slice the requested question count
        const randomizedOutput = shuffleArray(combinedPool).slice(0, totalNeeded);
        return res.status(200).json({ status: 'ok', data: randomizedOutput });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}

function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}
