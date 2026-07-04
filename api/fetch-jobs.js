export default async function handler(req, res) {
    // Enable CORS access so your own frontend pages can read this server response safely
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        const targetFeedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.sarkarinaukriblog.com%2Ffeed';
        const response = await fetch(targetFeedUrl);
        const data = await response.json();

        // Send the clean text data straight back to your jobs.html page
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to compile server-side feed data streams.' });
    }
}
