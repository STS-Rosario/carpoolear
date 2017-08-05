import Vue from 'vue';
import { getRoute } from './services/utility';

Vue.filter('profile-image', function (value) {
    return getRoute(value, '/image/profile/');
});

Vue.filter('conversation-image', function (value) {
    return getRoute(value);
});

Vue.filter('googleInfoClean', function (value) {
    return value.replace('Province', '');
});
