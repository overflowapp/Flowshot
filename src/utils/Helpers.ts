const cuid = require('cuid');

export default class Helpers {
    public static genId() {
        return cuid();
    }
}
