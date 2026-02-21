<template>
    <div class="rate-item" :class="themeClass">
        <template v-if="tripCardTheme === 'light'">
            <div class="rate-item-comment">
                {{ rate.comment }}
            </div>

            <div v-if="!notReply" class="rate-item-value">
                <span v-if="rate.rating == 1">
                        {{ $t('rateItemPositiva') }}
                        <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                    </span>
                    <span v-if="rate.rating == 0">
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
                <div
                    class="trip_driver_img circle-box"
                    v-imgSrc:profile="rate.from.image"
                ></div>
                <strong>{{ rate.from.name }}</strong>
            </div>
        </template>
        <template v-else>
            <div class="image-width">
                <div
                    class="trip_driver_img circle-box"
                    v-imgSrc:profile="rate.from.image"
                ></div>
            </div>
            <div class="text-width">
                <div class="rate-item-title">
                    <div>
                        <strong>{{ rate.from.name }}</strong>
                        <template v-if="!notReply">
                            <span class="rate-item-value">
                                <i
                                    class="fa fa-thumbs-up"
                                    aria-hidden="true"
                                    v-if="rate.rating == 1"
                                ></i>
                                <i
                                    class="fa fa-thumbs-down"
                                    aria-hidden="true"
                                    v-if="rate.rating == 0"
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
                            {{ formatDate(rate.rate_at, 'DD/MM/YYYY') }}
                        </div>
                    </template>
                    <template v-else>
                        <div class="rate-item-detail">
                            {{ formatDate(rate.created_at, 'DD/MM/YYYY') }}
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
                {{ formatDate(rate.reply_comment_created_at, 'calendar') }}
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';
import { useRatesStore } from '@/stores/rates';
import moment from 'moment';
import { formatDate } from '@/composables/useFormatters';

const { t } = useI18n();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const ratesStore = useRatesStore();

const props = defineProps({
    user: {
        required: false
    },
    rate: {
        required: true
    },
    id: {
        required: false
    },
    notReply: {
        required: false
    }
});

const config = computed(() => authStore.appConfig);
const me = computed(() => authStore.user);
const profile = computed(() => profileStore.user);

const showReply = ref(false);
const comment = ref('');

const canReply = computed(() => {
    return (
        !props.rate.reply_comment &&
        me.value &&
        profile.value &&
        me.value.id === profile.value.id &&
        config.value &&
        config.value.allow_rating_reply
    );
});

const rateType = computed(() => {
    return props.rate.user_to_type === 0 ? t('pasajero') : t('conductor');
});

const tripCardTheme = computed(() => {
    return config.value ? config.value.trip_card_design : '';
});

const themeClass = computed(() => {
    return config.value
        ? 'rate-item-' + config.value.trip_card_design
        : ' rate-item-default';
});

function onReply() {
    let data = {
        trip_id: props.rate.trip.id,
        user_id: props.rate.from.id,
        comment: comment.value
    };
    ratesStore.reply(data).then(() => {
        showReply.value = false;
        props.rate.reply_comment = comment.value;
        props.rate.reply_comment_created_at = moment(
            new Date()
        ).format();
        comment.value = '';
    });
}

function onCancelReply() {
    comment.value = '';
    showReply.value = false;
}
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
