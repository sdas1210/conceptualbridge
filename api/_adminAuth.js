import crypto from 'crypto';

// All admin auth relies on ADMIN_SECRET being set as a Vercel environment
// variable (Project Settings -> Environment Variables). It must NEVER be
// hardcoded in source, since this repo is public.
function getSecret() {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) {
        throw new Error('ADMIN_SECRET environment variable is not set');
    }
    return secret;
}

const TOKEN_TTL_MS = 1000 * 60 * 60 * 4; // 4 hour session

// Creates a signed, time-limited token. The token embeds an expiry timestamp
// and an HMAC signature over that timestamp, keyed with ADMIN_SECRET. The
// client stores/sends only this token - never the underlying secret - so
// nothing sensitive is ever exposed in the browser, sessionStorage, or network
// requests.
export function createToken() {
    const secret = getSecret();
    const expires = Date.now() + TOKEN_TTL_MS;
    const signature = crypto
        .createHmac('sha256', secret)
        .update(String(expires))
        .digest('hex');
    return `${expires}.${signature}`;
}

// Verifies a token's signature and expiry. Returns true/false.
export function verifyToken(token) {
    try {
        const secret = getSecret();
        if (!token || typeof token !== 'string') return false;

        const [expiresStr, signature] = token.split('.');
        if (!expiresStr || !signature) return false;

        const expires = Number(expiresStr);
        if (!Number.isFinite(expires) || Date.now() > expires) return false;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(expiresStr)
            .digest('hex');

        // Constant-time comparison to avoid timing attacks.
        const a = Buffer.from(signature);
        const b = Buffer.from(expectedSignature);
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
    } catch {
        return false;
    }
}

// Constant-time comparison for the plaintext password submitted at login.
export function verifyPassword(candidate) {
    try {
        const secret = getSecret();
        if (!candidate || typeof candidate !== 'string') return false;
        const a = Buffer.from(candidate);
        const b = Buffer.from(secret);
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
    } catch {
        return false;
    }
}
