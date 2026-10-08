<template>
    <div class="col-xs-24 col-md-16 col-lg-12">
        <div class="rate-pending_component clearfix">
            <div class="rate-pending_photo">
                <router-link
                    :to="{
                        name: 'profile',
                        params: { id: to.id, userProfile: to, activeTab: 1 }
                    }"
                >
                    <div
                        class="trip_driver_img circle-box"
                        v-imgSrc:profile="to.image"
                    ></div>
                </router-link>
            </div>
            <div class="rate-pending-message">
                <div class="rate-pending-message--content">
                    {{ $t('ratePendingComoCalificariasA') }}
                    <strong>{{ to.name }}</strong>
                    {{ $t('como') }}
                    <span v-if="rate.user_to_type === DRIVER">{{ $t('ratePendingConductor') }}</span>
                    <span v-if="rate.user_to_type === PASSENGER">{{ $t('ratePendingPasajero') }}</span>
                    {{ $t('ratePendingEnElViajeHacia') }}
                    <strong>{{ getTripDestinationCity(trip) }}</strong>
                    {{ $t('ratePendingElDia') }}
                    <strong>{{
                        dayjs(trip.trip_date).format('dddd DD [de] MMMM')
                    }}</strong>
                    ?
                </div>
            </div>
            <div class="float-margin">
                <div class="rate-buttons">
                    <button
                        class="btn rate-positive"
                        @click="setRate(1)"
                        :class="{ active: vote === 1 }"
                    >
                        <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                    </button>
                    <button
                        class="btn rate-neutral"
                        @click="setRate(2)"
                        :class="{ active: vote === 2 }"
                    >
                        <i
                            class="fa fa-thumbs-o-up rate-neutral-icon"
                            aria-hidden="true"
                            :style="neutralIconStyle"
                        ></i>
                    </button>
                    <button
                        class="btn rate-negative"
                        @click="setRate(0)"
                        :class="{ active: vote === 0 }"
                    >
                        <i class="fa fa-thumbs-o-down" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <div class="rate--comment-box" v-show="expanded">
                <AppTextarea
                    v-model="comment"
                    maxlength="600"
                    rows="3"
                    :placeholder="$t('ratePendingIncluyaUnComentario')"
                />
                <div v-if="shouldAskPaidMore" class="rate-pending-paid-more">
                    <p class="rate-pending-paid-more-question">
                        {{
                            $t('ratePendingPaidMoreThanContribution', {
                                amount: paidMoreAmountLabel
                            })
                        }}
                    </p>
                    <div class="rate-pending-paid-more-options">
                        <label class="rate-pending-paid-more-option">
                            <input
                                v-model="paidMoreChoice"
                                type="radio"
                                :name="'paid-more-' + rate.id"
                                value="yes"
                            />
                            {{ $t('si') }}
                        </label>
                        <label class="rate-pending-paid-more-option">
                            <input
                                v-model="paidMoreChoice"
                                type="radio"
                                :name="'paid-more-' + rate.id"
                                value="no"
                            />
                            {{ $t('no') }}
                        </label>
                    </div>
                    <p class="rate-pending-paid-more-legend">
                        {{ $t('ratePendingPaidMoreLegend') }}
                    </p>
                </div>
                <AppButton
                    variant="primary"
                    @click="makeVote"
                    :disabled="sending"
                    :loading="sending"
                >
                    {{ $t('ratePendingCalificar') }}
                </AppButton>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useRatesStore } from '../stores/rates';
import dialogs from '../services/dialogs.js';
import dayjs from '../dayjs';
import {
    NEUTRAL_RATING_ICON_STYLE,
    canSubmitRatingVote,
    getRequiredCommentMessageKey
} from '../utils/tripRating';
import {
    buildRatingVotePayload,
    canSubmitPaidMoreAnswer,
    shouldAskPaidMoreThanContribution
} from '../utils/tripContributionOvercharge';
import { formatTripContributionPesosLabel } from '../utils/adminTripExcessContributionList';
import { getTripDestinationCity } from '../utils/ongoingTrip';
import AppButton from './ui/AppButton.vue';
import AppTextarea from './ui/AppTextarea.vue';

export default {
    name: 'rate-pending',

    components: {
        AppButton,
        AppTextarea
    },

    data() {
        return {
            ACCEPTED: 1,
            CANCELED: 3,
            DRIVER: 0,
            PASSENGER: 1,
            vote: null,
            expanded: false,
            comment: '',
            paidMoreChoice: null,
            sending: false,
            neutralIconStyle: NEUTRAL_RATING_ICON_STYLE
        };
    },

    methods: {
        dayjs,
        getTripDestinationCity,
        ...mapActions(useRatesStore, {
            emit: 'vote'
        }),

        setRate(value) {
            if (this.vote === value) {
                this.vote = null;
                this.expanded = false;
                this.paidMoreChoice = null;
            } else {
                this.vote = value;
                this.expanded = true;
            }
        },

        makeVote() {
            this.sending = true;
            const votePayload = buildRatingVotePayload({
                comment: this.comment,
                rating: this.vote,
                paidMore: this.paidMore,
                includePaidMore: this.shouldAskPaidMore
            });
            let data = {
                id: this.rate.id,
                trip_id: this.trip.id,
                user_id: this.to.id,
                trip: this.rate.trip,
                ...votePayload
            };
            if (!canSubmitRatingVote(this.vote, this.comment)) {
                dialogs.message(
                    this.$t(getRequiredCommentMessageKey(this.vote)),
                    { duration: 10, estado: 'error' }
                );
                this.sending = false;
                return;
            }
            if (!canSubmitPaidMoreAnswer(this.shouldAskPaidMore, this.paidMore)) {
                dialogs.message(this.$t('ratePendingPaidMoreRequired'), {
                    duration: 10,
                    estado: 'error'
                });
                this.sending = false;
                return;
            }

            console.log('emit rated');
            this.$emit('rated', data);
            this.emit(data)
                .then(() => {
                    this.comment = '';
                    this.paidMoreChoice = null;
                    this.sending = false;
                })
                .catch(() => {
                    this.sending = false;
                });
        }
    },

    computed: {
        ...mapState(useAuthStore, {
            user: 'user'
        }),

        to() {
            return this.rate.to;
        },

        trip() {
            return this.rate.trip;
        },

        shouldAskPaidMore() {
            return shouldAskPaidMoreThanContribution({
                userToType: this.rate.user_to_type,
                seatPriceCents: this.trip && this.trip.seat_price_cents
            });
        },

        paidMore() {
            if (this.paidMoreChoice === 'yes') {
                return true;
            }
            if (this.paidMoreChoice === 'no') {
                return false;
            }
            return null;
        },

        paidMoreAmountLabel() {
            return formatTripContributionPesosLabel(
                this.trip && this.trip.seat_price_cents
            );
        }
    },

    props: ['rate']
};
</script>
<style scoped>
.rate-pending-paid-more-question {
    font-weight: 700;
    font-size: 1.125rem;
    margin-bottom: 0.35em;
}

.rate-pending-paid-more-options {
    display: flex;
    gap: 2.5rem;
}

.rate-pending-paid-more-option {
    display: inline-flex;
    align-items: center;
    gap: 0.4em;
    cursor: pointer;
}

.rate-pending-paid-more-legend {
    font-style: italic;
    color: #888;
    margin-top: 0.35em;
}
</style>
