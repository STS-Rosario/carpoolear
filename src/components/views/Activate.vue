<template>

</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'activate',
    props: ['token'],

    data () {
        return {

        };
    },

    methods: {
        ...mapActions({
            activateAccount: 'auth/activate'
        })
    },

    mounted () {
        this.activateAccount(this.token);
    }
};
</script>