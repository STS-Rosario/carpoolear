import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'LiveLocationShare.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('LiveLocationShare.vue', () => {
    it('includes share url, copy, native share, and start/stop controls', () => {
        expect(viewSource).toContain('compartirUbicacionTiempoReal');
        expect(viewSource).toContain('shareUrl');
        expect(viewSource).toContain('copyShareUrl');
        expect(viewSource).toContain('shareLiveUrl');
        expect(viewSource).toContain('shareContent');
        expect(viewSource).not.toContain('navigator.share');
        expect(viewSource).toContain('live-location-share__stop');
        expect(viewSource).toMatch(
            /live-location-share__stop[\s\S]*safe-area-inset-bottom/
        );
        expect(viewSource).toContain('startSharing');
        expect(viewSource).toContain('stopSharing');
        expect(viewSource).toContain('useTripLiveShareStore');
        expect(viewSource).toContain('loadingData');
        expect(viewSource).not.toMatch(/:data="loaded"/);
        expect(viewSource).toContain('live-location-map');
        expect(viewSource).toContain('syncMap');
        expect(viewSource).toContain('resumeActiveSharing');
        expect(viewSource).toContain('LiveLocationLastUpdated');
        expect(viewSource).toContain('share.recorded_at');
        expect(viewSource).toContain('getLiveLocationShareIntroKey');
        expect(viewSource).toContain('shareIntroKey');
        expect(viewSource).toContain('$t(shareIntroKey)');
        expect(viewSource).toContain('getTrip');
    });
});
