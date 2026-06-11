import dayjs from '../dayjs';

export function formatTripShareDay(tripDate, locale = 'es') {
    const parsed = dayjs(tripDate);
    if (!parsed.isValid()) {
        return '';
    }

    if (String(locale).startsWith('en')) {
        return parsed.locale('en').format('dddd, MMMM D');
    }

    return parsed.locale('es').format('dddd D [de] MMMM');
}

export function formatTripShareTime(tripDate) {
    const parsed = dayjs(tripDate);
    return parsed.isValid() ? parsed.format('HH:mm') : '';
}

export function buildTripShareMessage({
    trip,
    locale = 'es',
    translate
}) {
    const destination = trip?.['to_town'] || '';
    const tripDate = trip?.['trip_date'];
    const day = formatTripShareDay(tripDate, locale);
    const time = formatTripShareTime(tripDate);

    return translate('tripShareMessage', {
        day,
        time,
        destination
    });
}
