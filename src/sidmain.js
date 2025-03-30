
doSolverLoaded = () => {
    document.getElementById("menu").addEventListener('change',doMenuChanged.bind(this));
}

function setInfoText(text) {
    document.getElementById("infotext").textContent = text;
}

oPuzzleData = null;
oPuzzle = null;

function setupPuzzle(puzzleData) {
    setInfoText("Please wait: the puzzle is being solved...");
    oPuzzle = new SidukoPuzzle();

    
    oPuzzle.setPuzzleStartData(puzzleData);
    
    const generator = new SidukoHtmlGenerator(oPuzzle);
    const tableDOM = generator.getPuzzleDOM();
    const puzzleElementHolder = document.getElementById("everywhere");
    puzzleElementHolder.textContent = "";
    puzzleElementHolder.appendChild(tableDOM);

    if (puzzleData) {
        // use set timeout here, to allow time for the DOM to be updated with the starting position
        setTimeout(()=> {
            const solver = new SidukoSolver(oPuzzle, doPuzzleSolved);
            solver.execute();
        },0,oPuzzle);
    } else {
        // change the ownership, and don't leak
        const eventHandler = new SidukoEventsHandler(oPuzzle, tableDOM);
    }

    document.getElementById("solvebutton").addEventListener('click',doSolvePressed.bind(oPuzzle));
}


doSolvePressed = (oEv) => {
    // The next step is to use web workers to try and solve this a bit faster
    /*
    const worker = new Worker("/src/sidoku_worker.js");
    worker.onmessage = (oEv) => {
      console.log("worker.onmessage: ", oEv.data);     
      worker.postMessage("close");
    };
    worker.postMessage({ puzzle: oPuzzle.getData() });
    */


    const startValues = oPuzzle.getData().cells.map(o => o.value);
    setupPuzzle(startValues);
    oEv.stopPropagation();
}


doMenuChanged = (oEv) => {
    btn = document.getElementById("solvebutton");
    switch (oEv.target.value) {
        case "Monster":
            btn.hidden = true;
            btn.disabled = true;
    
            oEv.target.disabled = true;
            setupPuzzle(escargotAiData);
            break;            

        case "Difficult":
            btn.hidden = true;
            btn.disabled = true;
    
            oEv.target.disabled = true;
            setupPuzzle(shinningStarData);
            break;    
        case "Hard":
            btn.hidden = true;
            btn.disabled = true;
    
            oEv.target.disabled = true;
            setupPuzzle(hardPuzzleData);
            break;                     
        case "Easier":
            btn.hidden = true;
            btn.disabled = true;
    
            oEv.target.disabled = true;
            setupPuzzle(evilPuzzleData);
            break;
        case "Custom":            
            setupPuzzle();
            setInfoText("Use arrow keys and numeric keys to setup a puzzle");
            btn.hidden = false;
            btn.disabled = false;
            
            break;
        default:
            break
    }
}

function doPuzzleSolved(info) {
    setInfoText(info);    
    window.setTimeout(() => {
        document.getElementById("menu").disabled = false;
        let a = document.getElementsByClassName("suggested");
        [].forEach.call(a,(el) => {
            el.classList.remove("suggested");
            //el.classList.add("solved");
        });
        document.getElementById("solvebutton").hidden = false;
    },400);
    
}

const shinningStarData = [0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 7, 0, 0, 0, 0, 0, 8, 0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 3, 8, 0, 0, 9, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 6, 0, 8, 0, 2, 0, 0, 0, 4, 0, 6, 0, 0, 0, 0, 7, 2, 0, 0, 0, 0, 9, 0, 6, 0];
const evilPuzzleData = [9, 0, 0, 0, 4, 3, 1, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 9, 0, 8, 0, 0, 0, 1, 9, 3, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 6, 0, 0, 0, 0, 7, 0, 6, 4, 0, 0, 3, 4, 0, 0, 2, 0, 0, 0, 0, 0];
const hardPuzzleData = [1,0,0,6,0,5,0,0,9,0,0,0,0,0,0,0,0,0,0,5,3,0,1,0,8,4,0,0,0,0,9,5,1,0,0,0,0,0,0,0,6,0,0,0,0,0,0,2,0,8,0,6,0,0,6,0,7,0,0,0,9,0,5,3,0,0,8,0,7,0,0,2,0,0,9,0,0,0,1,0,0];
const escargotAiData = [1,0,0,0,0,7,0,9,0,0,3,0,0,2,0,0,0,8,0,0,9,6,0,0,5,0,0,0,0,5,3,0,0,9,0,0,0,1,0,0,8,0,0,0,2,6,0,0,0,0,4,0,0,0,3,0,0,0,0,0,0,1,0,0,4,0,0,0,0,0,0,7,0,0,7,0,0,0,3,0,0];
                       

class SidukoPuzzle {
    #rowCells = [];
    #columnCells = [];
    #innerTableCells = [];
    #data = new SidukoPuzzleData();
    constructor() {
        this.#data = new SidukoPuzzleData();

        // Optimisation. Build a collection of the cells in each column, row and inner table
        for (let i = 0; i < 9; i++) {
            this.#rowCells[i] = this.#data.cells.filter(oCell => oCell.row === i);
            this.#columnCells[i] = this.#data.cells.filter(oCell => oCell.column === i);
            this.#innerTableCells[i] = this.#data.cells.filter(oCell => oCell.innerTableIndex === i);
        }
    }


    setPuzzleStartData(aStartData) {
        aStartData.forEach((iValue, iIndex) => {
            const oCell = this.getData().cells[iIndex];
            if (iValue > 0) {
                oCell.value = iValue;
                oCell.setFixedValue();
            }
        });
    }

    getData() {
        return this.#data
    }
}