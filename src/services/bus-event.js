import mitt from 'mitt';

const emitter = mitt();

const bus = {
    emit(name, params) {
        const hasListeners = emitter.all.has(name) && emitter.all.get(name).length > 0;
        emitter.emit(name, params);
        return hasListeners;
    },
    on(name, callback) {
        emitter.on(name, callback);
    },
    off(name, callback) {
        emitter.off(name, callback);
    }
};

export default bus;
