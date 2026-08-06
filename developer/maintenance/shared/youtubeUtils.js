/**
 * Conceptual Bridge - YouTube Utilities
 * Utility layer for parsing, validating, and generating YouTube URLs.
 */

export function extractYouTubeID(input) {
  if (!input || typeof input !== 'string') return '';
  const clean = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = clean.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function validateVideo(input) {
  if (!input || input.trim() === '') {
    return { isValid: true, videoId: '' }; // Optional videos are valid if empty
  }
  const videoId = extractYouTubeID(input);
  if (!videoId) {
    return { isValid: false, videoId: null, error: 'Invalid YouTube Video ID or URL format.' };
  }
  return { isValid: true, videoId };
}

export function buildPreviewURL(videoId) {
  if (!videoId) return '#';
  return `https://www.youtube.com/watch?v=${videoId}`;
}
