<template>
    <div class="trip-contribution-breakdown" v-if="lines">
        <ul class="trip-contribution-breakdown__details">
            <li>
                {{
                    $t('tripContributionBreakdownFuelLiter', {
                        amount: lines.fuelPricePerLiter
                    })
                }}
            </li>
            <li>
                {{
                    $t('tripContributionBreakdownLiters', {
                        liters: lines.liters,
                        km: lines.distanceKm
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
            </li>
            <li>
                {{
                    $t('tripContributionBreakdownFuelCost', {
                        pricePerLiter: lines.fuelPricePerLiter,
                        liters: lines.liters,
                        amount: lines.fuelCost
                    })
                }}
            </li>
            <li>
                {{
                    $t('tripContributionBreakdownTolls', {
                        amount: lines.tollsCost,
                        percent: lines.tollsPercent
                    })
                }}
            </li>
            <li v-if="lines.showSellado">
                <template v-if="lines.selladoBonificado">
                    {{ $t('tripContributionBreakdownSellado').split(':')[0] }}:
                    {{ $t('tripContributionBreakdownSelladoBonificado') }}
                </template>
                <template v-else>
                    {{
                        $t('tripContributionBreakdownSellado', {
                            amount: lines.selladoCost
                        })
                    }}
                </template>
            </li>
            <li>
                <template v-if="!lines.showSellado">
                    {{
                        $t('tripContributionBreakdownTotal', {
                            fuel: lines.fuelCost,
                            tolls: lines.tollsCost
                        })
                    }}
                </template>
                <template v-else-if="lines.selladoBonificado">
                    {{
                        $t('tripContributionBreakdownTotalWithSelladoBonificado', {
                            fuel: lines.fuelCost,
                            tolls: lines.tollsCost,
                            sellado: $t('tripContributionBreakdownSelladoBonificado')
                        })
                    }}
                </template>
                <template v-else>
                    {{
                        $t('tripContributionBreakdownTotalWithSellado', {
                            fuel: lines.fuelCost,
                            tolls: lines.tollsCost,
                            sellado: lines.selladoCost
                        })
                    }}
                </template>
            </li>
            <li>
                {{
                    $t('tripContributionBreakdownOccupants', {
                        count: lines.occupants
                    })
                }}
            </li>
            <li>
                {{
                    $t('tripContributionBreakdownPerPerson', {
                        total: lines.total,
                        count: lines.occupants,
                        amount: lines.perPerson
                    })
                }}
            </li>
        </ul>

        <dl class="trip-contribution-breakdown__table">
            <div class="trip-contribution-breakdown__row">
                <dt>{{ $t('tripContributionBreakdownFuel') }}</dt>
                <dd>${{ lines.fuelCostInteger }}</dd>
            </div>
            <div class="trip-contribution-breakdown__row">
                <dt>{{ $t('tripContributionBreakdownTollsLabel') }}</dt>
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

export default {
    name: 'trip-contribution-breakdown',

    props: {
        breakdown: {
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
        }
    }
};
</script>

<style scoped>
.trip-contribution-breakdown {
    margin: 0;
    color: var(--ds-text-primary, #22211f);
}

.trip-contribution-breakdown__details {
    margin: 0 0 1rem;
    padding: 0;
    list-style: none;
    line-height: 1.55;
}

.trip-contribution-breakdown__details li + li {
    margin-top: 0.2rem;
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
