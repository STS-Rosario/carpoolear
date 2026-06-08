export function getOtherParticipant(users, currentUserId) {
    if (!Array.isArray(users) || currentUserId == null) {
        return null;
    }
    const others = users.filter((user) => user && user.id !== currentUserId);
    if (others.length !== 1) {
        return null;
    }
    return others[0];
}

export function getOtherParticipantRatings(users, currentUserId) {
    const other = getOtherParticipant(users, currentUserId);
    if (!other) {
        return null;
    }
    return {
        positive: Number(other.positive_ratings) || 0,
        negative: Number(other.negative_ratings) || 0
    };
}
