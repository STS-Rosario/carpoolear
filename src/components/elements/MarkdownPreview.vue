<template>
    <div class="markdown-preview" v-html="previewHtml"></div>
</template>

<script>
import { renderMarkdownPreview } from '../../services/markdown';

export default {
    name: 'MarkdownPreview',
    props: {
        source: {
            type: String,
            default: ''
        }
    },
    computed: {
        previewHtml() {
            return renderMarkdownPreview(this.source || '');
        }
    }
};
</script>

<style scoped>
.markdown-preview {
    color: #333;
    line-height: 1.5;
}

.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3),
.markdown-preview :deep(p),
.markdown-preview :deep(li),
.markdown-preview :deep(ul),
.markdown-preview :deep(ol),
.markdown-preview :deep(blockquote),
.markdown-preview :deep(code),
.markdown-preview :deep(pre),
.markdown-preview :deep(a),
.markdown-preview :deep(span) {
    color: #333;
}

.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3) {
    margin: 0 0 0.5em;
    font-weight: 600;
}

.markdown-preview :deep(p) {
    margin: 0 0 0.5em;
}

.markdown-preview :deep(p:last-child),
.markdown-preview :deep(ul:last-child),
.markdown-preview :deep(ol:last-child) {
    margin-bottom: 0;
}

.markdown-preview :deep(ul),
.markdown-preview :deep(ol) {
    margin: 0.25em 0 0.5em;
    padding-left: 1.25em;
}

.markdown-preview :deep(strong) {
    font-weight: 700;
}

.markdown-preview :deep(em) {
    font-style: italic;
}

.markdown-preview :deep(code) {
    background: rgba(0, 0, 0, 0.06);
    padding: 0.15em 0.35em;
    border-radius: 3px;
    font-size: 0.9em;
}

.markdown-preview :deep(a) {
    color: #036686;
    text-decoration: underline;
}
</style>
