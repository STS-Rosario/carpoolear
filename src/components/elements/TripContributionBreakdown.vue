<template>
    <ul class="trip-contribution-breakdown" v-if="lines">
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
    padding: 0;
    list-style: none;
    line-height: 1.55;
    color: var(--ds-text-primary, #22211f);
}

.trip-contribution-breakdown li + li {
    margin-top: 0.2rem;
}

.trip-contribution-breakdown__info {
    display: inline-flex;
    margin-left: 0.25rem;
    color: var(--ds-action, #1e5f9e);
    cursor: help;
}
</style>
