export function isOfflineApiError(error) {
    return Boolean(
        error &&
            (error.offline === true ||
                error.status === 0 ||
                (error.data && error.data.message === 'network_offline') ||
                error.message === 'network_offline')
    );
}
