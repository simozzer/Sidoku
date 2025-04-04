
class SidukoBoostData {
    #name
    #maxCellCount
    #accuracy
    #turnsRemaining
    #description
    #decrementsEachTurn
    constructor(name, description) {
        this.#name = name;
        this.#maxCellCount = 2;
        this.#accuracy = 0.3;
        this.#turnsRemaining = null;
        this.#description = description;
        this.#decrementsEachTurn = false;
    }
    
    get name() {
        return this.#name;
    }

    get accuracy() {
        return this.#accuracy;
    }

    get description() {
        return this.#description;
    }

    get maxCellCount() {
        return this.#maxCellCount;
    }
    
    boostAccuracy() {
        if (this.accuracy < 1) {
            this.#accuracy += 0.1;
        }
    }

    boostMaxCellCount() {
        if (this.#maxCellCount < 5) {
            this.#maxCellCount += 1
        }
    }

    get turnsRemaining() {
        return this.#turnsRemaining;
    }

    set turnsRemaining(value) {
        this.#turnsRemaining = value;     
    }

    get decrmentsEachTurn() {
        return this.#decrementsEachTurn;
    }

    set decrementsEachTurn(value) {
        this.#decrementsEachTurn = true;
    }


}