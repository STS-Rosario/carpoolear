/* jshint esversion: 6 */
export default {
    login() {
        return new Promise((resolve, reject) => {
            window.SignInWithApple.isAvailable().then(function (isAvailable) {
                console.log('SignInWithApple', isAvailable);
                if (isAvailable) {
                    window.SignInWithApple.request({
                        requestedScopes: [
                            window.SignInWithApple.Scope.Email,
                            window.SignInWithApple.Scope.FullName,
                        ],
                        requestedOperation:
                            window.SignInWithApple.Operation.Login,
                    }).then(function (credential) {
                        console.log(
                            'SignInWithApple credentials: ',
                            credential
                        );
                        resolve(credential);
                    });
                }
            });
        });
    },
};
