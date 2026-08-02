import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'CoordinateTrip.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('CoordinateTrip.vue', () => {
    it('renders a collapsed trip description toggle after the trip summary', () => {
        expect(viewSource).toContain("$t('coordinateTripMostrarDescripcionViaje')");
        expect(viewSource).toContain('showTripDescription');
        expect(viewSource).toMatch(
            /<div class="trip_actions-detail">[\s\S]*?<\/div>\s*<div[\s\S]*?class="trip_actions-description"/s
        );
        expect(viewSource).toMatch(
            /v-if="conversation\.trip\.description"/
        );
        expect(viewSource).toMatch(
            /v-show="showTripDescription"[\s\S]*conversation\.trip\.description/s
        );
    });

    it('uses optional amountPart so zero-price trips omit currency in driver and passenger copy', () => {
        expect(viewSource).toContain('getContributionWarningAmountPart');
        expect(viewSource).toMatch(
            /\$t\(\s*'coordinateTripContributionWarningDriver'\s*,\s*\{[\s\S]*?\bamountPart\b/s
        );
        expect(viewSource).toMatch(
            /\$t\(\s*'coordinateTripContributionWarningPassengerPrefix'\s*,\s*\{[\s\S]*?\bamountPart\b/s
        );
    });

    it('links passenger report action to a prefilled denuncia ticket', () => {
        expect(viewSource).toContain("$t('coordinateTripContributionWarningPassengerPrefix'");
        expect(viewSource).toContain("$t('coordinateTripContributionWarningPassengerSuffix')");
        expect(viewSource).toContain("from '../../utils/supportTicketTripReport.js'");
        expect(viewSource).toContain('buildTripReportSupportTicketRoute');
        expect(viewSource).toContain('reportSupportTicketRoute');
        expect(viewSource).toMatch(
            /<router-link\s+:to="reportSupportTicketRoute">\s*\{\{\s*\$t\('coordinateTripContributionWarningPassengerReportLink'\)\s*\}\}\s*<\/router-link>/
        );
    });

    it('keeps trip info visible in group chat but hides seat request actions', () => {
        expect(viewSource).toContain('isTripGroupConversation');
        expect(viewSource).toMatch(
            /v-if="conversation && conversation\.trip"/
        );
        expect(viewSource).toMatch(
            /v-if="!owner && !isTripGroupConversation\(conversation\)"/
        );
        expect(viewSource).toMatch(
            /v-if="conversation\.return_trip && !isTripGroupConversation\(conversation\)"/
        );
    });

    it('uses danger AppButton for Retirar solicitud without uppercase', () => {
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toContain("$t('retirarSolicitudDeAsiento')");
        expect(viewSource).toMatch(
            /outboundSeatActionVariant[\s\S]*danger/
        );
        expect(viewSource).toMatch(
            /:variant="outboundSeatActionVariant"/
        );
        expect(viewSource).toMatch(
            /\.trip_actions\s+\.app-button[\s\S]*?text-transform:\s*none/s
        );
        expect(viewSource).not.toMatch(
            /class="btn btn-primary"[\s\S]*?retirarSolicitudDeAsiento/
        );
    });

    it('keeps a space before the trip date on seat action buttons', () => {
        expect(viewSource).toMatch(
            /\{\{\s*' '\s*\}\}[\s\S]*?\(\{\{[\s\S]*?conversation\.trip\.trip_date/
        );
        expect(viewSource).toMatch(
            /\{\{\s*' '\s*\}\}[\s\S]*?\(\{\{[\s\S]*?conversation\.return_trip\.trip_date/
        );
    });

    it('styles seat request buttons with design-system primary action blue', () => {
        expect(viewSource).toMatch(
            /\.trip_actions\s+\.app-button--primary\s*\{[^}]*background:\s*var\(--ds-action\)|AppButton/
        );
    });
});
