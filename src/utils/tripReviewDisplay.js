import { STEP } from './tripCreationSteps.js';

const EDIT_STEP_BY_SECTION = {
    route: STEP.ORIGIN,
    vehicle: STEP.CAR,
    seats: STEP.SEATS,
    contribution: STEP.CONTRIBUTION,
    preferences: STEP.DESCRIPTION
};

export function getTripReviewEditStep(section) {
    return EDIT_STEP_BY_SECTION[section] || null;
}

export function getTripReviewRoutePoints(points = []) {
    if (!Array.isArray(points) || points.length === 0) {
        return [];
    }

    return points.map((point, index) => {
        let kind = 'stop';
        if (index === 0) {
            kind = 'origin';
        } else if (index === points.length - 1) {
            kind = 'destination';
        }
        return {
            name: point && point.name ? String(point.name) : '',
            kind
        };
    });
}

export function formatTripReviewPrice(price) {
    if (price === '' || price == null) {
        return '';
    }
    const value = Number(price);
    if (!Number.isFinite(value)) {
        return '';
    }

    const [integerPart, fractionPart] = String(value).split('.');
    const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (fractionPart == null || fractionPart === '') {
        return withThousands;
    }
    return `${withThousands},${fractionPart}`;
}

export function buildTripReviewPreferenceTags({
    allow_kids = false,
    allow_smoking = false,
    allow_animals = false
} = {}) {
    return [
        { key: 'kids', allowed: Boolean(allow_kids) },
        { key: 'smoking', allowed: Boolean(allow_smoking) },
        { key: 'pets', allowed: Boolean(allow_animals) }
    ];
}
