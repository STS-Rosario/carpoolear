import { describe, it, expect } from 'vitest';
import {
    ADMIN_PER_PAGE_OPTIONS,
    DEFAULT_ADMIN_PER_PAGE,
    buildAdminPaginationQuery,
    parseAdminPaginationFromRoute,
    readPaginationMeta,
    resolveAdminPage,
    resolveAdminPerPage
} from './adminPagination';

describe('adminPagination', () => {
    it('exposes default per page and allowed options', () => {
        expect(DEFAULT_ADMIN_PER_PAGE).toBe(20);
        expect(ADMIN_PER_PAGE_OPTIONS).toEqual([10, 20, 30, 50, 100]);
    });

    it('resolveAdminPerPage accepts allowed values and falls back to default', () => {
        expect(resolveAdminPerPage(10)).toBe(10);
        expect(resolveAdminPerPage('30')).toBe(30);
        expect(resolveAdminPerPage(15)).toBe(20);
        expect(resolveAdminPerPage(undefined)).toBe(20);
    });

    it('resolveAdminPage defaults to one and clamps invalid values', () => {
        expect(resolveAdminPage(undefined)).toBe(1);
        expect(resolveAdminPage(0)).toBe(1);
        expect(resolveAdminPage('3')).toBe(3);
    });

    it('parseAdminPaginationFromRoute reads page and per_page query params', () => {
        expect(parseAdminPaginationFromRoute({ page: '2', per_page: '50' })).toEqual({
            page: 2,
            perPage: 50
        });
    });

    it('buildAdminPaginationQuery serializes pagination into route query', () => {
        expect(buildAdminPaginationQuery(2, 30, { type: 'bug_report' })).toEqual({
            type: 'bug_report',
            page: '2',
            per_page: '30'
        });
    });

    it('readPaginationMeta returns pagination meta from API body', () => {
        expect(readPaginationMeta({
            data: [],
            meta: {
                pagination: {
                    current_page: 1,
                    per_page: 20,
                    total: 0,
                    total_pages: 1
                }
            }
        })).toEqual({
            current_page: 1,
            per_page: 20,
            total: 0,
            total_pages: 1
        });
    });
});
