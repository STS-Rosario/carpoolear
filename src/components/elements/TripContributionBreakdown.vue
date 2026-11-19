<template>
    <div class="trip-contribution-breakdown" v-if="lines">
        <dl class="trip-contribution-breakdown__table">
            <div class="trip-contribution-breakdown__row">
                <dt>
                    {{
                        $t('tripContributionBreakdownFuel', {
                            liters: lines.liters
                        })
                    }}
                    <span
                        class="trip-contribution-breakdown__info tooltip-bottom"
                        :data-tooltip="
                            $t('tripContributionBreakdownConsumptionTooltip', {
                                kmPerLiter: lines.kmPerLiter,
                                litersPer100km: lines.litersPer100Km
                            })
                        "
                        @click.stop
                    >
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                </dt>
                <dd>${{ lines.fuelCostInteger }}</dd>
            </div>
            <div
                v-if="fuelProfileLabel"
                class="trip-contribution-breakdown__row trip-contribution-breakdown__fuel-profile"
            >
                <dt>{{ fuelProfileLabel }}</dt>
            </div>
            <div
                v-if="showFuelAbuseReport && fuelAbuseRoute"
                class="trip-contribution-breakdown__row trip-contribution-breakdown__fuel-abuse"
            >
                <dt>
                    <router-link :to="fuelAbuseRoute">
                        {{ $t('fuelAbuseReportLink') }}
                    </router-link>
                    <span
                        class="trip-contribution-breakdown__info tooltip-bottom"
                        :data-tooltip="$t('fuelAbuseReportTooltip')"
                        @click.stop
                    >
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                    </span>
                </dt>
            </div>
            <div class="trip-contribution-breakdown__row">
                <dt>
                    {{
                        $t('tripContributionBreakdownTollsLabel', {
                            percent: lines.tollsPercent
                        })
                    }}
                </dt>
                <dd>${{ lines.tollsCostInteger }}</dd>
            </div>
            <div
                v-if="lines.showSellado"
                class="trip-contribution-breakdown__row"
            >
                <dt>
                    <i class="fa fa-tint" aria-hidden="true"></i>
                    {{ $t('unLitroName') }}
                </dt>
                <dd v-if="lines.selladoBonificado">
                    {{ $t('tripContributionBreakdownSelladoBonificado') }}
                </dd>
                <dd v-else>${{ lines.selladoCostInteger }}</dd>
            </div>
            <div
                class="trip-contribution-breakdown__row trip-contribution-breakdown__row--total"
            >
                <dt>{{ $t('tripContributionBreakdownTripTotal') }}</dt>
                <dd>${{ lines.totalInteger }}</dd>
            </div>
            <div class="trip-contribution-breakdown__row">
                <dt>
                    {{
                        $t('tripContributionBreakdownOccupantsSplit', {
                            count: lines.occupants
                        })
                    }}
                </dt>
                <dd>÷ {{ lines.occupants }}</dd>
            </div>
            <div
                class="trip-contribution-breakdown__row trip-contribution-breakdown__row--person"
            >
                <dt>{{ $t('tripContributionBreakdownPerPersonLabel') }}</dt>
                <dd>${{ lines.perPersonInteger }}</dd>
            </div>
        </dl>

        <p class="trip-contribution-breakdown__explainer">
            {{
                $t(
                    lines.showSellado
                        ? 'tripContributionHowCalculatedExplainer'
                        : 'tripContributionHowCalculatedExplainerWithoutUnLitro'
                )
            }}
        </p>
        <p class="trip-contribution-breakdown__explainer">
            {{ $t('tripContributionTankTip') }}
        </p>
    </div>
</template>

<script>
import { formatBreakdownLines } from '../../utils/tripContributionBreakdown.js';
import {
    fuelConsumptionI18nKey,
    fuelConsumptionRateLabel,
    fuelTypeI18nKey,
    hasCarFuelProfile
} from '../../utils/carFields.js';

export default {
    name: 'trip-contribution-breakdown',

    props: {
        breakdown: {
            type: Object,
            default: null
        },
        fuelProfile: {
            type: Object,
            default: null
        },
        showFuelAbuseReport: {
            type: Boolean,
            default: false
        },
        fuelAbuseRoute: {
            type: Object,
            default: null
        }
    },

    computed: {
        lines() {
            if (!this.breakdown) {
                return null;
            }
            return formatBreakdownLines(this.breakdown);
        },
        fuelProfileLabel() {
            if (!hasCarFuelProfile(this.fuelProfile)) {
                return '';
            }

            const { fuel_type: type, fuel_consumption: level } =
                this.fuelProfile;

            return this.$t('tripContributionBreakdownFuelProfile', {
                type: this.$t(fuelTypeI18nKey(type)),
                consumption: this.$t(fuelConsumptionI18nKey(level)),
                rate: fuelConsumptionRateLabel(type, level)
            });
        }
    }
};
</script>

<style scoped>
.trip-contribution-breakdown {
    margin: 0;
    color: var(--ds-text-primary, #22211f);
}

.trip-contribution-breakdown__info {
    display: inline-flex;
    margin-left: 0.25rem;
    color: var(--ds-action, #1e5f9e);
    cursor: help;
}

.trip-contribution-breakdown__table {
    margin: 0 0 1rem;
}

.trip-contribution-breakdown__row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.35rem 0;
}

.trip-contribution-breakdown__row dt {
    font-weight: 400;
}

.trip-contribution-breakdown__row dd {
    margin: 0;
    font-weight: 600;
    white-space: nowrap;
}

.trip-contribution-breakdown__row--total,
.trip-contribution-breakdown__row--person {
    border-top: 1px solid #d7e3ef;
    font-weight: 700;
}

.trip-contribution-breakdown__row--total dt,
.trip-contribution-breakdown__row--person dt,
.trip-contribution-breakdown__row--total dd,
.trip-contribution-breakdown__row--person dd {
    font-weight: 700;
}

.trip-contribution-breakdown__explainer {
    margin: 0 0 0.75rem;
    line-height: 1.45;
    color: #404040;
}
</style>
