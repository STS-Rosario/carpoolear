<template>
    <div ref="mount" class="toast-ui-editor-mount" />
</template>

<script>
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { log343bb5 } from '../../debug/session343bb5Log';

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
    beforeCreate() {
        // #region agent log
        log343bb5('H7', 'ToastUiEditor.vue:beforeCreate', 'editor-component-construct-start', {});
        // #endregion
    },
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
        log343bb5('H-B,H-C', 'ToastUiEditor:mounted', 'creating-editor', {
            initialEditType: this.initialEditType,
            height: this.height
        });
        try {
            this.editor = new Editor({
                el: this.$refs.mount,
                ...this.editorConstructorOptions
            });
            log343bb5('H-B', 'ToastUiEditor:mounted', 'editor-created-ok', {});
        } catch (e) {
            log343bb5('H-B', 'ToastUiEditor:mounted', 'editor-created-throw', {
                errName: e && e.name,
                errMessage: e && e.message ? String(e.message).slice(0, 160) : 'unknown'
            });
            throw e;
        }
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
