export default class Hero {
    constructor(value) {
        this.heroValue = value;
        this.heroStepCount = 0;
        this.heroPosition = {};
        this.heroHasKey = false;
    }

    getHeroValue() {
        return this.heroValue;
    }

    increaseHeroValue(valueToAdd) {
        this.heroValue += valueToAdd;
    }

    getHeroStepCount() {
        return this.heroStepCount;
    }

    setHeroStepCount(stepCount) {
        this.heroStepCount = stepCount;
    }

    powerUpHero(factorValue) {
        this.heroValue *= factorValue;
    }

    setHeroPosition(position) {
        this.heroPosition = position;
    }

    getHeroPosition() {
        return this.heroPosition;
    }

    setHeroHasKey(hasKey) {
        this.heroHasKey = hasKey;
    }

    hasKey() {
        return this.heroHasKey;
    }

    increaseHeroStepCount() {
        this.heroStepCount += 1;
    }

    
}
