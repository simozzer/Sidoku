class SidukoPlayerData {
  #guessesRemaining;
  #funds;
  #boosts;
  #puzzle;
  constructor() {
    this.#guessesRemaining = 0;
    this.#funds = 0;
    this.#boosts = [];
    this.#puzzle = null;
  }

  get guessesRemaining() {
    return this.#guessesRemaining;
  }

  set guessesRemaining(value) {
    this.#guessesRemaining = value;
    const oElem = document.getElementById("playerGuessesRemaining");
    if (oElem) {
      oElem.innerText = value;
    }
  }

  get funds() {
    return this.#funds;
  }

  set funds(value) {
    const oElem = document.getElementById("playerFunds");
    if (oElem) {
      oElem.innerText = "$" + value;

      if (value > this.#funds) {
        oElem.classList.add("fund-boost");
        const fnListener = () => {
          const playerFundsElem = document.getElementById("playerFunds");
          playerFundsElem.classList.remove("fund-boost");
          playerFundsElem.removeEventListener("animationend", fnListener);
        };
        oElem.addEventListener("animationend", fnListener);
      } else if (value < this.#funds) {
        oElem.classList.add("fund-reduce");
        const fnListener = () => {
          const playerFundsElem = document.getElementById("playerFunds");
          playerFundsElem.classList.remove("fund-reduce");
          playerFundsElem.removeEventListener("animationend", fnListener);
        };
        oElem.addEventListener("animationend", fnListener);
      }
    }

    this.#funds = value;
  }

  get boosts() {
    return this.#boosts;
  }

  set puzzle(value) {
    this.#puzzle = value;
  }

  get puzzle() {
    return this.#puzzle;
  }
  // returns a reference to a newly added boost, or an existing item
  // if one with the same name already exists
  addBoost(boostName, boosDescription, puzzle) {
    const existingBoost = this.#boosts.find((b) => b.name === boostName);
    if (existingBoost) {
      return existingBoost;
    }
    const boost = new SidukoBoostData(boostName, boosDescription, puzzle);
    this.#boosts.push(boost);
    return boost;
  }

  addBoostItem(boost) {
    const existingBoost = this.#boosts.find((b) => b.name === boost.name);
    if (existingBoost) {
      return existingBoost;
    }
    this.#boosts.push(boost);
    return boost;
  }

  getBoost(boostName) {
    return this.#boosts.find((b) => b.name === boostName);
  }

  deleteBoost(boostName) {
    const index = this.#boosts.findIndex((b) => b.name === boostName);
    if (index > -1) {
      this.#boosts.splice(index, 1);
    }
  }

  renderBoosts() {
    const tbody = document.getElementById("playerBoostsTableBody");
    tbody.innerHTML = "";
    this.#boosts.forEach((boost) => {
      const row = document.createElement("tr");
      const nameCell = document.createElement("td");
      nameCell.innerText = boost.name;
      row.appendChild(nameCell);
      const maxCellCountCell = document.createElement("td");
      maxCellCountCell.innerText =
        boost.maxCellCount > 0 ? boost.maxCellCount : "";
      row.appendChild(maxCellCountCell);
      const livesCell = document.createElement("td");
      livesCell.innerText =
        boost.turnsRemaining > 0 ? boost.turnsRemaining : "";
      row.appendChild(livesCell);
      row.title = boost.description;

      const levelCell = document.createElement("td");
      if (
        boost.boostable &&
        this.#funds >= SidukoConstants.BOOST_UP_LEVEl_COST &&
        !boost.exhausted
      ) {
        const levelButton = document.createElement("input");
        levelButton.classList.add("boostBoostButton");
        levelButton.type = "button";
        levelButton.value = `$${SidukoConstants.BOOST_UP_LEVEl_COST}`;
        levelButton.style.display = "button"; // TODO
        levelButton.title = boost.boostBuyHint;
        levelCell.appendChild(levelButton);
      }
      row.appendChild(levelCell);

      const useCell = document.createElement("td");
      const useButton = document.createElement("input");
      useButton.classList.add("useBoostButton");
      useButton.type = "button";
      useButton.value = "Use";
      useButton.style.display =
        boost.getCanUse() && !boost.decrementsEachTurn ? "button" : "none";
      useCell.appendChild(useButton);
      row.appendChild(useCell);

      const buyCell = document.createElement("td");
      if (this.#funds >= SidukoConstants.BOOST_LIFE_COST) {
        const buyButton = document.createElement("input");
        buyButton.classList.add("buyBoostButton");
        buyButton.type = "button";
        buyButton.value = `$${SidukoConstants.BOOST_LIFE_COST}`;
        buyButton.title = boost.buyHint;
        buyCell.appendChild(buyButton);
      }
      row.appendChild(buyCell);

      boost.domElement = row;
      if (boost.exhausted) {
        boost.domElement.classList.add("exhausted");
      }
      tbody.appendChild(row);
    });
    return tbody;
  }

  renderHints(oPuzzle) {
    // update hints
    const oBoost = this.getBoost("Hints");
    if (
      oBoost &&
      typeof oBoost.turnsRemaining === "number" &&
      oBoost.turnsRemaining > 0
    ) {
      SidukoHtmlGenerator.updateCellHints(oPuzzle);
    } else {
      oPuzzle.getData().cells.forEach((cell) => {
        cell.element.title = "No hints remaining";
      });
    }
  }

  doTurnPlayed(bSolvedByPlayer, oPuzzle) {
    this.guessesRemaining--;

    if (this.guessesRemaining <= 0) {
      logMessage("You ran out of guesses. Game over.");
      //this.puzzle.endGame(false);
    }

    if (bSolvedByPlayer) {
      this.#boosts
        .filter((b) => b.decrementsEachTurn && b.turnsRemaining > 0)
        .forEach((b) => {
          b.turnsRemaining--;
          if (b.turnsRemaining === 0) {
            logMessage("Boost '" + b.name + "' has run out of turns.");
            b.exhausted = true;
          }
        });
    }
    this.#boosts.forEach((b) => {
      b.forSale = this.funds >= 1;
      if (b.forSale) {
        b.domElement.classList.add("forSale");
      } else {
        b.domElement.classList.remove("forSale");
      }
    });

    this.renderHints(oPuzzle);

    this.renderBoosts();
  }
}
