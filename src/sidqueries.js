class SidukoCellQueries {

    /**
     * Determines the possible values for a given cell in a Sudoku grid.
     * 
     * @param {Object} oSudukoData - The Sudoku data object containing information about the current state of the grid.
     * @param {Object} oCell - The cell object for which possible values are being determined.
     * @returns {number[]} An array of possible values for the given cell, based on Sudoku rules.
     */
    static getPossibleValues(oSudukoData, oCell) {
        const possibleValues = [];
        const { row, column, innerTableIndex } = oCell;

        // count backwards (for most processors the comparison to zero at the end of the loop will be faster)
        for (let value = 9; value > 0; value--) {
            if ((!oSudukoData.cellsInRow(row).some(cell => cell.value === value)) &&
                (!oSudukoData.cellsInColumn(column).some(cell => cell.value === value)) && 
                (!oSudukoData.cellsInInnerTable(innerTableIndex).some(cell => cell.value === value))) {
                    possibleValues.push(value);
            }
        }
        return possibleValues;
    }


    /**
     * Checks if a specific value can be set in a given cell without violating Sudoku rules.
     * 
     * @param {Object} oSudukoData - The Sudoku data object containing information about the current state of the grid.
     * @param {Object} oCell - The cell object where the value is being checked.
     * @param {number} value - The value to be checked for placement in the cell.
     * @returns {boolean} True if the value can be set in the cell without conflicts, false otherwise.
     */
    static canSetValue(oSudukoData, oCell, value) {
        const { row, column, innerTableIndex } = oCell;
        return !oSudukoData.cellsInRow(row).some(cell => cell.value === value) &&
               !oSudukoData.cellsInColumn(column).some(cell => cell.value === value) &&
               !oSudukoData.cellsInInnerTable(innerTableIndex).some(cell => cell.value === value);
    }


    /**
     * Determines if a cell can be set with a valid value based on the current state of the Sudoku grid.
     *
     * @param {Object} oSudukoData - The Sudoku data object containing information about the current state of the grid.
     * @param {Object} oCell - The cell object for which the value is being checked.
     * @returns {boolean} True if a valid value can be set for the cell, false otherwise.
     */
    static canSetACellValue(oSudukoData, oCell) {
        const possibleCellValues = this.getPossibleValues(oSudukoData, oCell);
        let choiceIndex = oCell.choiceIndex;
        const possibleValueCount  = possibleCellValues.length;
        while (choiceIndex < possibleValueCount) {
            if (this.canSetValue(oSudukoData, oCell, possibleCellValues[choiceIndex])) {
                oCell.choiceIndex = choiceIndex;
                return true;
            }
            choiceIndex++;
        }
        return false;
    }

}
