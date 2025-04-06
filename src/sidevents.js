class SidukoEventsHandler {
    #tableDomElement;
    #puzzle;
    #playerData;
    #intervalTimeout;
    #secondsRemaining;
    
    constructor(oPuzzle, oTableDomElement, playerData) {
        this.#tableDomElement = oTableDomElement;
        this.#puzzle = oPuzzle;
        this.#playerData = playerData;        
        document.querySelectorAll('.sidukoTable>tr>td>table>tr>td')
        this.attachEvents();
        this.#secondsRemaining = 120;
        this.#intervalTimeout = window.setInterval(() => {
            if (this.#secondsRemaining > 0) {
                this.#secondsRemaining--;
                const w = Math.round((this.#secondsRemaining / 120) * 100);
                document.getElementById('progressBarProgress').style.width = `${w}%`;
            } else {
                window.clearInterval(this.#intervalTimeout);
                this.#intervalTimeout = null;
            }
        }, 1000, this);
    }

    attachEvents() {
        this.#tableDomElement.addEventListener('keydown', this._onKeyDown.bind(this));
        this.#tableDomElement.addEventListener('keypress', this._onKeyPress.bind(this));
    }

    detatchEvents() {
        this.#tableDomElement.removeEventListener('keydown', this._onKeyDown.bind(this));
        this.#tableDomElement.addEventListener('keypress', this._onKeyPress.bind(this));        
    }

    gameplayChangedHandler(state) {
        const oGame = this.#puzzle;
        if (state) {
            // TODO: check if the cells filled match the solution if not then NO BONUS
            if (state.column) {
                logMessage(`✨***Column Filled***✨`, "column_filled");
                if (oGame.getData().cellsInColumn(state.column-1).map(o=>o.value).toString() === oGame.solution.getData().cellsInColumn(state.column-1).map(o=>o.value).toString()) {
                    oGame.getData().cellsInColumn(state.column-1).forEach(cell => {
                        cell.element.classList.add('player_solved');
                        cell.setFixedValue(true);
                    });
                    logMessage("☝️Matches solution. Bonus $1☝️", "completion_bonus");
                    this.#playerData.funds++;
                } else {
                    logMessage("👎Does not match soution. No bonus awared👎");
                }
                
            }
            if (state.row) {
                logMessage(`🎉***Row Filled***🎉`, "row_filled");
                if (oGame.getData().cellsInRow(state.row-1).map(o=>o.value).toString() === oGame.solution.getData().cellsInRow(state.row-1).map(o=>o.value).toString()) {                    
                    oGame.getData().cellsInRow(state.row-1).forEach(cell => {
                        cell.element.classList.add('player_solved');
                        cell.setFixedValue(true);
                    });
                    logMessage("😺Matches solution. Bonus $1😺", "completion_bonus");
                    this.#playerData.funds++;
                } else {
                    logMessage("😩Does not match soution. No bonus awared😩");
                }
            }
            if (state.innerTable) {
                logMessage(`👍***Inner Table Filled***👍`, "inner_table_filled");
                if (oGame.getData().cellsInInnerTable(state.innerTable-1).map(o=>o.value).toString() === oGame.solution.getData().cellsInInnerTable(state.innerTable-1).map(o=>o.value).toString()) {
                    oGame.getData().cellsInInnerTable(state.innerTable-1).forEach(cell => {
                        cell.element.classList.add('player_solved');
                        cell.setFixedValue(true);
                    });
                    logMessage("😉Matches solution. Bonus $1😉", "completion_bonus");
                    this.#playerData.funds++;
                } else {
                    logMessage("😭Does not match soution. No bonus awared😭");
                }
            }
            if (state.board) {
                logMessage(`🔥🔥🔥***Board Filled***🔥🔥🔥`, "board_filled");
            }
            if (state.playerCellUsed) {                
                console.log("Cell used by player");
                this.#playerData.doTurnPlayed(true);
                //SidokuBonuses.autoFillCellsWithOnePossibleValue(oGame, oGame.solution, this.gameplayChangedHandler.bind(this));
            } else if (state.cellUsed) {
                console.log("cell used by A bonus");
                this.#playerData.doTurnPlayed(false);
            }
        }
    }

    _onKeyDown(oEvent) {
        const column = 0 | oEvent.target.dataset.column;
        const row = 0 | oEvent.target.dataset.row;
        console.log(`KeyDowm: col: ${column}, row: ${row}, elem: ${oEvent.target.dataset}`);
        switch (oEvent.code) {
            case 'ArrowLeft':
                if (column > 0) {
                    this.#puzzle.getData().cell(column-1, row).element.focus();
                }
                break;

            case 'ArrowRight':
                if (column < 8) {
                    this.#puzzle.getData().cell(column+1, row).element.focus();
                }

                break;

            case 'ArrowUp':
                if (row > 0) {
                    this.#puzzle.getData().cell(column,row-1).element.focus();
                }
                break;

            case 'ArrowDown':
                if (row < 8) {
                    this.#puzzle.getData().cell(column,row+1).element.focus();
                }
                break;
            case 'Backspace': 
            case 'Space': 
            case 'Delete':
            case 'Digit0':
                const oElem = document.querySelector(`td[data-column="${column}"][data-row="${row}"]`);
                if (oElem.classList.contains('entered')) {
                    const oCellData = this.#puzzle.getData().cell(column, row);
                    oCellData.entered = false;
                    oCellData.value = null;
                    oCellData.element.innerText = '';                    
                    oCellData.element.classList.remove('entered');

                    const oBoost = this.#playerData.getBoost("Hints");
                    if (oBoost && (typeof oBoost.turnsRemaining === "number") && oBoost.turnsRemaining > 0) {
                        SidukoHtmlGenerator.updateCellHints(this.#puzzle);                           
                    } else {
                        this.#puzzle.getData().cells.forEach(cell => {
                            cell.element.title = "";
                        });
                    }
                    
                }
                break;
        }
        oEvent.stopPropagation();
    }

    _onKeyPress(oEvent) {
        const oEventTarget = oEvent.target;
        const iValue = parseInt(oEvent.key, 10);

        if ((oEventTarget.nodeName === "TD") && ([1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(iValue) >= 0)) {
            if (!oEventTarget.classList.contains('fixedval')) {
                const column = 0 | oEventTarget.dataset.column;
                const row = 0 | oEventTarget.dataset.row;                               
                const oCellData = this.#puzzle.getData().cell(column,row);
                    
                if (SidukoCellQueries.getPossibleValues(this.#puzzle.getData(),oCellData).indexOf(iValue) >= 0) {
                    const oStartFullnessState = SidukoCellQueries.getFullnessState(this.#puzzle.getData(), oCellData);        

                    oCellData.value = iValue || 0;
                    oCellData.entered = true;                    
                    oEventTarget.innerText = oEvent.key;
                    oEventTarget.classList.add('entered');                       
                    oEventTarget.title = "";                    

                    let oBoost = this.#playerData.getBoost("Hints");
                    if (oBoost && (typeof oBoost.turnsRemaining === "number") && oBoost.turnsRemaining > 0) {
                        SidukoHtmlGenerator.updateCellHints(this.#puzzle);                           
                    } else {
                        this.#puzzle.getData().cells.forEach(cell => {
                            cell.element.title = "";
                        });
                    }                    

                    const oEndFullnessState = SidukoCellQueries.getFullnessState(this.#puzzle.getData(), oCellData);    
                    const oFullnessStateChanges = {};
                    if (oStartFullnessState.column !== oEndFullnessState.column) {
                        oFullnessStateChanges['column'] = oCellData.column+1;
                    } 
                    if (oStartFullnessState.row !== oEndFullnessState.row) {
                        oFullnessStateChanges['row'] = oCellData.row+1;
                    }
                    if (oStartFullnessState.innerTableIndex !== oEndFullnessState.innerTableIndex) {
                        oFullnessStateChanges['innerTable'] = oCellData.innerTableIndex+1;
                    }
                    if (oStartFullnessState.board !== oEndFullnessState.board) {
                        oFullnessStateChanges['board'] = true;
                    }
                    this.gameplayChangedHandler(oFullnessStateChanges);

                    this.gameplayChangedHandler({playerCellUsed: true });      
                                    

                    this.#playerData.guessesRemaining = this.#playerData.guessesRemaining - 1;
                    this.#playerData.guessesUntilNextBonus--;
                    if (this.#playerData.guessesUntilNextBonus === 0) {
                        this.#puzzle.triggerBonus();
                        this.#playerData.guessesUntilNextBonus = 1; //TODO
                    }


                    oBoost = this.#playerData.getBoost("Seeker");
                    if (oBoost && (typeof oBoost.turnsRemaining === "number") && oBoost.turnsRemaining > 0) {
                        if (SidokuBonuses.autoFillCellsWithOnePossibleValue(this.#puzzle,this.#puzzle.solution, this.gameplayChangedHandler.bind(this),oBoost)) {
                            SidukoHtmlGenerator.updateCellHints(this.#puzzle);
                            oBoost.turnsRemaining--;
                        }
                        
                    }
                    if (oBoost && oBoost.turnsRemaining === 0) {
                        oBoost.turnsRemaining = null;
                        oBoost.domElement.classList.add("exhausted");
                        logMessage("Seeker bonus used up");
                    }
                }
            }
        }
    }
}
