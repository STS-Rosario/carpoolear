export const SWITCH_TO_MERCADO_PAGO_ROUTE = Object.freeze({
    name: 'identity_validation'
});

export function shouldShowSwitchToMercadoPago(config) {
    return !!(
        config &&
        config.identity_validation_mercado_pago_enabled === true
    );
}
