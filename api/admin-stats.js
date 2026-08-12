import fs from 'fs';
import path from 'path';
import { verifyToken } from './_adminAuth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const { token } = req.query;
    const sections = ['math', 'gi', 'gs', 'gaca'];

    if (!verifyToken(token)) {
        return res.status(404).json({ status: 'not_found' });
    }

    try {
        const knowledgeDir = path.join(process.cwd(), 'knowledge');
        const sectionStats = {};
        const hierarchy = {};
        let totalQuestions = 0;

        for (const folder of sections) {
            const key = folder.toUpperCase();
            const libraryPath = path.join(knowledgeDir, `questionLibrary.${folder}.json`);
            let library = null;

            try {
                const raw = fs.readFileSync(libraryPath, 'utf8').trim();
                if (raw) library = JSON.parse(raw);
            } catch (_) {
                library = null;
            }

            if (library && library.summary && Array.isArray(library.topics)) {
                const count = Number(library.summary.totalQuestions) || 0;
                sectionStats[key] = count;
                totalQuestions += count;
                hierarchy[key] = {
                    totalQuestions: count,
                    topics: library.topics
                };
                continue;
            }

            // Backward-compatible fallback for a section whose Knowledge Library
            // has not yet been generated.
            let count = 0;
            const folderPath = path.join(process.cwd(), 'questions', folder);
            if (fs.existsSync(folderPath)) {
                for (const file of fs.readdirSync(folderPath)) {
                    if (!file.toLowerCase().endsWith('.txt')) continue;
                    const content = fs.readFileSync(path.join(folderPath, file), 'utf8');
                    count += content.replace(/\r\n/g, '\n').split('\n').filter(line => {
                        const t = line.trim();
                        return t.startsWith('Q|') || t.startsWith('QEN|');
                    }).length;
                }
            }
            sectionStats[key] = count;
            totalQuestions += count;
            hierarchy[key] = { totalQuestions: count, topics: [] };
        }

        const allocationRatios = {};
        for (const folder of sections) {
            const key = folder.toUpperCase();
            allocationRatios[key] = totalQuestions > 0
                ? Number(((sectionStats[key] / totalQuestions) * 100).toFixed(1))
                : 0;
        }

        return res.status(200).json({
            status: 'success',
            meta: {
                systemClockSync: new Date().toISOString(),
                formattedDate: new Date().toISOString().split('T')[0]
            },
            statistics: {
                totalQuestions,
                sections: sectionStats,
                allocationRatios,
                hierarchy
            }
        });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
