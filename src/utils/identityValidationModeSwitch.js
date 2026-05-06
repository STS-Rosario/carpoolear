export function shouldShowSwitchToMercadoPago(config) {
    return !!(
        config &&
        config.identity_validation_mercado_pago_enabled === true
    );
}
