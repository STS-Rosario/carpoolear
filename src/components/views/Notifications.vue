<template> 
    <div>
        <Loading :data="notifications">
            <div id="notifications-list list-group">
                <div class="list-group-item" v-for="n in notifications" :class="{'unread': !n.readed}" @click="onNotificationClick(n)">
                    <div>
                        {{n.text}} - {{n.created_at | moment('calendar')}}
                    </div>
                </div>
            </div>
            <p slot="no-data" class="alert alert-warning"  role="alert">No hay notificaciones</p> 
            <p slot="loading" class="alert alert-info" role="alert">Cargando notificaciones ...</p>
        </Loading>
    </div>
</template>

<script>
import Loading from '../Loading';
import {mapActions, mapGetters} from 'vuex';
import router from '../../router';

export default {
    name: 'notifications',

    data () {
        return {

        };
    },

    methods: {
        ...mapActions({
            search: 'notifications/index'
        }),

        onNotificationClick (n) {
            if (n.extras) {
                switch (n.extras.type) {
                case 'trip':
                    router.push({name: 'detail_trip', params: { id: n.extras.trip_id }});
                    break;
                case 'friends':
                    router.push({name: 'trips'});
                    break;
                case 'my-trips':
                    router.push({ name: 'my-trips' });
                    break;
                case 'conversation':
                    router.push({ name: 'conversation-chat', params: { id: n.extras.conversation_id } });
                    break;
                }
            }
        }
    },

    computed: {
        ...mapGetters({
            notifications: 'notifications/index'
        })
    },

    mounted () {
        this.search(true);
    },

    components: {
        Loading
    }

};
</script>