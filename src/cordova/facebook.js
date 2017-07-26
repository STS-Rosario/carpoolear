/* jshint esversion: 6 */

export default {
    login () {
        return new Promise((resolve, reject) => {
            if (window.cordova.platformId === 'browser') {
                window.facebookConnectPlugin.browserInit(process.env.FACEBOOK_API);
            }
            window.facebookConnectPlugin.login(['public_profile', 'email', 'user_friends', 'user_birthday'],
                function (response) {
                    console.log(JSON.stringify(response));
                    resolve(response);
                },
                function (response) {
                    console.log(JSON.stringify(response));
                    reject(response);
                }
            );
        });
    }
};
