/**
 * @param {Array<{ message_markdown?: string }>|null|undefined} replies
 * @param {string} messageMarkdown
 */
export function ticketReplyBodyAlreadyUsed(replies, messageMarkdown) {
    const needle = String(messageMarkdown ?? '').trim();
    if (!needle) {
        return false;
    }
    const list = Array.isArray(replies) ? replies : [];
    return list.some((r) => String(r?.message_markdown ?? '').trim() === needle);
}
