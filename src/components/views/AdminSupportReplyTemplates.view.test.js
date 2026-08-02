import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viewPath = path.resolve(__dirname, 'AdminSupportReplyTemplates.vue');

describe('AdminSupportReplyTemplates view', () => {
    it('lists templates with expected columns and actions', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');
        expect(viewSource).toContain("{{ $t('plantillasRespuestas') }}");
        expect(viewSource).toContain("capitalizeFirst($t('descripcionCortaPlantilla'))");
        expect(viewSource).toContain("{{ $t('accionVer') }}");
        expect(viewSource).toContain("{{ $t('accionEditar') }}");
        expect(viewSource).toContain("{{ $t('accionDuplicar') }}");
        expect(viewSource).toContain("{{ $t('accionEliminar') }}");
        expect(viewSource).toContain('fetchAdminList');
    });

    it('uses AppButton for new template link and row actions', () => {
        const viewSource = fs.readFileSync(viewPath, 'utf8');
        expect(viewSource).toContain("import AppButton from '../ui/AppButton.vue'");
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?:to="\{ name: 'admin-support-reply-template-new' \}"[\s\S]*?nuevaPlantillaRespuesta/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?size="sm"[\s\S]*?admin-support-reply-template-view/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?size="sm"[\s\S]*?remove\(row\.id\)/
        );
        expect(viewSource).not.toContain('btn btn-primary');
        expect(viewSource).not.toContain('btn btn-xs');
    });
});
