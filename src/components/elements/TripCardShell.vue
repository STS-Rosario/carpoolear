<template>
    <div
        class="trip-card-shell"
        :class="{ 'trip-card-shell--no-driver': !user }"
        @click="onRootClick"
    >        <div class="trip-card-shell__header">
            <div
                v-if="user"
                class="trip-card-shell__driver"
                @click.stop="onProfileClick"
            >
                <div
                    class="trip-card-shell__avatar circle-box"
                    v-imgSrc:profile="avatarImage"
                ></div>
                <div class="trip-card-shell__copy">
                    <div class="trip-card-shell__primary">
                        <div class="trip-card-shell__name">
                            {{ user.name }}
                        </div>
                        <div
                            v-if="showSeatsPill"
                            class="trip-card-shell__seats"
                            :class="'trip-card-shell__seats--' + seatsTone"
                        >
                            <i class="fa fa-user" aria-hidden="true"></i>
                            {{ seatsLabel }}
                        </div>
                    </div>
                    <div class="trip-card-shell__meta">
                        <UserRatingsCounts :ratings="ratings" />
                        <span v-if="tripsCountLabel" class="trip-card-shell__trips">
                            | {{ tripsCountLabel }}
                        </span>
                        <span
                            v-if="isDriverVerified"
                            class="trip-card-shell__verified"
                            :title="$t('usuarioVerificado')"
                            :aria-label="$t('usuarioVerificado')"
                        >
                            <i class="fa fa-shield" aria-hidden="true"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div
                v-else-if="showSeatsPill"
                class="trip-card-shell__seats"
                :class="'trip-card-shell__seats--' + seatsTone"
            >
                <i class="fa fa-user" aria-hidden="true"></i>
                {{ seatsLabel }}
            </div>
        </div>

        <div class="trip-card-shell__divider" aria-hidden="true"></div>

        <div class="trip-card-shell__body">
            <div class="trip-card-shell__route">
                <div class="trip-card-shell__route-graphic">
                    <span class="trip-card-shell__route-marker"></span>
                </div>
                <div class="trip-card-shell__route-content">
                    <div class="trip-card-shell__endpoint">
                        <span class="trip-card-shell__city">{{ fromCity }}</span>
                        <span v-if="fromRegion" class="trip-card-shell__region">{{
                            fromRegion
                        }}</span>
                        <span v-if="fromPoint" class="trip-card-shell__point">{{
                            fromPoint
                        }}</span>
                    </div>
                    <div class="trip-card-shell__endpoint">
                        <span class="trip-card-shell__city">{{ toCity }}</span>
                        <span v-if="toRegion" class="trip-card-shell__region">{{
                            toRegion
                        }}</span>
                        <span v-if="toPoint" class="trip-card-shell__point">{{
                            toPoint
                        }}</span>
                    </div>
                </div>
            </div>
            <div v-if="dateLabel || timeLabel" class="trip-card-shell__schedule">
                <div v-if="dateLabel" class="trip-card-shell__chip">
                    <i class="fa fa-calendar" aria-hidden="true"></i>
                    {{ dateLabel }}
                </div>
                <div v-if="timeLabel" class="trip-card-shell__chip">
                    <i class="fa fa-clock-o" aria-hidden="true"></i>
                    {{ timeLabel }}
                </div>
            </div>
        </div>

        <slot name="body-extra" />

        <div class="trip-card-shell__divider" aria-hidden="true"></div>

        <div class="trip-card-shell__footer">
            <slot name="actions-extra" />
            <button
                type="button"
                class="trip-card-shell__detail"
                @click.stop="onDetailClick"
            >
                {{ $t('verDetalle') }}
            </button>
            <slot name="footer-extra" />
        </div>
    </div>
</template>

<script>
import { getSeatsPillTone, getSeatsPillLabel } from '../../utils/tripCardDisplay.js';
import UserRatingsCounts from './UserRatingsCounts.vue';

export default {
    name: 'TripCardShell',
    props: {
        user: {
            type: Object,
            default: null
        },
        ratings: {
            type: Object,
            default: null
        },
        tripsCountLabel: {
            type: String,
            default: ''
        },
        seatsAvailable: {
            type: Number,
            default: 0
        },
        fromCity: {
            type: String,
            default: ''
        },
        fromRegion: {
            type: String,
            default: ''
        },
        fromPoint: {
            type: String,
            default: ''
        },
        toCity: {
            type: String,
            default: ''
        },
        toRegion: {
            type: String,
            default: ''
        },
        toPoint: {
            type: String,
            default: ''
        },
        dateLabel: {
            type: String,
            default: ''
        },
        timeLabel: {
            type: String,
            default: ''
        },
        showSeatsPill: {
            type: Boolean,
            default: true
        }
    },
    emits: ['profile-click', 'detail-click'],
    computed: {
        avatarImage() {
            return this.user && this.user.image ? this.user.image : '';
        },
        seatsTone() {
            return getSeatsPillTone(this.seatsAvailable);
        },
        seatsLabel() {
            return getSeatsPillLabel(this.seatsAvailable, this.$t);
        },
        isDriverVerified() {
            return !!(
                this.user &&
                (this.user.identity_validated || this.user.identity_validated_at)
            );
        }
    },
    methods: {
        onRootClick(event) {
            this.$emit('detail-click', event);
        },
        onProfileClick(event) {
            this.$emit('profile-click', event);
        },
        onDetailClick(event) {
            this.$emit('detail-click', event);
        }
    },
    components: {
        UserRatingsCounts
    }
};
</script>
