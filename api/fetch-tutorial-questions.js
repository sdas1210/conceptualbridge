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
        const filePath = path.resolve(process.cwd(), source);
        console.log(filePath);
        console.log("Resolved:", filePath);
        
        console.log("Exists:", fs.existsSync(filePath));

        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'Question asset file not found' });
        }

        

        const folder = path.basename(
            path.dirname(filePath)
        );
        console.log("File Path:", filePath);
        console.log("Folder:", folder);
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

        const totalMarks = testSet.reduce(
            (sum, q) => sum + (q.marks || 1),
            0
        );
        const passMark = Number(

            (Math.random() * (7.99 - 6.01) + 6.01).toFixed(2)
        
                .toFixed(2)
        
        );

        const passPercentage = Number(
            ((passMark / totalMarks) * 100).toFixed(2)
        );

        const totalDifficulty = testSet.reduce(
            (sum, q) => sum + (q.difficulty || 5),
            0
        );
        
        const averageDifficulty =
            testSet.length > 0
                ? Number((totalDifficulty / testSet.length).toFixed(2))
                : 5;

       // 5. Slice down to exactly 10 questions
            
                        
            return res.status(200).json({

            status: "ok",
        
            averageDifficulty,
        
            passPercentage,
        
            passMark,
        
            paperMeta: {
        
                exam: testSet[0]?.exam || "",

                subject: testSet[0]?.subject || "",
            
                topic: testSet[0]?.topic || "",
            
                subTopic: testSet[0]?.subTopic || "",
            
                notification: testSet[0]?.notification || "",
            
                level: testSet[0]?.level || "",
            
                type: testSet[0]?.type || "",
            
                marks: testSet[0]?.marks || 1,
            
                qType: testSet[0]?.qType || "MCQ",
            
                totalMarks
        
            },
        
            data: testSet
        
        });

    } catch (err) {
        console.error("Tutorial API Error:", err);

        return res.status(500).json({
            error: err.message,
            stack: err.stack
        });
    }
}
