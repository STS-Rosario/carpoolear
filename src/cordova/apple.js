/* jshint esversion: 6 */
import { DebugApi } from '../services/api';

let debugApi = new DebugApi();

export default {
    login () {
        return new Promise((resolve, reject) => {
            SignInWithApple.isAvailable().then(function (isAvailable) {
                console.log('SignInWithApple', isAvailable);
                if (isAvailable) {
                    SignInWithApple.request({
                        requestedScopes: [ SignInWithApple.Scope.Email, SignInWithApple.Scope.FullName ],
                        requestedOperation: SignInWithApple.Operation.Login,
                    }).then(function (credential) {
                        console.log('SignInWithApple credentials: ', credential);
                        resolve(credential);
                    });
                }
            });
        });
    }
};
