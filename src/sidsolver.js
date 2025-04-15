class SidukoSolver {
  #oPuzzle;
  #sortedPossibleValuesList;
  #passIndex = 0;
  #stack = [];
  #fast = false;
  #fnComplete;

  constructor(oPuzzle, fnComplete) {
    this.#fast = document.getElementById("chk_fast")?.checked;
    this.#oPuzzle = oPuzzle;
    this.oPuzzleData = this.#oPuzzle.getData();
    this.cells = [...this.#oPuzzle.getData().cells];
    const emptyCells = this.#oPuzzle
      .getData()
      .cells.filter((oCell) => oCell.value < 1);
    this.#sortedPossibleValuesList = emptyCells.sort(
      (b, a) =>
        SidukoCellQueries.getPossibleValues(this.oPuzzleData, a).length -
        SidukoCellQueries.getPossibleValues(this.oPuzzleData, b).length
    );
    this.#fnComplete = fnComplete;
  }

  // TODO:: look for values with 1 possible cell.

  //TODO :: Reverse last 2 cells.

  //NEGATIVE BONUSES

  //EXACT CELL BONUSES

  //SOLVE PAIR BONUS

  //SEQUENCE BONUSES (3 or more of the same number revealed consecutively, or 3 in increasing or decreasing sequence, 3 values from the same cell, column or inner cell).

  // FACE DOWN.. find matching pairs

  // REWIND

  // REWIND TO LAST CORRECT POSITION

  // DESTROY ALL GUESSES SINCE LAST CORRECT POSITION

  // HIGHLIGHT WRONG CELLS

  // NON RECUSRIVE TOTAL SOLVE

  // BUY EXTRA MOVES

  // WILD CARDS

  // REVEAL INCORRECT CELLS

  // DOUBLE MODE (EVERY COL/ROW/INNER CELL solved reveals items with matching value in other COL/ROW/INNER CELL)

  // DOUBLE MODE (EVERY COL/ROW/INNER CELL solved reveals items with matching position in other COL/ROW/INNER CELL)

  // GUARANTEE (BONUS WILL FIND AN ANSWER)

  // DOUBLE MODE (EVERY COL/ROW/INNER CELL solved reveals all items in a COL/ROW/INNER CELL)

  // AUTO COMPLETE ROW/COLUMN?INNER TABLE WHEN ONLY x cells left.

  // allow digits ase wildcard pairs (e.g. 2s can be 1s and 1s can be 2s)

  // Slow time

  // level up max cells by x for a skill (temp)

  // level up max cells by x for a skill (decreasing each turn)

  // level up max cells by x for a skill (decresing when used)

  // level up max cells by x for a skill (permanent)

  /**
   * Solves a group of cells in the Sudoku puzzle.
   * This function iterates through the given cells and attempts to find cells with a unique possible value.
   * If a cell is found with a unique possible value, it sets the cell's value, updates the puzzle state, and returns true.
   * If no cell is found with a unique possible value, it returns false.
   *
   * @param {Array<SidukoCell>} aCellsToSolve - An array of SidukoCell objects to be solved.
   * @returns {boolean} - Returns true if a cell was solved, false otherwise.
   */
  solveCells(aCellsToSolve) {
    let stepProducedProgress;
    const oPuzzleData = this.#oPuzzle.getData();
    const fnGetPossibleValues = SidukoCellQueries.getPossibleValues;
    do {
      stepProducedProgress = false;
      for (let possibleValue = 9; possibleValue > 0; possibleValue--) {
        const iOccurenceCount = aCellsToSolve.reduce(
          (count, oCell) =>
            count +
            (fnGetPossibleValues(oPuzzleData, oCell).includes(possibleValue)
              ? 1
              : 0),
          0
        );

        if (iOccurenceCount === 1) {
          const oCellToAdjust = aCellsToSolve.find(
            (oCell) =>
              fnGetPossibleValues(oPuzzleData, oCell).indexOf(possibleValue) >=
              0
          );
          if (oCellToAdjust?.value === 0) {
            stepProducedProgress = true;
            oCellToAdjust.value = possibleValue;
            oCellToAdjust.setSolved();
            oCellToAdjust.passIndex = this.#passIndex;
            if (this.#fast) {
              return true;
            }
            return true;
          }
        }
      }
    } while (stepProducedProgress);
    return stepProducedProgress;
  }

  /**
   * Attempts to solve the Sudoku puzzle by processing each 3x3 inner table.
   * It checks each inner table for cells that can be definitively solved based on current possibilities.
   *
   * @returns {boolean} - Returns true if any progress was made in solving the puzzle, otherwise false.
   */
  solveInnerTables() {
    let stepProducedProgress = false;
    const oPuzzleData = this.oPuzzleData;
    const fnSolve = this.solveCells.bind(this);
    for (let i = 0; i < 9 && fnSolve(oPuzzleData.cellsInInnerTable(i)); i++) {
      stepProducedProgress = true;
    }
    return stepProducedProgress;
  }

  /**
   * Attempts to solve the Sudoku puzzle by processing each row.
   * It checks each row for cells that can be definitively solved based on current possibilities.
   *
   * @returns {boolean} - Returns true if any progress was made in solving the puzzle, otherwise false.
   */
  solveRows() {
    let stepProducedProgress = false;
    const oPuzzleData = this.oPuzzleData;
    const fnSolve = this.solveCells.bind(this);
    for (let i = 0; i < 9 && fnSolve(oPuzzleData.cellsInRow(i)); i++) {
      stepProducedProgress = true;
    }
    return stepProducedProgress;
  }

  /**
   * Attempts to solve the Sudoku puzzle by processing each column.
   * It checks each column for cells that can be definitively solved based on current possibilities.
   *
   * @returns {boolean} - Returns true if any progress was made in solving the puzzle, otherwise false.
   */
  solveColumns() {
    let stepProducedProgress = false;
    const oPuzzleData = this.oPuzzleData;
    const fnSolve = this.solveCells.bind(this);
    for (let i = 0; i < 9 && fnSolve(oPuzzleData.cellsInColumn(i)); i++) {
      stepProducedProgress = true;
    }
    return stepProducedProgress;
  }

  /**
   * Attempts to solve the Sudoku puzzle by processing each 3x3 inner table, each row, each column, and finally applying values to cells that have only one possible value.
   * This function returns true if any progress was made in solving the puzzle, otherwise false.
   *
   * @returns {boolean} - Returns true if any progress was made in solving the puzzle, otherwise false.
   */
  doSimpleSolve() {
    return (
      this.solveRows() ||
      this.solveColumns() ||
      this.solveInnerTables() ||
      this.applyCellsWithOnePossibleValue()
    );
  }

  /**
   * Asynchronously executes the next step in the Sudoku solving process.
   * This function attempts to process the next cell in the puzzle and updates the pass index if successful.
   * If processing fails, it triggers a rewind of the solving process.
   *
   * @async
   * @returns {Promise<boolean>} A promise that resolves to:
   *   - true if a cell was successfully processed and the pass index was incremented
   *   - false if processing failed and a rewind was triggered
   */
  async doExecuteAsync() {
    return new Promise((resolve) => {
      window.setTimeout(
        function (that) {
          if (that.processNextCell()) {
            that.#passIndex++;
            resolve(true);
          } else {
            that.rewind();
            resolve(false);
          }
        },
        0,
        this
      );
    });
  }

  /**
   * Executes the next step in the Sudoku solving process.
   * This function attempts to process the next cell in the puzzle and updates the pass index if successful.
   * If processing fails, it triggers a rewind of the solving process.
   *
   * @returns {boolean} Returns true if a cell was successfully processed and the pass index was incremented, false if processing failed and a rewind was triggered
   */
  doExecute() {
    if (this.processNextCell()) {
      this.#passIndex++;
    } else {
      this.rewind();
    }
  }

  /**
   * Executes the solver to try and complete the sudoko puzzle
   *
   * @async
   * @returns {Promise<boolean>} A promise that resolves to:
   *   - true if a cell was successfully processed and the pass index was incremented
   *   - false if processing failed and a rewind was triggered
   */
  async execute() {
    this.#passIndex++;

    this.doSimpleSolve();

    this.#passIndex = 1;
    let iExecutionCount = 0;
    const startTime = new Date().getTime();
    const oCells = this.#oPuzzle.getData().cells;

    if (this.#fast) {
      do {
        this.doExecute();
        iExecutionCount++;
      } while (oCells.filter((oCell) => oCell.value === 0).length > 0);
    } else {
      do {
        await this.doExecuteAsync().then(() => {
          iExecutionCount++;
        });
      } while (oCells.filter((cell) => cell.value === 0).length > 0);
    }

    const duration = new Date().getTime() - startTime;
    document.querySelector("#everywhere table").classList.add("solved");
    if (typeof this.#fnComplete === "function") {
      this.#fnComplete(
        `Done: 'doExecute' was called ${iExecutionCount} times and took ${duration} ms.`
      );
    }
  }

  /**
   * Rewinds the solving process by undoing the last cell update and resetting affected cells.
   * If the last updated cell cannot be set to a new value, it continues rewinding to the previous cell.
   * This method is used in backtracking to explore different possibilities when the current path doesn't lead to a solution.
   *
   * @returns {void} This method doesn't return a value.
   */
  rewind() {
    const oLastUpdatedCell = this.#stack.pop();
    const iLastUpdatedCellIndex = oLastUpdatedCell.passIndex;
    this.cells.forEach((o) => {
      if (o.passIndex === iLastUpdatedCellIndex) {
        o.reset(this.#fast);
      }
    });
    oLastUpdatedCell.choiceIndex++;
    oLastUpdatedCell.reset(this.#fast);
    const oPuzzleData = this.#oPuzzle.getData();
    if (!SidukoCellQueries.canSetACellValue(oPuzzleData, oLastUpdatedCell)) {
      oLastUpdatedCell.choiceIndex = 0;
      const oPrevCell = this.#stack[this.#stack.length - 1];
      const iPrevCellPassIndex = oPrevCell.passIndex;
      oPuzzleData.cells.forEach((o) => {
        if (o.passIndex === iPrevCellPassIndex) {
          o.reset(this.#fast);
        }
      });
      oPrevCell.reset(this.#fast);
      this.rewind();
    }
  }

  /**
   * Processes the next empty cell in the Sudoku puzzle.
   * This function identifies the empty cell with the least possible values,
   * attempts to fill it with a valid value, and updates the puzzle state accordingly.
   *
   * @returns {boolean} Returns true if a cell was successfully processed and filled,
   *                    or if the puzzle is complete. Returns false if no valid value
   *                    could be assigned to the selected cell.
   */
  processNextCell() {
    const oPuzzleData = this.oPuzzleData;
    const emptyCells = oPuzzleData.cells.filter((oCell) => oCell.value < 1);
    if (emptyCells.length === 0) return true;

    const fnGetPossibleValues = SidukoCellQueries.getPossibleValues;

    const oSolveCell = emptyCells.reduce((min, cell) =>
      fnGetPossibleValues(oPuzzleData, cell).length <
      fnGetPossibleValues(oPuzzleData, min).length
        ? cell
        : min
    );

    const aPossibleCellValues = fnGetPossibleValues(oPuzzleData, oSolveCell);
    if (
      oSolveCell.choiceIndex < aPossibleCellValues.length &&
      SidukoCellQueries.canSetACellValue(oPuzzleData, oSolveCell)
    ) {
      oSolveCell.value = aPossibleCellValues[oSolveCell.choiceIndex];
      oSolveCell.suggested = true;
      oSolveCell.passIndex = this.#passIndex;
      this.#stack.push(oSolveCell);
      this.doSimpleSolve();
      if (this.#fast) return true;
      /*
            const oElem = oSolveCell.element;         
            oElem.innerHTML = oSolveCell.value;
            oElem.classList.add('suggested');
            */
      return true;
    }
    return false;
  }

  /**
   * Applies values to cells that have only one possible value.
   * This function identifies cells with only one possible value and sets that value,
   * updating the puzzle state accordingly.
   *
   * @returns {boolean} Returns true if at least one cell was updated with a new value,
   *                    false if no cells were updated or if there are no cells with only one possible value.
   */
  applyCellsWithOnePossibleValue() {
    const oPuzzleData = this.#oPuzzle.getData();
    const oSingleValueCells = this.#sortedPossibleValuesList.filter(
      (oCell) =>
        oCell.value < 1 &&
        SidukoCellQueries.getPossibleValues(oPuzzleData, oCell).length === 1
    );
    const fnGetPossibleValues = SidukoCellQueries.getPossibleValues;
    const fnCanSetValue = SidukoCellQueries.canSetValue;
    if (oSingleValueCells.length === 0) {
      return false;
    }

    let bEditedValue = oSingleValueCells.length > 0;
    while (bEditedValue) {
      bEditedValue = false;
      oSingleValueCells.forEach((oCell) => {
        const iValue = fnGetPossibleValues(oPuzzleData, oCell)[0];
        if (iValue && fnCanSetValue(oPuzzleData, oCell, iValue)) {
          bEditedValue = true;
          oCell.value = iValue;
          oCell.setSolved();
          oCell.passIndex = this.#passIndex;
          if (this.#fast) {
            return true;
          }
          /*
                    const oElem = oCell.element;
                    oElem.innerText = iValue;
                    oElem.title = '';
                    oElem.classList.add('solved');
                    */
        }
      });
    }

    return bEditedValue;
  }
}
