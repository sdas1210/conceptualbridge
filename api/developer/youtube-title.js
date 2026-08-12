export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ status: 'error', message: 'Method not allowed' });

  const videoId = String(req.query?.videoId || '').trim();
  if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
    return res.status(400).json({ status: 'error', message: 'Invalid YouTube video ID' });
  }

  try {
    const url = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (!response.ok) {
      return res.status(502).json({ status: 'error', message: 'Unable to retrieve the YouTube video title.' });
    }
    const data = await response.json();
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    if (!title) return res.status(502).json({ status: 'error', message: 'YouTube returned no video title.' });
    return res.status(200).json({ status: 'ok', videoId, title });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message || 'YouTube title lookup failed.' });
  }
}
