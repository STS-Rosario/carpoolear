<template></template>

<script>
import { mapActions } from 'pinia';
import { useAuthStore } from '../../stores/auth';

export default {
    name: 'activate',
    props: ['token'],

    data() {
        return {};
    },

    methods: {
        ...mapActions(useAuthStore, {
            activateAccount: 'activate'
        })
    },

    mounted() {
        this.activateAccount(this.token);
    }
};
</script>
