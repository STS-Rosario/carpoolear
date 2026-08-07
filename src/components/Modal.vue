<template>
    <transition name="modal">
        <div class="modal-mask" @click.self="requestModalClose">
            <div class="modal-wrapper">
                <div
                    class="modal-container"
                    v-clickoutside="onModalClickOutside"
                    :id="name"
                >
                    <div class="modal-header modal-header-with-close">
                        <button
                            type="button"
                            class="modal-header-close btn btn-link"
                            :aria-label="$t('cerrar')"
                            @click="requestModalClose"
                        >
                            <i class="fa fa-times" aria-hidden="true"></i>
                        </button>
                        <slot name="header"></slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body"></slot>
                    </div>

                    <div class="modal-footer" v-if="!hideFooter">
                        <slot name="footer">
                            <AppButton
                                variant="secondary"
                                @click="$emit('close')"
                            >
                                {{ $t('cerrar') }}
                            </AppButton>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import AppButton from './ui/AppButton.vue';

export default {
    name: 'modal',
    components: {
        AppButton
    },
    data() {
        return {
            // Avoid treating the same click that opened the modal (e.g. table row) as an outside click.
            outsideDismissReady: false
        };
    },
    mounted() {
        window.addEventListener('keydown', this.onModalDocumentEscape);
        setTimeout(() => {
            this.outsideDismissReady = true;
        }, 0);
    },
    beforeUnmount() {
        window.removeEventListener('keydown', this.onModalDocumentEscape);
    },
    methods: {
        requestModalClose() {
            if (typeof this.clickOutside === 'function') {
                this.clickOutside();
            }
            this.$emit('close');
        },
        onModalClickOutside() {
            if (!this.outsideDismissReady) {
                return;
            }
            this.requestModalClose();
        },
        onModalDocumentEscape(event) {
            if (event.key === 'Escape') {
                this.requestModalClose();
            }
        }
    },

    props: {
        hideFooter: {
            required: false
        },
        clickOutside: {
            required: false
        },
        name: {
            required: false
        },
        // Absorb legacy unused attrs so they do not fall through as HTML title/body.
        title: {
            type: String,
            default: ''
        },
        body: {
            type: String,
            default: ''
        }
    }
};
</script>

<style scoped>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    box-sizing: border-box;
    transition: opacity 0.3s ease;
}

.modal-wrapper {
    display: flex;
    width: fit-content;
    max-width: 100%;
    justify-content: center;
    flex: 0 1 auto;
    min-height: 0;
}

.modal-container {
    width: fit-content;
    max-width: min(32rem, calc(100vw - 2rem));
    max-height: calc(100vh - 2rem);
    margin: 0;
    padding: 1.25rem 1.5rem;
    background: var(--ds-card-bg, #fff);
    border-radius: var(--ds-card-radius, 20px);
    box-shadow: var(--ds-card-shadow, 3px 3px 7.3px 0 rgba(0, 0, 0, 0.05));
    transition: all 0.3s ease;
    color: #333333;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0;
}

.modal-container :deep(p),
.modal-container :deep(label),
.modal-container :deep(h3),
.modal-container :deep(li) {
    color: #333333;
}

.modal-container :deep(a) {
    color: var(--ds-action, #1e5f9e);
}

.modal-header {
    position: relative;
    flex-shrink: 0;
    border-bottom: none;
}

.modal-header-with-close {
    padding-right: 2.5rem;
}

.modal-header-close {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 0.25rem;
    line-height: 1;
    font-size: 1.25rem;
    color: #333 !important;
    text-decoration: none !important;
}

.modal-header h3 {
    margin-top: 0;
}

.modal-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    margin: 20px 0;
}

.modal-footer {
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.6rem;
    text-align: center;
    border-top: none;
}

/*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */

.modal-enter {
    opacity: 0;
}

.modal-leave-active {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>
