import { eventBus } from "./shared";

export class Timer {
    #timer;
    #seconds;
    #time;

    constructor(seconds) {
        this.#seconds = seconds || 60;
        this.#time = this.#seconds;
        // this._init();
    }

    start() {
        this.#timer = setInterval(function () {
            if (this.#time <= 0) {
                clearInterval(this.#timer);
                this._afk();
                return;
            }
            this.#time--;
        }.bind(this), 1000)
    }

    stop() {
        clearInterval(this.#timer);
    }


    _afk() {
        $(eventBus).trigger('reset-page');
    }
}