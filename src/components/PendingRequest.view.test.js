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
});
