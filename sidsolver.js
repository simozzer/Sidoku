class SidukoSolver {
    #oPuzzle;
    #sortedPossibleValuesList;
    #passIndex = 0;
    #stack = [];
    #fast = true;
    #fnComplete;
    #fastinterval = 500000;    
    #intervalsRemaining = 0;


    constructor(oPuzzle, fnComplete) {
        this.#oPuzzle = oPuzzle;
        this.oPuzzleData = this.#oPuzzle.data;       
        this.cells = this.#oPuzzle.data.cells;
        
        let emptyCells = this.#oPuzzle.data.cells.filter(oCell => oCell.value < 1);

        // Reverse sort seems a little faster!! :)
        //this.#sortedPossibleValuesList = emptyCells.sort((a, b) => SidukoCellQueries.getPossibleValues(oPuzzleData,a).length - SidukoCellQueries.getPossibleValues(oPuzzleData,b).length);
        this.#sortedPossibleValuesList = emptyCells.sort((b, a) => SidukoCellQueries.getPossibleValues(this.oPuzzleData,a).length - SidukoCellQueries.getPossibleValues(this.oPuzzleData,b).length);
        this.#fnComplete = fnComplete;
        this.#intervalsRemaining = this.#fastinterval;
    }

    solveSomething() {
        let stepProducedProgress;
        do {
            stepProducedProgress = false;
            if (this.applyCellsWithOnePossibleValue()) {
                this.solvedSomething = true;
                stepProducedProgress = true;
                return true;                
            }
        } while (stepProducedProgress)
        return stepProducedProgress;
    }

    // Within a set of 9 cells find and cells which can be the only cell containing a specific value and set them
    solveCells(aCellsToSolve) {
        let stepProducedProgress = false;
        let continueLooping = false;
        const oPuzzleData = this.#oPuzzle.data;
        const getPossibleValues = SidukoCellQueries.getPossibleValues;
        do {
            continueLooping = false;

            for (let possibleValue = 1; possibleValue < 10; possibleValue++) {
                let iOccurenceCount = aCellsToSolve.reduce((count, oCell) => 
                    count + (getPossibleValues(oPuzzleData, oCell).includes(possibleValue) ? 1 : 0), 0);

                if (iOccurenceCount === 1) {
                    const oCellToAdjust = aCellsToSolve.find(oCell => SidukoCellQueries.getPossibleValues(oPuzzleData,oCell).indexOf(possibleValue) > -1);
                    if (oCellToAdjust && oCellToAdjust.value < 1) {
                        this.solvedSometing = true;
                        stepProducedProgress = true;
                        continueLooping = true;
                        oCellToAdjust.value = possibleValue;
                        if (!this.#fast) {
                            this.#intervalsRemaining --;
                            if (this.#intervalsRemaining >= 0) {
                                this.#intervalsRemaining --;
                            } else {
                                this.#intervalsRemaining = this.#fastinterval;
                                const oElem = oCellToAdjust.element;
                                oElem.innerText = possibleValue;
                                oElem.title = '';
                                oElem.classList.add('solved');
                            }
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
        let stepProducedProgress = false;
        do {
            stepProducedProgress = false;
            for (let i = 0; ((i < 9) && this.solveCells(this.oPuzzleData.cellsInInnerTable(i))); i++) {
                stepProducedProgress = true;
            }
        } while (stepProducedProgress);
        return stepProducedProgress;
    }

    solveRows() {
        let stepProducedProgress = false;
        do {
            stepProducedProgress = false;
            for (let i = 0; ((i < 9) && this.solveCells(this.oPuzzleData.cellsInRow(i))); i++) {
                stepProducedProgress = true;
            }
        } while (stepProducedProgress);
        return stepProducedProgress;
    }

    solveColumns() {
        let stepProducedProgress = false;
        do {
            stepProducedProgress = false;
            for (let i = 0;((i < 9) && this.solveCells(this.oPuzzleData.cellsInColumn(i))); i++) {
                stepProducedProgress = true;
            }
        } while (stepProducedProgress);
        return stepProducedProgress;
    }

    // Try to solve based on current data, by process of elimination
    doSimpleSolve() {
        try {
            let solvedSomething = true;
            while (solvedSomething) {  
                
                this.solvedSomething = this.solveRows() 
                                    || this.solveColumns() 
                                    || this.solveInnerTables() 
                                    || this.solveSomething();
                return this.solvedSomething;                    
           
            }
        } catch (err) {
            window.alert(err);
        }
    }

    async doExecuteAsync() {
        return new Promise((resolve) => {
            window.setTimeout(function (that) {
                if (that.processNextCell()) {
                    that.#passIndex++;
                    resolve(true);
                } else {
                    that.rewind();
                    resolve(false);
                }
                
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
        let oCells = this.#oPuzzle.data.cells;
        if (this.#fast) {
            do {
                 this.doExecute();
                iExecutionCount++;
            } while (oCells.filter(oCell => oCell.value === 0).length > 0);

            oCells.forEach(oCell => {
                if (!oCell.fixed) {
                    const oElem = oCell.element;
                    oElem.innerHTML = oCell.value;
                    oElem.classList.remove('bob');
                    oElem.classList.add('solved');                    
                }
            });

            } else {
            do {
                await this.doExecuteAsync().then(() => {                        
                  iExecutionCount++;
                });

            } while (oCells.filter(cell => cell.value === 0).length > 0);
        }
        const duration = new Date().getTime() - startTime;
        document.querySelector('#everywhere table').classList.add('solved');
        if (typeof(this.#fnComplete) === "function") {
            this.#fnComplete(`Done: 'doExecute' was called ${iExecutionCount} times and took ${duration} ms.`);
        }
        
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
        const oPuzzleData = this.#oPuzzle.data;
        if (!SidukoCellQueries.canSetACellValue(oPuzzleData,oLastUpdatedCell)) {
            oLastUpdatedCell.choiceIndex = 0;
            const oPrevCell = this.#stack[this.#stack.length - 1];
            oPuzzleData.cells.forEach(o => {
                if (o.passIndex === oPrevCell.passIndex) {
                    o.reset(this.#fast);
                }
            });
            oPrevCell.reset(this.#fast);
            this.rewind();
        }
    }

    processNextCell() {
        const emptyCells = this.oPuzzleData.cells.filter(oCell => oCell.value < 1);
        if (emptyCells.length === 0) return true;

        const oSolveCell = emptyCells.reduce((min, cell) => 
            SidukoCellQueries.getPossibleValues(this.oPuzzleData, cell).length < 
            SidukoCellQueries.getPossibleValues(this.oPuzzleData, min).length ? cell : min
        );

        const aPossibleCellValues = SidukoCellQueries.getPossibleValues(this.oPuzzleData, oSolveCell);
        if (oSolveCell.choiceIndex < aPossibleCellValues.length && 
            SidukoCellQueries.canSetACellValue(this.oPuzzleData, oSolveCell)) {
            oSolveCell.value = aPossibleCellValues[oSolveCell.choiceIndex];
            oSolveCell.suggested = true;
            oSolveCell.passIndex = this.#passIndex;
            if (!this.#fast) {       
                const oElem = oSolveCell.element;         
                oElem.innerHTML = oSolveCell.value;
                oElem.classList.add('suggested');
            }
            this.#stack.push(oSolveCell);
            this.doSimpleSolve();
            return true;
        } else {
            return false;
        }
    }

    applyCellsWithOnePossibleValue() {
        const oPuzzleData = this.#oPuzzle.data;
        const oSingleValueCells = this.#sortedPossibleValuesList.filter(oCell => oCell.value < 1 && SidukoCellQueries.getPossibleValues(oPuzzleData,oCell).length === 1);
        oSingleValueCells.forEach(oCell => {
            const iValue = SidukoCellQueries.getPossibleValues(oPuzzleData,oCell)[0];
            if (iValue && SidukoCellQueries.canSetValue(oPuzzleData,oCell, iValue)) {
                oCell.value = iValue;
                if (!this.#fast) {
                    const oElem = oCell.element;
                    oElem.innerText = iValue;
                    oElem.title = '';
                    oElem.classList.add('solved');
                }
                oCell.setSolved();
                oCell.passIndex = this.#passIndex;            
                return true;
            }
        });
        return false;
    }

}
