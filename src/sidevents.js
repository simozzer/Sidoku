class SidukoEventsHandler {
    #tableDomElement;
    #puzzle;
    #playerData;
    #focusedCell;
    #cellValueEntry
    
    constructor(oPuzzle, oTableDomElement, playerData) {
        this.#tableDomElement = oTableDomElement;
        this.#puzzle = oPuzzle;
        this.#playerData = playerData;        
        this.#focusedCell = null;
        //document.querySelectorAll('.sidukoTable>tr>td>table>tr>td')
        this.#cellValueEntry = document.getElementById('cellValueEntryPopup');
        this.attachEvents();

        
    }

    attachEvents() {
        this.#tableDomElement.addEventListener('keydown', this._onKeyDown.bind(this));
        this.#tableDomElement.addEventListener('keypress', this._onKeyPress.bind(this));
        this.#tableDomElement.addEventListener('click', this._onTap.bind(this));
        this.#cellValueEntry.addEventListener('click', this._onCellValueEntryChange.bind(this));
        this.#cellValueEntry.addEventListener('blur', this._onCellValueEntryBlur.bind(this));
    }

    detatchEvents() {
        this.#tableDomElement.removeEventListener('keydown', this._onKeyDown.bind(this));
        this.#tableDomElement.removeEventListener('keypress', this._onKeyPress.bind(this));   
        this.#tableDomElement.removeEventListener('click', this._onTap.bind(this));  
        this.#cellValueEntry.removeEventListener('click', this._onCellValueEntryChange.bind(this));   
        this.#cellValueEntry.removeEventListener('blur', this._onCellValueEntryBlur.bind(this));
    }

    gameplayChangedHandler(state) {
        const oGame = this.#puzzle;
        if (state) {            
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
                this.#playerData.doTurnPlayed(true, oGame);
                //SidokuBonuses.autoFillCellsWithOnePossibleValue(oGame, oGame.solution, this.gameplayChangedHandler.bind(this));
            } else if (state.cellUsed) {
                console.log("cell used by A bonus");
                this.#playerData.doTurnPlayed(false, oGame);
            } else {
                console.log("Unknown state");
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
        oEvent.stopImmediatePropagation();
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
                 

                    const oEndFullnessState = SidukoCellQueries.getFullnessState(this.#puzzle.getData(), oCellData);    
                    let oFullnessStateChanges = SidukoCellQueries.getFullnessStateChanges(oStartFullnessState, oEndFullnessState, oCellData);
                    if (!oFullnessStateChanges) {
                        oFullnessStateChanges = {};
                    }
                    oFullnessStateChanges.playerCellUsed= true;
                    this.gameplayChangedHandler(oFullnessStateChanges);
                    
                    // TODO REWIND TO LAST POINT OF DIVERGENCE
                }
            }
            oEvent.stopImmediatePropagation();
        }
    }

    _onTap(oEvent) {
        const oEventTarget = oEvent.target;
        
        console.log(`Tap: elem: ${oEventTarget.dataset}`);

        if ((oEventTarget.nodeName === "TD")) {
            if (!oEventTarget.classList.contains('fixedval')) {
                const column = 0 | oEventTarget.dataset.column;
                const row = 0 | oEventTarget.dataset.row;                               
                this.#focusedCell = this.#puzzle.getData().cell(column,row);

                const aPossibleValues = SidukoCellQueries.getPossibleValues(this.#puzzle.getData(), this.#focusedCell);

                const valueEntry = document.getElementById('cellValueEntryPopup');

                const valueEntryTds = Array.from(document.querySelectorAll('#cellValueEntryPopup td'));
                valueEntryTds.forEach(td => {
                    if (this.#playerData.getBoost("Hints").turnsRemaining > 0 && aPossibleValues.indexOf(parseInt(td.innerText,10)) >= 0) {
                        td.classList.add('suggested');
                    } else {
                        td.classList.remove('suggested');
                    }
                });

                valueEntry.style.top = oEvent.clientY + "px";
                valueEntry.style.left = oEvent.clientX + "px";
                valueEntry.classList.remove('hidden');
                
                valueEntry.focus();
           
                oEvent.stopImmediatePropagation();
            }

        }
    }

    _onCellValueEntryChange(oEvent) {
        const oCellData = this.#focusedCell;
        const valueEntry = document.getElementById('cellValueEntryPopup');
        if (oEvent.target.innerText === "Clear") {
            oCellData.value = null;
            oCellData.entered = false;                    
            oCellData.element.innerText = '';
            oCellData.element.classList.remove('entered');                       
            oCellData.element.title = "";    
            
            valueEntry.classList.add('hidden');2                    
            oEvent.stopImmediatePropagation();
            return;
        }

        const iValue = parseInt(oEvent.target.innerText, 10);
        if (iValue > 0 && iValue <= 9) {            
            if (SidukoCellQueries.canSetValue(this.#puzzle.getData(), oCellData, iValue)) {                                                     
                const oStartFullnessState = SidukoCellQueries.getFullnessState(this.#puzzle.getData(), oCellData);        

                oCellData.value = iValue || 0;
                oCellData.entered = true;                    
                oCellData.element.innerText = iValue
                oCellData.element.classList.add('entered');                       
                oCellData.element.title = "";                    
                
                const oEndFullnessState = SidukoCellQueries.getFullnessState(this.#puzzle.getData(), oCellData);    
                let oFullnessStateChanges = SidukoCellQueries.getFullnessStateChanges(oStartFullnessState, oEndFullnessState, oCellData);
                if (!oFullnessStateChanges) {
                    oFullnessStateChanges = {};
                }
                oFullnessStateChanges.playerCellUsed= true;
                this.gameplayChangedHandler(oFullnessStateChanges);                
                valueEntry.classList.add('hidden');2                
            }
            oEvent.stopImmediatePropagation();
        }
    }

    _onCellValueEntryBlur(oEvent) {
        const valueEntry = document.getElementById('cellValueEntryPopup');
        valueEntry.classList.add('hidden');
        oEvent.stopImmediatePropagation();
    }
}
