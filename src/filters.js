import Vue from 'vue';

Vue.filter('profile-image', function (value) {
    if (value && value.length) {
        return process.env.API_URL + '/image/profile/' + value;
    } else {
        return '/static/img/default-profile.png';
    }
});
