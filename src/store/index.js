import { createStore } from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import auth from './modules/auth';
import cordova from './modules/cordova';
import trips from './modules/trips';
import device from './modules/device';
import myTrips from './modules/my-trips';
import conversations from './modules/conversations';
import cars from './modules/car';
import friends from './modules/friends';
import passenger from './modules/passenger';
import notifications from './modules/notifications';
import rates from './modules/rates';
import actionbars from './modules/actionbars';
import profile from './modules/profile';
import background from './modules/background';
import subscriptions from './modules/subscriptions';
import admin from './modules/admin';

export default createStore({
    actions,
    getters,
    state: {
        appVersion: 3
    },
    modules: {
        auth,
        cordova,
        trips,
        device,
        myTrips,
        conversations,
        cars,
        friends,
        passenger,
        notifications,
        rates,
        actionbars,
        profile,
        background,
        subscriptions,
        admin
    }
});
