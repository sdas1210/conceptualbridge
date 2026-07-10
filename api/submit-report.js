export default async function handler(req, res) {
    // 1. Setup global CORS headers to avoid cross-domain preflight blockages
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    // Instantly pass security preflight checks
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { concern, activeSourceFile, questionIndex, rawQuestionContent } = req.body;

        if (!concern) {
            return res.status(400).json({ error: 'Missing concern payload data' });
        }

        const timestamp = new Date().toISOString();

        // 2. THIS IS THE CRITICAL LINE THAT DUMPS RIGHT INTO YOUR VERCEL LOGS WINDOW
        console.log(`=== [NEW QUESTION CONCERN REPORTED] ===`);
        console.log(`[Timestamp] : ${timestamp}`);
        console.log(`[Source]    : ${activeSourceFile || 'Exam Routing Engine'}`);
        console.log(`[Q. Index]  : Position ${questionIndex || 'Unknown'}`);
        console.log(`[Question]  : "${rawQuestionContent || 'N/A'}"`);
        console.log(`[User Text] : "${concern}"`);
        console.log(`=======================================`);

        // 3. SECURE LOCAL ENVIRONMENT CHECK: Only write files if running locally on your computer
        // If it's running on Vercel (where process.env.VERCEL is true), it completely skips fs to prevent crashes!
        if (!process.env.VERCEL) {
            try {
                const fs = await import('fs');
                const path = await import('path');
                const localLogPath = path.join(process.cwd(), 'reports.txt');
                const logLine = `[${timestamp}] Source: ${activeSourceFile} | Q: ${questionIndex} | Concern: ${concern}\n`;
                fs.appendFileSync(localLogPath, logLine, 'utf-8');
            } catch (fsErr) {
                // Fail silently in development local fallbacks
            }
        }

        // Return instant success confirmation back to the student portal front-end interface
        return res.status(200).json({ 
            success: true, 
            message: "Report processed and safely registered." 
        });

    } catch (err) {
        console.error("Internal processing fallback error:", err);
        return res.status(500).json({ error: 'Internal pipeline execution failure' });
    }
}
