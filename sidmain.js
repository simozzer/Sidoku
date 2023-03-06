doLoaded = () => {

    const oPuzzle = new SidukoPuzzle();
    oPuzzle.setPuzzleStartData(linearEvilPuzzleData);
    const generator = new SidukoHtmlGenerator(oPuzzle);
    const tableDOM = generator.getPuzzleDOM();
    document.getElementById("everywhere").appendChild(tableDOM);
    const eventHandler = new SidukoEventsHandler(oPuzzle, tableDOM);
    const solver = new SidukoSolver(oPuzzle);
    solver.execute();

};

// Data here is in sequential order from top left cell to bottom right traversing columns before rows.
//const linearEvilPuzzleData = [0, 0, 9, 0, 3, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 7, 0, 0, 8, 0, 1, 0, 7, 0, 0, 0, 3, 0, 9, 0, 0, 8, 0, 0, 0, 0, 6, 0, 8, 2, 0, 0, 0, 1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 6, 3, 0, 7, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 5, 0, 2, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0];
const linearEvilPuzzleData = [9, 0, 0, 0, 4, 3, 1, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 9, 0, 8, 0, 0, 0, 1, 9, 3, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 6, 0, 0, 0, 0, 7, 0, 6, 4, 0, 0, 3, 4, 0, 0, 2, 0, 0, 0, 0, 0];

const cellValueStates = {
    FIXED: 1,
    ENTERED: 2,
    SUGGESTED: 3,
    SOLVED: 4
}
Object.freeze(cellValueStates);

class SidukoPuzzle {
    #cells;
    constructor() {
        this.#cells = [];
        for (let iCellIndex = 0; iCellIndex < 81; iCellIndex++) {
            const oCell = new SidukoCell(iCellIndex);
            this.#cells.push(oCell);
        }
    }

    get cells() {
        return this.#cells;
    }

    cell(iColIndex, iRowIndex) {
        return this.#cells.filter(oCell => oCell.column === iColIndex && oCell.row === iRowIndex)[0];
    }

    cellsInRow(iRowIndex) {
        return this.#cells.filter(oCell => oCell.row === iRowIndex);
    }

    cellsInColumn(iColumnIndex) {
        return this.#cells.filter(oCell => oCell.column === iColumnIndex);
    }

    cellsInInnerTable(iInnerTableIndex) {
        return this.#cells.filter(oCell => oCell.innerTableIndex === iInnerTableIndex);
    }

    setPuzzleStartData(aStartData) {
        aStartData.forEach((iValue, iIndex) => {
            const oCell = this.#cells[iIndex];
            if (iValue > 0) {
                oCell.value = iValue;
                oCell.setFixed();
            }
        });
    }

    getPossibleValues(oCell) {
        const aPossibleValues = [];
        for (let iPossibleValue = 1; iPossibleValue < 10; iPossibleValue++) {
            if ((this.cellsInRow(oCell.row).filter(oRowCell => oRowCell.value === iPossibleValue).length === 0)
                && (this.cellsInColumn(oCell.column).filter(oColumnCell => oColumnCell.value === iPossibleValue).length === 0)
                && (this.cellsInInnerTable(oCell.innerTableIndex).filter(oInnerTableCell => oInnerTableCell.value === iPossibleValue).length === 0)) {
                aPossibleValues.push(iPossibleValue);
            }
        }
        return aPossibleValues;
    }

    canSetValue(oCell, value) {
        if ((this.cells.filter(o => (o.row === oCell.Row) && (o !== oCell) && (o.value === value)).length > 0)
            || (this.cells.filter(o => (o.column === oCell.column) && (o !== oCell) && (o.value === value)).length > 0)
            || (this.cells.filter(o => (o.innerTableIndex === oCell.innerTableIndex) && (o !== oCell) && (o.value === value)).length > 0)) {
            return false;
        }
        return true;
    }

    canSetACellValue(oCell) {
        const aPossibleCellValues = this.getPossibleValues(oCell);
        let iChoiceIndex = oCell.choiceIndex;
        if (iChoiceIndex < aPossibleCellValues.length) {
            while ((iChoiceIndex < aPossibleCellValues.length - 1) && (!this.canSetValue(oCell, aPossibleCellValues[iChoiceIndex]))) {
                iChoiceIndex++;
            }
            if (this.canSetValue(oCell, aPossibleCellValues[iChoiceIndex])) {
                oCell.choiceIndex = iChoiceIndex;
                return true;
            }
        }
        return false;
    }
}

class SidukoCell {
    #column;
    #row;
    #value;
    #innerTableIndex;
    #valueState;
    #element;
    #passIndex;

    constructor(iCellIndex) {
        this.#row = Math.floor(iCellIndex / 9);
        this.#column = iCellIndex - (9 * this.#row);
        this.#innerTableIndex = (3 * Math.floor(this.#row / 3)) + Math.floor(this.#column / 3);
        this.#value = 0;
        this.choiceIndex = 0;
        this.#passIndex = -1;
    }

