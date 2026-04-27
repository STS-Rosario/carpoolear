import TaggedApi from '../../classes/TaggedApi';

class TicketsApi extends TaggedApi {
    list() {
        return this.get('/api/support/tickets');
    }

    show(id) {
        return this.get('/api/support/tickets/' + id);
    }

    create(data) {
        const body = this.toFormData(data);
        return this.post('/api/support/tickets', body);
    }

    reply(id, data) {
        const body = this.toFormData(data);
        return this.post('/api/support/tickets/' + id + '/replies', body);
    }

    close(id, data = {}) {
        return this.post('/api/support/tickets/' + id + '/close', data);
    }

    adminList() {
        return this.get('/api/admin/support/tickets');
    }

    adminShow(id) {
        return this.get('/api/admin/support/tickets/' + id);
    }

    adminReply(id, data) {
        const body = this.toFormData(data);
        return this.post('/api/admin/support/tickets/' + id + '/replies', body);
    }

    adminResolve(id, data = {}) {
        return this.post('/api/admin/support/tickets/' + id + '/resolve', data);
    }

    adminClose(id, data = {}) {
        return this.post('/api/admin/support/tickets/' + id + '/close', data);
    }

    adminReopen(id) {
        return this.post('/api/admin/support/tickets/' + id + '/reopen', {});
    }

    adminSetPriority(id, priority) {
        return this.put('/api/admin/support/tickets/' + id + '/priority', { priority });
    }

    adminSetInternalNote(id, internalNoteMarkdown) {
        return this.put('/api/admin/support/tickets/' + id + '/internal-note', {
            internal_note_markdown: internalNoteMarkdown
        });
    }

    toFormData(data) {
        const form = new FormData();
        Object.keys(data || {}).forEach((key) => {
            const value = data[key];
            if (value == null) return;
            if (key === 'attachments' && Array.isArray(value)) {
                value.slice(0, 3).forEach((file) => {
                    form.append('attachments[]', file);
                });
                return;
            }
            form.append(key, value);
        });
        return form;
    }
}

export { TicketsApi as default };
