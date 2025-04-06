
class SidukoBoostData {
    #name
    #maxCellCount
    #accuracy
    #turnsRemaining
    #description
    #decrementsEachTurn
    #domElement
    #exhausted;
    constructor(name, description) {
        this.#name = name;
        this.#maxCellCount = 1;
        this.#accuracy = 0.3;
        this.#turnsRemaining = null;
        this.#description = description;
        this.#decrementsEachTurn = false;
        this.#domElement = null;
        this.#exhausted = false;
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

    get exhausted() {
        return this.#exhausted;        
    }

    set exhausted(value) {
        this.#exhausted = value;
        if (value) {
            this.#domElement.classList.add("exhausted");
            this.#turnsRemaining = null;
        } else {
            this.#domElement.classList.remove("exhausted");
        }
    }

    set decrementsEachTurn(value) {
        this.#decrementsEachTurn = true;
    }

    get domElement() {
        return this.#domElement;
    }

    set domElement(value) {
        this.#domElement = value;
    }

}