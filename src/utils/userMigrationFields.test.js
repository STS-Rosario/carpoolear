import { describe, it, expect } from 'vitest';
import {
    DEFAULT_FIELD_SOURCES,
    createDefaultFieldSources,
    migrationFields
} from './userMigrationFields.js';

describe('userMigrationFields', () => {
    it('defaults email dni and created_at to removed and password and phone to kept', () => {
        expect(DEFAULT_FIELD_SOURCES.email).toBe('removed');
        expect(DEFAULT_FIELD_SOURCES.password).toBe('kept');
        expect(DEFAULT_FIELD_SOURCES.nro_doc).toBe('removed');
        expect(DEFAULT_FIELD_SOURCES.mobile_phone).toBe('kept');
        expect(DEFAULT_FIELD_SOURCES.created_at).toBe('removed');
    });

    it('lists all mergeable migration fields', () => {
        expect(migrationFields.map((field) => field.key)).toEqual([
            'email',
            'password',
            'nro_doc',
            'mobile_phone',
            'created_at'
        ]);
    });

    it('returns a fresh copy of default field sources', () => {
        const first = createDefaultFieldSources();
        first.email = 'kept';
        expect(createDefaultFieldSources().email).toBe('removed');
    });
});
