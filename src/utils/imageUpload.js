export const IMAGE_UPLOAD_ACCEPT =
    'image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp';

const JPEG_EXTENSIONS = new Set(['jpg', 'jpeg']);
const JPEG_MIMES = new Set(['image/jpeg', 'image/jpg']);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif']);
const ALLOWED_MIMES = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
]);

export function getImageFileExtension(file) {
    const name = file && file.name ? String(file.name) : '';
    const dotIndex = name.lastIndexOf('.');

    if (dotIndex < 0) {
        return '';
    }

    return name.slice(dotIndex + 1).toLowerCase();
}

function isAllowedExtension(extension, allowedExtensions = ALLOWED_EXTENSIONS) {
    if (!extension) {
        return false;
    }

    if (allowedExtensions.has(extension)) {
        return true;
    }

    if (JPEG_EXTENSIONS.has(extension)) {
        return [...allowedExtensions].some((allowed) => JPEG_EXTENSIONS.has(allowed));
    }

    return false;
}

function isAllowedMime(mime, allowedMimes = ALLOWED_MIMES) {
    if (!mime) {
        return false;
    }

    const normalized = String(mime).toLowerCase();

    if (allowedMimes.has(normalized)) {
        return true;
    }

    if (JPEG_MIMES.has(normalized)) {
        return [...allowedMimes].some((allowed) => JPEG_MIMES.has(allowed));
    }

    return false;
}

export function isAllowedImageUpload(file) {
    if (!file) {
        return false;
    }

    const extension = getImageFileExtension(file);
    const mime = file.type ? String(file.type).toLowerCase() : '';

    return isAllowedExtension(extension) || isAllowedMime(mime);
}

export function filterAllowedImageUploads(files, limit = Number.POSITIVE_INFINITY) {
    return Array.from(files || [])
        .filter(isAllowedImageUpload)
        .slice(0, limit);
}

export function normalizeCapacitorImageFormat(format) {
    const normalized = String(format || 'jpeg').toLowerCase();

    return normalized === 'jpg' ? 'jpeg' : normalized;
}
