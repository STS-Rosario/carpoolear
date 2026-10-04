<template>
    <div
        class="un-litro-card"
        :class="{ 'un-litro-card--link-only': linkOnly }"
        data-testid="un-litro-info-card"
    >
        <div v-if="!linkOnly" class="un-litro-card__icon" aria-hidden="true">
            <i class="fa fa-tint"></i>
        </div>
        <div class="un-litro-card__content">
            <template v-if="!linkOnly && charged">
                <h4 class="un-litro-card__title">
                    {{ $t('unLitroAppliesTitle') }}
                </h4>
                <p class="un-litro-card__body">{{ $t('unLitroAppliesBody') }}</p>
            </template>
            <template v-else-if="!linkOnly">
                <span class="un-litro-card__badge">
                    <i class="fa fa-check" aria-hidden="true"></i>
                    {{ $t('unLitroBonificadoBadge') }}
                </span>
                <h4 class="un-litro-card__title">
                    {{ $t('unLitroBonificadoTitle') }}
                </h4>
                <p v-if="remainingFreeTrips > 0" class="un-litro-card__body">
                    {{ remainingMessage }}
                </p>
            </template>
            <button
                type="button"
                class="un-litro-card__link"
                data-testid="un-litro-what-is-this"
                @click="showModal = true"
            >
                {{ $t('unLitroWhatIsThis') }}
            </button>
        </div>
        <modal v-if="showModal" name="un-litro-what-is" @close="showModal = false">
            <template #header>
                <h3 data-testid="un-litro-modal">{{ $t('unLitroModalTitle') }}</h3>
            </template>
            <template #body>
                <div class="un-litro-card__modal text-left color-black">
                    <p>{{ $t('unLitroModalBody1') }}</p>
                    <p>{{ $t('unLitroModalBody2') }}</p>
                    <p>{{ $t('unLitroModalBody3') }}</p>
                    <p>
                        {{
                            $t('unLitroModalBody4', {
                                freeTrips: freeTripsAmount
                            })
                        }}
                    </p>
                </div>
            </template>
            <template #footer>
                <AppButton variant="secondary" @click="showModal = false">
                    {{ $t('cerrar') }}
                </AppButton>
            </template>
        </modal>
    </div>
</template>

<script>
import modal from '../Modal';
import AppButton from '../ui/AppButton.vue';

export default {
    name: 'un-litro-info-card',

    components: {
        modal,
        AppButton
    },

    props: {
        charged: {
            type: Boolean,
            default: false
        },
        remainingFreeTrips: {
            type: Number,
            default: 0
        },
        freeTripsAmount: {
            type: Number,
            default: 0
        },
        linkOnly: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            showModal: false
        };
    },

    computed: {
        remainingMessage() {
            const key =
                this.remainingFreeTrips === 1
                    ? 'unLitroBonificadoRemainingSingular'
                    : 'unLitroBonificadoRemainingPlural';
            return this.$t(key, { remaining: this.remainingFreeTrips });
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

.un-litro-card__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin-bottom: 0.4rem;
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
    background: #d9f4e3;
    color: #1f7a46;
    font-size: 0.8rem;
    font-weight: 700;
}

.un-litro-card__title {
    margin: 0 0 0.4rem;
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
}

.un-litro-card__body {
    margin: 0 0 0.55rem;
    color: #404040;
    line-height: 1.45;
}

.un-litro-card__link {
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--ds-action, #1e5f9e);
    font: inherit;
    font-weight: 700;
    text-decoration: underline;
    cursor: pointer;
}

.un-litro-card__modal p {
    margin: 0 0 0.85rem;
    line-height: 1.45;
}

.un-litro-card--link-only {
    display: inline;
    margin: 0;
    padding: 0;
    background: transparent;
}

.un-litro-card--link-only .un-litro-card__content {
    display: inline;
}
</style>
