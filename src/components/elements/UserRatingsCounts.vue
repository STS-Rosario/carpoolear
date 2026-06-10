<template>
    <span class="user-ratings-counts" v-if="visible">
        <span class="user-ratings-counts__pair user-ratings-counts__pair--positive">
            <span class="user-ratings-counts__icon-slot">
                <i
                    class="fa fa-thumbs-up user-ratings-counts__icon--positive"
                    aria-hidden="true"
                ></i>
            </span>
            <span>{{ ratings.positive }}</span>
        </span>
        <span class="user-ratings-counts__pair user-ratings-counts__pair--neutral">
            <span
                class="user-ratings-counts__icon-slot user-ratings-counts__icon-slot--neutral"
            >
                <i
                    class="fa fa-thumbs-up user-ratings-counts__icon--neutral rate-neutral-icon"
                    aria-hidden="true"
                ></i>
            </span>
            <span>{{ ratings.neutral }}</span>
        </span>
        <span class="user-ratings-counts__pair user-ratings-counts__pair--negative">
            <span class="user-ratings-counts__icon-slot">
                <i
                    class="fa fa-thumbs-down user-ratings-counts__icon--negative"
                    aria-hidden="true"
                ></i>
            </span>
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
    justify-content: center;
    gap: 1em;
    font-size: 13px;
    white-space: nowrap;
}
.user-ratings-counts__pair {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
}
.user-ratings-counts__pair--positive,
.user-ratings-counts__pair--negative {
    gap: 0.55em;
}
.user-ratings-counts__pair--neutral {
    gap: 0.35em;
}
.user-ratings-counts__icon-slot {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1em;
    height: 1em;
    flex-shrink: 0;
}
.user-ratings-counts__icon-slot--neutral {
    width: 1.15em;
    padding-top: 0.6em;
}
.user-ratings-counts__icon--positive {
    color: #59b200;
    font-size: 0.95em;
}
.user-ratings-counts__icon--neutral {
    color: #888;
    font-size: 0.95em;
}
.user-ratings-counts__icon--negative {
    color: red;
    font-size: 0.95em;
}
.rate-neutral-icon {
    display: inline-block;
    line-height: 1;
    transform: rotate(-90deg) translateY(0.12em);
    filter: grayscale(100%);
}
@media only screen and (max-width: 768px) {
    .user-ratings-counts {
        gap: 1.25em;
    }
    .user-ratings-counts__pair--positive,
    .user-ratings-counts__pair--negative {
        gap: 0.6em;
    }
}
</style>
