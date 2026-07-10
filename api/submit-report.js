import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // Only allow secure POST requests from the quiz portal
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    try {
        const { concern, activeSourceFile, questionIndex, rawQuestionContent } = req.body;

        // Validation guard clause
        if (!concern) {
            return res.status(400).json({ error: 'Missing concern text body content.' });
        }

        // Generate a clean ISO timestamp
        const timestamp = new Date().toISOString();

        // 1. FORMAT FOR STREAM LOGS (This prints instantly to your Vercel Dashboard log screen)
        console.log(`[QUESTION REPORT] [${timestamp}]`);
        console.log(`- File Source: ${activeSourceFile || 'Official Exam API'}`);
        console.log(`- Question Index (Position): ${questionIndex || 'Unknown'}`);
        console.log(`- Content Body: "${rawQuestionContent || 'N/A'}"`);
        console.log(`- User Concern: "${concern}"`);
        console.log(`--------------------------------------------------`);

        // 2. OPTIONAL: APPEND TO A LOCAL LOG FILE (Excellent for localhost testing)
        // Note: Vercel serverless hosting environments use a ephemeral read-only filesystem,
        // so this file append block will write locally on your computer during local testing.
        const logLine = `[${timestamp}] Source: ${activeSourceFile || 'API'} | Q.Index: ${questionIndex} | Question: ${rawQuestionContent} | Concern: ${concern}\n`;
        
        try {
            // Using /tmp directory or relative directory safe checks
            const localLogPath = path.join(process.cwd(), 'reports.txt');
            fs.appendFileSync(localLogPath, logLine, 'utf-8');
        } catch (fileErr) {
            // Safely bypass if the server block filesystem is read-only on deployment node
            console.warn("Persistent filesystem write skipped on production engine node.");
        }

        // Return a successful verification response to the front-end browser
        return res.status(200).json({
            status: 'success',
            message: 'Report filed successfully.',
            timestamp: timestamp
        });

    } catch (err) {
        console.error("Critical error inside submit-report API route handler:", err);
        return res.status(500).json({ error: 'Internal server processing error' });
    }
}
