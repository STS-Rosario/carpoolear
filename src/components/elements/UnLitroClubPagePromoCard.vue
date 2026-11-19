<template>
    <div
        v-if="showAsMember"
        class="un-litro-card un-litro-card--large"
        data-testid="un-litro-page-club-card"
    >
        <div class="un-litro-card__icon" aria-hidden="true">
            <i class="fa fa-tint"></i>
        </div>
        <div class="un-litro-card__content">
            <h4 class="un-litro-card__title">
                {{ $t('unLitroClubExemptTitle') }}
            </h4>
            <div class="un-litro-card__actions">
                <div
                    class="un-litro-card__club-promo"
                    data-testid="un-litro-club-thanks"
                >
                    <img
                        :src="clubBadgeUrl"
                        :alt="$t('miembroClubCarpoolearTitulo')"
                        class="un-litro-card__club-badge"
                        width="24"
                        height="24"
                    />
                    <span>{{ $t('unLitroClubExemptThanks') }}</span>
                </div>
            </div>
        </div>
    </div>
    <div
        v-else
        class="un-litro-page-club-join"
        data-testid="un-litro-page-club-join"
    >
        <router-link
            :to="{ name: 'donate' }"
            class="un-litro-card__club-promo un-litro-card__club-promo--page-large"
            data-testid="un-litro-club-promo"
        >
            <img
                :src="clubBadgeUrl"
                :alt="$t('miembroClubCarpoolearTitulo')"
                class="un-litro-card__club-badge"
                width="24"
                height="24"
            />
            <span>{{ $t('unLitroClubMemberPromo') }}</span>
        </router-link>
    </div>
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
.un-litro-card {
    display: flex;
    gap: 0.75rem;
    margin: 0 0 1rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background: #e8f2fb;
    color: #22211f;
}

.un-litro-card__icon {
    flex: 0 0 auto;
    color: var(--ds-action, #1e5f9e);
    font-size: 1.15rem;
    line-height: 1.4;
}

.un-litro-card__content {
    min-width: 0;
    flex: 1;
}

.un-litro-card__title {
    margin: 0 0 0.4rem;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
}

.un-litro-card__actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.un-litro-card__club-promo {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-top: 0.65rem;
    align-self: center;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    background: #fef5f6;
    color: #ce0f2c;
    font-size: 0.85rem;
    font-weight: 700;
    line-height: 1.35;
    text-decoration: none;
}

.un-litro-card__club-promo:hover,
.un-litro-card__club-promo:focus,
.un-litro-card__club-promo:focus-visible {
    color: #ce0f2c;
    background: #fde8eb;
    text-decoration: none;
}

.un-litro-card__club-badge {
    display: block;
    flex-shrink: 0;
}

.un-litro-card--large {
    margin-top: 1.25rem;
    padding: 1.35rem 1.5rem;
    gap: 1rem;
}

.un-litro-card--large .un-litro-card__icon {
    font-size: 1.45rem;
}

.un-litro-card--large .un-litro-card__title {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
}

.un-litro-card--large .un-litro-card__club-promo {
    margin-top: 0.25rem;
    padding: 0.55rem 1rem;
    font-size: 1rem;
}

.un-litro-card--large .un-litro-card__club-badge {
    width: 24px;
    height: 24px;
}

.un-litro-page-club-join {
    margin-top: 1.25rem;
}

.un-litro-card__club-promo--page-large {
    margin-top: 0;
    align-self: flex-start;
    padding: 0.6rem 1.05rem;
    font-size: 1rem;
}

@media (min-width: 768px) {
    .un-litro-card__actions {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.75rem 1rem;
    }

    .un-litro-card__club-promo {
        margin-top: 0;
        align-self: auto;
    }
}
</style>