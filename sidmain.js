
doLoaded = () => {

    const oPuzzle = new SidukoPuzzle();
    oPuzzle.setPuzzleStartData(linearEvilPuzzleData);
    const generator = new SidukoHtmlGenerator(oPuzzle);
    const tableDOM = generator.getPuzzleDOM();
    document.getElementById("everywhere").appendChild(tableDOM);
    //const eventHandler = new SidukoEventsHandler(oPuzzle, tableDOM);
    const solver = new SidukoSolver(oPuzzle);
    solver.execute();

};

//const linearEvilPuzzleData = [9, 0, 0, 0, 4, 3, 1, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 9, 0, 8, 0, 0, 0, 1, 9, 3, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 6, 0, 0, 0, 0, 7, 0, 6, 4, 0, 0, 3, 4, 0, 0, 2, 0, 0, 0, 0, 0];
const linearEvilPuzzleData = [0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 7, 0, 0, 0, 0, 0, 8, 0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 3, 8, 0, 0, 9, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 6, 0, 8, 0, 2, 0, 0, 0, 4, 0, 6, 0, 0, 0, 0, 7, 2, 0, 0, 0, 0, 9, 0, 6, 0];



class SidukoPuzzle {
    #rowCells = [];
    #columnCells = [];
    #innerTableCells = [];
    constructor() {
        this.data = new SidukoPuzzleData();

        // Optimisation. Build a collection of the cells in each column, row and inner table
        for (let i = 0; i < 9; i++) {
            this.#rowCells[i] = this.data.cells.filter(oCell => oCell.row === i);
            this.#columnCells[i] = this.data.cells.filter(oCell => oCell.column === i);
            this.#innerTableCells[i] = this.data.cells.filter(oCell => oCell.innerTableIndex === i);
        }
    }


    setPuzzleStartData(aStartData) {
        aStartData.forEach((iValue, iIndex) => {
            const oCell = this.data.cells[iIndex];
            if (iValue > 0) {
                oCell.value = iValue;
                oCell.setFixed();
            }
        })
    }
}