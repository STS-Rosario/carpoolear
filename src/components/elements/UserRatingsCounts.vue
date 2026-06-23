<template>
    <span
        class="user-ratings-counts"
        :class="{ 'user-ratings-counts--inverse': variant === 'inverse' }"
        v-if="visible"
    >
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
                    :style="neutralIconStyle"
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
import { neutralRatingIconStyle } from '../../utils/tripRating';

export default {
    name: 'UserRatingsCounts',
    props: {
        ratings: {
            type: Object,
            default: null
        },
        variant: {
            type: String,
            default: 'default'
        }
    },
    computed: {
        visible() {
            return this.ratings != null;
        },
        neutralIconStyle() {
            return neutralRatingIconStyle({
                grayscale: this.variant !== 'inverse',
                translateX: this.variant === 'inverse' ? '0.32em' : null
            });
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
    gap: 0.65em;
}
.user-ratings-counts__pair--neutral {
    gap: 0.35em;
    margin-right: 0.15em;
}
.user-ratings-counts__pair--negative {
    margin-left: 0.15em;
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
}
.user-ratings-counts--inverse .user-ratings-counts__icon--positive,
.user-ratings-counts--inverse .user-ratings-counts__icon--neutral,
.user-ratings-counts--inverse .user-ratings-counts__icon--negative {
    color: #fff;
}
@media only screen and (max-width: 768px) {
    .user-ratings-counts {
        gap: 1.25em;
    }
    .user-ratings-counts__pair--positive,
    .user-ratings-counts__pair--negative {
        gap: 0.7em;
    }
}
</style>
