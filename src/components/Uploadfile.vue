<template>
    <input ref="input" type="file" @change="onFileChange" v-show="false" accept="image/*" />
</template>

<script>
import { Capacitor } from '@capacitor/core';

export default {
    name: 'uploadfile',
    data() {
        return {
            isNative: false
        };
    },
    mounted() {
        this.isNative = Capacitor.isNativePlatform();
    },
    methods: {
        async show() {
            if (this.isNative) {
                const success = await this.showNativePicker();
                // If native picker failed (not user cancellation), fallback to web input
                if (!success) {
                    this.$refs.input.click();
                }
            } else {
                this.$refs.input.click();
            }
        },

        async showNativePicker() {
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
                    data[this.name] = imageData;
                    this.$emit('change', data);
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
        },

        onFileChange(e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) {
                return;
            }
            this.createImage(files[0]);
        },

        createImage(file) {
            /* eslint-disable no-undef */
            let reader = new FileReader();
            let vm = this;
            reader.onload = (e) => {
                let image = e.target.result;
                let data = {};
                data[vm.name] = image;
                vm.$emit('change', data);
            };
            reader.readAsDataURL(file);
        }
    },
    props: ['name']
};
</script>
