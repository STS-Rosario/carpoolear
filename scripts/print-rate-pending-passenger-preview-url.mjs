import { buildRatePendingPassengerPreviewUrl } from '../src/utils/ratePendingPassengerPreview.js';

const hashUrl = buildRatePendingPassengerPreviewUrl({
    origin: 'http://localhost:8080'
});
const historyUrl = `http://localhost:8080${buildRatePendingPassengerPreviewUrl()}`;

console.log('Open while running npm run dev:');
console.log(historyUrl);
console.log('(hash mode:', hashUrl + ')');
