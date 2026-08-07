<template>
    <div v-if="profile" class="profile-identity-header">
        <div
            class="circle-box profile profile-identity-header__avatar"
            v-imgSrc:profile="profile.image"
        ></div>
        <div class="profile-identity-header__body">
            <div class="profile-identity-header__name-row">
                <h1 class="profile-identity-header__name">
                    {{ profile.name }}
                </h1>
                <span
                    v-if="isVerified"
                    class="profile-identity-header__verified"
                >
                    <i class="fa fa-check" aria-hidden="true"></i>
                    {{ $t('usuarioVerificado') }}
                </span>
            </div>
            <div class="profile-identity-header__stats">
                <span v-if="memberSinceLabel">{{ memberSinceLabel }}</span>
                <span class="profile-identity-header__ratings">
                    <UserRatingsCounts :ratings="profileRatings" />
                </span>
                <span
                    v-if="tripsLabel"
                    class="profile-identity-header__stats-sep"
                    aria-hidden="true"
                    >|</span
                >
                <span v-if="tripsLabel">{{ tripsLabel }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import UserRatingsCounts from './UserRatingsCounts.vue';
import {
    getMembershipDuration,
    normalizeTripsCount
} from '../../utils/profileMemberStats.js';
import { userRatingsFromProfile } from '../../utils/tripRating';

export default {
    name: 'ProfileIdentityHeader',
    components: {
        UserRatingsCounts
    },
    props: {
        profile: {
            type: Object,
            default: null
        }
    },
    computed: {
        isVerified() {
            return !!(
                this.profile &&
                (this.profile.identity_validated ||
                    this.profile.identity_validated_at)
            );
        },
        profileRatings() {
            return userRatingsFromProfile(this.profile);
        },
        memberSinceLabel() {
            const duration = getMembershipDuration(this.profile?.created_at);
            if (!duration) {
                return '';
            }
            if (duration.unit === 'years') {
                return duration.count === 1
                    ? this.$t('miembroHaceUnAnio')
                    : this.$t('miembroHaceAnios', { count: duration.count });
            }
            if (duration.unit === 'months') {
                return duration.count === 1
                    ? this.$t('miembroHaceUnMes')
                    : this.$t('miembroHaceMeses', { count: duration.count });
            }
            return duration.count === 1
                ? this.$t('miembroHaceUnDia')
                : this.$t('miembroHaceDias', { count: duration.count });
        },
        tripsLabel() {
            if (!this.profile || this.profile.trips_count == null) {
                return '';
            }
            return this.$t('perfilViajesParticipados', {
                count: normalizeTripsCount(this.profile.trips_count)
            });
        }
    }
};
</script>
