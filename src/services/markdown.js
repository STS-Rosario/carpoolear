import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Renders markdown string to safe HTML (sanitized to prevent XSS).
 * Supports basic markdown: bold, italic, code, links, lists, line breaks.
 * @param {string} text - Raw message text (may contain markdown)
 * @returns {string} Sanitized HTML safe for v-html
 */
export function markdownToHtml(text) {
    if (!text || typeof text !== 'string') return '';
    const rawHtml = marked.parse(text, {
        breaks: true,
        gfm: true
    });
    return DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'del', 's',
            'code', 'pre', 'a', 'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel']
    });
}
