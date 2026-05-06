import { shouldShowSwitchToMercadoPago } from './identityValidationModeSwitch.js';

export function shouldShowPendingManualSwitchLink(config, manualStatus) {
    return !!(
        shouldShowSwitchToMercadoPago(config) &&
        manualStatus &&
        manualStatus.has_submission &&
        manualStatus.paid === false
    );
}
