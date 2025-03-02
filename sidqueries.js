class SidukoCellQueries {

    static getPossibleValues(oSudukoData, oCell) {
        const possibleValues = [];
        const { row, column, innerTableIndex } = oCell;

        for (let value = 1; value < 10; value++) {
            const isValueInRow = oSudukoData.cellsInRow(row).some(cell => cell.value === value);
            const isValueInColumn = oSudukoData.cellsInColumn(column).some(cell => cell.value === value);
            const isValueInInnerTable = oSudukoData.cellsInInnerTable(innerTableIndex).some(cell => cell.value === value);

            if (!isValueInRow && !isValueInColumn && !isValueInInnerTable) {
                possibleValues.push(value);
            }
        }
        return possibleValues;
    }

    static canSetValue(oSudukoData, oCell, value) {
        const { row, column, innerTableIndex } = oCell;
        return !oSudukoData.cellsInRow(row).some(cell => cell.value === value) &&
               !oSudukoData.cellsInColumn(column).some(cell => cell.value === value) &&
               !oSudukoData.cellsInInnerTable(innerTableIndex).some(cell => cell.value === value);
    }

    static canSetACellValue(oSudukoData, oCell) {
        const possibleCellValues = this.getPossibleValues(oSudukoData, oCell);
        let choiceIndex = oCell.choiceIndex;

        while (choiceIndex < possibleCellValues.length) {
            const choice = possibleCellValues[choiceIndex];
            if (this.canSetValue(oSudukoData, oCell, choice)) {
                oCell.choiceIndex = choiceIndex;
                return true;
            }
            choiceIndex++;
        }
        return false;
    }
}
