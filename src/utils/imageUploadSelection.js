import dialogs from '../services/dialogs';
import {
    getImageUploadSizeErrorKey,
    getImageUploadSizeErrorParams,
    selectAllowedImageUploads
} from './imageUpload';

export function applyImageUploadSelection(vm, event, files, options = {}) {
    const { files: validFiles, oversized, maxBytes } = selectAllowedImageUploads(files, options);

    if (oversized.length) {
        dialogs.message(
            vm.$t(getImageUploadSizeErrorKey(oversized), getImageUploadSizeErrorParams(oversized, maxBytes)),
            { estado: 'error' }
        );
        if (event && event.target) {
            event.target.value = '';
        }
        return { files: [], rejected: true };
    }

    return { files: validFiles, rejected: false };
}