    get innerTableIndex() {
        return this.#innerTableIndex;
    }

    get column() {
        return this.#column;
    }

    get row() {
        return this.#row;
    }

    get value() {
        return this.#value;
    }

    set value(iValue) {
        this.#value = iValue;
    }

    get passIndex() {
        return this.#passIndex;
    }

    set passIndex(iPassIndex) {
        this.#passIndex = iPassIndex;
    }

    setFixed() {
        this.#valueState = cellValueStates.FIXED;
    }

    get fixed() {
        return this.#valueState === cellValueStates.FIXED;
    }

    get entered() {
        return this.#valueState === cellValueStates.ENTERED;
    }

    set entered(bEntered) {
        if (bEntered) {
            this.#valueState = cellValueStates.ENTERED;
        } else if ([cellValueStates.SOLVED, cellValueStates.FIXED].indexOf(this.#valueState) < 0) {
            this.#valueState = undefined;
        }
    }

    get solved() {
        return this.#valueState === cellValueStates.SOLVED;
    }

    setSolved() {
        this.#valueState = cellValueStates.SOLVED;
    }

    get suggested() {
        return this.#valueState === cellValueStates.SUGGESTED;
    }

    set suggested(bSuggested) {
        this.#valueState = bSuggested ? cellValueStates.SUGGESTED : undefined;
    }

    get element() {
        return this.#element;
    }

    set element(element) {
        this.#element = element;
    }

    reset() {
        this.#value = 0;
        this.#valueState = undefined;
        this.element.innerHTML = '';
        this.element.classList.remove('suggested');
        this.element.classList.remove('solved');
    }
}

class SidukoHtmlGenerator {

    #sidokuPuzzle;
    constructor(sidokuPuzzle) {
        this.#sidokuPuzzle = sidokuPuzzle;
    }

    getPuzzleDOM() {
        const oTable = document.createElement("table");
        oTable.className = "sidukoTable"
        for (let iCellY = 0; iCellY < 3; iCellY++) {
            const oTableRow = document.createElement('tr');
            for (let iCellX = 0; iCellX < 3; iCellX++) {
                const oInnerTable = this.getInnerTableDOM(iCellX, iCellY);
                oTableRow.appendChild(oInnerTable);
            }
            oTable.appendChild(oTableRow);
        }
        return oTable;
    }

    getInnerTableDOM(iTableX, iTableY) {
        const oInnerTableHolder = document.createElement('td');
        const oInnerTable = document.createElement('table');
        oInnerTable.className = "cell";

        for (let iInnerY = 0; iInnerY < 3; iInnerY++) {
            const oInnerRow = document.createElement('tr');
            for (let iInnerX = 0; iInnerX < 3; iInnerX++) {
                const iColumn = (3 * iTableX) + iInnerX;
                const iRow = (3 * iTableY) + iInnerY;
                const oInnerCell = this.getCellDOM(iColumn, iRow);
                oInnerRow.appendChild(oInnerCell);
            }
            oInnerTable.appendChild(oInnerRow);
        }

        oInnerTableHolder.appendChild(oInnerTable)
        return oInnerTableHolder;
    }

    getCellDOM(iColumn, iRow) {
        const oCellData = this.#sidokuPuzzle.cell(iColumn, iRow);
        const iCellValue = oCellData.value;
        const oInnerCell = document.createElement('td');

        if (iCellValue > 0) {
            oInnerCell.innerText = iCellValue;
            if (oCellData.fixed) {
                oInnerCell.classList.add('fixed');
            }
        } else {
            oInnerCell.title = this.#sidokuPuzzle.getPossibleValues(oCellData).toString();
        }
        oInnerCell.tabIndex = 0;

        // needed for keyboard navigation
        oInnerCell.dataset.column = iColumn;
        oInnerCell.dataset.row = iRow;

        oCellData.element = oInnerCell;

        return oInnerCell;
    }
}

class SidukoEventsHandler {
    #tableDomElement;
    #puzzle;
    constructor(oPuzzle, oTableDomElement) {
        this.#tableDomElement = oTableDomElement;
        this.#puzzle = oPuzzle;
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
        switch (oEvent.code) {
            case 'ArrowLeft':
                if (column > 0) {
                    this.#tableDomElement.querySelector(`td[data-column="${column - 1}"][data-row="${row}"]`).focus();
                }
                break;

            case 'ArrowRight':
                if (column < 8) {
                    this.#tableDomElement.querySelector(`td[data-column="${column + 1}"][data-row="${row}"]`).focus();
                }

                break;

            case 'ArrowUp':
                if (row > 0) {
                    this.#tableDomElement.querySelector(`td[data-column="${column}"][data-row="${row - 1}"]`).focus();
                }
                break;

            case 'ArrowDown':
                if (row < 8) {
                    this.#tableDomElement.querySelector(`td[data-column="${column}"][data-row="${row + 1}"]`).focus();
                }
                break;
            case 'Backspace', 'Space', 'Delete', 'Digit0':
                const oElem = this.#tableDomElement.querySelector(`td[data-column="${column}"][data-row="${row}"]`);
                if (oElem.classList.contains('entered')) {
                    const oCellData = this.#puzzle.cell(column, row);
                    oCellData.entered = false;
                    oElem.innerText = '';
                    oElem.classList.remove('entered');
                }
                break;
        }
    }

