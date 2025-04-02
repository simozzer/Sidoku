class SidukoPlayerData {
    #guessesRemaining
    #guessesUntilNextBonus
    #funds
    constructor() {
        this.#guessesRemaining = 0;
        this.#guessesUntilNextBonus = 0;
        this.#funds = 0;
    }

    get guessesRemaining() {
        return this.#guessesRemaining;         
    }

    set guessesRemaining(value) {
        this.#guessesRemaining = value;
        document.getElementById("playerGuessesRemaining").innerText = this.#guessesRemaining;
    }

    get guessesUntilNextBonus() {
        return this.#guessesUntilNextBonus;
    }

    set guessesUntilNextBonus(value) {
        this.#guessesUntilNextBonus = value;
        document.getElementById("playerGuessesUntilBonus").innerText = this.#guessesUntilNextBonus;
    }

    get funds() {
        return this.#funds;
    }

    set funds(value) {
        this.#funds = value;
        document.getElementById("playerFunds").innerText = "$" + this.#funds;
    }

}