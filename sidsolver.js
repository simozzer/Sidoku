class SidukoSolver {
    #oPuzzle;
    #sortedPossibleValuesList;
    #passIndex = 0;
    #stack = [];
    #fast = false;
    

    constructor(oPuzzle) {
        this.#oPuzzle = oPuzzle;
        this.cells = this.#oPuzzle.data.cells;        
        this.#sortedPossibleValuesList = this.cells.filter(oCell => oCell.value < 1).sort((a, b) => SidukoCellQueries.getPossibleValues(this.#oPuzzle.data,a).length - SidukoCellQueries.getPossibleValues(this.#oPuzzle.data,b).length);
    }

    solveSomething() {
        let stepProducedProgress;
        do {
            stepProducedProgress = false;
            if (this.applyCellsWithOnePossibleValue()) {
                this.solvedSomething = true;
                stepProducedProgress = true;
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
                    if ((SidukoCellQueries.getPossibleValues(this.#oPuzzle.data,oCell).indexOf(possibleValue) > -1)) {
                        iOccurenceCount++;
                    }
                });

                if (iOccurenceCount === 1) {
                    const oCellToAdjust = aCellsToSolve.find(oCell => SidukoCellQueries.getPossibleValues(this.#oPuzzle.data,oCell).indexOf(possibleValue) > -1);
                    if (oCellToAdjust && oCellToAdjust.value < 1) {
                        this.solvedSometing = true;
                        stepProducedProgress = true;
                        continueLooping = true;
                        oCellToAdjust.value = possibleValue;
                        if (!this.#fast) {
                            oCellToAdjust.element.innerText = possibleValue;
                            oCellToAdjust.element.title = '';
                            oCellToAdjust.element.classList.add('solved');
                        }
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
                stepProducedProgress = this.solveCells(this.#oPuzzle.data.cellsInInnerTable(i));
            }
        } while (stepProducedProgress);
    }

    solveRows() {
        let stepProducedProgress;
        do {
            stepProducedProgress = false;
            for (let i = 0; i < 9; i++) {
                stepProducedProgress = this.solveCells(this.#oPuzzle.data.cellsInRow(i));
            }
        } while (stepProducedProgress);
    }

    solveColumns() {
        let stepProducedProgress;
        do {
            stepProducedProgress = false;
            for (let i = 0; i < 9; i++) {
                stepProducedProgress = this.solveCells(this.#oPuzzle.data.cellsInColumn(i));
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

    async doExecuteAsync() {
        return new Promise((resolve, reject) => {
            var that = this;
            window.setTimeout(function (that) {
                if (that.processNextCell()) {
                    that.#passIndex++
                } else {
                    that.rewind();
                }
                resolve(true);
            }, 0, this);
        });
    }


    doExecute() {
        if (this.processNextCell()) {
            this.#passIndex++
        } else {
            this.rewind();
        }
    }

    async execute() {
        this.#passIndex++;

        this.doSimpleSolve();

        this.#passIndex = 1;
        let iExecutionCount = 0;
        const startTime = new Date().getTime();
        if (this.#fast) {
            do {
                this.doExecute();
                iExecutionCount++;
            } while (this.#oPuzzle.data.cells.filter(oCell => oCell.value === 0).length > 0);

            this.#oPuzzle.data.cells.forEach(oCell => {
                if (!oCell.fixed) {
                    oCell.element.innerHTML = oCell.value;
                    oCell.element.classList.add('solved');
                }
            });
        } else {
            do {
                await this.doExecuteAsync();
                iExecutionCount++;
            } while (this.#oPuzzle.data.cells.filter(cell => cell.value === 0).length > 0);
        }
        const duration = new Date().getTime() - startTime;
        document.querySelector('#everywhere table').classList.add('solved');
        window.setTimeout(() => {
            window.alert(`Done: 'doExecute' was called ${iExecutionCount} times and took ${duration} ms.`);
        }, 4000)
    }

    rewind() {
        const oLastUpdatedCell = this.#stack.pop();
        this.cells.forEach(o => {
            if (o.passIndex === oLastUpdatedCell.passIndex) {
                o.reset(this.#fast);
            }
        })
        oLastUpdatedCell.choiceIndex++;
        oLastUpdatedCell.reset(this.#fast);
        if (!SidukoCellQueries.canSetACellValue(this.#oPuzzle.data,oLastUpdatedCell)) {
            oLastUpdatedCell.choiceIndex = 0;
            const oPrevCell = this.#stack[this.#stack.length - 1];
            this.#oPuzzle.data.cells.forEach(o => {
                if (o.passIndex === oPrevCell.passIndex) {
                    o.reset(this.#fast);
                }
            });
            oPrevCell.reset(this.#fast);
            this.rewind();
        }
    }

    processNextCell() {
        this.#sortedPossibleValuesList = this.cells.filter(oCell => oCell.value < 1).sort((a, b) => SidukoCellQueries.getPossibleValues(this.#oPuzzle.data,a).length - SidukoCellQueries.getPossibleValues(this.#oPuzzle.data,b).length);        
        let cellsWithMutlipleSolutions = this.#sortedPossibleValuesList.filter(oCell => SidukoCellQueries.getPossibleValues(this.#oPuzzle.data, oCell).length > 0);

        if (this.#sortedPossibleValuesList.map(o => SidukoCellQueries.getPossibleValues(this.#oPuzzle.data,o)).filter(o => o.length > 0).length === 0) {
            // some of the cells on the grid have no possible answer
            return false;
        };

        const oSolveCell = cellsWithMutlipleSolutions[0];
        const aPossibleCellValues = SidukoCellQueries.getPossibleValues(this.#oPuzzle.data,oSolveCell);
        const iLen = aPossibleCellValues.length;
        if (oSolveCell.choiceIndex < iLen && SidukoCellQueries.canSetACellValue(this.#oPuzzle.data,oSolveCell)) {
            oSolveCell.value = aPossibleCellValues[oSolveCell.choiceIndex];
            oSolveCell.suggested = true;
            oSolveCell.passIndex = this.#passIndex;
            if (!this.#fast) {
                oSolveCell.element.innerHTML = oSolveCell.value;
                oSolveCell.element.classList.add('suggested');
            }
            this.#stack.push(oSolveCell);
            this.doSimpleSolve();
            return true;
        } else {
            return false;
        }
    }

    applyCellsWithOnePossibleValue() {
        const oSingleValueCells = this.#sortedPossibleValuesList.filter(oCell => oCell.value < 1 && SidukoCellQueries.getPossibleValues(this.#oPuzzle.data,oCell).length === 1);
        oSingleValueCells.forEach(oCell => {
            const iValue = SidukoCellQueries.getPossibleValues(this.#oPuzzle.data,oCell)[0];
            if (iValue && SidukoCellQueries.canSetValue(this.#oPuzzle.data,oCell, iValue)) {
                oCell.value = iValue;
                if (!this.#fast) {
                    oCell.element.innerText = iValue;
                    oCell.element.title = '';
                    oCell.element.classList.add('solved');
                }
                oCell.setSolved();
                oCell.passIndex = this.#passIndex;
                return true;
            }
        });
        return false;
    }

}
