import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const viewPath = path.resolve(__dirname, 'ConversationChat.vue');
const viewSource = fs.readFileSync(viewPath, 'utf8');

describe('ConversationChat report action', () => {
    it('shows Denunciar beside the conversation title for the other participant', () => {
        expect(viewSource).toContain("from '../../utils/reportTicketRoute'");
        expect(viewSource).toContain('buildReportTicketRoute');
        expect(viewSource).toContain('reportTicketSubjectForUser');
        expect(viewSource).toContain('otherConversationUser');
        expect(viewSource).toContain('canReportConversationUser');
        expect(viewSource).toContain('reportConversationUserRoute');
        expect(viewSource).toContain("$t('denunciar')");
        expect(viewSource).toContain('fa-flag');
        expect(viewSource).toContain('conversation_user_header_top');
        expect(viewSource).toMatch(
            /v-if="canReportConversationUser"[\s\S]*?:to="reportConversationUserRoute"/s
        );
        expect(viewSource).toMatch(
            /conversation_user_header_top[\s\S]*\$t\('denunciar'\)/s
        );
    });
});
