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

describe('LiveLocationShare CTA AppButtons', () => {
    it('uses primary AppButtons for start sharing and share sheet', () => {
        expect(viewSource).toContain(
            "import AppButton from '../ui/AppButton.vue'"
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?startSharing[\s\S]*?compartirUbicacionTiempoReal/
        );
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="primary"[\s\S]*?shareLiveUrl[\s\S]*?compartirUbicacionTiempoReal/
        );
        expect(viewSource).not.toContain('btn btn-primary');
    });

    it('uses secondary AppButton for copy URL', () => {
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="secondary"[\s\S]*?copyShareUrl[\s\S]*?liveLocationCopyUrl/
        );
        expect(viewSource).not.toContain('btn btn-default');
    });

    it('uses danger AppButton for stop sharing', () => {
        expect(viewSource).toMatch(
            /<AppButton[\s\S]*?variant="danger"[\s\S]*?live-location-share__stop[\s\S]*?stopSharing[\s\S]*?liveLocationStopSharing/
        );
        expect(viewSource).not.toContain('btn btn-danger');
    });

    it('uses readonly AppInput for the share URL', () => {
        expect(viewSource).toContain(
            "import AppInput from '../ui/AppInput.vue'"
        );
        expect(viewSource).toMatch(
            /<AppInput[\s\S]*?id="live-share-url"[\s\S]*?:model-value="shareUrl"[\s\S]*?readonly/
        );
        expect(viewSource).not.toContain('form-control live-location-share__url');
        expect(viewSource).not.toContain('class="form-control');
    });
});
