import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    let { topic, limit } = req.query;
    const totalNeeded = parseInt(limit) || 10;

    // Force incoming parameters to match exact lower-case folder names on GitHub
    let targetFolder = 'math';
    if (topic === 'GI') targetFolder = 'gi';
    if (topic === 'GS') targetFolder = 'gs';
    if (topic === 'GACA' || topic === 'gaca') targetFolder = 'gaca';

    try {
        const questionsDir = path.join(process.cwd(), 'questions');

        const readFolderQuestions = (folder) => {
            const targetFolderPath = path.join(questionsDir, folder);
            if (!fs.existsSync(targetFolderPath)) return [];

            const files = fs.readdirSync(targetFolderPath);
            let combinedQuestions = [];

            files.forEach(file => {
                if (path.extname(file) === '.txt') {
                    const filePath = path.join(targetFolderPath, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    
                    const blocks = content.split('\n\n').filter(b => b.trim().length > 0);
                    
                    let questionsInFile = [];
                    let globalMetadata = {};

                    blocks.forEach(block => {
                        const lines = block.split('\n');
                        let isQuestionBlock = false;
                        let parsedBlock = { text: "" };

                        lines.forEach(l => {
                            const cleanLine = l.trim();
                            if (!cleanLine) return;
                            
                            if (cleanLine.startsWith('Q|')) {
                                isQuestionBlock = true;
                                parsedBlock.text += cleanLine.replace('Q|', '') + " ";
                            } else if (cleanLine.startsWith('A|')) {
                                parsedBlock.a = cleanLine.replace('A|', '');
                            } else if (cleanLine.startsWith('B|')) {
                                parsedBlock.b = cleanLine.replace('B|', '');
                            } else if (cleanLine.startsWith('C|')) {
                                parsedBlock.c = cleanLine.replace('C|', '');
                            } else if (cleanLine.startsWith('D|')) {
                                parsedBlock.d = cleanLine.replace('D|', '');
                            } else if (cleanLine.startsWith('Topic|')) {
                                parsedBlock.topic = cleanLine.replace('Topic|', '');
                            } else if (cleanLine.startsWith('Correct|')) {
                                const ansStr = cleanLine.replace('Correct|', '').trim().toUpperCase();
                                parsedBlock.correct = ansStr === 'A' ? 0 : ansStr === 'B' ? 1 : ansStr === 'C' ? 2 : 3;
                            } else if (cleanLine.startsWith('Exam|')) {
                                globalMetadata.exam = cleanLine.replace('Exam|', '');
                            } else if (cleanLine.startsWith('Shift|')) {
                                parsedBlock.shift = cleanLine.replace('Shift|', '');
                            } else if (cleanLine.startsWith('Level|')) {
                                parsedBlock.level = cleanLine.replace('Level|', '');
                            } else {
                                if (isQuestionBlock && !parsedBlock.a) {
                                    parsedBlock.text += "<br><br>" + cleanLine;
                                }
                            }
                        });

                        if (isQuestionBlock) {
                            questionsInFile.push(parsedBlock);
                        }
                    });

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
            finalPool = readFolderQuestions(targetFolder);
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
