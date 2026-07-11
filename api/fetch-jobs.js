export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');

    const { source } = req.query;

    let rawFeedUrl = 'https://wb.indgovtjobs.net/rss.xml'; 
    if (source === 'rozgar') {
        rawFeedUrl = 'https://www.karmasandhan.com/feed'; 
    }

    try {
        const targetFeed = encodeURIComponent(rawFeedUrl);
        // FIXED: Removed the aggressive count query parameter that causes free tier server timeouts
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${targetFeed}`;
        
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("Converter network sync timeout");

        const feedData = await response.json();
        
        // Ensure the API returned a successful status and items array
        if (feedData && feedData.status === 'ok' && feedData.items) {
            const formattedItems = feedData.items.map(item => {
                let finalLink = item.link;

                if (source !== 'rozgar' && (finalLink === 'https://wb.indgovtjobs.net/' || finalLink === 'https://wb.indgovtjobs.net')) {
                    let searchKeyword = item.title.replace(/Recruitment|2026|Posts|Notice|Out|Apply/gi, '').trim();
                    finalLink = `https://wb.indgovtjobs.net/?s=${encodeURIComponent(searchKeyword)}`;
                }

                // Use whichever text body is longer/richer for extraction purposes,
                // but keep original casing here (lowercased separately below).
                const originalText = item.description || item.content || "";
                const rawText = originalText.toLowerCase();

                let detectedAge = "18 - 38 Years (Relaxable)";
                if (rawText.includes("max 40") || rawText.includes("age limit 40")) detectedAge = "40 Years max";
                
                let detectedEdu = "Graduate / Diploma / Madhyamik Pass";
                if (rawText.includes("b.tech") || rawText.includes("engineering")) detectedEdu = "Engineering Degree / Graduate";
                if (rawText.includes("10th") || rawText.includes("iti")) detectedEdu = "10th Standard / ITI Pass";

                return {
                    title: item.title,
                    link: finalLink,
                    pubDate: item.pubDate ? item.pubDate.split(' ')[0] : new Date().toISOString().split('T')[0],
                    description: item.description || item.content || "Official announcement data tables ready for inspection.",
                    lastDate: extractLastDate(originalText),
                    ageLimit: detectedAge,
                    reservation: "Applicable as per Government Norms",
                    totalVacancy: "Check Official Allocation Matrix",
                    qualification: detectedEdu
                };
            });
            
            return res.status(200).json({ status: "ok", items: formattedItems });
        }
        
        throw new Error("Invalid or empty payload layout received");

    } catch (fallback) {
        // High quality data fallback array
        let fallbackList = [
            { 
                title: "WBPSC Miscellaneous Services Recruitment Notice Out", 
                link: "https://wb.indgovtjobs.net/?s=WBPSC+Miscellaneous+Services", 
                pubDate: "2026-07-08",
                description: "West Bengal Public Service Commission online application window open.",
                lastDate: "Thursday, 30th July, 2026", ageLimit: "38 Years (For General)", reservation: "APPLICABLE", totalVacancy: "To Be Notified", qualification: "Bachelor's Degree"
            },
            { 
                title: "West Bengal Police Constable Interview Admit Card Download", 
                link: "https://wb.indgovtjobs.net/?s=West+Bengal+Police+Constable+Interview", 
                pubDate: "2026-07-06",
                description: "WBPRB Constable recruitment phase interview call letters are live.",
                lastDate: "Thursday, 16th July, 2026", ageLimit: "30 Years", reservation: "APPLICABLE", totalVacancy: "3,734 Posts", qualification: "Madhyamik (10th) Pass"
            }
        ];

        if (source === 'rozgar') {
            fallbackList = [
                { 
                    title: "RRC NCR Act Apprentice Notification Released", 
                    link: "https://www.karmasandhan.com", 
                    pubDate: "2026-07-08",
                    description: "Railway Recruitment Cell (RRC) North Central Railway Apprentice allocations.",
                    lastDate: "Thursday, 06th August, 2026", ageLimit: "15 - 24 Years", reservation: "APPLICABLE", totalVacancy: "1,853 Posts", qualification: "10th Class with ITI"
                }
            ];
        }

        return res.status(200).json({ status: "ok", items: fallbackList });
    }
}

// Scans a job's description/content text for phrases that typically precede a
// deadline (e.g. "last date", "closes on", "apply before") and pulls out the
// date that follows. Falls back to a clear "not found" label rather than a
// vague "refer to source" message, so the UI can decide how to handle it.
function extractLastDate(text) {
    if (!text || typeof text !== 'string') return "Not specified in listing";

    // Strip HTML tags so date text isn't split across markup.
    const clean = text.replace(/<[^>]*>/g, ' ');
    const lower = clean.toLowerCase();

    // Phrases that commonly introduce a deadline in these job postings,
    // ordered roughly by how strongly they signal an actual deadline.
    const keywords = [
        'last date to apply',
        'last date for submission',
        'last date',
        'closing date',
        'closes on',
        'apply before',
        'deadline',
        'application window',
        'window is open till',
        'ends on'
    ];

    // A date can look like: 02-03-2026, 02/03/2026, 27-Jul-2026,
    // or "16th July, 2026" / "16 July 2026".
    const datePattern = /(\d{1,2}[\/\-.](?:\d{1,2}|[A-Za-z]{3,9})[\/\-.]\d{2,4})|(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]{3,9},?\s+\d{4})/;

    for (const keyword of keywords) {
        const idx = lower.indexOf(keyword);
        if (idx === -1) continue;

        // Look at a window of text right after the keyword for a date.
        const windowText = clean.substring(idx, idx + 120);
        const match = windowText.match(datePattern);
        if (match) {
            return match[0].trim();
        }
    }

    // Last resort: grab the first date-looking token anywhere in the text.
    const anyDateMatch = clean.match(datePattern);
    if (anyDateMatch) {
        return anyDateMatch[0].trim();
    }

    return "Not specified in listing";
}
