/**
 * Conceptual Bridge - Theme & Design System Definitions
 * Design tokens and glassmorphism styling constants for dynamic maintenance tool interfaces.
 */

export const THEME = Object.freeze({
  COLORS: {
    BG_PRIMARY: '#0a0e17',
    BG_SECONDARY: '#121824',
    TEXT_MAIN: '#f0f4f8',
    TEXT_MUTED: '#8a99ad',
    TEXT_DIM: '#526071',
    ACCENT_BLUE: '#00d2ff',
    ACCENT_CYAN: '#00f2fe',
    ACCENT_GREEN: '#00e676',
    ACCENT_RED: '#ff5252',
    ACCENT_WARNING: '#ffab00'
  },
  GLASS: {
    BACKGROUND: 'rgba(18, 24, 36, 0.65)',
    BORDER: 'rgba(255, 255, 255, 0.08)',
    BORDER_ACTIVE: 'rgba(0, 210, 255, 0.3)',
    BLUR: '16px',
    SHADOW: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
  },
  SPACING: {
    RADIUS_LG: '16px',
    RADIUS_MD: '10px',
    RADIUS_SM: '6px'
  },
  ANIMATION: {
    SPEED_FAST: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    SPEED_NORMAL: '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }
});
