export default class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(evt, listener) {
    (this.events[evt] || (this.events[evt] = [])).push(listener);
    return this;
  }

  emit(evt, arg) {
    (this.events[evt] || []).forEach((lsn) => lsn(arg));
  }
}
