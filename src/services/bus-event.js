import Vue from 'vue';

class EventBuffer {
    constructor () {
        this.buffer = new Vue();
    }

    emit (name, params) {
        this.buffer.$emit(name, params);
    }

    on (name, callback) {
        this.buffer.$on(name, callback);
    }
}

let bus = new EventBuffer();

export default bus;

export {
    EventBuffer
};

