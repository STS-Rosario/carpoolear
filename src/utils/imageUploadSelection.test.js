import { describe, expect, it, vi, beforeEach } from 'vitest';
import { DEFAULT_IMAGE_UPLOAD_MAX_BYTES } from './imageUpload';
import { applyImageUploadSelection } from './imageUploadSelection';

const dialogs = {
    message: vi.fn()
};

vi.mock('../services/dialogs', () => ({
    default: dialogs
}));

describe('applyImageUploadSelection', () => {
    beforeEach(() => {
        dialogs.message.mockReset();
    });

    it('rejects oversized files, shows an error, and clears the input', () => {
        const valid = new File(['a'], 'valid.jpg', { type: 'image/jpeg' });
        Object.defineProperty(valid, 'size', { value: 100 });
        const tooBig = new File(['b'], 'huge.jpg', { type: 'image/jpeg' });
        Object.defineProperty(tooBig, 'size', { value: DEFAULT_IMAGE_UPLOAD_MAX_BYTES + 1 });
        const input = { value: 'selected' };
        const vm = {
            $t: (key, params) => `${key}:${JSON.stringify(params)}`
        };

        const result = applyImageUploadSelection(vm, { target: input }, [valid, tooBig], {
            limit: 3,
            maxBytes: DEFAULT_IMAGE_UPLOAD_MAX_BYTES
        });

        expect(result).toEqual({ files: [], rejected: true });
        expect(dialogs.message).toHaveBeenCalledWith(
            'imageUploadTooLargeSingle:{"fileLabel":"huge.jpg","maxMb":10}',
            { estado: 'error' }
        );
        expect(input.value).toBe('');
    });

    it('returns valid files when every upload is within the size limit', () => {
        const valid = new File(['a'], 'valid.jpg', { type: 'image/jpeg' });
        Object.defineProperty(valid, 'size', { value: 100 });
        const vm = { $t: (key) => key };

        const result = applyImageUploadSelection(vm, null, [valid], {
            maxBytes: DEFAULT_IMAGE_UPLOAD_MAX_BYTES
        });

        expect(result).toEqual({ files: [valid], rejected: false });
        expect(dialogs.message).not.toHaveBeenCalled();
    });
});