    _onKeyPress(oEvent) {
        const oEventTarget = oEvent.target;
        const iValue = parseInt(oEvent.key, 10);
        if ((oEventTarget.nodeName === "TD") && ([1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(iValue) >= 0)) {
            if (!oEventTarget.classList.contains('fixed')) {
                const column = 0 | oEventTarget.dataset.column;
                const row = 0 | oEventTarget.dataset.row;
                const oCellData = this.#puzzle.cell(column, row);
                if (this.#puzzle.getPossibleValues(oCellData).indexOf(iValue) >= 0) {
                    oCellData.value = iValue;
                    oCellData.entered = true;
                    oEventTarget.innerText = oEvent.key;
                    oEventTarget.classList.add('entered');
                }
            }
        }
    }
}

class SidukoSolver {
    #oPuzzle;
    #sortedPossibleValuesList;
    #passIndex = 0;
    #stack = [];

    constructor(oPuzzle) {
        this.#oPuzzle = oPuzzle;
        this.#sortedPossibleValuesList = this.#oPuzzle.cells.filter(oCell => oCell.value < 1).sort((a, b) => this.#oPuzzle.getPossibleValues(a).length - this.#oPuzzle.getPossibleValues(b).length);
    }

    solveSomething() {
        let stepProducedProgress;
        do {
            stepProducedProgress = false;
            if (this.hasPossibleDefiniteAnswers()) {
                if (this.applyCellsWithOnePossibleValue()) {
                    this.solvedSomething = true;
                    stepProducedProgress = true;
                }
            }
        } while (stepProducedProgress)
    }

    // Within a set of 9 cells find and cells which can be the only cell containing a specific value and set them
    solveCells(aCellsToSolve) {
        let stepProducedProgress = false;
        let continueLooping = false;
        do {
            continueLooping = false;

            for (let possibleValue = 1; possibleValue < 10; possibleValue++) {
                let iOccurenceCount = 0;
                aCellsToSolve.forEach(oCell => {
                    if ((this.#oPuzzle.getPossibleValues(oCell).indexOf(possibleValue) > -1) || (oCell.value === possibleValue)) {
                        iOccurenceCount++;
                    }
                });

                if (iOccurenceCount === 1) {
                    const oCellToAdjust = aCellsToSolve.find(oCell => this.#oPuzzle.getPossibleValues(oCell).indexOf(possibleValue) > -1);
                    if (oCellToAdjust && oCellToAdjust.value < 1) {
                        this.solvedSometing = true;
                        stepProducedProgress = true;
                        continueLooping = true;
                        oCellToAdjust.value = possibleValue;
                        oCellToAdjust.element.innerText = possibleValue;
                        oCellToAdjust.element.title = '';
                        oCellToAdjust.element.classList.add('solved');
                        oCellToAdjust.setSolved();
                        oCellToAdjust.passIndex = this.#passIndex;
                    }
                }
            }
        } while (continueLooping);
        return stepProducedProgress;
    }

    solveInnerTables() {
        let stepProducedProgress;
        do {
            stepProducedProgress = false;
            for (let i = 0; i < 9; i++) {
                const aCellsInInnerTable = this.#oPuzzle.cells.filter(oCell => oCell.innerTableIndex === i);
                stepProducedProgress = this.solveCells(aCellsInInnerTable);
            }
        } while (stepProducedProgress);
    }

    solveRows() {
        let stepProducedProgress;
        do {
            stepProducedProgress = false;
            for (let i = 0; i < 9; i++) {
                const aCellsInRow = this.#oPuzzle.cells.filter(oCell => oCell.row === i);
                stepProducedProgress = this.solveCells(aCellsInRow);
            }
        } while (stepProducedProgress);
    }

    solveColumns() {
        let stepProducedProgress;
        do {
            stepProducedProgress = false;
            for (let i = 0; i < 9; i++) {
                const aCellsInColumn = this.#oPuzzle.cells.filter(oCell => oCell.column === i);
                stepProducedProgress = this.solveCells(aCellsInColumn);
            }
        } while (stepProducedProgress);
    }

    // Try to solve based on current data, by process of illimination
    doSimpleSolve() {
        try {
            this.solvedSometing = true;
            while (this.solvedSometing) {
                this.solvedSometing = false;
                this.solveInnerTables();
                this.solveRows();
                this.solveColumns();
                this.solveSomething();
            }

        } catch (err) {
            window.alert(err);
        }
    }

    async doExecute() {
        return new Promise((resolve, reject) => {
            window.setTimeout(function (that) {
                if (that.processNextCell()) {
                    that.#passIndex++
                } else {
                    that.rewind();
                }
                resolve(true);
            }, 50, this);
        });
    }

    async execute() {
        this.#passIndex++;

        this.doSimpleSolve();

        this.#passIndex = 1;
        let solved = false;
        do {
            await this.doExecute();
        } while (this.#oPuzzle.cells.filter(cell => cell.value === 0).length > 0);

    }

    rewind() {
        const oLastUpdatedCell = this.#stack.pop();
        this.#oPuzzle.cells.forEach(o => {
            if (o.passIndex === oLastUpdatedCell.passIndex) {
                o.reset();
            }
        })
        oLastUpdatedCell.choiceIndex++;
        oLastUpdatedCell.reset();
        if (!this.#oPuzzle.canSetACellValue(oLastUpdatedCell)) {
            oLastUpdatedCell.choiceIndex = 0;
            const oPrevCell = this.#stack[this.#stack.length - 1];
            this.#oPuzzle.cells.forEach(o => {
                if (o.passIndex === oPrevCell.passIndex) {
                    o.reset();
                }
            });
            oPrevCell.reset();
            this.rewind();
        }
    }

