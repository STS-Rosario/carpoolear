import { defineStore } from 'pinia';
import { TicketsApi } from '../services/api';

const ticketsApi = new TicketsApi();

export const useTicketsStore = defineStore('tickets', {
    state: () => ({
        list: null,
        selected: null,
        adminList: null
    }),
    actions: {
        fetchList() {
            this.list = null;
            return ticketsApi.list().then((response) => {
                this.list = response.data || [];
                return this.list;
            });
        },
        fetchOne(id) {
            this.selected = null;
            return ticketsApi.show(id).then((response) => {
                this.selected = response.data;
                return this.selected;
            });
        },
        createTicket(payload) {
            return ticketsApi.create(payload).then((response) => response.data);
        },
        replyTicket(id, payload) {
            return ticketsApi.reply(id, payload).then((response) => response.data);
        },
        closeTicket(id, payload) {
            return ticketsApi.close(id, payload).then((response) => response.data);
        },
        fetchAdminList() {
            this.adminList = null;
            return ticketsApi.adminList().then((response) => {
                this.adminList = response.data || [];
                return this.adminList;
            }).catch((error) => {
                this.adminList = [];
                return Promise.reject(error);
            });
        },
        fetchAdminOne(id) {
            return ticketsApi.adminShow(id).then((response) => response.data);
        },
        adminCreateTicket(payload) {
            return ticketsApi.adminCreate(payload).then((response) => response.data);
        },
        adminReply(id, payload) {
            return ticketsApi.adminReply(id, payload).then((response) => response.data);
        },
        adminResolve(id, payload) {
            return ticketsApi.adminResolve(id, payload).then((response) => response.data);
        },
        adminClose(id, payload) {
            return ticketsApi.adminClose(id, payload).then((response) => response.data);
        },
        adminReopen(id) {
            return ticketsApi.adminReopen(id).then((response) => response.data);
        },
        adminSetPriority(id, priority) {
            return ticketsApi.adminSetPriority(id, priority).then((response) => response.data);
        },
        adminSetInternalNote(id, note) {
            return ticketsApi.adminSetInternalNote(id, note).then((response) => response.data);
        }
    }
});
