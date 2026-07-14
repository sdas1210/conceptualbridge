import fs from 'fs';
import path from 'path';
import { parseQuestionFile } from "../services/questionParser.js";
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

        

        const folder = path.basename(
            path.dirname(filePath)
        );
        
        const parsedQuestions = parseQuestionFile(
            filePath,
            folder
        );

        
        for (let i = parsedQuestions.length - 1; i > 0; i--) {

            const j = Math.floor(
                Math.random() * (i + 1)
            );
        
            [parsedQuestions[i], parsedQuestions[j]] =
            [parsedQuestions[j], parsedQuestions[i]];
        
        }

        const testSet =
        parsedQuestions.slice(0,10);

        const passMark = Number(

            (8 + Math.random()*1.5)
        
                .toFixed(2)
        
        );

        

       // 5. Slice down to exactly 10 questions
            
                        
            return res.status(200).json({

                status: "ok",
            
                passMark,
            
                data: testSet
            
            });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server processing error' });
    }
}
