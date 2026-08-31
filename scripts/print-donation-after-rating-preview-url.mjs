import { buildDonationAfterRatingPreviewUrl } from '../src/utils/donationAfterRatingPreview.js';

const previewUrl = buildDonationAfterRatingPreviewUrl({
    origin: 'http://localhost:8080'
});

console.log('Open while running npm run dev:');
console.log(previewUrl);
