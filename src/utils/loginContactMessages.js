export function getLoginBannedMessage(t, adminEmail) {
    return t('usuarioBanneado', { adminEmail });
}

export function getLoginInactiveAccountMessage(t, adminEmail) {
    return t('paraIngresarCuenta', { adminEmail });
}
