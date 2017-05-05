/* jshint esversion: 6 */

export default {
    login () {
        if (window.cordova.platformId === 'browser') {
            window.facebookConnectPlugin.browserInit('829566563845558');
        }
        window.facebookConnectPlugin.login(['public_profile', 'email', 'user_friends', 'user_birthday'],
            function (response) { console.log(JSON.stringify(response)); },
            function (response) { console.log(JSON.stringify(response)); }
        );
    }

};
