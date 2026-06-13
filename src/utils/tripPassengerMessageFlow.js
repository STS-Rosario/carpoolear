export function shouldShowPricingHint({ user, config, force = false }) {
    if (force) {
        return false;
    }
    if (config?.['disable_user_hints']) {
        return false;
    }
    if (user?.['do_not_alert_pricing']) {
        return false;
    }
    return true;
}

export function resolveRequestSeatModalConfirm({
    moduleCoordinateByMessage,
    user,
    config
}) {
    if (!moduleCoordinateByMessage) {
        return {
            closeRequestSeatModal: true,
            showPricingModal: false,
            openConversation: false,
            makeSeatRequest: true
        };
    }

    const showPricingModal = shouldShowPricingHint({ user, config });

    return {
        closeRequestSeatModal: true,
        showPricingModal,
        openConversation: !showPricingModal,
        makeSeatRequest: false
    };
}

export function resolvePricingModalConfirm() {
    return {
        closeRequestSeatModal: true,
        closePricingModal: true,
        openConversation: true
    };
}

export function resolveOpenConversationModalState() {
    return {
        showRequestSeatModal: false,
        showPricingModal: false
    };
}
