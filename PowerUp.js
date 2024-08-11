export default class PowerUp {
    constructor(powerUpFactor) {
        this.powerUpFactor = powerUpFactor;
    }

    getPowerUpFactor() {
        console.log(this.powerUpFactor)
        return this.powerUpFactor;
    }
}