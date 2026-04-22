/**
 * When POST /api/users returns a JWT (active accounts), establish the session like after login.
 *
 * @param {object} apiResponse - Resolved axios body (fractal `data` plus optional top-level `token`)
 * @param {(token: string) => Promise<void>} onLoginWithToken
 * @returns {Promise<void>}
 */
export async function completeSessionIfRegistrationReturnsToken(apiResponse, onLoginWithToken) {
    if (
        apiResponse &&
        typeof apiResponse.token === 'string' &&
        apiResponse.token.length > 0
    ) {
        await onLoginWithToken(apiResponse.token);
    }
}
