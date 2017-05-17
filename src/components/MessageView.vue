<template>  
    <div class="message">
        <div class="message-author">    
            {{ author }}
            <span class="message-time"> {{date}} </span>
        </div>
        <div class="message-text">    
            {{message.text}}
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
        };
    },
    computed: {
        author () {
            let user = this.users.find(item => this.message.user_id === item.id);
            return user.name;
        },

        date () {
            return this.message.created_at;
        }
    },
    props: [
        'users',
        'message',
        'user'
    ]
};
</script>