import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    let { topic, limit } = req.query;
    const totalNeeded = parseInt(limit) || 10;

    // Direct mapping to match folder structures explicitly
    let targetFolder = 'math';
    if (topic === 'GI') targetFolder = 'gi';
    if (topic === 'GS') targetFolder = 'gs';
    if (topic === 'GACA' || topic === 'gaca') targetFolder = 'gaca';

    try {
        // Vercel forces process.cwd() to locate the root of your repo
        const questionsBaseDir = path.join(process.cwd(), 'questions');
        const targetFolderPath = path.join(questionsBaseDir, targetFolder);

        // Debug fallback check to see if dir path mapping is failing
        if (!fs.existsSync(targetFolderPath)) {
            return res.status(404).json({ 
                status: 'not_found', 
                debug: `Folder path does not exist: questions/${targetFolder}` 
            });
        }

        const files = fs.readdirSync(targetFolderPath);
        let combinedQuestions = [];

        files.forEach(file => {
            if (path.extname(file).toLowerCase() === '.txt') {
                const filePath = path.join(targetFolderPath, file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Normalize windows carriage returns (\r\n) to standard unix newlines (\n)
                const standardizedContent = content.replace(/\r\n/g, '\n');
                const blocks = standardizedContent.split('\n\n').filter(b => b.trim().length > 0);
                
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

                // Inject metadata
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

        if (combinedQuestions.length === 0) {
            return res.status(404).json({ status: 'not_found', debug: 'No valid questions parsed from files.' });
        }

        // Handle structural slicing limits securely
        let finalPool = [];
        if (topic === 'ALL') {
            // Mixed logic defaults back to standard slicing metrics
            finalPool = combinedQuestions; 
        } else {
            finalPool = shuffleArray(combinedQuestions).slice(0, totalNeeded);
        }

        return res.status(200).json({ status: 'ok', data: finalPool });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}

function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}
