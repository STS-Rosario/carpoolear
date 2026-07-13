import { buildIdentityValidationMpBothMismatchPreviewUrl } from '../src/utils/identityValidationMpRejectionPreview.js';

const previewUrl = buildIdentityValidationMpBothMismatchPreviewUrl({
    origin: 'http://localhost:8080'
});

console.log('Open while running npm run dev:');
console.log(previewUrl);
