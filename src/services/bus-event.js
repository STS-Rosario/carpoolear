import Vue from 'vue';

class EventBuffer {
    constructor () {
        this.buffer = new Vue();
    }

    emit (name, params) {
        console.log(this.buffer._events);
        let b = this.buffer._events[name] && this.buffer._events[name].length;
        this.buffer.$emit(name, params);
        return b;
    }

    on (name, callback) {
        this.buffer.$on(name, callback);
    }

    off (name, callback) {
        this.buffer.$off(name, callback);
    }
}

let bus = new EventBuffer();

export default bus;

export {
    EventBuffer
};

