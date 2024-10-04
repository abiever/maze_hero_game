export default class Timer {
    constructor() {
        this.seconds = 0;
        this.minutes = 0;
        this.minutesElement = document.getElementById("minutes");
        this.secondsElement = document.getElementById("seconds");
        this.timer = document.getElementById("timer");
        this.interval = null;
    }

    run() {
        this.seconds++;
        
        if (this.seconds <= 9) {
            this.secondsElement.innerHTML = "0" + this.seconds;
        }
        
        if (this.seconds > 9) {
            this.secondsElement.innerHTML = this.seconds.toString();
        } 
        
        if (this.seconds > 59) {
            //console.log("seconds");
            this.minutes++;
            this.minutesElement.innerHTML = this.minutes < 10 ? "0" + this.minutes : this.minutes.toString();
            this.seconds = 0;
            this.secondsElement.innerHTML = "00";
        }
        
        if (this.minutes > 9) {
            this.minutesElement.innerHTML = this.minutes.toString();
        }
    }

    start() {
        this.interval = setInterval(this.run.bind(this), 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    reset() {
        this.seconds = 0;
        this.minutes = 0;
        this.minutesElement.innerHTML = "00";
        this.secondsElement.innerHTML = "00";
    }
}