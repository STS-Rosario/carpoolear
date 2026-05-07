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
});
