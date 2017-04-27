<template>  

</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: 'trips',
    methods: {
        ...mapActions({
            search: 'trips/search'
        })
    },
    mounted () {
        // this.search();
    },
    computed: {
        ...mapGetters({
            trips: 'trips/trips',
            morePages: 'trips/morePage',
            user: 'auth/user'
        })
    },
    components: {

    },
    props: [
        'id'
    ]
};
</script>