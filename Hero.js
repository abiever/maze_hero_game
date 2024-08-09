export default class Hero {
    constructor(value) {
        this.heroValue = value;
        this.heroScore = null;
        this.heroPosition = {};
        this.heroHasKey = false;
    }

    getHeroValue() {
        return this.heroValue;
    }

    increaseHeroValue(valueToAdd) {
        this.heroValue += valueToAdd;
    }

    setHeroScore(score) {
        this.heroScore = score;
    }

    setHeroPosition(position) {
        this.heroPosition = position;
    }

    getHeroPosition() {
        return this.heroPosition;
    }

    getHeroScore() {
        return this.heroScore;
    }

    setHeroHasKey(hasKey) {
        this.heroHasKey = hasKey;
    }

    hasKey() {
        return this.heroHasKey;
    }

    decreaseScore(amount) {
        this.heroScore = Math.max(this.heroScore - amount, 0);
    }

    increaseScore(amount) {
        this.heroScore += amount;
    }
}
