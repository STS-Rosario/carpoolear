export function shouldShowPendingManualSwitchLink(config, manualStatus) {
    return !!(
        config &&
        config.identity_validation_mercado_pago_enabled === true &&
        manualStatus &&
        manualStatus.has_submission &&
        manualStatus.paid === false
    );
}
