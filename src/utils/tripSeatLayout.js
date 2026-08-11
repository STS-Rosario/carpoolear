export const SEAT_LAYOUT_FOUR = 4;
export const SEAT_LAYOUT_FIVE = 5;

export function maxOfferedSeatsForLayout(layout) {
    if (Number(layout) === SEAT_LAYOUT_FOUR) {
        return 3;
    }
    if (Number(layout) === SEAT_LAYOUT_FIVE) {
        return 4;
    }
    return 0;
}

export function rearMaxTwoFromLayout(layout) {
    return Number(layout) === SEAT_LAYOUT_FOUR;
}

export function createPassengerSeatAvailability(layout) {
    const count = maxOfferedSeatsForLayout(layout);
    return Array.from({ length: count }, () => true);
}

export function countAvailableSeats(availability) {
    if (!Array.isArray(availability)) {
        return 0;
    }
    return availability.filter(Boolean).length;
}

export function togglePassengerSeat(availability, index) {
    if (!Array.isArray(availability) || index < 0 || index >= availability.length) {
        return Array.isArray(availability) ? availability.slice() : [];
    }
    return availability.map((on, i) => (i === index ? !on : on));
}

export function seatLabelsForLayout(layout) {
    const labels = ['tripSeatMapFront'];
    const rearCount = Math.max(0, maxOfferedSeatsForLayout(layout) - 1);
    for (let i = 1; i <= rearCount; i += 1) {
        labels.push(`tripSeatMapRear${i}`);
    }
    return labels;
}
