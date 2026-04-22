/**
 * When POST /api/users returns a JWT (active accounts), establish the session like after login.
 *
 * @param {object} apiResponse - Resolved axios body (fractal `data` plus optional top-level `token`)
 * @param {(token: string) => Promise<void>} onLoginWithToken
 * @returns {Promise<void>}
 */
export async function completeSessionIfRegistrationReturnsToken(apiResponse, onLoginWithToken) {
    const token = apiResponse?.token;
    if (typeof token !== 'string' || token.length === 0) {
        return;
    }
    await onLoginWithToken(token);
}
