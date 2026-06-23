<template>
    <div class="rate-item" :class="themeClass">
        <template v-if="tripCardTheme === 'light'">
            <div class="rate-item-comment">
                {{ rate.comment }}
            </div>

            <div v-if="!notReply" class="rate-item-value">
                <span v-if="isPositiveRating(rate.rating)">
                        {{ $t('rateItemPositiva') }}
                        <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                    </span>
                    <span v-else-if="isNeutralRating(rate.rating)">
                        {{ $t('rateItemNeutral') }}
                        <i
                            class="fa fa-thumbs-up rate-neutral-icon"
                            aria-hidden="true"
                            :style="neutralIconStyle"
                        ></i>
                    </span>
                    <span v-else-if="isNegativeRating(rate.rating)">
                        {{ $t('rateItemNegativa') }}
                        <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                    </span>

                <span
                    class="pull-right clickeable"
                    v-if="canReply"
                    @click="showReply = !showReply"
                >
                    <!--   -->
                    <i class="fa fa-reply" aria-hidden="true"></i>
                </span>
            </div>

            <div class="rate-item-profile">
                <router-link
                    v-if="authorProfileRoute"
                    :to="authorProfileRoute"
                    class="rate-item-author-link"
                >
                    <div
                        class="trip_driver_img circle-box"
                        v-imgSrc:profile="rate.from.image"
                    ></div>
                    <strong>{{ rate.from.name }}</strong>
                </router-link>
                <template v-else>
                    <div
                        class="trip_driver_img circle-box"
                        v-imgSrc:profile="rate.from.image"
                    ></div>
                    <strong>{{ rate.from.name }}</strong>
                </template>
            </div>
        </template>
        <template v-else>
            <div class="image-width">
                <router-link
                    v-if="authorProfileRoute"
                    :to="authorProfileRoute"
                    class="rate-item-author-link"
                >
                    <div
                        class="trip_driver_img circle-box"
                        v-imgSrc:profile="rate.from.image"
                    ></div>
                </router-link>
                <div
                    v-else
                    class="trip_driver_img circle-box"
                    v-imgSrc:profile="rate.from.image"
                ></div>
            </div>
            <div class="text-width">
                <div class="rate-item-title">
                    <div>
                        <router-link
                            v-if="authorProfileRoute"
                            :to="authorProfileRoute"
                            class="rate-item-author-link"
                        >
                            <strong>{{ rate.from.name }}</strong>
                        </router-link>
                        <strong v-else>{{ rate.from.name }}</strong>
                        <template v-if="!notReply">
                            <span class="rate-item-value">
                                <i
                                    class="fa fa-thumbs-up"
                                    aria-hidden="true"
                                    v-if="isPositiveRating(rate.rating)"
                                ></i>
                                <i
                                    class="fa fa-thumbs-up rate-neutral-icon"
                                    aria-hidden="true"
                                    v-else-if="isNeutralRating(rate.rating)"
                                    :style="neutralIconStyle"
                                ></i>
                                <i
                                    class="fa fa-thumbs-down"
                                    aria-hidden="true"
                                    v-else-if="isNegativeRating(rate.rating)"
                                ></i>
                            </span>
                            <span
                                class="pull-right clickeable"
                                v-if="canReply"
                                @click="showReply = !showReply"
                            >
                                <i class="fa fa-reply" aria-hidden="true"></i>
                            </span>
                        </template>
                    </div>
                    <template v-if="!notReply">
                        <div class="rate-item-detail">
                            {{ $t('rateItemViajoAComo') }} {{ rate.trip.to_town }} {{ $t('rateItemComo') }}
                            {{ rateType }} -
                            {{ dayjs(rate.rate_at).format('DD/MM/YYYY') }}
                        </div>
                    </template>
                    <template v-else>
                        <div class="rate-item-detail">
                            {{ dayjs(rate.created_at).format('DD/MM/YYYY') }}
                        </div>
                    </template>
                </div>
                <div class="rate-item-comment">
                    {{ rate.comment }}
                </div>
            </div>
        </template>
        <div class="reply-box" v-if="showReply && canReply">
            <label for="reply" class="label label-reply"
                >{{ $t('rateItemResponderALaCalificacion') }}</label>
            <textarea maxlength="260" v-model="comment" id="reply"></textarea>
            <div class="reply-btns">
                <button class="btn btn-primary" @click="onReply">
                    {{ $t('rateItemResponder') }}
                </button>
                <button class="btn btn-primary" @click="onCancelReply">
                    {{ $t('rateItemCancelar') }}
                </button>
            </div>
        </div>
        <div
            class="reply_comment_content"
            v-if="!notReply && rate.reply_comment"
        >
            <div class="reply_comment">
                <strong>{{ profile.name }} {{ $t('rateItemRespondio') }}</strong>
                {{ rate.reply_comment }}
            </div>
            <div class="reply_comment_date">
                {{ dayjs(rate.reply_comment_created_at).calendar() }}
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useProfileStore } from '../stores/profile';
import { useRatesStore } from '../stores/rates';
import dayjs from '../dayjs';
import {
    neutralRatingIconStyle,
    isNegativeRating,
    isNeutralRating,
    isPositiveRating
} from '../utils/tripRating';
export default {
    data() {
        return {
            showReply: false,
            comment: ''
        };
    },
    methods: {
        dayjs,
        isPositiveRating,
        isNeutralRating,
        isNegativeRating,
        ...mapActions(useRatesStore, {
            reply: 'reply'
        }),
        onReply() {
            let data = {
                trip_id: this.rate.trip.id,
                user_id: this.rate.from.id,
                comment: this.comment
            };
            this.reply(data).then(() => {
                this.showReply = false;
                this.rate.reply_comment = this.comment;
                this.rate.reply_comment_created_at = dayjs(
                    new Date()
                ).format();
                this.comment = '';
            });
        },
        onCancelReply() {
            this.comment = '';
            this.showReply = false;
        }
    },
    computed: {
        ...mapState(useAuthStore, {
            config: 'appConfig',
            me: 'user'
        }),
        ...mapState(useProfileStore, {
            profile: 'user'
        }),
        canReply() {
            return (
                !this.rate.reply_comment &&
                this.me &&
                this.profile &&
                this.me.id === this.profile.id &&
                this.config &&
                this.config.allow_rating_reply
            );
        },
        rateType() {
            return this.rate.user_to_type === 0 ? this.$t('pasajero') : this.$t('conductor');
        },
        tripCardTheme() {
            return this.config ? this.config.trip_card_design : '';
        },
        themeClass() {
            return this.config
                ? 'rate-item-' + this.config.trip_card_design
                : ' rate-item-default';
        },
        authorProfileRoute() {
            if (!this.rate?.from?.id) {
                return null;
            }

            return {
                name: 'profile',
                params: {
                    id: this.rate.from.id,
                    userProfile: this.rate.from,
                    activeTab: 1
                }
            };
        },
        neutralIconStyle() {
            return neutralRatingIconStyle();
        }
    },
    props: ['user', 'rate', 'id', 'notReply']
};
</script>
<style scoped>
.rate-item-light .rate-item-comment {
    color: var(--primary-color);
    margin-bottom: 0.6rem;
}
.rate-item-light .rate-item-value {
    color: var(--secondary-color);
    font-size: 14px;
}
.rate-item-light .rate-item-value .fa {
    color: var(--secondary-color);
    font-size: 14px;
    margin-bottom: 0.6rem;
    margin-left: 0.25rem;
    padding-left: 0;
}
.rate-item-value .rate-neutral-icon {
    display: inline-block;
    margin-left: 0.6em;
    padding-left: 0;
    color: #888;
    vertical-align: middle;
}
.rate-item-profile .trip_driver_img {
    max-width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    vertical-align: middle;
    margin-right: 0.25rem;
}
.rate-item-profile strong {
    vertical-align: middle;
    font-size: 14px;
}
.rate-item-author-link {
    color: inherit;
    text-decoration: none;
}
.rate-item-author-link:hover strong {
    text-decoration: underline;
}
.reply_comment_content {
    margin-top: 1.25em;
    padding-left: 1em;
    font-size: 0.9em;
}
.reply_comment_content .reply_comment_date {
    font-size: 0.95em;
    font-style: italic;
    margin-top: 0.5em;
    color: #999;
}
.reply-btns {
    margin-top: 1em;
}
.label-reply {
    display: block;
    font-weight: bold;
    margin-top: 1.5em;

    padding: 0;
    font-size: 0.9rem;
    font-weight: bold;
    line-height: 1.5em;
    color: #333;
    text-align: left;
    border-radius: 0;
}
.reply-box {
    width: 100%;
    float: left;
}
textarea {
    height: 6.6em;
}
.reply_comment_content[data-v-79e4aac3] {
    word-wrap: break-word;
    float: left;
    width: 100%;
}
</style>
