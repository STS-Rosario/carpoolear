<template>
    <table class="table table-bordered ivr-outcomes-table">
        <thead>
            <tr>
                <th scope="col">{{ $t('adminIvrResultado') }}</th>
                <th scope="col" class="ivr-num">{{ $t('adminIvrCantidad') }}</th>
                <th scope="col" class="ivr-num">{{ $t('adminIvrPorcentaje') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in rows" :key="row.key" :data-outcome="row.key">
                <th scope="row">{{ $t(row.labelKey) }}</th>
                <td class="ivr-num">{{ row.count }}</td>
                <td class="ivr-num">{{ formatPct(row.pct) }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { formatPct } from '../../utils/identityVerificationReportData';

/** Outcome rows ({ key, labelKey, count, pct }) of one verification method. */
export default {
    name: 'identity-verification-outcome-table',
    props: {
        rows: {
            type: Array,
            required: true
        }
    },
    methods: {
        formatPct
    }
};
</script>

<style scoped>
.ivr-num {
    text-align: right;
    white-space: nowrap;
}
</style>
