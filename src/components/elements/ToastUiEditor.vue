<template>
    <div ref="mount" class="toast-ui-editor-mount" />
</template>

<script>
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const EDITOR_EVENTS = [
    'load',
    'change',
    'caretChange',
    'focus',
    'blur',
    'keydown',
    'keyup',
    'beforePreviewRender',
    'beforeConvertWysiwygToMarkdown'
];

const DEFAULT_OPTIONS = {
    initialEditType: 'markdown',
    initialValue: '',
    height: '300px',
    previewStyle: 'vertical'
};

export default {
    name: 'ToastUiEditor',
    props: {
        initialValue: {
            type: String,
            default: ''
        },
        initialEditType: {
            type: String,
            default: 'markdown'
        },
        height: {
            type: String,
            default: '300px'
        },
        previewStyle: {
            type: String,
            default: 'vertical'
        },
        options: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            editor: null
        };
    },
    computed: {
        editorConstructorOptions() {
            const userEvents = (this.options && this.options.events) || {};
            const wrappedEvents = {};
            EDITOR_EVENTS.forEach((name) => {
                const existing = userEvents[name];
                wrappedEvents[name] = (...args) => {
                    if (typeof existing === 'function') {
                        existing(...args);
                    }
                    this.$emit(name, ...args);
                };
            });
            const merged = {
                ...DEFAULT_OPTIONS,
                ...this.options,
                initialEditType: this.initialEditType,
                initialValue: this.initialValue,
                height: this.height,
                previewStyle: this.previewStyle,
                events: wrappedEvents
            };
            return merged;
        }
    },
    watch: {
        previewStyle(value) {
            if (this.editor) {
                this.editor.changePreviewStyle(value);
            }
        },
        height(value) {
            if (this.editor) {
                this.editor.height(value);
            }
        }
    },
    mounted() {
        this.editor = new Editor({
            el: this.$refs.mount,
            ...this.editorConstructorOptions
        });
    },
    beforeUnmount() {
        if (!this.editor) {
            return;
        }
        EDITOR_EVENTS.forEach((eventName) => {
            this.editor.off(eventName);
        });
        this.editor.destroy();
        this.editor = null;
    },
    methods: {
        invoke(method, ...args) {
            if (!this.editor || typeof this.editor[method] !== 'function') {
                return null;
            }
            return this.editor[method](...args);
        }
    }
};
</script>

<style scoped>
.toast-ui-editor-mount {
    width: 100%;
}
</style>
