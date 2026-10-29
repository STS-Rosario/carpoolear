import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const storyRequest = vi.hoisted(() => vi.fn());
const shareMock = vi.hoisted(() => vi.fn());
const writeFileMock = vi.hoisted(() => vi.fn());
const deleteFileMock = vi.hoisted(() => vi.fn());

vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: vi.fn(() => false)
    }
}));

vi.mock('@capacitor/filesystem', () => ({
    Directory: { Cache: 'CACHE' },
    Filesystem: {
        writeFile: writeFileMock,
        deleteFile: deleteFileMock
    }
}));

vi.mock('@capacitor/share', () => ({
    Share: { share: shareMock }
}));

vi.mock('../services/api/Trips.js', () => ({
    default: class TripApiMock {
        instagramStory(...args) {
            return storyRequest(...args);
        }
    }
}));

describe('shareTripInstagramStory', () => {
    beforeEach(() => {
        storyRequest.mockReset();
        shareMock.mockReset();
        writeFileMock.mockReset();
        deleteFileMock.mockReset();
        storyRequest.mockResolvedValue(
            new Blob(['png image'], { type: 'image/png' })
        );
        writeFileMock.mockResolvedValue({
            uri: 'file:///cache/trip-story.png'
        });
        deleteFileMock.mockResolvedValue(undefined);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.resetModules();
    });

    it('shares the generated PNG using the Web Share API when supported', async () => {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(false);
        const navigatorShare = vi.fn().mockResolvedValue(undefined);
        vi.stubGlobal('navigator', {
            canShare: vi.fn(() => true),
            share: navigatorShare
        });
        const { shareTripInstagramStory } = await import(
            './tripInstagramStoryShare.js'
        );

        const result = await shareTripInstagramStory(42, 'Compartir historia de Instagram');

        expect(storyRequest).toHaveBeenCalledWith(42);
        expect(navigatorShare).toHaveBeenCalledWith({
            title: 'Compartir historia de Instagram',
            files: [
                expect.objectContaining({
                    name: 'carpoolear-viaje-42-instagram-story.png',
                    type: 'image/png'
                })
            ]
        });
        expect(result).toEqual({ ok: true, method: 'navigator' });
    });

    it('writes and shares a temporary image file on native platforms', async () => {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(true);
        shareMock.mockResolvedValue(undefined);
        const { shareTripInstagramStory } = await import(
            './tripInstagramStoryShare.js'
        );

        const result = await shareTripInstagramStory(7);

        expect(writeFileMock).toHaveBeenCalledWith({
            path: 'carpoolear-viaje-7-instagram-story.png',
            data: expect.any(String),
            directory: 'CACHE'
        });
        expect(shareMock).toHaveBeenCalledWith({
            title: 'Carpoolear - Instagram story',
            dialogTitle: 'Carpoolear - Instagram story',
            files: ['file:///cache/trip-story.png']
        });
        expect(deleteFileMock).toHaveBeenCalledWith({
            path: 'carpoolear-viaje-7-instagram-story.png',
            directory: 'CACHE'
        });
        expect(result).toEqual({ ok: true, method: 'capacitor' });
    });

    it('rejects invalid trip IDs and invalid image responses', async () => {
        const { Capacitor } = await import('@capacitor/core');
        Capacitor.isNativePlatform.mockReturnValue(false);
        const { shareTripInstagramStory } = await import(
            './tripInstagramStoryShare.js'
        );

        await expect(shareTripInstagramStory(0)).rejects.toThrow(
            'A valid trip ID is required'
        );
        storyRequest.mockResolvedValueOnce(
            new Blob(['not a png'], { type: 'text/plain' })
        );
        await expect(shareTripInstagramStory(1)).rejects.toThrow(
            'did not return a valid PNG'
        );
    });
});
