class SidukoMain {
    #playerData;
    #game;
    #puzzleData;
    #solution;
    #htmlGenerator;
    #eventHandler;
    #gameTimeOut;
    #gamesSecondsRemaining;
    #sounds;
    constructor(puzzleData) {
        this.#sounds = new SidukoSounds();    
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
        this.#gamesSecondsRemaining = -1;
        
    }

    
    async _solve() {
        return new Promise(async (resolve, reject) => {
            const solver = new SidukoSolver(this.#solution ,(data) => {});
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

    async start() {
        if (this.#gameTimeOut) {
            window.clearInterval(this.#gameTimeOut);
            this.#gameTimeOut = null;
        }
        await this._solve();
        document.getElementById("menucontainer").style.display = "none";
        const oPlayerData = this.#playerData;
        const oGame = this.#game;
        const emptyCellCount = this.#game.getData().cells.filter((cell) => cell.value === 0).length
        oPlayerData.guessesRemaining = Math.round(emptyCellCount * 1.3);


        this.#htmlGenerator = new SidukoHtmlGenerator(this.#game);        
        const tableDOM = this.#htmlGenerator.getPuzzleDOM();
        const puzzleElementHolder = document.getElementById("everywhere");    
        puzzleElementHolder.textContent = "";
        puzzleElementHolder.appendChild(tableDOM);

        if (this.#eventHandler) {
            this.#eventHandler.detatchEvents();
            this.#eventHandler = null;
        }

        this.#eventHandler = new SidukoEventsHandler(this.#game,tableDOM, this.#playerData, this.#game.solution, this.#sounds); 
        this.#eventHandler.attachEvents();

        let oBoost = new SidukoRowBoostData("Row","Reveals up to a specified number of cells in a random row", oGame);
        oPlayerData.addBoostItem(oBoost);
        oBoost.turnsRemaining = 0;
        oBoost.decrementsEachTurn = false;
        oBoost.boostBuyHint = `Increment max cell count for Rows`;
        oBoost.buyHint = `Add a rows bonus to your collection`;
        oBoost.boostable = true;
        oBoost.maxCellCount = 1;
        oBoost.exhausted = true;

        oBoost = new SidukoColumnBoostData("Column","Reveals up to a specified number of cells in a random column", oGame)
        oPlayerData.addBoostItem(oBoost);
        oBoost.turnsRemaining = 0;
        oBoost.decrementsEachTurn = false;
        oBoost.boostBuyHint = `Increment max cell count for Rows`;
        oBoost.buyHint = `Add a columns bonus to your collection`;
        oBoost.boostable = true;
        oBoost.maxCellCount = 1;
        oBoost.exhausted = true;


        oBoost = new SidukoInnerTableBoostData("InnerTable","Reveals up to a specified number of cells in a random inner table", oGame)
        oPlayerData.addBoostItem(oBoost);
        oBoost.turnsRemaining = 0;
        oBoost.decrementsEachTurn = false;
        oBoost.boostBuyHint = `Increment max cell count for Inner Tables`;
        oBoost.buyHint = `Add an inner table bonus to your collection`;
        oBoost.boostable = true;
        oBoost.maxCellCount = 1;
        oBoost.exhausted = true;

        oBoost = new SidukoRandomBoostData("Random","Reveals up to a specified number of random cells", oGame)
        oPlayerData.addBoostItem(oBoost);
        oBoost.turnsRemaining = 0;
        oBoost.decrementsEachTurn = false;
        oBoost.boostBuyHint = `Increment max cell count for random`;
        oBoost.buyHint = `Add a random cell bonus to your collection`;
        oBoost.boostable = true;
        oBoost.maxCellCount = 1;
        oBoost.exhausted = true;

        
        oBoost = new SidukoRandomValueBoostData("Random Value","Reveals up to a specified number of random cells with a randomly chose value", oGame)
        oPlayerData.addBoostItem(oBoost);
        oBoost.turnsRemaining = 0;
        oBoost.decrementsEachTurn = false;
        oBoost.boostBuyHint = `Increment max cell count for random value`;
        oBoost.buyHint = `Add a random value bonus to your collection`;
        oBoost.boostable = true;
        oBoost.maxCellCount = 1;
        oBoost.exhausted = true;



        // Show tooltips on each turn whilst we still have turns remaining
        oBoost = new SidukoHintsBoostData("Hints","Shows tooltips for the possible values in a cell", oGame);
        oPlayerData.addBoostItem(oBoost);
        oBoost.turnsRemaining = SidukoConstants.HINT_BUY_BOOST_TURNS;
        oBoost.decrementsEachTurn = true;
        oBoost.buyHint = `Add tooltip hints for another ${SidukoConstants.HINT_BUY_BOOST_TURNS}`;
        oBoost.boostable = false;
        oBoost.maxCellCount = null;


        oBoost = new SidukoSeekerBoostData("Seeker","Solves values that can only exist in 1 cell", oGame);
        oBoost.turnsRemaining = SidukoConstants.INITIAL_SEEKER_LIVES;
        oBoost.decrementsEachTurn = false;
        oPlayerData.addBoostItem(oBoost);
        oBoost.boostBuyHint = 'Increase the max cell count for the Seeker bonus';
        oBoost.buyHint = `Add another seeker bonus to be used when you choose`;
        oBoost.boostable = true;

        
        oBoost = new SidukoBoostData("Time",`Adds a maximum of ${SidukoConstants.TIME_BOOST_SECONDS} seconds to the timer`, oGame);
        oBoost.turnsRemaining = 0;
        oBoost.decrementsEachTurn = false;
        oPlayerData.addBoostItem(oBoost);
        oBoost.buyHint = `Add a time boost bonus to be used when you choose`;
        oBoost.boostable = false;
        oBoost.maxCellCount = null;


        oPlayerData.renderBoosts();

        document.getElementById("playerBoostsTableBody").addEventListener('click',(oEv) => {
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
            const sBoostName = rowElement.childNodes[0].innerText;
            let oBoost = oPlayerData.getBoost(sBoostName);

            const clickedColumn = Array.from(rowElement.childNodes).indexOf(oEv.target.parentNode);
            //if (clickedColumn >= 0) {
            if (clickedColumn === 3) {
                // boost
                if (this.#playerData.funds >= SidukoConstants.BOOST_UP_LEVEl_COST) {
                    oBoost.maxCellCount = oBoost.maxCellCount + 1;
                    this.#playerData.funds -= SidukoConstants.BOOST_UP_LEVEl_COST;
                    oBoost.exhausted = oBoost.turnsRemaining <= 0;  
                }
            } else if (clickedColumn === 4) {
                // USE
      
                //if (sBoostName === "Seeker") {   
                    if (sBoostName === "Time") {
                        let gameSeconds = this.#gamesSecondsRemaining + SidukoConstants.TIME_BOOST_SECONDS;
                        if (gameSeconds > SidukoConstants.GAME_DURATION_SECONDS) {
                            gameSeconds = SidukoConstants.GAME_DURATION_SECONDS;
                        }
                        this.#gamesSecondsRemaining = gameSeconds;
                    }    
                    oBoost.use()

                    if (oBoost.turnsRemaining <= 0) {
                        oBoost.exhausted = true;
                    }

                    if (oBoost.maxCellCount > 2) {
                        oBoost.maxCellCount--;
                    }
                //} 
                
            } else if (clickedColumn === 5) {
                // BUY

                if (sBoostName === "Hints") {
                    oBoost.turnsRemaining = oBoost.turnsRemaining + SidukoConstants.HINT_BUY_BOOST_TURNS;        
                } else {
                    oBoost.turnsRemaining = oBoost.turnsRemaining + 1;                                        
                }         
                oBoost.exhausted = oBoost.turnsRemaining <= 0;            
                this.#playerData.funds -= SidukoConstants.BOOST_LIFE_COST;                      
            }              
            

            oPlayerData.renderBoosts(oGame);    

            oPlayerData.renderHints(oGame);
                

            
        }, this);

        if (this.#gameTimeOut) {
            window.clearInterval(this.#gameTimeOut);
            this.#gameTimeOut = null;
        }
        this.#gamesSecondsRemaining = SidukoConstants.GAME_DURATION_SECONDS;
        this.#sounds.playSound("all systems go");
        document.getElementById("mainGameArea").classList.remove("gameStart");
        document.getElementById("mainGameArea").classList.remove("hidden");
        document.getElementById("mainGameArea").classList.add("gameStart");
        this.#gameTimeOut = window.setInterval(() => {
            
            if (this.#gamesSecondsRemaining > 0) {
                this.#gamesSecondsRemaining --;
                
                const totalWidth = document.getElementById("progressBarProgress").parentElement.clientWidth;
                const w = Math.round((this.#gamesSecondsRemaining / SidukoConstants.GAME_DURATION_SECONDS) * totalWidth);
                document.getElementById('progressBarProgress').style.width = `${w}px`;
                document.getElementById("progressBarTextOverlay").innerText = `${this.#gamesSecondsRemaining} seconds remaining`;
            } else {
                window.clearInterval(this.#gameTimeOut);
                this.#gameTimeOut = null;
                window.alert(('You ran out of time!\nTechnically speaking the game is over and you lost.\nFeel free to carry on playing, or choose a level from the menu.'));
                document.getElementById("menu").value = "";
                document.getElementById("menucontainer").style.display = "block";

            }
            
        }, 1000, this);
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
            let iValue = parseInt(aStartData[i],10);
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