<template>
    <span class="user-ratings-counts" v-if="visible">
        <i class="fa fa-thumbs-up" aria-hidden="true"></i>
        <span>{{ ratings.positive }}</span>
        <i class="fa fa-thumbs-down" aria-hidden="true"></i>
        <span>{{ ratings.negative }}</span>
    </span>
</template>

<script>
export default {
    name: 'UserRatingsCounts',
    props: {
        ratings: {
            type: Object,
            default: null
        }
    },
    computed: {
        visible() {
            return this.ratings != null;
        }
    }
};
</script>

<style scoped>
.user-ratings-counts {
    display: inline-flex;
    align-items: center;
    gap: 0.2em;
    font-size: 13px;
    white-space: nowrap;
}
.user-ratings-counts i {
    font-size: 0.95em;
}
.user-ratings-counts span:first-of-type {
    margin-right: 0.35em;
}
</style>
