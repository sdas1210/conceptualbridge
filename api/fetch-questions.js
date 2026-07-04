import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const { topic, limit } = req.query;
    const totalNeeded = parseInt(limit) || 10;

    try {
        const questionsDir = path.join(process.cwd(), 'questions');

        const readFolderQuestions = (folderName) => {
            const targetFolder = path.join(questionsDir, folderName.toLowerCase());
            if (!fs.existsSync(targetFolder)) return [];

            const files = fs.readdirSync(targetFolder);
            let combinedQuestions = [];

            files.forEach(file => {
                if (path.extname(file) === '.txt') {
                    const filePath = path.join(targetFolder, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    // Split the file into separate blocks
                    const blocks = content.split('\n\n').filter(b => b.trim().length > 0);
                    
                    let questionsInFile = [];
                    let globalMetadata = {};

                    // Step 1: Read through blocks to separate questions from global tags
                    blocks.forEach(block => {
                        const lines = block.split('\n');
                        let isQuestionBlock = false;
                        let parsedBlock = {};

                        lines.forEach(l => {
                            const cleanLine = l.trim();
                            
                            // Check if this is a question line
                            if (cleanLine.startsWith('Q|')) {
                                isQuestionBlock = true;
                                parsedBlock.text = cleanLine.replace('Q|', '');
                            }
                            if (cleanLine.startsWith('A|')) parsedBlock.a = cleanLine.replace('A|', '');
                            if (cleanLine.startsWith('B|')) parsedBlock.b = cleanLine.replace('B|', '');
                            if (cleanLine.startsWith('C|')) parsedBlock.c = cleanLine.replace('C|', '');
                            if (cleanLine.startsWith('D|')) parsedBlock.d = cleanLine.replace('D|', '');
                            if (cleanLine.startsWith('Topic|')) parsedBlock.topic = cleanLine.replace('Topic|', '');
                            if (cleanLine.startsWith('Correct|')) {
                                const ansStr = cleanLine.replace('Correct|', '').trim().toUpperCase();
                                parsedBlock.correct = ansStr === 'A' ? 0 : ansStr === 'B' ? 1 : ansStr === 'C' ? 2 : 3;
                            }

                            // Catch global/shared tags if written independently anywhere in the file
                            if (cleanLine.startsWith('Exam|')) globalMetadata.exam = cleanLine.replace('Exam|', '');
                            if (cleanLine.startsWith('Shift|')) globalMetadata.shift = cleanLine.replace('Shift|', '');
                            if (cleanLine.startsWith('Level|')) globalMetadata.level = cleanLine.replace('Level|', '');
                        });

                        if (isQuestionBlock) {
                            questionsInFile.push(parsedBlock);
                        }
                    });

                    // Step 2: Automatically apply global file tags to questions that don't have individual ones
                    questionsInFile = questionsInFile.map(q => {
                        return {
                            ...q,
                            exam: q.exam || globalMetadata.exam || '',
                            shift: q.shift || globalMetadata.shift || '',
                            level: q.level || globalMetadata.level || ''
                        };
                    });
                    
                    combinedQuestions = [...combinedQuestions, ...questionsInFile];
                }
            });

            return combinedQuestions;
        };

        let finalPool = [];

        if (topic === 'ALL') {
            const factor = totalNeeded / 10;
            
            const mathQuestions = shuffleArray(readFolderQuestions('math')).slice(0, 3 * factor);
            const giQuestions = shuffleArray(readFolderQuestions('gi')).slice(0, 3 * factor);
            const gsQuestions = shuffleArray(readFolderQuestions('gs')).slice(0, 1 * factor);
            const gacaQuestions = shuffleArray(readFolderQuestions('gaca')).slice(0, 3 * factor);

            if (mathQuestions.length === 0 && giQuestions.length === 0 && gsQuestions.length === 0 && gacaQuestions.length === 0) {
                return res.status(404).json({ status: 'not_found' });
            }

            finalPool = [...mathQuestions, ...giQuestions, ...gsQuestions, ...gacaQuestions];
        } else {
            finalPool = readFolderQuestions(topic);
            if (finalPool.length === 0) {
                return res.status(404).json({ status: 'not_found' });
            }
            finalPool = shuffleArray(finalPool).slice(0, totalNeeded);
        }

        return res.status(200).json({ status: 'ok', data: shuffleArray(finalPool) });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}

function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}
