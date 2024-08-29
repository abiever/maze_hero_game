import Monster from "./Monster.js";

export default class Boss extends Monster {
    constructor(bossLevel) {
        super(bossLevel);
        this.specialAbility = "Roar"; // Example special ability
    }
    
    /*The below are just placeholders for now */
    useSpecialAbility() {
        console.log(`The boss uses ${this.specialAbility}!`);
        // Implement the effect of the special ability here
    }

    dropLoot() {
        console.log("The boss drops rare loot!");
        // Implement loot dropping logic here
    }
}