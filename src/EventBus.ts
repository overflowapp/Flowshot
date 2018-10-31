export default class EventBus {
    private functionMap = {};

    add(event, func) {
        this.functionMap[event] = func;
        document.addEventListener(event.split('.')[0], this.functionMap[event]);
    }

    remove(event) {
        document.removeEventListener(event.split('.')[0], this.functionMap[event]);
        delete this.functionMap[event];
    }
}