import Vue from 'vue';

Vue.filter('profile-image', function (value) {
    if (value && value.length) {
        return process.env.API_URL + '/image/profile/' + value;
    } else {
        return process.env.ROUTE_BASE + 'static/img/default-profile.png';
    }
});

Vue.filter('conversation-image', function (value) {
    if (value && value.length) {
        return process.env.API_URL + value;
    } else {
        return process.env.ROUTE_BASE + 'static/img/default-profile.png';
    }
});
