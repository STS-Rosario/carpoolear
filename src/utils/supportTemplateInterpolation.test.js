import { describe, it, expect } from 'vitest';
import { interpolateSupportTemplateVariables } from './supportTemplateInterpolation';

describe('interpolateSupportTemplateVariables', () => {
    it('replaces nombre with first word of user name', () => {
        const result = interpolateSupportTemplateVariables('Hola {{nombre}}', { name: 'Ana María López' });
        expect(result).toBe('Hola Ana');
    });

    it('replaces nombreCompleto with full trimmed name', () => {
        const result = interpolateSupportTemplateVariables('Hola {{nombreCompleto}}', { name: '  Juan Pérez  ' });
        expect(result).toBe('Hola Juan Pérez');
    });

    it('replaces both placeholders in one string', () => {
        const result = interpolateSupportTemplateVariables('{{nombre}} / {{nombreCompleto}}', { name: 'X Y' });
        expect(result).toBe('X / X Y');
    });

    it('uses empty string for known keys when user is missing', () => {
        expect(interpolateSupportTemplateVariables('Hola {{nombre}}', null)).toBe('Hola ');
    });

    it('uses empty string when name is missing', () => {
        expect(interpolateSupportTemplateVariables('Hola {{nombre}}', {})).toBe('Hola ');
    });

    it('leaves unknown placeholders unchanged', () => {
        const result = interpolateSupportTemplateVariables('{{foo}} {{nombre}}', { name: 'A B' });
        expect(result).toBe('{{foo}} A');
    });
});
