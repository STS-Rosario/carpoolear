import { isTripGroupConversation } from './tripGroupChatTitle';

/**
 * Filter conversations by list chip kind.
 * @param {Array} conversations
 * @param {'all'|'group'|'individual'} kind
 */
export function filterConversationsByKind(conversations, kind) {
    const list = Array.isArray(conversations) ? conversations : [];
    if (kind === 'group') {
        return list.filter((c) => isTripGroupConversation(c));
    }
    if (kind === 'individual') {
        return list.filter((c) => !isTripGroupConversation(c));
    }
    return list;
}

export function countConversationsByKind(conversations) {
    const list = Array.isArray(conversations) ? conversations : [];
    let group = 0;
    let individual = 0;
    list.forEach((c) => {
        if (isTripGroupConversation(c)) {
            group += 1;
        } else {
            individual += 1;
        }
    });
    return {
        all: list.length,
        group,
        individual
    };
}
