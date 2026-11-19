<template>
    <div
        v-if="showAsMember"
        class="un-litro-page-club-card"
        data-testid="un-litro-page-club-member"
    >
        <img
            :src="clubBadgeUrl"
            :alt="$t('miembroClubCarpoolearTitulo')"
            class="un-litro-page-club-card__badge"
            width="28"
            height="28"
        />
        <div class="un-litro-page-club-card__copy">
            <p class="un-litro-page-club-card__title">
                {{ $t('unLitroClubExemptTitle') }}
            </p>
            <p class="un-litro-page-club-card__thanks">
                {{ $t('unLitroClubExemptThanks') }}
            </p>
        </div>
    </div>
    <router-link
        v-else
        :to="{ name: 'donate' }"
        class="un-litro-page-club-card un-litro-page-club-card--link"
        data-testid="un-litro-page-club-join"
    >
        <img
            :src="clubBadgeUrl"
            :alt="$t('miembroClubCarpoolearTitulo')"
            class="un-litro-page-club-card__badge"
            width="28"
            height="28"
        />
        <p class="un-litro-page-club-card__title">
            {{ $t('unLitroClubMemberPromo') }}
        </p>
    </router-link>
</template>

<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { isActiveClubCarpoolearMember } from '../../utils/clubCarpoolearMember.js';

export default {
    name: 'un-litro-club-page-promo-card',

    props: {
        clubMemberExempt: {
            type: Boolean,
            default: null
        }
    },

    computed: {
        ...mapState(useAuthStore, {
            user: 'user'
        }),

        showAsMember() {
            if (this.clubMemberExempt !== null) {
                return this.clubMemberExempt;
            }

            return isActiveClubCarpoolearMember(this.user);
        },

        clubBadgeUrl() {
            return process.env.ROUTE_BASE + 'img/badges/club-carpoolear.png';
        }
    }
};
</script>

<style scoped>
.un-litro-page-club-card {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin-top: 1.25rem;
    padding: 1.2rem 1.35rem;
    border-radius: 0.75rem;
    background: #fef5f6;
    color: #ce0f2c;
    line-height: 1.4;
}

.un-litro-page-club-card--link {
    text-decoration: none;
    font-weight: 700;
    transition: background 0.15s ease;
}

.un-litro-page-club-card--link:hover,
.un-litro-page-club-card--link:focus,
.un-litro-page-club-card--link:focus-visible {
    color: #ce0f2c;
    background: #fde8eb;
    text-decoration: none;
}

.un-litro-page-club-card__badge {
    display: block;
    flex: 0 0 auto;
    width: 28px;
    height: 28px;
}

.un-litro-page-club-card__copy {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;
}

.un-litro-page-club-card__title {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    line-height: 1.35;
}

.un-litro-page-club-card--link .un-litro-page-club-card__title {
    font-size: 1.2rem;
    line-height: 1.3;
}

.un-litro-page-club-card__thanks {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.35;
}
</style>