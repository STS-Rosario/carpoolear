<template>
    <input ref="inputRef" type="file" @change="onFileChange" v-show="false" accept="image/*" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Capacitor } from '@capacitor/core';

const props = defineProps({
    name: {
        required: true
    }
});

const emit = defineEmits(['change']);

const inputRef = ref(null);
const isNative = ref(false);

onMounted(() => {
    isNative.value = Capacitor.isNativePlatform();
});

async function show() {
    if (isNative.value) {
        const success = await showNativePicker();
        // If native picker failed (not user cancellation), fallback to web input
        if (!success) {
            inputRef.value.click();
        }
    } else {
        inputRef.value.click();
    }
}

async function showNativePicker() {
    try {
        const { Camera } = await import('@capacitor/camera');
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: 'base64',
            source: 'PROMPT' // Shows dialog to choose between Camera and Photo Library
        });

        if (image && image.base64String) {
            // Format: data:image/jpeg;base64,{base64String}
            const imageData = `data:image/${image.format || 'jpeg'};base64,${image.base64String}`;
            const data = {};
            data[props.name] = imageData;
            emit('change', data);
            return true; // Success
        }
        return false; // Incomplete response
    } catch (error) {
        // Check if error is due to user cancellation
        const errorMessage = error.message || error.toString() || '';
        const isUserCancellation =
            errorMessage.includes('User cancelled') ||
            errorMessage.includes('canceled') ||
            errorMessage.includes('cancelled') ||
            error.code === 'USER_CANCELLED' ||
            error.code === 'CANCELLED';

        if (isUserCancellation) {
            // User cancelled - this is expected behavior, don't fallback
            return true; // Return true to prevent fallback
        } else {
            // Actual error (permissions, plugin issue, etc.) - log and allow fallback
            console.error('Error picking image:', error);
            return false; // Return false to trigger fallback
        }
    }
}

function onFileChange(e) {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) {
        return;
    }
    createImage(files[0]);
}

function createImage(file) {
    /* eslint-disable no-undef */
    let reader = new FileReader();
    reader.onload = (e) => {
        let image = e.target.result;
        let data = {};
        data[props.name] = image;
        emit('change', data);
    };
    reader.readAsDataURL(file);
}

defineExpose({ show });
</script>
