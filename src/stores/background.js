import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useBackgroundStore = defineStore('background', () => {
    const backgroundStyle = ref('white');

    function setBackgroundStyle(style) {
        backgroundStyle.value = style;
    }

    return {
        backgroundStyle,
        setBackgroundStyle
    };
});
