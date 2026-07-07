/**
 * Input sanitization helpers.
 *
 * Zod handles shape/type validation; these helpers normalise free-text
 * user input before it is persisted, and escape it before it is
 * interpolated into HTML email templates.
 */

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Trim, collapse whitespace and strip control characters. */
export function sanitizeText(value: string): string {
  return value.replace(CONTROL_CHARS, "").replace(/\s+/g, " ").trim();
}

/** Same as sanitizeText but preserves newlines (for notes/messages). */
export function sanitizeMultiline(value: string): string {
  return value
    .replace(CONTROL_CHARS, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Escape HTML entities before interpolating into email HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Normalise an email address for storage and lookups. */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}
