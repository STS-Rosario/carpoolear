export const PASSENGER_REQUEST_ACCEPTED = 1;

export function extractFirstName(fullName) {
    if (!fullName || typeof fullName !== 'string') {
        return '';
    }

    const trimmed = fullName.trim();
    if (!trimmed) {
        return '';
    }

    return trimmed.split(/\s+/)[0];
}

export function formatSpanishNameList(names) {
    if (!Array.isArray(names) || names.length === 0) {
        return '';
    }

    if (names.length === 1) {
        return names[0];
    }

    if (names.length === 2) {
        return `${names[0]} y ${names[1]}`;
    }

    const head = names.slice(0, -1).join(', ');
    const last = names[names.length - 1];

    return `${head} y ${last}`;
}

export function getAcceptedCoPassengerFirstNames(
    allPassengerRequest,
    currentUserId
) {
    if (!Array.isArray(allPassengerRequest)) {
        return [];
    }

    return allPassengerRequest
        .filter(
            (request) =>
                request.request_state === PASSENGER_REQUEST_ACCEPTED &&
                request.user_id !== currentUserId
        )
        .map((request) =>
            extractFirstName(request.user ? request.user.name : request.name)
        )
        .filter(Boolean);
}

export function isAcceptedPassengerOnTrip(allPassengerRequest, currentUserId) {
    if (!Array.isArray(allPassengerRequest) || currentUserId == null) {
        return false;
    }

    return allPassengerRequest.some(
        (request) =>
            request.user_id === currentUserId &&
            request.request_state === PASSENGER_REQUEST_ACCEPTED
    );
}
