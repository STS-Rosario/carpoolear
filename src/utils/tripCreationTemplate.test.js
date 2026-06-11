import { beforeEach, describe, expect, it, vi } from 'vitest';
import dayjs from '../dayjs.js';

const { mockStore, mockIndex, mockShow } = vi.hoisted(() => ({
    mockStore: vi.fn(),
    mockIndex: vi.fn(),
    mockShow: vi.fn()
}));

vi.mock('../services/api/TripCreationTemplate.js', () => ({
    default: class MockTripCreationTemplateApi {
        store(data) {
            return mockStore(data);
        }

        index() {
            return mockIndex();
        }

        show(name) {
            return mockShow(name);
        }
    }
}));

describe('getDefaultTripCreationTime', () => {
    it('returns the next full hour like new trip creation', async () => {
        const { getDefaultTripCreationTime } = await import('./tripCreationTemplate.js');

        expect(getDefaultTripCreationTime(dayjs('2026-06-11T17:17:00'))).toBe('18:00');
    });

    it('rolls over to the next day when needed', async () => {
        const { getDefaultTripCreationTime } = await import('./tripCreationTemplate.js');

        expect(getDefaultTripCreationTime(dayjs('2026-06-11T23:45:00'))).toBe('00:00');
    });
});

describe('applyTripCreationTemplateToForm', () => {
    const templateApplyNow = dayjs('2026-06-11T17:17:00');

    it('applies template data onto the wizard form state', async () => {
        const { applyTripCreationTemplateToForm } = await import('./tripCreationTemplate.js');
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

        applyTripCreationTemplateToForm(form, template, {
            now: templateApplyNow,
            useDefaultScheduleTime: true
        });

        expect(form.trip.is_passenger).toBe(0);
        expect(form.trip.description).toBe('Viaje frecuente');
        expect(form.points[0].name).toBe('Rosario');
        expect(form.dateAnswer).toBe('');
        expect(form.time).toBe('18:00');
        expect(form.price).toBe('5000');
        expect(form.selectedCarId).toBe(9);
        expect(form.useWeeklySchedule).toBe(true);
        expect(form.weeklyScheduleTime).toBe('18:00');
        expect(form.points[0].error).toEqual({ state: false, message: '' });
    });

    it('sets schedule time to the next full hour when loading a template', async () => {
        const { applyTripCreationTemplateToForm } = await import('./tripCreationTemplate.js');
        const form = {
            trip: { is_passenger: 0, total_seats: 2 },
            points: [
                { id: 0, name: 'Origen', error: { state: false, message: '' } },
                { id: 1, name: 'Destino', error: { state: false, message: '' } }
            ],
            dateAnswer: '',
            date: '',
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

        applyTripCreationTemplateToForm(
            form,
            {
                trip: { total_seats: 3 },
                time: '',
                useWeeklySchedule: true,
                weeklySchedule: 2,
                weeklyScheduleTime: '08:00'
            },
            {
                now: templateApplyNow,
                useDefaultScheduleTime: true
            }
        );

        expect(form.time).toBe('18:00');
        expect(form.weeklyScheduleTime).toBe('18:00');
    });

    it('preserves saved draft schedule times when default schedule is not requested', async () => {
        const { applyTripCreationTemplateToForm } = await import('./tripCreationTemplate.js');
        const form = {
            trip: { is_passenger: 0, total_seats: 2 },
            points: [
                { id: 0, name: 'Origen', error: { state: false, message: '' } },
                { id: 1, name: 'Destino', error: { state: false, message: '' } }
            ],
            dateAnswer: '2026-06-15',
            date: '2026-06-15',
            time: '10:00',
            price: '',
            no_lucrar: false,
            selectedCarId: null,
            allowForeignPoints: false,
            wantsIntermediateStops: false,
            useWeeklySchedule: true,
            weeklySchedule: 2,
            weeklyScheduleTime: '12:00'
        };

        applyTripCreationTemplateToForm(
            form,
            {
                trip: { total_seats: 3 },
                dateAnswer: '2026-06-15',
                date: '2026-06-15',
                time: '14:00',
                useWeeklySchedule: true,
                weeklySchedule: 2,
                weeklyScheduleTime: '08:00'
            },
            { now: templateApplyNow }
        );

        expect(form.time).toBe('14:00');
        expect(form.weeklyScheduleTime).toBe('08:00');
    });

    it('ignores invalid points payloads instead of throwing', async () => {
        const { applyTripCreationTemplateToForm } = await import('./tripCreationTemplate.js');
        const form = {
            trip: { is_passenger: 0, total_seats: 2 },
            points: [
                { id: 0, name: 'Origen', error: { state: false, message: '' } },
                { id: 1, name: 'Destino', error: { state: false, message: '' } }
            ],
            dateAnswer: '',
            date: '',
            time: '',
            price: '',
            no_lucrar: false,
            selectedCarId: null,
            allowForeignPoints: false,
            wantsIntermediateStops: false,
            useWeeklySchedule: false,
            weeklySchedule: 0,
            weeklyScheduleTime: '12:00'
        };

        expect(() =>
            applyTripCreationTemplateToForm(form, {
                trip: { total_seats: 4 },
                points: { invalid: true }
            })
        ).not.toThrow();

        expect(form.trip.total_seats).toBe(4);
        expect(form.points[0].name).toBe('Origen');
    });
});

describe('getWizardNavigationAfterTemplateApply', () => {
    it('opens the wizard on the schedule step after applying a template', async () => {
        const { getWizardNavigationAfterTemplateApply } = await import('./tripCreationTemplate.js');
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

    it('keeps route and trip details but clears specific dates', async () => {
        const { buildTripCreationTemplateFromSnapshot } = await import('./tripCreationTemplate.js');
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

describe('resolveTripCreationTemplateSaveName', () => {
    it('uses a new template name when no replacement is selected', async () => {
        const { resolveTripCreationTemplateSaveName } = await import('./tripCreationTemplate.js');

        expect(
            resolveTripCreationTemplateSaveName({
                newName: '  Semanal  ',
                replaceName: ''
            })
        ).toBe('Semanal');
    });

    it('uses the selected replacement template name when provided', async () => {
        const { resolveTripCreationTemplateSaveName } = await import('./tripCreationTemplate.js');

        expect(
            resolveTripCreationTemplateSaveName({
                newName: 'Nueva',
                replaceName: 'Fin de semana'
            })
        ).toBe('Fin de semana');
    });

    it('returns null when neither a new name nor replacement is provided', async () => {
        const {
            canSaveTripCreationTemplateName,
            resolveTripCreationTemplateSaveName
        } = await import('./tripCreationTemplate.js');

        expect(
            resolveTripCreationTemplateSaveName({
                newName: '   ',
                replaceName: ''
            })
        ).toBeNull();
        expect(
            canSaveTripCreationTemplateName({
                newName: '',
                replaceName: ''
            })
        ).toBe(false);
    });
});

describe('saveTripCreationTemplate', () => {
    beforeEach(() => {
        mockStore.mockReset();
        mockStore.mockResolvedValue({
            data: {
                name: 'Rosario a BA',
                data: { trip: { total_seats: 3 } }
            }
        });
    });

    it('posts the template to the backend API', async () => {
        const { saveTripCreationTemplate } = await import('./tripCreationTemplate.js');
        const data = {
            trip: { is_passenger: 0, total_seats: 3 },
            points: [{ name: 'Rosario' }, { name: 'Buenos Aires' }]
        };

        await saveTripCreationTemplate(7, 'Rosario a BA', data);

        expect(mockStore).toHaveBeenCalledWith({
            name: 'Rosario a BA',
            data
        });
    });

    it('rejects when template data is missing instead of resolving silently', async () => {
        const { saveTripCreationTemplate } = await import('./tripCreationTemplate.js');
        await expect(saveTripCreationTemplate(7, 'Rosario a BA', null)).rejects.toThrow(
            'Trip creation template data is required'
        );
        expect(mockStore).not.toHaveBeenCalled();
    });
});

describe('listTripCreationTemplates', () => {
    beforeEach(() => {
        mockIndex.mockReset();
    });

    it('reads templates from the API response payload', async () => {
        const { listTripCreationTemplates } = await import('./tripCreationTemplate.js');
        mockIndex.mockResolvedValue({
            data: [
                {
                    name: 'Semanal',
                    data: { trip: { total_seats: 2 } }
                }
            ]
        });

        await expect(listTripCreationTemplates(7)).resolves.toEqual([
            {
                name: 'Semanal',
                data: { trip: { total_seats: 2 } }
            }
        ]);
    });
});

describe('loadTripCreationTemplate', () => {
    beforeEach(() => {
        mockShow.mockReset();
    });

    it('reads a named template from the API response payload', async () => {
        const { loadTripCreationTemplate } = await import('./tripCreationTemplate.js');
        mockShow.mockResolvedValue({
            data: {
                name: 'Fin de semana',
                data: {
                    trip: { total_seats: 3 },
                    points: [{ name: 'Rosario' }, { name: 'Buenos Aires' }]
                }
            }
        });

        await expect(loadTripCreationTemplate(7, 'Fin de semana')).resolves.toEqual({
            trip: { total_seats: 3 },
            points: [{ name: 'Rosario' }, { name: 'Buenos Aires' }]
        });
    });
});
