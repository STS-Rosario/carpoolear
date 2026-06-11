import { describe, expect, it } from 'vitest';
import {
    applyTripCreationTemplateToForm,
    buildTripCreationTemplateFromSnapshot,
    getWizardNavigationAfterTemplateApply
} from './tripCreationTemplate.js';

describe('applyTripCreationTemplateToForm', () => {
    it('applies template data onto the wizard form state', () => {
        const form = {
            trip: { is_passenger: 1, total_seats: 2, description: '' },
            points: [
                { id: 0, name: '', error: { state: false, message: '' } },
                { id: 1, name: '', error: { state: false, message: '' } }
            ],
            date: '2026-01-01',
            dateAnswer: '2026-01-01',
            time: '10:00',
            price: '',
            no_lucrar: false,
            selectedCarId: null,
            allowForeignPoints: false,
            wantsIntermediateStops: false,
            useWeeklySchedule: false,
            weeklySchedule: 0,
            weeklyScheduleTime: '12:00'
        };
        const template = {
            trip: { is_passenger: 0, total_seats: 3, description: 'Viaje frecuente' },
            points: [
                { id: 0, name: 'Rosario', place: 'Rosario' },
                { id: 1, name: 'Buenos Aires', place: 'Buenos Aires' }
            ],
            date: '',
            dateAnswer: '',
            time: '',
            price: '5000',
            no_lucrar: true,
            selectedCarId: 9,
            allowForeignPoints: true,
            wantsIntermediateStops: false,
            useWeeklySchedule: true,
            weeklySchedule: 2,
            weeklyScheduleTime: '08:00'
        };

        applyTripCreationTemplateToForm(form, template);

        expect(form.trip.is_passenger).toBe(0);
        expect(form.trip.description).toBe('Viaje frecuente');
        expect(form.points[0].name).toBe('Rosario');
        expect(form.dateAnswer).toBe('');
        expect(form.time).toBe('');
        expect(form.price).toBe('5000');
        expect(form.selectedCarId).toBe(9);
        expect(form.useWeeklySchedule).toBe(true);
        expect(form.points[0].error).toEqual({ state: false, message: '' });
    });
});

describe('getWizardNavigationAfterTemplateApply', () => {
    it('opens the wizard on the schedule step after applying a template', () => {
        expect(getWizardNavigationAfterTemplateApply()).toEqual({
            currentStep: 5,
            maxVisitedStep: 9
        });
    });
});

describe('buildTripCreationTemplateFromSnapshot', () => {
    const snapshot = {
        trip: {
            is_passenger: 0,
            total_seats: 3,
            description: 'Viaje frecuente',
            allow_kids: true
        },
        points: [
            { id: 0, name: 'Rosario', place: 'Rosario' },
            { id: 1, name: 'Buenos Aires', place: 'Buenos Aires' }
        ],
        date: '2026-06-15',
        dateAnswer: '2026-06-15',
        time: '14:00',
        price: '5000',
        no_lucrar: true,
        selectedCarId: 9,
        allowForeignPoints: false,
        wantsIntermediateStops: false,
        useWeeklySchedule: true,
        weeklySchedule: 2,
        weeklyScheduleTime: '08:00'
    };

    it('keeps route and trip details but clears specific dates', () => {
        const template = buildTripCreationTemplateFromSnapshot(snapshot);

        expect(template.trip.description).toBe('Viaje frecuente');
        expect(template.points).toHaveLength(2);
        expect(template.points[0].name).toBe('Rosario');
        expect(template.price).toBe('5000');
        expect(template.selectedCarId).toBe(9);
        expect(template.useWeeklySchedule).toBe(true);
        expect(template.weeklySchedule).toBe(2);
        expect(template.weeklyScheduleTime).toBe('08:00');
        expect(template.date).toBe('');
        expect(template.dateAnswer).toBe('');
        expect(template.time).toBe('');
    });
});
