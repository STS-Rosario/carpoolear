import { getApiErrorMessage } from './apiErrors.js';
import { logGenericApiErrorForDebug } from './clientErrorReporting.js';

export async function handleGenericApiError(
    error,
    {
        source,
        fallbackMessageKey,
        t,
        dialogs,
        reportError = logGenericApiErrorForDebug,
        isDebugEnabled = async () => false
    } = {}
) {
    const debugEnabled = await isDebugEnabled();
    await reportError(source, error, { debugEnabled });

    const message = getApiErrorMessage(error, t(fallbackMessageKey), (key, params) =>
        t(key, params)
    );

    dialogs.message(message, { estado: 'error' });
}
