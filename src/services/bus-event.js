import Vue from 'vue';

class EventBuffer {
    constructor() {
        this.buffer = new Vue();
    }

    emit(name, params) {
        const events = this.buffer._events || {};
        const b = events[name] && events[name].length;
        this.buffer.$emit(name, params);
        return b;
    }

    on(name, callback) {
        this.buffer.$on(name, callback);
    }

    off(name, callback) {
        this.buffer.$off(name, callback);
    }
}

const bus = new EventBuffer();

export default bus;

export { EventBuffer };
