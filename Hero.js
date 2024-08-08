export default class Hero {
    constructor(value) {
        this.value = value;
        this.heroScore = null;
        this.heroPosition = {};
        this.heroHasKey = false;
        this.childMode = false;
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

    setHeroHasKey() { //TODO: change this to 'heroTakeKey' from Mazing.js
        this.heroHasKey = true;
    }
}