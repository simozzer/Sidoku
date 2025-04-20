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
      // TODO:: animate
      oElem.innerText = value;
    }
  }

  get funds() {
    const urlParams = new URLSearchParams(window.location.search);
    const cheatMode = urlParams.get('cheat');    
    if (cheatMode) {
      return 100;
    } else {
      return this.#funds;
    }    
  }

  set funds(value) {
    const oElem = document.getElementById("playerFunds");
    if (oElem) {
      oElem.innerText = "$" + value;

      if (value > this.funds) {
        oElem.classList.add("fund-boost");
        const fnListener = () => {
          const playerFundsElem = document.getElementById("playerFunds");
          playerFundsElem.classList.remove("fund-boost");
          playerFundsElem.removeEventListener("animationend", fnListener);
        };
        oElem.addEventListener("animationend", fnListener);
      } else if (value < this.funds) {
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

  __sortBoosts() {
    const aBoosts = [...this.#boosts];
    this.#boosts.sort((oBoost1, oBoost2) => {
      if (oBoost1.getCanUse() && !oBoost2.getCanUse()) {
        return -1;
      } else if (oBoost2.getCanUse() && !oBoost1.getCanUse()) {
        return 1;
      }
      if (oBoost1.turnsRemaining > oBoost2.turnsRemaining) {
        return -1;
      } else if (oBoost1.turnsRemaining < oBoost2.turnsRemaining) {
        return 1;
      }
      if (oBoost1.maxCellCount > oBoost2.maxCellCount) {
        return -1;
      } else if (oBoost1.maxCellCount < oBoost2.maxCellCount) {
        return 1;
      }
      oBoost1.name.localeCompare(oBoost2.name);
    });
    this.#boosts = aBoosts;
  }

  renderBoosts() {
    this.__sortBoosts();
    const tbody = document.getElementById("playerBoostsTableBody");
    tbody.innerHTML = "";
    this.#boosts.forEach((boost) => {
      const row = document.createElement("tr");
      row.title = `${boost.description}`;
      const containerTd = document.createElement("td");    
      containerTd.dataset.boostName = boost.name;
      const glyphDiv = document.createElement("div");
      glyphDiv.classList.add("boost_glyph");
      glyphDiv.innerText = boost.glyph;
      containerTd.appendChild(glyphDiv);
      const nameDiv = document.createElement("div");
      const sBoostRemainingText = boost.turnsRemaining > 0 ? "Lives: " + boost.turnsRemaining : "";
      const sCellCountText = boost.maxCellCount > 0 ? ` Level:${boost.maxCellCount}` : "";
      nameDiv.innerText = `${sBoostRemainingText}${sCellCountText}`;
      nameDiv.classList.add("boost_text");
      containerTd.appendChild(nameDiv);      
      row.appendChild(containerTd);
      nameDiv.classList.add("boost_text");
      containerTd.appendChild(nameDiv);      
      row.appendChild(containerTd);

      if (boost.getCanUse() && !boost.decrementsEachTurn) {
        row.classList.add("can_use_boost");
      }

      const levelCell = document.createElement("td");
      if (
        boost.boostable &&
        this.funds >= SidukoConstants.BOOST_UP_LEVEL_COST &&
        !boost.exhausted
      ) {
        const levelButton = document.createElement("input");
        levelButton.classList.add("boostBoostButton");
        levelButton.type = "button";
        levelButton.value = `$${SidukoConstants.BOOST_UP_LEVEL_COST}`;
        levelButton.style.display = "button"; // TODO
        levelButton.title = boost.boostBuyHint;
        levelCell.appendChild(levelButton);
      }
      row.appendChild(levelCell);

      const buyCell = document.createElement("td");
      if (this.funds >= boost.cost) {
        const buyButton = document.createElement("input");
        buyButton.classList.add("buyBoostButton");
        buyButton.type = "button";
        buyButton.value = `$${boost.cost}`;
        buyButton.title = boost.buyHint;
        buyCell.appendChild(buyButton);
      }
      row.appendChild(buyCell);

      boost.domElement = row;
      if (boost.exhausted) {
        boost.domElement.classList.add("exhausted");
      } else {
        boost.domElement.classList.remove("exhausted");
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
      SidukoNotifications.getInstance().queueAlert("You ran out of guesses. Game over.",4000);
      window.alert("Out of guesses!!! Refresh your browser to start another puzzle");
    }

    if (bSolvedByPlayer) {
      this.#boosts
        .filter((b) => b.decrementsEachTurn && b.turnsRemaining > 0)
        .forEach((b) => {
          b.turnsRemaining--;
          if (b.turnsRemaining === 0) {
            SidukoNotifications.getInstance().queueAlert("Boost '" + b.name + "' has run out of turns.");            
            SidukoNotifications.getInstance().queueInfo("Consider buying more Hints");
            b.exhausted = true;
            if (b.name === "Hints") {
              SidukoSounds.getInstance().playSound("si_lost_hints");
            } else {
              SidukoSounds.getInstance().playSound("si_lost_bonus");
            }
          }
        });
    }


    this.#boosts.forEach((b) => {
      b.forSale = this.funds >= b.cost;
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
