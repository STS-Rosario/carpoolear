export const ANY_ALLOW_FILTER = 'any';

export function appendAllowPreferenceParams(params, filters) {
    if (filters.allowAnimals === 'yes') {
        params.allow_animals = true;
    } else if (filters.allowAnimals === 'no') {
        params.allow_animals = false;
    }
    if (filters.allowSmoking === 'yes') {
        params.allow_smoking = true;
    } else if (filters.allowSmoking === 'no') {
        params.allow_smoking = false;
    }
    if (filters.allowKids === 'yes') {
        params.allow_kids = true;
    } else if (filters.allowKids === 'no') {
        params.allow_kids = false;
    }
}

export function hydrateAllowPreferenceFilters(parameters = {}) {
    const toFilterValue = (value) => {
        if (value === true || value === 'true' || value === 1 || value === '1') {
            return 'yes';
        }
        if (value === false || value === 'false' || value === 0 || value === '0') {
            return 'no';
        }
        return ANY_ALLOW_FILTER;
    };

    return {
        allowAnimals: toFilterValue(parameters.allow_animals),
        allowSmoking: toFilterValue(parameters.allow_smoking),
        allowKids: toFilterValue(parameters.allow_kids)
    };
}

export function hasAdvancedSearchFilters(parameters = {}) {
    return Boolean(
        parameters.hide_carpooleado ||
            parameters.allow_animals !== undefined ||
            parameters.allow_smoking !== undefined ||
            parameters.allow_kids !== undefined
    );
}
