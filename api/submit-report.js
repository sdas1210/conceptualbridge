import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // 1. ADD SECURITY HEADERS TO BYPASS CONNECTION BLOCKS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight browser options checks safely
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    }

    try {
        const { concern, activeSourceFile, questionIndex, rawQuestionContent } = req.body;

        if (!concern) {
            return res.status(400).json({ error: 'Missing concern content.' });
        }

        const timestamp = new Date().toISOString();

        // 2. FORCE PRINT THE MESSAGE FOR YOUR VERCEL LOGS SCREEN
        console.log(`[USER_REPORT_SUBMITTED] [${timestamp}]`);
        console.log(`SOURCE_FILE: ${activeSourceFile || 'N/A'}`);
        console.log(`QUESTION_INDEX: ${questionIndex || 'N/A'}`);
        console.log(`QUESTION_TEXT: ${rawQuestionContent || 'N/A'}`);
        console.log(`USER_CONCERN: ${concern}`);
        console.log(`--------------------------------------------------`);

        // 3. DEVELOPMENT ENGINES BACKUP (Writes to local project folder if testing on your PC)
        const logLine = `[${timestamp}] File: ${activeSourceFile} | Q: ${questionIndex} | Concern: ${concern}\n`;
        try {
            const localLogPath = path.join(process.cwd(), 'reports.txt');
            fs.appendFileSync(localLogPath, logLine, 'utf-8');
        } catch (e) {
            // Silently skip if the production hosting node filesystem is locked as read-only
        }

        return res.status(200).json({ status: 'success', received: true });

    } catch (err) {
        console.error("Critical error in submit-report handler:", err);
        return res.status(500).json({ error: 'Internal processing failure' });
    }
}
