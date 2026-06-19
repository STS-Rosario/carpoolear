import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPaths = [
    '../components/sections/ManualIdentityValidation.vue',
    '../components/sections/UpdateProfile.vue',
    '../components/views/Register.vue',
    '../components/views/TicketNew.vue',
    '../components/views/TicketDetail.vue',
    '../components/views/AdminSupportTicketDetail.vue',
    '../components/Uploadfile.vue'
].map((relativePath) => path.resolve(__dirname, relativePath));

describe('image upload views', () => {
    it.each(viewPaths)('%s blocks oversized files before upload', (viewPath) => {
        const source = fs.readFileSync(viewPath, 'utf8');

        expect(source).toContain('applyImageUploadSelection');
        expect(source).not.toMatch(/filterAllowedImageUploads\(/);
    });
});
