import fs from 'fs';
import path from 'path';
import { parseQuestionFile } from "../services/questionParser.js";
export default async function handler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    let { topic, limit } = req.query;

    const totalNeeded = parseInt(limit) || 10;

    let targetFolder = 'math';

    if (topic === 'GI') targetFolder = 'gi';
    if (topic === 'GS') targetFolder = 'gs';
    if (topic === 'GACA' || topic === 'gaca') targetFolder = 'gaca';

    try {

        const folderPath = path.join(
            process.cwd(),
            'questions',
            targetFolder
        );

        if (!fs.existsSync(folderPath)) {

            return res.status(404).json({
                status: 'not_found',
                debug: `Folder not found : questions/${targetFolder}`
            });

        }

        const txtFiles = fs.readdirSync(folderPath)

            .filter(file => file.toLowerCase().endsWith('.txt'))

            .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

        if (txtFiles.length === 0) {

            return res.status(404).json({
                status: 'not_found',
                debug: `No txt files found in questions/${targetFolder}`
            });

        }

        let combinedQuestions = [];
        let globalMetadata = {};

       for (const currentFile of txtFiles) {

            const filePath = path.join(folderPath, currentFile);
        
            const parsedQuestions = parseQuestionFile(
                filePath,
                targetFolder
            );
        
            combinedQuestions.push(...parsedQuestions);
        
        }

        combinedQuestions = combinedQuestions.map(q => ({

            ...q,

            exam: q.exam || globalMetadata.exam || '',

            shift: q.shift || globalMetadata.shift || '',

            level: q.level || globalMetadata.level || ''

        }));

        if (combinedQuestions.length === 0) {

            return res.status(404).json({

                status: 'not_found',

                debug: 'Zero questions parsed.'

            });

        }

        const finalPool = shuffleArray(combinedQuestions)

            .slice(0, totalNeeded);

        return res.status(200).json({

            status: 'ok',

            data: finalPool

        });

    }

    catch (error) {

        return res.status(500).json({

            status: 'error',

            message: error.message

        });

    }

}

function shuffleArray(arr) {

    return arr.sort(() => Math.random() - 0.5);

}
