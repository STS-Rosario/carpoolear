export function isUserIdentityVerified(user) {
    if (!user) {
        return false;
    }
    if (typeof user.identity_validated === 'boolean') {
        return user.identity_validated;
    }
    return Number(user.identity_validated) > 0;
}

export function applySuccessfulIdentityVerificationToUser(
    user,
    verifiedAt = new Date().toISOString()
) {
    if (!user) {
        return user;
    }

    return {
        ...user,
        identity_validated: true,
        identity_validated_at: user.identity_validated_at || verifiedAt,
        identity_validation_rejected_at: null,
        identity_validation_reject_reason: null
    };
}

export function syncAuthUserAfterIdentityVerificationSuccess({
    resultMessage,
    user,
    setUser,
    fetchUser
}) {
    if (resultMessage !== 'success') {
        return Promise.resolve();
    }

    if (typeof setUser === 'function' && user) {
        setUser(applySuccessfulIdentityVerificationToUser(user));
    }

    if (typeof fetchUser === 'function') {
        return Promise.resolve(fetchUser());
    }

    return Promise.resolve();
}
