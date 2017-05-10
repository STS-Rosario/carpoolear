<template>
    <div class="conversation_chat" v-if="conversation">   
        <div class="list-group">
            <div class="list-group-item">
                <h2> {{conversation.title}} </h2>    
                <span class="chat_last_connection"> {{lastConnection | moment("calendar")}}  </span>
            </div>
            <div class="list-group-item">
            
            </div>
            <div class="list-group-item">
                <div class="input-group">
                    <input v-model="message" type="text" class="form-control" placeholder="Escribir mensaje...">
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="button">
                            <i class="fa fa-play" aria-hidden="true"></i>
                        </button>
                    </span>
                </div>
            </div>
        </div>
        
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';

export default {
    name: 'conversation-chat',
    data () {
        return {
            message: ''
        };
    },
    computed: {
        ...mapGetters({
            'conversation': 'conversations/selectedConversation',
            'user': 'auth/user'
        }),
        lastConnection () {
            let users = this.conversation.users.filter(item => item.id !== this.user.id);
            if (users.length > 1) {
                return '';
            } else {
                return users[0].last_connection;
            }
        }
    },
    methods: {
        ...mapActions({
            'select': 'conversations/select'
        })
    },
    mounted () {
        this.select(parseInt(this.id));
    },
    watch: {
        'id': function () {
            this.select(parseInt(this.id));
        }
    },
    props: ['id']
};
</script>