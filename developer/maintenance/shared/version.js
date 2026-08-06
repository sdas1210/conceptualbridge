/**
 * Conceptual Bridge - Maintenance Framework
 * Version Registry
 * 
 * Centralized tracking for framework, tool, and schema versions.
 */

export const VERSION_INFO = Object.freeze({
  FRAMEWORK_VERSION: '2.1.0',
  MAINTENANCE_SUITE_VERSION: '2.1.0',
  BUILD_DATE: '2026-08-07',
  BUILD_NUMBER: '20260807.1',
  GIT_COMMIT: 'v2.1.0-release'
});

export const TOOL_VERSIONS = Object.freeze({
  YOUTUBE_ANCHOR_BUILDER: '2.1.0',
  KNOWLEDGE_INDEX_BUILDER: '1.1.0'
});

/**
 * Returns a formatted version string for system diagnostics.
 * @returns {string} Formatted version string
 */
export function getVersionString() {
  return `Framework v${VERSION_INFO.FRAMEWORK_VERSION} (Build ${VERSION_INFO.BUILD_NUMBER})`;
}
