<template>
    <span class="user-ratings-counts" v-if="visible">
        <span class="user-ratings-counts__pair">
            <i
                class="fa fa-thumbs-up user-ratings-counts__icon--positive"
                aria-hidden="true"
            ></i>
            <span>{{ ratings.positive }}</span>
        </span>
        <span class="user-ratings-counts__pair">
            <i
                class="fa fa-thumbs-down user-ratings-counts__icon--negative"
                aria-hidden="true"
            ></i>
            <span>{{ ratings.negative }}</span>
        </span>
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
    gap: 0.8em;
    font-size: 13px;
    white-space: nowrap;
}
.user-ratings-counts__pair {
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
}
.user-ratings-counts__icon--positive {
    color: #59b200;
    font-size: 0.95em;
}
.user-ratings-counts__icon--negative {
    color: red;
    font-size: 0.95em;
}
@media only screen and (max-width: 768px) {
    .user-ratings-counts {
        gap: 1.25em;
    }
    .user-ratings-counts__pair {
        gap: 0.35em;
    }
}
</style>
