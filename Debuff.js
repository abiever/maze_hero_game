//This class may not be necessary for Debuff purposes

export default class Debuff {
    constructor(debuffFactor) {
        this.debuffFactor = debuffFactor;
    }

    getDebuffFactor() {
        return this.debuffFactor;
    }
}