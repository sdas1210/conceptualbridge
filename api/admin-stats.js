import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const { secret } = req.query;

    // SECURITY KEY: Change 'manoj_admin_2026' to whatever secure password you want!
    const ADMIN_SECRET = 'manoj_admin_2026'; 

    if (!secret || secret !== ADMIN_SECRET) {
        // If someone guesses or opens this randomly, they just see a generic 404 error
        return res.status(404).json({ status: 'not_found' });
    }

    try {
        const questionsBaseDir = path.join(process.cwd(), 'questions');
        const sections = ['math', 'gi', 'gs', 'gaca'];
        let stats = {
            totalQuestions: 0,
            sections: {}
        };

        sections.forEach(folder => {
            const folderPath = path.join(questionsBaseDir, folder);
            stats.sections[folder.toUpperCase()] = 0;

            if (fs.existsSync(folderPath)) {
                const files = fs.readdirSync(folderPath);

                files.forEach(file => {
                    if (path.extname(file).toLowerCase() === '.txt') {
                        const filePath = path.join(folderPath, file);
                        const content = fs.readFileSync(filePath, 'utf8');
                        
                        // Standardize breaks and split by double lines to count question blocks
                        const standardized = content.replace(/\r\n/g, '\n');
                        const blocks = standardized.split('\n\n').filter(b => b.trim().startsWith('Q|'));
                        
                        stats.sections[folder.toUpperCase()] += blocks.length;
                        stats.totalQuestions += blocks.length;
                    }
                });
            }
        });

        return res.status(200).json({
            status: 'success',
            generatedAt: new Date().toISOString().split('T')[0],
            data: stats
        });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
