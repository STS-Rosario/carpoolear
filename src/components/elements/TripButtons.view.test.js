import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'TripButtons.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('TripButtons.vue group chat', () => {
    it('keeps private message button and adds group chat button with unread badge', () => {
        expect(viewSource).toContain("$emit('toMessages')");
        expect(viewSource).toContain("$emit('toGroupChat')");
        expect(viewSource).toContain("$t('enviarMensaje')");
        expect(viewSource).toContain("$t('groupChatButton')");
        expect(viewSource).toContain('group_chat_unread_count');
        expect(viewSource).toContain('showGroupChatButton');
        expect(viewSource).toContain('group_chat_conversation_id');
    });
});

describe('TripButtons.vue message/request hierarchy', () => {
    it('marks solicitar asiento secondary when both CTAs can show', () => {
        expect(viewSource).toContain('trip-detail__cta-secondary');
        expect(viewSource).toMatch(
            /trip-detail__cta-secondary[\s\S]*?showMessageButton|showMessageButton[\s\S]*?trip-detail__cta-secondary/
        );
    });

    it('only marks solicitar/reservar secondary when the message CTA is also visible', () => {
        expect(viewSource).toContain('trip-detail__cta-secondary');
        expect(viewSource).toContain('showMessageButton');
        expect(viewSource).toMatch(
            /:variant="showMessageButton \? 'secondary' : 'primary'"/
        );
        expect(viewSource).toMatch(/v-if="showMessageButton"/);
    });

    it('uses AppButton primary for Enviar mensaje', () => {
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toContain('variant="primary"');
        expect(viewSource).toContain("$emit('toMessages')");
        expect(viewSource).toContain("$t('enviarMensaje')");
    });
});

describe('TripButtons.vue seat request limit', () => {
    it('disables message and request actions and shows passenger limit message', () => {
        expect(viewSource).toContain('shouldShowPassengerSeatRequestLimitMessage');
        expect(viewSource).toContain('seatRequestLimitReached');
        expect(viewSource).toContain("$t('tripSeatRequestLimitPassengerMessage'");
        expect(viewSource).toContain('seat_request_limit');
        expect(viewSource).toMatch(
            /:disabled="[^"]*seatRequestLimitReached/
        );
    });
});

describe('TripButtons.vue owner actions', () => {
    it('uses AppButton primary for Editar viaje and tertiary destructive for Cancelar viaje', () => {
        expect(viewSource).toContain("$t('editarViaje')");
        expect(viewSource).toContain("$t('cancelarViaje')");
        expect(viewSource).toMatch(
            /variant="primary"[\s\S]*?\$t\('editarViaje'\)/
        );
        expect(viewSource).toMatch(
            /variant="tertiary"[\s\S]*?tone="destructive"[\s\S]*?\$t\('cancelarViaje'\)/
        );
        expect(viewSource).not.toMatch(
            /class="btn btn-primary"[\s\S]*?\$t\('editar'\)/
        );
        expect(viewSource).not.toMatch(
            /class="btn btn-primary"[\s\S]*?\$t\('cancelarViaje'\)/
        );
    });

    it('does not render the red Viaje carpooleado status CTA', () => {
        expect(viewSource).not.toContain('carpooled-trip');
        expect(viewSource).not.toContain("$t('viajeCarpooleado')");
    });

    it('stacks owner Edit above Cancel in a column at all breakpoints', () => {
        expect(viewSource).toMatch(
            /\.buttons-container\s*\{[^}]*display:\s*flex[^}]*flex-direction:\s*column/
        );
        expect(viewSource).not.toMatch(
            /@media only screen and \(min-width: 768px\)\s*\{\s*\.buttons-container button:first-child\s*\{[^}]*margin-right:\s*1em/
        );
        const editIdx = viewSource.indexOf("$t('editarViaje')");
        const cancelIdx = viewSource.indexOf("$t('cancelarViaje')");
        expect(editIdx).toBeGreaterThan(-1);
        expect(cancelIdx).toBeGreaterThan(editIdx);
    });
});
