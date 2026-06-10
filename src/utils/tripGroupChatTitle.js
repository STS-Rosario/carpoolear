import dayjs from '../dayjs';

export function formatTripGroupChatTitle(t, tripDate) {
    if (!tripDate) {
        return t('viaje');
    }

    const parsed = dayjs(tripDate);
    if (!parsed.isValid()) {
        return t('viaje');
    }

    return t('groupChatTripTitle', {
        date: parsed.format('DD/MM/YYYY'),
        hour: parsed.format('HH:mm')
    });
}

export function isTripGroupConversation(conversation) {
    return conversation && Number(conversation.type) === 1;
}
