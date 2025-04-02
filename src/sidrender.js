
class SidukoHtmlGenerator {

    #sidokuPuzzle;
    constructor(sidokuPuzzle) {
        this.#sidokuPuzzle = sidokuPuzzle;
    }

    getPuzzleDOM() {
        const oTable = document.createElement("table");
        oTable.className = "sidukoTable mx-auto border-separate [border-spacing:0.25rem] border-3 bg-slate-200 rounded-2x1";
        oTable.id = "sidukoTable";
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
        oInnerTable.className = "cell border-separate [border-spacing:0.75rem] bg-slate-400 rounded-2x1";

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
        const oCellData = this.#sidokuPuzzle.getData().cell(iColumn, iRow);
        const iCellValue = oCellData.value;
        const oInnerCell = document.createElement('td');

        if (iCellValue > 0) {
            oInnerCell.innerText = iCellValue;
            if (oCellData.fixedValue) {
                oInnerCell.classList.add('fixedval');
            }
        } else {
            oInnerCell.title = SidukoCellQueries.getPossibleValues(this.#sidokuPuzzle.getData(),oCellData).toString();
        }
        oInnerCell.tabIndex = 0;

        // needed for keyboard navigation
        oInnerCell.dataset.column = iColumn;
        oInnerCell.dataset.row = iRow;

        oCellData.element = oInnerCell;        
        return oInnerCell;
    }

    static updateCellHints(oPuzzle) {        
        // Update tooltip hints
        for (let row = 0; row< 9; row++) {
            for (let col = 0; col < 9; col++) {
                const oCell = oPuzzle.getData().cell(col, row);
                if (!(oCell.fixedValue || oCell.entered)) {
                    const aPossibleValues = SidukoCellQueries.getPossibleValues(oPuzzle.getData(), oCell);
                    oCell.element.title = aPossibleValues.toString();                                
                } else {
                    oCell.element.title = "";
                }
            }
            
        }
    }
}