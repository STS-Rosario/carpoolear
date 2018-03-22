import io from 'socket.io-client';

let socketClient;
let _token = null;
let isAuth = false;
// socketClient.on('user-notify', (data) => {
//     console.log('testing', data);
// });

export default {
    init () {
        socketClient = io('http://localhost:8890');

        socketClient.on('auth', (data) => {
            if (data.status) {
                isAuth = true;
            }
        });

        socketClient.on('disconnected', () => {
            isAuth = false;
        });

        socketClient.on('reconnect', () => {
            if (_token) {
                socketClient.emit('auth', _token);
            }
        });

        socketClient.on('new-message', (data) => {
            console.log(data);
        });
    },

    auth (token) {
        _token = token;
        socketClient.emit('auth', token);
    },

    emit (message, data) {
        socketClient.emit(message, data);
    }
};
