import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const { secret } = req.query;
    const ADMIN_SECRET = 'shodas_admin_2026'; 

    if (!secret || secret !== ADMIN_SECRET) {
        return res.status(404).json({ status: 'not_found' });
    }

    try {
        const questionsBaseDir = path.join(process.cwd(), 'questions');
        const sections = ['math', 'gi', 'gs', 'gaca'];
        
        let stats = {
            totalQuestions: 0,
            sections: {},
            allocationRatios: {}
        };

        sections.forEach(f => stats.sections[f.toUpperCase()] = 0);

        sections.forEach(folder => {
            const folderPath = path.join(questionsBaseDir, folder);

            if (fs.existsSync(folderPath)) {
                const files = fs.readdirSync(folderPath);

                files.forEach(file => {
                    if (path.extname(file).toLowerCase() === '.txt') {
                        const filePath = path.join(folderPath, file);
                        const content = fs.readFileSync(filePath, 'utf8');
                        
                        const standardized = content.replace(/\r\n/g, '\n');
                        const blocks = standardized.split('\n\n').filter(b => b.trim().startsWith('Q|'));
                        
                        stats.sections[folder.toUpperCase()] += blocks.length;
                        stats.totalQuestions += blocks.length;
                    }
                });
            }
        });

        sections.forEach(folder => {
            const key = folder.toUpperCase();
            const count = stats.sections[key];
            stats.allocationRatios[key] = stats.totalQuestions > 0 
                ? parseFloat(((count / stats.totalQuestions) * 100).toFixed(1)) 
                : 0;
        });

        return res.status(200).json({
            status: 'success',
            meta: {
                systemClockSync: new Date().toISOString(),
                formattedDate: new Date().toISOString().split('T')[0]
            },
            statistics: stats
        });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
