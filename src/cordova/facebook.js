/* jshint esversion: 6 */
import { DebugApi } from '../services/api';

let debugApi = new DebugApi();

export default {
    login () {
        return new Promise((resolve, reject) => {
            var doLogin = function () {
                console.log('do facebook login');
                window.facebookConnectPlugin.login(['public_profile', 'email', 'user_friends'], // , 'user_birthday'
                    function (response) {
                        console.log(JSON.stringify(response));
                        resolve(response);
                    },
                    function (response) {
                        console.log(JSON.stringify(response));
                        let data = {};
                        data.log = JSON.stringify(response);

                        debugApi.log(data).then((response) => {
                            return Promise.resolve();
                        }, ({data, status}) => {
                            return Promise.reject(data);
                        });
                        reject(response);
                    }
                );
            };
            console.log('facebook login', window.cordova.platformId);
            if (window.cordova.platformId === 'browser') {
                window.facebookConnectPlugin.browserInit(process.env.FACEBOOK_API);
            }
            if (window.cordova.platformId.toLowerCase() === 'android') {
                window.facebookConnectPlugin.logout(function () {
                    console.log('Facebook Logout success');
                    doLogin();
                }, function () {
                    console.log('Facebook Logout error');
                    doLogin();
                });
            } else {
                doLogin();
            }
        });
    }
};
