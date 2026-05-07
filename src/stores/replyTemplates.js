import { defineStore } from 'pinia';
import { TicketsApi } from '../services/api';

const ticketsApi = new TicketsApi();

export const useReplyTemplatesStore = defineStore('replyTemplates', {
    state: () => ({
        adminList: null
    }),
    actions: {
        fetchAdminList() {
            this.adminList = null;
            return ticketsApi
                .adminReplyTemplateList()
                .then((response) => {
                    const rows = response.data || [];
                    this.adminList = rows;
                    return rows;
                })
                .catch((error) => {
                    this.adminList = [];
                    return Promise.reject(error);
                });
        },
        fetchAdminOne(id) {
            return ticketsApi.adminReplyTemplateShow(id).then((response) => response.data);
        },
        adminCreateTemplate(payload) {
            return ticketsApi.adminReplyTemplateCreate(payload).then((response) => response.data);
        },
        adminUpdateTemplate(id, payload) {
            return ticketsApi.adminReplyTemplateUpdate(id, payload).then((response) => response.data);
        },
        adminDeleteTemplate(id) {
            return ticketsApi.adminReplyTemplateDelete(id);
        },
        adminDuplicateTemplate(id) {
            return ticketsApi.adminReplyTemplateDuplicate(id).then((response) => response.data);
        }
    }
});
