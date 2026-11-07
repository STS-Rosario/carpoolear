import { marked } from 'marked';
import DOMPurify from 'dompurify';

const SANITIZE_OPTIONS = {
    ALLOWED_TAGS: [
        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'del', 's',
        'code', 'pre', 'a', 'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel']
};

const HTML_CONTENT_PATTERN = /<(?:p|h[1-6]|ul|ol|li|br|strong|em|del|blockquote|pre|code)\b/i;
const MARKDOWN_LINK_PATTERN = /\[[^\]]+\]\([^)]+\)/;

export function looksLikeHtmlContent(text) {
    return HTML_CONTENT_PATTERN.test(text);
}

function containsRawMarkdownSyntax(text) {
    return MARKDOWN_LINK_PATTERN.test(text) || /\*\*[^*]+\*\*/.test(text) || /\*[^*<\n]+\*/.test(text);
}

function decodeBasicHtmlEntities(text) {
    return text
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

function htmlToPlainMarkdownSource(html) {
    const withBreaks = html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
        .replace(/<\/(?:p|div|h[1-6]|li|blockquote)>/gi, '\n')
        .replace(/<(?:p|div|h[1-6]|li|blockquote)[^>]*>/gi, '')
        .replace(/<[^>]+>/g, '');

    return decodeBasicHtmlEntities(withBreaks).replace(/\n{3,}/g, '\n\n').trim();
}

function sanitizeHtml(html) {
    return DOMPurify.sanitize(html, SANITIZE_OPTIONS);
}

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
    return sanitizeHtml(rawHtml);
}

/**
 * Renders changelog/support preview bodies that may be markdown or HTML from Toast UI WYSIWYG.
 * @param {string} text
 * @returns {string}
 */
export function renderMarkdownPreview(text) {
    if (!text || typeof text !== 'string') return '';
    const trimmed = text.trim();
    if (looksLikeHtmlContent(trimmed)) {
        if (containsRawMarkdownSyntax(trimmed)) {
            return markdownToHtml(htmlToPlainMarkdownSource(trimmed));
        }
        return sanitizeHtml(trimmed);
    }
    return markdownToHtml(trimmed);
}
