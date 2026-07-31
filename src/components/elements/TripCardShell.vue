<template>
    <div class="trip-card-shell" @click="onRootClick">
        <div class="trip-card-shell__header">
            <div
                v-if="user"
                class="trip-card-shell__driver"
                @click.stop="onProfileClick"
            >
                <div
                    class="trip-card-shell__avatar circle-box"
                    v-imgSrc:profile="user.image"
                ></div>
                <div class="trip-card-shell__driver-info">
                    <div class="trip-card-shell__name">
                        <UserNameWithBadge :user="user" />
                    </div>
                    <div class="trip-card-shell__meta">
                        <UserRatingsCounts :ratings="ratings" />
                        <span v-if="tripsCountLabel" class="trip-card-shell__trips">
                            | {{ tripsCountLabel }}
                        </span>
                    </div>
                </div>
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

        <div class="trip-card-shell__divider" aria-hidden="true"></div>

        <div class="trip-card-shell__body">
            <div class="trip-card-shell__route">
                <div class="trip-card-shell__route-graphic">
                    <span class="trip-card-shell__route-marker"></span>
                </div>
                <div class="trip-card-shell__route-content">
                    <div class="trip-card-shell__endpoint">
                        <span class="trip-card-shell__city">{{ fromCity }}</span>
                        <span v-if="fromPoint" class="trip-card-shell__point">{{
                            fromPoint
                        }}</span>
                    </div>
                    <div class="trip-card-shell__endpoint">
                        <span class="trip-card-shell__city">{{ toCity }}</span>
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
import UserNameWithBadge from './UserNameWithBadge.vue';
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
        fromPoint: {
            type: String,
            default: ''
        },
        toCity: {
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
        seatsTone() {
            return getSeatsPillTone(this.seatsAvailable);
        },
        seatsLabel() {
            return getSeatsPillLabel(this.seatsAvailable, this.$t);
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
        UserNameWithBadge,
        UserRatingsCounts
    }
};
</script>
