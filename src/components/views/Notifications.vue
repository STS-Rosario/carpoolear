<template>
    <div>
        <Loading class="container" :data="notifications">
            <div class="notifications-list list-group">
                <div class="list-group-item" v-for="n in notifications" :class="{'unread': !n.readed}" @click="onNotificationClick(n)">
                    <div class="row">
                        <div class="col-xs-22">
                            <i class="fa fa-bell-o" aria-hidden="true" v-show="!n.readed"></i>
                            <strong>{{n.text}}</strong>
                            <em>{{n.created_at | moment('calendar')}}</em>
                        </div>
                        <span class="col-xs-2 text-right">
                            <i class="fa fa-chevron-right" aria-hidden="true"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div class="text-right">
                <button class="btn btn-primary" v-on:click="nextPage()">Siguiente</button>
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">No hay notificaciones</p>
            <p slot="loading" class="alert alert-info" role="alert">
                <img src="https://carpoolear.com.ar/static/img/loader.gif" alt="" class="ajax-loader" />
                Cargando notificaciones ...
            </p>
        </Loading>
    </div>
</template>

<script>
import Loading from '../Loading';
import { mapActions, mapGetters } from 'vuex';
import router from '../../router';

export default {
    name: 'notifications',

    data () {
        return {
            query: {
                page: 1,
                page_size: 25,
                mark: true
            }
        };
    },

    methods: {
        ...mapActions({
            search: 'notifications/index'
        }),

        onNotificationClick (n) {
            console.log('onNotificationClick', n);
            if (n.extras) {
                console.log(n.extras);
                switch (n.extras.type) {
                case 'trip':
                    router.push({ name: 'detail_trip', params: { id: n.extras.trip_id } });
                    break;
                case 'friends':
                    router.push({ name: 'friends_setting' });
                    break;
                case 'subscription':
                    router.push({ name: 'my-trips', query: { loc: 'suscriptions' } });
                    break;
                case 'my-trips':
                    router.push({ name: 'my-trips' });
                    break;
                case 'conversation':
                    router.push({ name: 'conversation-chat', params: { id: n.extras.conversation_id } });
                    break;
                }
            }
        },
        nextPage () {
            this.query.page += 1;
            this.search(this.query);
        }
    },

    computed: {
        ...mapGetters({
            notifications: 'notifications/index'
        })
    },

    mounted () {
        this.search(this.query);
    },

    components: {
        Loading
    }

};
</script>

<style scoped>
    .container {
        padding: 3em 2em;
    }
    .notifications-list .list-group-item {
        cursor: pointer;
    }
    .notifications-list .list-group-item:hover {
        background: #EEE;
    }
    .notifications-list .list-group-item.unread {
        background: rgba(254, 153, 0, 0.25);
    }
    .notifications-list .list-group-item.unread:hover {
        background: rgba(254, 222, 0, 0.1);
    }
</style>
