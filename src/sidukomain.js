class SidukoMain {
  #playerData;
  #game;
  #solution;
  #htmlGenerator;
  #eventHandler;
  #gameTimeOut;
  #gameSecondsRemaining;
  constructor(puzzleData) {  
    this.#game = new SidukoPuzzle();
    this._setGameStartData(this.#game, puzzleData);

    this.#htmlGenerator = new SidukoHtmlGenerator(this.#game);
    const tableDOM = this.#htmlGenerator.getPuzzleDOM();
    const puzzleElementHolder = document.getElementById("everywhere");
    puzzleElementHolder.textContent = "";
    puzzleElementHolder.appendChild(tableDOM);

    this.#solution = new SidukoPuzzle(this);
    this._setGameStartData(this.#solution, puzzleData);
    this.#game.solution = this.#solution;

    this.#playerData = new SidukoPlayerData();
    this.#playerData.funds = SidukoConstants.DEFAULT_FUNDS;
    this.#playerData.guessesRemaining = -1;

    this.#playerData.puzzle = this.#game;
    this.#eventHandler = null;
    this.#gameTimeOut = null;
    this.#gameSecondsRemaining = -1;

    SidukoHtmlGenerator.updateCharset(this.#game);
  }

  async _solve() {
    return new Promise(async (resolve, reject) => {
      const solver = new SidukoSolver(this.#solution, () => {});
      await solver.execute();
      resolve();
    });
  }

  stop() {
    this.#eventHandler.detatchEvents();
    if (this.#gameTimeOut) {
      window.clearInterval(this.#gameTimeOut);
      this.#gameTimeOut = null;
    }
  }

  _addInitialBoosts(oGame, oPlayerData) {
    let oBoost = new SidukoRowBoostData(
      "Row",
      "Reveals up to a specified number of cells in a random row",
      oGame
    );
    oPlayerData.addBoostItem(oBoost);
    oBoost.turnsRemaining = SidukoConstants.INITIAL_DEFAULT_BOOST_LIVES;
    oBoost.decrementsEachTurn = false;
    oBoost.boostBuyHint = `Increment max cell count for Rows`;
    oBoost.buyHint = `Add a rows bonus to your collection`;
    oBoost.boostable = true;
    oBoost.maxCellCount = SidukoConstants.INITIAL_DEFAULT_BOOST_CELLCOUNT;
    oBoost.exhausted = oBoost.turnsRemaining <= 0;
    oBoost.cost = 4;

    oBoost = new SidukoColumnBoostData(
      "Column",
      "Reveals up to a specified number of cells in a random column",
      oGame
    );
    oPlayerData.addBoostItem(oBoost);
    oBoost.turnsRemaining = SidukoConstants.INITIAL_DEFAULT_BOOST_LIVES;
    oBoost.decrementsEachTurn = false;
    oBoost.boostBuyHint = `Increment max cell count for Rows`;
    oBoost.buyHint = `Add a columns bonus to your collection`;
    oBoost.boostable = true;
    oBoost.maxCellCount = SidukoConstants.INITIAL_DEFAULT_BOOST_CELLCOUNT;
    oBoost.exhausted = oBoost.turnsRemaining <= 0;
    oBoost.cost = 4;

    oBoost = new SidukoInnerTableBoostData(
      "InnerTable",
      "Reveals up to a specified number of cells in a random inner table",
      oGame
    );
    oPlayerData.addBoostItem(oBoost);
    oBoost.turnsRemaining = SidukoConstants.INITIAL_DEFAULT_BOOST_LIVES;
    oBoost.decrementsEachTurn = false;
    oBoost.boostBuyHint = `Increment max cell count for Inner Tables`;
    oBoost.buyHint = `Add an inner table bonus to your collection`;
    oBoost.boostable = true;
    oBoost.maxCellCount = SidukoConstants.INITIAL_DEFAULT_BOOST_CELLCOUNT;
    oBoost.exhausted = oBoost.turnsRemaining <= 0;
    oBoost.cost = 4;

    oBoost = new SidukoRandomBoostData(
      "Random",
      "Reveals up to a specified number of random cells",
      oGame
    );
    oPlayerData.addBoostItem(oBoost);
    oBoost.turnsRemaining = SidukoConstants.INITIAL_DEFAULT_BOOST_LIVES;
    oBoost.decrementsEachTurn = false;
    oBoost.boostBuyHint = `Increment max cell count for random`;
    oBoost.buyHint = `Add a random cell bonus to your collection`;
    oBoost.boostable = true;
    oBoost.maxCellCount = SidukoConstants.INITIAL_DEFAULT_BOOST_CELLCOUNT;
    oBoost.exhausted = oBoost.turnsRemaining <= 0;
    oBoost.cost = 4;

    oBoost = new SidukoRandomValueBoostData(
      "Random Value",
      "Reveals up to a specified number of random cells with a randomly chose value",
      oGame
    );
    oPlayerData.addBoostItem(oBoost);
    oBoost.turnsRemaining = SidukoConstants.INITIAL_DEFAULT_BOOST_LIVES;
    oBoost.decrementsEachTurn = false;
    oBoost.boostBuyHint = `Increment max cell count for random value`;
    oBoost.buyHint = `Add a random value bonus to your collection`;
    oBoost.boostable = true;
    oBoost.maxCellCount = SidukoConstants.INITIAL_DEFAULT_BOOST_CELLCOUNT;
    oBoost.exhausted = oBoost.turnsRemaining <= 0;
    oBoost.cost = 4;

    oBoost = new SidukoSeekerBoostData(
      "Seeker",
      "Solves values that can only exist in 1 cell",
      oGame
    );
    oBoost.turnsRemaining = SidukoConstants.INITIAL_SEEKER_LIVES;
    oBoost.decrementsEachTurn = false;
    oPlayerData.addBoostItem(oBoost);
    oBoost.boostBuyHint = "Increase the max cell count for the Seeker bonus";
    oBoost.buyHint = `Add another seeker bonus to be used when you choose`;
    oBoost.boostable = true;
    oBoost.maxCellCount = SidukoConstants.INITIAL_DEFAULT_BOOST_CELLCOUNT;
    oBoost.exhausted = oBoost.turnsRemaining <= 0;   
    oBoost.cost = 3; // cost is lower, as the user could solve this easily


    oBoost = new SidukoBadValueRemovalBoostData(
      "Eraser",
      "Removes up to a specified number of cells which contain an incorrect value",
      oGame
    );
    oBoost.turnsRemaining = SidukoConstants.INITIAL_DEFAULT_BOOST_LIVES;
    oBoost.decrementsEachTurn = false;
    oPlayerData.addBoostItem(oBoost);
    oBoost.boostBuyHint = "Increase the max cell count for the Eraser bonus";
    oBoost.buyHint = `Add another Eraser bonus to be used when you choose`;;
    oBoost.boostable = true;
    oBoost.maxCellCount = SidukoConstants.INITIAL_DEFAULT_BOOST_CELLCOUNT;
    oBoost.exhausted = oBoost.turnsRemaining <= 0;
    oBoost.cost = 4;

    oBoost = new SidukoHighlightBoostData(
      "Highlight",
      "Shows highlights for incorrect values [this will only be available when you're off-track]",
      oGame
    );    
    oBoost.turnsRemaining = SidukoConstants.INITIAL_DEFAULT_BOOST_LIVES;
    oBoost.decrementsEachTurn = false;
    oPlayerData.addBoostItem(oBoost);
    oBoost.boostBuyHint = "Increase the max cell count for the Highlight bonus";
    oBoost.buyHint = `Add another Highlight bonus to be used when you choose`;;
    oBoost.boostable = true;
    oBoost.maxCellCount = SidukoConstants.INITIAL_DEFAULT_BOOST_CELLCOUNT;
    oBoost.exhausted = oBoost.turnsRemaining <= 0;
    oBoost.cost = 3;

    // Show tooltips on each turn whilst we still have turns remaining
    oBoost = new SidukoHintsBoostData(
      "Hints",
      "Shows tooltips for the possible values in a cell",
      oGame
    );
    oPlayerData.addBoostItem(oBoost);
    oBoost.turnsRemaining = SidukoConstants.HINT_BUY_BOOST_TURNS;
    oBoost.decrementsEachTurn = true;
    oBoost.buyHint = `Add tooltip hints for another ${SidukoConstants.HINT_BUY_BOOST_TURNS}`;
    oBoost.boostable = false;
    oBoost.maxCellCount = null;
    oBoost.cost = 1;

    oBoost = new SidukoBoostData(
      "Time",
      `Adds a maximum of ${SidukoConstants.TIME_BOOST_SECONDS} seconds to the timer`,
      oGame
    );
    oBoost.turnsRemaining = 0;
    oBoost.decrementsEachTurn = false;
    oPlayerData.addBoostItem(oBoost);
    oBoost.buyHint = `Add a time boost bonus to be used when you choose`;
    oBoost.boostable = false;
    oBoost.maxCellCount = null;
    oBoost.cost = 2;
  }


  async start() {

    if (typeof Storage !== "undefined") {
      if (!localStorage.gamesStarted) {
        localStorage.gamesStarted = 1;
      } else {
        localStorage.gamesStarted++;
      }
      console.log(`Games started: ${localStorage.gamesStarted}`);
    }

    const intro = document.getElementById("introScreen");
    const introListener = intro.addEventListener("animationend", () => {
        intro.removeEventListener("animationend", introListener);
        intro.classList.remove("fadeIntro");
        intro.style.display = "none";      
      }
    );
          
    intro.classList.add("fadeIntro");

    
    if (this.#gameTimeOut) {
      window.clearInterval(this.#gameTimeOut);
      this.#gameTimeOut = null;
    }
    await this._solve();
    document.getElementById("menucontainer").style.display = "none";
    const oPlayerData = this.#playerData;
    const oGame = this.#game;

    const aEmptyCells = this.#game.getData().cells.filter((cell) => cell.value === 0);

    let randomBonusIndex = Math.floor(Math.random() * aEmptyCells.length -1);
    if (randomBonusIndex >= 0) {     
      aEmptyCells[randomBonusIndex].bonusTrigger = true;
      aEmptyCells[randomBonusIndex].element.innerText = "B";
    }

    if (Math.random() < 0.3) {
      const aRemainingCells = aEmptyCells.filter((cell) => !cell.bonusTrigger);
      randomBonusIndex = Math.floor(Math.random() * aRemainingCells.length -1);
      if (randomBonusIndex >= 0) {        
        aRemainingCells[randomBonusIndex].randomBonusTrigger = true;
      }
    }
    
    oPlayerData.guessesRemaining = Math.round(aEmptyCells.length * SidukoConstants.GUESSES_MULTIPLER);

    this.#htmlGenerator = new SidukoHtmlGenerator(this.#game);
    const tableDOM = this.#htmlGenerator.getPuzzleDOM();
    const puzzleElementHolder = document.getElementById("everywhere");
    puzzleElementHolder.textContent = "";
    puzzleElementHolder.appendChild(tableDOM);

    if (this.#eventHandler) {
      this.#eventHandler.detatchEvents();
      this.#eventHandler = null;
    }

    this.#eventHandler = new SidukoEventsHandler(
      this.#game,
      tableDOM,
      this.#playerData,
      this.#game.solution      
    );
    this.#eventHandler.attachEvents();
    this.#eventHandler.addEventListener("levelComplete", () => {
      //TODO::
      window.clearInterval(this.#gameTimeOut);
      this.#gameTimeOut = null;
      window.alert(`Level Complete! ${this.#gameSecondsRemaining} seconds remaining`);
    });

    this._addInitialBoosts(oGame,oPlayerData);
    oPlayerData.renderBoosts();

    document.getElementById("playerBoostsTableBody").addEventListener(
      "click",
      (oEv) => {
        if (this.#playerData.guessesRemaining <= 0) {
          return;
        }
        let rowElement;
        if (oEv.target.tagName === "TD") {
          rowElement = oEv.target.parentNode;
        } else if (oEv.target.tagName === "TR") {
          rowElement = oEv.target;
        } else if (oEv.target.tagName === "INPUT") {
          rowElement = oEv.target.parentNode.parentNode;
        } else {
          console.warn("Invalid click event target for Boost", oEv.target);
        }
        const sBoostName = rowElement.childNodes[0].dataset["boostName"];
        let oBoost = oPlayerData.getBoost(sBoostName);

        const clickedColumn = Array.from(rowElement.childNodes).indexOf(
          oEv.target.parentNode
        );        
        if (clickedColumn === 2) {
          // boost
          if (this.#playerData.funds >= oBoost.cost) {
            oBoost.maxCellCount = oBoost.maxCellCount + 1;
            this.#playerData.funds -= oBoost.cost;;
            oBoost.exhausted = oBoost.turnsRemaining <= 0;
          }
        } else if (clickedColumn === 3) {
          // USE

          if (sBoostName === "Time") {
            let gameSeconds =
              this.#gameSecondsRemaining + SidukoConstants.TIME_BOOST_SECONDS;
            if (gameSeconds > SidukoConstants.GAME_DURATION_SECONDS) {
              gameSeconds = SidukoConstants.GAME_DURATION_SECONDS;
            }
            this.#gameSecondsRemaining = gameSeconds;
          }
          if (this.#playerData.guessesRemaining > 0 && oBoost.use()) {
          
            if (oBoost.turnsRemaining <= 0) {
              oBoost.exhausted = true;
              SidukoSounds.getInstance().playSound("si_bonus_exhausted");
              SidukoNotifications.getInstance().queueAlert(`Boost "${sBoostName}" exhausted`);     
              SidukoNotifications.getInstance().queueInfo(`Consider buying more boosts for "${sBoostName}"`);   
            }

            if (oBoost.maxCellCount > 2) {
              oBoost.maxCellCount--;
            }

          } else {
            SidukoNotifications.getInstance().queueAlert(
              "Failed to use boost", 2000
            );
          }

        } else if (clickedColumn === 4) {
          // BUY

          if (sBoostName === "Hints") {
            oBoost.turnsRemaining =
              oBoost.turnsRemaining + SidukoConstants.HINT_BUY_BOOST_TURNS;
          } else {
            oBoost.turnsRemaining = oBoost.turnsRemaining + 1;
          }
          oBoost.exhausted = oBoost.turnsRemaining <= 0;
          if (this.#playerData.funds >= oBoost.cost) {
            this.#playerData.funds -= oBoost.cost
          };        
        }

        oPlayerData.renderBoosts(oGame);
        oPlayerData.renderHints(oGame);
      },
      this
    );

    if (this.#gameTimeOut) {
      window.clearInterval(this.#gameTimeOut);
      this.#gameTimeOut = null;
    }
    this.#gameSecondsRemaining = SidukoConstants.GAME_DURATION_SECONDS;
    SidukoSounds.getInstance().playSound("all systems go");
    document.getElementById("mainGameArea").classList.remove("gameStart");
    document.getElementById("mainGameArea").classList.remove("hidden");
    document.getElementById("mainGameArea").classList.add("gameStart");
    this.#gameTimeOut = window.setInterval(
      () => {
        if (this.#gameSecondsRemaining > 0) {
          this.#gameSecondsRemaining--;

          const totalWidth = document.getElementById("progressBarProgress")
            .parentElement.clientWidth;
          const w = Math.round(
            (this.#gameSecondsRemaining /
              SidukoConstants.GAME_DURATION_SECONDS) *
              totalWidth
          );
          document.getElementById("progressBarProgress").style.width = `${w}px`;
          document.getElementById("progressBarTextOverlay").innerText = `${
            this.#gameSecondsRemaining
          } seconds remaining`;

          if (this.#gameSecondsRemaining < 31 && this.#gameSecondsRemaining  % 5 === 0) {
            SidukoNotifications.getInstance().queueAlert(`Warning: ${this.#gameSecondsRemaining} seconds left`);
          }
        } else {
          window.clearInterval(this.#gameTimeOut);
          this.#gameTimeOut = null;
          window.alert(
            "You ran out of time!\nTechnically speaking the game is over and you lost.\nFeel free to carry on playing, or refresh to start another puzzle."
          );        
        }
      },
      1000,
      this
    );
  }

  /**
   * Initializes the game with the provided puzzle data, generates a solution, and renders the game.
   *
   * @param {Object} puzzleData - The initial puzzle data to set up the game.
   *                              Expected to contain the necessary information to populate the game grid.
   * @returns {void} This function does not return a value.
   */
  _setGameStartData(oGame, aStartData) {
    const gameData = oGame.getData();
    for (let i = 0; i < aStartData.length; i++) {
      let iValue = parseInt(aStartData[i], 10);
      const oCell = gameData.cells[i];
      if (iValue > 0) {
        oCell.value = iValue;
        oCell.setFixedValue();
      } else {
        if (oCell) {
          oCell.setEmptyValue();
        }
      }
    }
  }
}
