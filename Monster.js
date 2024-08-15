export default class Monster {
    constructor(monsterLevel) {
        this.monsterLevel = monsterLevel;
        this.monsterPosition = {};
    }

    getMonsterLevel() {
        return this.monsterLevel;
    }

    increaseMonsterLevel(valueToAdd) {
        this.monsterLevel += valueToAdd;
    }

    setMonsterPosition(position) {
        this.monsterPosition = position;
    }

    getMonsterPosition() {
        return this.monsterPosition;
    }
}