import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const selectionViewPaths = [
    '../components/sections/ManualIdentityValidation.vue',
    '../components/sections/UpdateProfile.vue',
    '../components/views/Register.vue',
    '../components/views/TicketNew.vue',
    '../components/views/TicketDetail.vue',
    '../components/views/AdminSupportTicketDetail.vue'
].map((relativePath) => path.resolve(__dirname, relativePath));

const uploadfilePath = path.resolve(__dirname, '../components/Uploadfile.vue');

describe('image upload views', () => {
    it.each(selectionViewPaths)('%s blocks oversized files before upload', (viewPath) => {
        const source = fs.readFileSync(viewPath, 'utf8');

        expect(source).toContain('applyImageUploadSelection');
        expect(source).not.toMatch(/filterAllowedImageUploads\(/);
    });

    it('Uploadfile blocks oversized profile photos before emitting change', () => {
        const source = fs.readFileSync(uploadfilePath, 'utf8');

        expect(source).toContain('getImageUploadMaxBytes');
        expect(source).toContain('getDataUrlByteSize');
        expect(source).toContain('getImageUploadSizeErrorKey');
    });
});
