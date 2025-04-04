class SidukoPlayerData {
    #guessesRemaining
    #guessesUntilNextBonus
    #funds
    #boosts
    constructor() {
        this.#guessesRemaining = 0;
        this.#guessesUntilNextBonus = 0;
        this.#funds = 0;
        this.#boosts = [];
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

    get boosts() {
        return this.#boosts;
    }


    // returns a reference to a newly added boost, or an existing item
    // if one with the same name already exists
    addBoost(boostName, boosDescription) {
        const existingBoost = this.#boosts.find(b => b.name === boostName);
        if (existingBoost) {
            return existingBoost;
        }
        const boost = new SidukoBoostData(boostName, boosDescription);
        this.#boosts.push(boost);
        return boost;
    }

    getBoost(boostName) {
        return this.#boosts.find(b => b.name === boostName);
    }

    deleteBoost(boostName) {
        const index = this.#boosts.findIndex(b => b.name === boostName);
        if (index > -1) {
            this.#boosts.splice(index, 1);
        }
    }

    renderBoosts() {
        const tbody = document.getElementById("playerBoostsTableBody");
        tbody.innerHTML = "";
        this.#boosts.forEach(boost => {
            const row = document.createElement("tr");
            const nameCell = document.createElement("td");
            nameCell.innerText = boost.name;
            row.appendChild(nameCell);
            const maxCellCountCell = document.createElement("td");
            maxCellCountCell.innerText = boost.maxCellCount;;
            row.appendChild(maxCellCountCell);
            const livesCell = document.createElement("td");
            livesCell.innerText = boost.turnsRemaining;
            row.appendChild(livesCell);       
            row.title = boost.description;     
            boost.domElement = row;
            tbody.appendChild(row);
        });
        return tbody;
    }

    doTurnPlayed(bSolvedByPlayer) {        
        if (bSolvedByPlayer) {
            this.#boosts.filter(b => b.decrmentsEachTurn && b.turnsRemaining > 0).forEach(b => {
                b.turnsRemaining--;
                if (b.turnsRemaining === 0) {
                    logMessage("Boost '" + b.name + "' has run out of turns.");                  
                }
                
            });
        }

        this.renderBoosts();
    }
       
}
