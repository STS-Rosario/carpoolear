<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div
                    class="modal-container"
                    v-clickoutside="clickOutsideHandler"
                    :id="name"
                >
                    <div class="modal-header">
                        <slot name="header"></slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body"></slot>
                    </div>

                    <div class="modal-footer" v-if="!hideFooter">
                        <slot name="footer">
                            <button
                                class="modal-default-button btn btn-link"
                                @click="emit('close')"
                            >
                                {{ $t('cerrar') }}
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    hideFooter: {
        required: false
    },
    clickOutside: {
        required: false
    },
    name: {
        required: false
    }
});

const emit = defineEmits(['close']);

const clickOutsideHandler = ref(() => {});

onMounted(() => {
    setTimeout(() => {
        if (typeof props.clickOutside === 'function') {
            clickOutsideHandler.value = props.clickOutside;
        }
    }, 0);
});
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
    display: table;
    transition: opacity 0.3s ease;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    max-width: 600px;
    width: 90%;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
    color: #333333;
}

.modal-header h3 {
    margin-top: 0;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    float: right;
    color: #91b64c !important;
}

/*
    * The following styles are auto-applied to elements with
    * transition="modal" when their visibility is toggled
    * by Vue.js.
    *
    * You can easily play with the modal transition by editing
    * these styles.
    */

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>
