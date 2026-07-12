// Vercel automatically sets VERCEL_GIT_COMMIT_SHA (and related VERCEL_GIT_*
// variables) for every deployment triggered from a connected Git repo - no
// manual configuration needed. We use the commit SHA to look up the actual
// commit timestamp from GitHub's public API, so "last updated" reflects the
// real push time rather than whenever this function happens to run.
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');
    // Cache at the edge/CDN for an hour - this data only changes on deploy.
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    const sha = process.env.VERCEL_GIT_COMMIT_SHA || null;
    const message = process.env.VERCEL_GIT_COMMIT_MESSAGE || null;
    const repoOwner = process.env.VERCEL_GIT_REPO_OWNER || 'sdas1210';
    const repoSlug = process.env.VERCEL_GIT_REPO_SLUG || 'conceptualbridge';

    let commitDate = null;

    try {
        if (sha) {
            const ghResponse = await fetch(
                `https://api.github.com/repos/${repoOwner}/${repoSlug}/commits/${sha}`,
                { headers: { 'User-Agent': 'conceptualbridge-site' } }
            );
            if (ghResponse.ok) {
                const commitData = await ghResponse.json();
                commitDate = commitData?.commit?.committer?.date
                    || commitData?.commit?.author?.date
                    || null;
            }
        }
    } catch (err) {
        // Swallow errors - the frontend just won't show a date if this fails.
    }

    return res.status(200).json({
        status: 'ok',
        sha: sha ? sha.substring(0, 7) : null,
        message,
        commitDate
    });
}
