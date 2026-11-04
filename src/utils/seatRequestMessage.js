function parseTimestamp(value) {
    if (!value) {
        return Number.NaN;
    }
    return Date.parse(String(value).replace(' ', 'T'));
}

export function hasUnusedQualifyingSeatRequestMessage({
    messages,
    userId,
    tripCreatedAt
}) {
    const tripCreatedMs = parseTimestamp(tripCreatedAt);
    if (Number.isNaN(tripCreatedMs)) {
        return false;
    }

    return (messages || []).some((message) => {
        if (Number(message.user_id) !== Number(userId)) {
            return false;
        }
        if (message.is_system) {
            return false;
        }
        if (message.used_for_seat_request) {
            return false;
        }
        if (!String(message.text || '').trim()) {
            return false;
        }
        const createdMs = parseTimestamp(message.created_at);
        if (Number.isNaN(createdMs)) {
            return false;
        }
        return createdMs >= tripCreatedMs;
    });
}

export function seatRequestRequiresNewMessage({
    moduleCoordinateByMessage,
    alreadyRequested,
    messages,
    userId,
    tripCreatedAt
}) {
    if (!moduleCoordinateByMessage || alreadyRequested) {
        return false;
    }
    return !hasUnusedQualifyingSeatRequestMessage({
        messages,
        userId,
        tripCreatedAt
    });
}

export function markLatestQualifyingSeatRequestMessageUsed({
    messages,
    userId,
    tripCreatedAt
}) {
    const qualifying = (messages || []).filter((message) =>
        hasUnusedQualifyingSeatRequestMessage({
            messages: [message],
            userId,
            tripCreatedAt
        })
    );
    if (!qualifying.length) {
        return null;
    }
    const latest = qualifying.reduce((current, candidate) => {
        const currentMs = parseTimestamp(current.created_at);
        const candidateMs = parseTimestamp(candidate.created_at);
        if (candidateMs > currentMs) {
            return candidate;
        }
        if (candidateMs === currentMs && Number(candidate.id) > Number(current.id)) {
            return candidate;
        }
        return current;
    });
    latest.used_for_seat_request = true;
    return latest;
}
