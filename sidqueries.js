class SidukoCellQueries {

    static getPossibleValues(oSudukoData, oCell) {
        const aPossibleValues = [];
        for (let iPossibleValue = 1; iPossibleValue < 10; iPossibleValue++) {
            if ((!oSudukoData.cellsInRow(oCell.row).find(oRowCell => oRowCell.value === iPossibleValue))
                && (!oSudukoData.cellsInColumn(oCell.column).find(oColumnCell => oColumnCell.value === iPossibleValue))
                && (!oSudukoData.cellsInInnerTable(oCell.innerTableIndex).find(oInnerTableCell => oInnerTableCell.value === iPossibleValue))) {
                aPossibleValues.push(iPossibleValue);
            }


        }
        return aPossibleValues;
    }

    static canSetValue(oSudukoData,oCell, value) {
        if ((!oSudukoData.cellsInRow(oCell.row).find(oRowCell => oRowCell.value === value))
            && (!oSudukoData.cellsInColumn(oCell.column).find(oColumnCell => oColumnCell.value === value))
            && (!oSudukoData.cellsInInnerTable(oCell.innerTableIndex).find(oInnerTableCell => oInnerTableCell.value === value))) {
            return true
        }
        return false;
    }

    static canSetACellValue(oSudukoData,oCell) {
        const aPossibleCellValues = this.getPossibleValues(oSudukoData,oCell);
        let iChoiceIndex = oCell.choiceIndex;
        const iLen = aPossibleCellValues.length;
        if (iChoiceIndex < iLen) {
            let choice = aPossibleCellValues[iChoiceIndex];
            while ((iChoiceIndex < iLen - 1) && (!SidukoCellQueries.canSetValue(oSudukoData, oCell, choice))) {
                iChoiceIndex++;
            }
            if (this.canSetValue(oSudukoData,oCell, choice)) {
                oCell.choiceIndex = iChoiceIndex;
                return true;
            }
        }
        return false;
    }
}