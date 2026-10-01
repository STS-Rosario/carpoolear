import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

const replyMock = vi.fn();

vi.mock('../services/api', () => ({
    FriendsApi: class FriendsApiMock {
        constructor() {
            return {};
        }
    },
    UserApi: class UserApiMock {
        constructor() {
            return {};
        }
    },
    RateApi: class RateApiMock {
        constructor() {
            return {};
        }
    },
    ReferencesApi: class ReferencesApiMock {
        constructor() {
            return {
                reply: replyMock
            };
        }
    }
}));

describe('profile store reference reply', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        replyMock.mockReset();
        replyMock.mockResolvedValue({ data: 'ok' });
    });

    it('posts a reply and stores it on the matching reference', async () => {
        const { useProfileStore } = await import('./profile');
        const store = useProfileStore();
        store.user = {
            id: 10,
            name: 'Bob',
            references_data: [
                {
                    id: 1,
                    user_id_from: 7,
                    from: { id: 7, name: 'Ana' },
                    comment: 'Great person.',
                    reply_comment: null
                }
            ]
        };

        await store.replyReference({
            user_id: 7,
            comment: 'Thanks Ana!'
        });

        expect(replyMock).toHaveBeenCalledWith(7, { comment: 'Thanks Ana!' });
        expect(store.user.references_data[0].reply_comment).toBe('Thanks Ana!');
        expect(store.user.references_data[0].reply_comment_created_at).toBeTruthy();
    });
});
