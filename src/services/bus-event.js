import mitt from 'mitt';

class EventBuffer {
    constructor() {
        this.emitter = mitt();
    }

    emit(name, params) {
        this.emitter.emit(name, params);
    }

    on(name, callback) {
        this.emitter.on(name, callback);
    }

    off(name, callback) {
        this.emitter.off(name, callback);
    }
}

const bus = new EventBuffer();

export default bus;

export { EventBuffer };
