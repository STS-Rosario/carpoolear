export function buildTripDateForApi(dateAnswer, time) {
    const trimmedTime = String(time).trim();

    if (/^\d{1,2}:\d{2}:\d{2}$/.test(trimmedTime)) {
        return `${dateAnswer} ${trimmedTime}`;
    }

    return `${dateAnswer} ${trimmedTime}:00`;
}
