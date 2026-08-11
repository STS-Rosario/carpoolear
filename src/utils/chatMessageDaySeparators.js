import dayjs from '../dayjs';

/**
 * Interleave day separator markers with messages for chat rendering.
 * @param {Array<{id: *, created_at: string}>} messages
 * @param {(key: string) => string} t i18n translate
 * @param {import('dayjs').Dayjs} [now]
 * @returns {Array<{type: 'day', key: string, label: string}|{type: 'message', message: object}>}
 */
export function buildMessagesWithDaySeparators(messages, t, now = dayjs()) {
    const list = Array.isArray(messages) ? messages : [];
    const items = [];
    let lastDayKey = null;
    const todayKey = now.format('YYYY-MM-DD');
    const yesterdayKey = now.subtract(1, 'day').format('YYYY-MM-DD');

    list.forEach((message) => {
        const d = dayjs(message.created_at);
        const dayKey = d.isValid() ? d.format('YYYY-MM-DD') : 'unknown';
        if (dayKey !== lastDayKey) {
            let label;
            if (dayKey === todayKey) {
                label = t('mensajeDiaHoy');
            } else if (dayKey === yesterdayKey) {
                label = t('mensajeDiaAyer');
            } else if (d.isValid()) {
                label = d.format('DD/MM/YYYY');
            } else {
                label = '';
            }
            if (label) {
                items.push({
                    type: 'day',
                    key: `day-${dayKey}`,
                    label
                });
            }
            lastDayKey = dayKey;
        }
        items.push({
            type: 'message',
            message
        });
    });
    return items;
}
