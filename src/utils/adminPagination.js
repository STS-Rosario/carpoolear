export const DEFAULT_ADMIN_PER_PAGE = 20;

export const ADMIN_PER_PAGE_OPTIONS = [10, 20, 30, 50, 100];

export function resolveAdminPerPage(value) {
    const perPage = parseInt(value, 10);

    if (ADMIN_PER_PAGE_OPTIONS.includes(perPage)) {
        return perPage;
    }

    return DEFAULT_ADMIN_PER_PAGE;
}

export function resolveAdminPage(value) {
    const page = parseInt(value, 10);

    if (Number.isNaN(page) || page < 1) {
        return 1;
    }

    return page;
}

export function parseAdminPaginationFromRoute(query = {}) {
    return {
        page: resolveAdminPage(query.page),
        perPage: resolveAdminPerPage(query.per_page)
    };
}

export function buildAdminPaginationQuery(page, perPage, baseQuery = {}) {
    return {
        ...baseQuery,
        page: String(page),
        per_page: String(perPage)
    };
}

export function readPaginationMeta(response) {
    return response && response.meta && response.meta.pagination
        ? response.meta.pagination
        : null;
}