    processNextCell() {
        this.#sortedPossibleValuesList = this.#oPuzzle.cells.filter(oCell => oCell.value < 1).sort((a, b) => this.#oPuzzle.getPossibleValues(a).length - this.#oPuzzle.getPossibleValues(b).length);
        let cellsWithMutlipleSolutions = this.#sortedPossibleValuesList.filter(oCell => this.#oPuzzle.getPossibleValues(oCell).length > 0);

        if (this.#sortedPossibleValuesList.map(o => this.#oPuzzle.getPossibleValues(o)).filter(o => o.length > 0).length === 0) {
            // some of the cells on the grid have no possible answer
            return false;
        };

        const oSolveCell = cellsWithMutlipleSolutions[0];
        const aPossibleCellValues = this.#oPuzzle.getPossibleValues(oSolveCell);
        if (oSolveCell.choiceIndex < aPossibleCellValues.length && this.#oPuzzle.canSetACellValue(oSolveCell)) {
            oSolveCell.value = aPossibleCellValues[oSolveCell.choiceIndex];
            oSolveCell.suggested = true;
            oSolveCell.passIndex = this.#passIndex;
            oSolveCell.element.innerHTML = oSolveCell.value;
            oSolveCell.element.classList.add('suggested');
            this.#stack.push(oSolveCell);
            this.doSimpleSolve();
            return true;
        } else {
            return false;
        }
    }

    hasPossibleDefiniteAnswers() {
        return this.#sortedPossibleValuesList.filter(oCell => oCell.value < 1 && this.#oPuzzle.getPossibleValues(oCell).length === 1).length > 0;
    }

    applyCellsWithOnePossibleValue() {
        const aPossibleAnswers = this.#sortedPossibleValuesList.filter(oCell => oCell.value < 1 && this.#oPuzzle.getPossibleValues(oCell).length === 1);
        if (this.singleValuesAreValid(aPossibleAnswers)) {
            aPossibleAnswers.forEach(oPossibleAnswer => {
                oPossibleAnswer.value = this.#oPuzzle.getPossibleValues(oPossibleAnswer)[0];
                oPossibleAnswer.element.innerText = oPossibleAnswer.value;
                oPossibleAnswer.element.title = '';
                oPossibleAnswer.element.classList.add('solved');
                oPossibleAnswer.setSolved();
                oPossibleAnswer.passIndex = this.#passIndex;
                return true;
            });
        }
        return false;
    }

    singleValuesAreValid(aPossibleAnswers) {
        return !aPossibleAnswers.find((oSingleValueCell) => {
            return (aPossibleAnswers.find((oPossibleAnswerCell) => {
                if ((oSingleValueCell !== oPossibleAnswerCell) && (this.#oPuzzle.getPossibleValues(oSingleValueCell)[0] === this.#oPuzzle.getPossibleValues(oPossibleAnswerCell)[0])) {
                    if (oSingleValueCell.column === oPossibleAnswerCell.column) {
                        return true;
                    } else if (oSingleValueCell.row === oPossibleAnswerCell.row) {
                        return true;
                    } else if (oSingleValueCell.innerTableIndex === oPossibleAnswerCell.innerTableIndex)
                        return true;
                }
                return false;
            }
            ))
        });
    }
}
