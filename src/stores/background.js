import { defineStore } from 'pinia';

export const useBackgroundStore = defineStore('background', {
    state: () => ({
        background_style: 'white'
    }),

    getters: {
        backgroundStyle: (state) => state.background_style
    },

    actions: {
        setBackgroundStyle(style) {
            this.background_style = style;
        }
    }
});
