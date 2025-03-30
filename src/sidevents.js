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

    _onKeyDown(oEvent) {
        const column = 0 | oEvent.target.dataset.column;
        const row = 0 | oEvent.target.dataset.row;
        console.log(`KeyDowm: col: ${column}, row: ${row}, elem: ${oEvent.target.dataset}`);
        switch (oEvent.code) {
            case 'ArrowLeft':
                if (column > 0) {
                    this.#tableDomElement.querySelector(`.sidukoTable>tr>td>table>tr>td[data-column="${column - 1}"][data-row="${row}"]`).focus();
                }
                break;

            case 'ArrowRight':
                if (column < 8) {
                    this.#tableDomElement.querySelector(`.sidukoTable>tr>td>table>tr>td[data-column="${column + 1}"][data-row="${row}"]`).focus();
                }

                break;

            case 'ArrowUp':
                if (row > 0) {
                    this.#tableDomElement.querySelector(`.sidukoTable>tr>td>table>tr>td[data-column="${column}"][data-row="${row - 1}"]`).focus();
                }
                break;

            case 'ArrowDown':
                if (row < 8) {
                    this.#tableDomElement.querySelector(`.sidukoTable>tr>td>table>tr>td[data-column="${column}"][data-row="${row + 1}"]`).focus();
                }
                break;
            case 'Backspace': 
            case 'Space': 
            case 'Delete':
            case 'Digit0':
                const oElem = this.#tableDomElement.querySelector(`td[data-column="${column}"][data-row="${row}"]`);
                if (oElem.classList.contains('entered')) {
                    const oCellData = this.#puzzle.getData().cell(column, row);
                    oCellData.entered = false;
                    oCellData.value = null;
                    oCellData.element.innerText = '';                    
                    oCellData.element.classList.remove('entered');
                    const aPossibleValues = SidukoCellQueries.getPossibleValues(this.#puzzle.getData(), oCellData);
                    oCellData.element.title = aPossibleValues.toString();
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
                    oCellData.value = iValue || 0;
                    oCellData.entered = true;                    
                    oEventTarget.innerText = oEvent.key;
                    oEventTarget.classList.add('entered');                       
                    oEventTarget.title = "";                    

                    // Update tooltip hints
                    for (let row = 0; row< 9; row++) {
                        for (let col = 0; col < 9; col++) {
                            const oCell = this.#puzzle.getData().cell(col, row);
                            if (!(oCell.fixedValue || oCell.entered)) {
                                const aPossibleValues = SidukoCellQueries.getPossibleValues(this.#puzzle.getData(), oCell);
                                oCell.element.title = aPossibleValues.toString();
                                
                            } else {
                                oCell.element.title = "";
                            }
                          
                        }
                    }
                           
                }
            }
        }
    }
}
