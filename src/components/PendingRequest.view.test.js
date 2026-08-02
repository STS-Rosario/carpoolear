import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'PendingRequest.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('PendingRequest.vue design system migration', () => {
    it('uses DS card shell tokens instead of the old request-list card chrome', () => {
        expect(viewSource).toContain('pending-request-card');
        expect(viewSource).toMatch(
            /\.pending-request-card\s*\{[^}]*background:\s*var\(--ds-card-bg/s
        );
        expect(viewSource).toMatch(
            /\.pending-request-card\s*\{[^}]*border-radius:\s*var\(--ds-card-radius/s
        );
        expect(viewSource).toMatch(
            /\.pending-request-card\s*\{[^}]*box-shadow:\s*var\(--ds-card-shadow/s
        );
        expect(viewSource).not.toContain('col-md-16');
        expect(viewSource).not.toContain('col-lg-12');
        expect(viewSource).toMatch(
            /\.pending-request-card\s*\{[^}]*margin(?:-top)?:\s*0/s
        );
        expect(viewSource).toMatch(
            /\.pending-request-card\s*\{[^}]*width:\s*fit-content/s
        );
    });

    it('uses success Aceptar, danger Rechazar, and secondary Enviar mensaje AppButtons', () => {
        expect(viewSource).toContain(
            "import AppButton from './ui/AppButton.vue'"
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="success"[\s\S]*?pendingRequestAceptar[\s\S]*?<\/AppButton>/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?pendingRequestRechazar[\s\S]*?<\/AppButton>/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?pendingRequestEnviarMensaje[\s\S]*?<\/AppButton>/
        );
        expect(viewSource).not.toContain('btn-accept-request');
        expect(viewSource).not.toContain('btn btn-primary');
        expect(viewSource).not.toContain('btn btn-secondary');
    });

    it('keeps mobile pending-request actions in one compact equal-width row', () => {
        expect(viewSource).toMatch(
            /pending-request-card__actions[\s\S]*?variant="success"[\s\S]*?variant="danger"[\s\S]*?variant="secondary"[\s\S]*?pendingRequestEnviarMensaje/
        );
        expect(viewSource).not.toContain('pending-request-card__message-action');
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?size="sm"[\s\S]*?pendingRequestAceptar/
        );
        expect(viewSource).toMatch(
            /@media[^{]*max-width:\s*767px[^{]*\{[\s\S]*\.pending-request-card__actions\s*\{[^}]*flex-direction:\s*row/s
        );
        expect(viewSource).toMatch(
            /@media[^{]*max-width:\s*767px[^{]*\{[\s\S]*\.pending-request-card__actions\s+:deep\(\.app-button\)\s*\{[^}]*flex:\s*1\s+1\s+0/s
        );
        expect(viewSource).toMatch(
            /@media[^{]*max-width:\s*767px[^{]*\{[\s\S]*\.pending-request-card__content\s*\{[^}]*font-size:\s*1rem/s
        );
        expect(viewSource).not.toMatch(
            /@media[^{]*max-width:\s*767px[^{]*\{[\s\S]*\.pending-request-card__actions\s*\{[^}]*flex-direction:\s*column/s
        );
    });
});
