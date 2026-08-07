export const MERCADO_PAGO_MY_APPS_URL =
    'https://www.mercadopago.com.ar/accounts/my-apps';

export function shouldShowMercadoPagoIntegrationDisconnectHint({
    resultMessage,
    user
}) {
    if (resultMessage === 'success') {
        return true;
    }
    return Boolean(user && user.identity_validation_type === 'mercado_pago');
}
