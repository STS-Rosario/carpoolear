import dialogs from '../services/dialogs';
import {
    getDataUrlByteSize,
    getImageUploadMaxBytes,
    getImageUploadSizeErrorKey,
    getImageUploadSizeErrorParams,
    selectAllowedImageUploads
} from './imageUpload';

export function showImageUploadSizeError(vm, oversized, maxBytes) {
    dialogs.message(
        vm.$t(getImageUploadSizeErrorKey(oversized), getImageUploadSizeErrorParams(oversized, maxBytes)),
        { estado: 'error' }
    );
}

export function applyImageUploadSelection(vm, event, files, options = {}) {
    const { files: validFiles, oversized, maxBytes } = selectAllowedImageUploads(files, options);

    if (oversized.length) {
        showImageUploadSizeError(vm, oversized, maxBytes);
        if (event && event.target) {
            event.target.value = '';
        }
        return { files: [], rejected: true };
    }

    return { files: validFiles, rejected: false };
}

export function rejectOversizedDataUrl(vm, dataUrl, displayName, config) {
    const maxBytes = getImageUploadMaxBytes(config);
    if (getDataUrlByteSize(dataUrl) <= maxBytes) {
        return false;
    }

    showImageUploadSizeError(vm, [{ displayName }], maxBytes);
    return true;
}

export function rejectOversizedFile(vm, file, displayName, config, event) {
    const maxBytes = getImageUploadMaxBytes(config);
    if (!file || file.size <= maxBytes) {
        return false;
    }

    showImageUploadSizeError(vm, [{ displayName: displayName || file.name || '' }], maxBytes);
    if (event && event.target) {
        event.target.value = '';
    }
    return true;
}
