import { verifyPassword, createToken } from './_adminAuth.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ status: 'error', message: 'Method Not Allowed' });
    }

    try {
        const { password } = req.body || {};

        if (!verifyPassword(password)) {
            // Generic 401 - don't reveal whether ADMIN_SECRET is even configured.
            return res.status(401).json({ status: 'unauthorized' });
        }

        const token = createToken();
        return res.status(200).json({ status: 'success', token });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
