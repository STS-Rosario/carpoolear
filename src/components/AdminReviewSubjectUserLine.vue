<template>
    <p><strong>{{ $t(labelKey) }}:</strong>&nbsp;
        <router-link v-if="userId" :to="getAdminUserProfileRoute(userId)">
            {{ userName }}
        </router-link>
        <span v-else>{{ userName || $t('na') }}</span>
    </p>
</template>

<script>
import { getAdminUserProfileRoute } from '../utils/adminProfileRoute';

export default {
    name: 'AdminReviewSubjectUserLine',
    props: {
        labelKey: {
            type: String,
            required: true
        },
        userId: {
            type: [Number, String],
            default: null
        },
        userName: {
            type: String,
            default: ''
        }
    },
    methods: {
        getAdminUserProfileRoute
    }
};
</script>
