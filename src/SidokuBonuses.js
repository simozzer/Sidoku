class SidokuBonuses {

    static revealRandomValue(oPuzzle, puzzleSolution) {
        const emptyCells = oPuzzle.getData().cells.filter(c => c.value === 0);
        if (emptyCells.length === 0) {             
            return;
        }
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const sourceCell = puzzleSolution.getData().cell(randomCell.column,randomCell.row);            
        randomCell.value = sourceCell.value;
        randomCell.element.innerHTML = sourceCell.value;
        randomCell.setSolved();
        randomCell.element.classList.add('aided');
        randomCell.entered = true;

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