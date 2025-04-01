class SidukoEventsHandler {
    #tableDomElement;
    #puzzle;
    constructor(oPuzzle, oTableDomElement) {
        this.#tableDomElement = oTableDomElement;
        this.#puzzle = oPuzzle;
        document.querySelectorAll('.sidukoTable>tr>td>table>tr>td')
        this.attachEvents();
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
        if (state) {
            // TODO: check if the cells filled match the solution if not then NO BONUS
            if (state.column) {
                logMessage(`✨***Column Filled***✨`, "column_filled");
            }
            if (state.row) {
                logMessage(`🎉***Row Filled***🎉`, "row_filled");
            }
            if (state.innerTable) {
                logMessage(`👍***Inner Table Filled***👍`, "inner_table_filled");
            }
            if (state.board) {
                logMessage(`🔥🔥🔥***Board Filled***🔥🔥🔥`, "board_filled");
                window.alert('Well Done!');
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
                    SidukoHtmlGenerator.updateCellHints(this.#puzzle);
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

                    SidukoHtmlGenerator.updateCellHints(this.#puzzle);                    

                    const oEndFullnessState = SidukoCellQueries.getFullnessState(this.#puzzle.getData(), oCellData);    
                    const oFullnessStateChanges = {};
                    if (oStartFullnessState.column !== oEndFullnessState.column) {
                        oFullnessStateChanges['column'] = true;
                    } 
                    if (oStartFullnessState.row !== oEndFullnessState.row) {
                        oFullnessStateChanges['row'] = true;
                    }
                    if (oStartFullnessState.innerTableIndex !== oEndFullnessState.innerTableIndex) {
                        oFullnessStateChanges['innerTable'] = true;
                    }
                    if (oStartFullnessState.board !== oEndFullnessState.board) {
                        oFullnessStateChanges['board'] = true;
                    }
                    this.gameplayChangedHandler(oFullnessStateChanges);                             
                }
            }
        }
    }
}
