doGameLoaded = () => {

    document.getElementById("menu").addEventListener('change',doMenuChanged.bind(this));
}

loadPuzzle = (filename) => {
    fetch(filename)
        .then((res) => res.text())
        .then((text) => {
        // do something with "text"
        const lines = text.split('\n');
        const lineNum = Math.floor(Math.random() * lines.length);
        const puzzleData = lines[lineNum];
        setupGame(puzzleData);
        })
        .catch((e) => console.error(e));
}
doMenuChanged = (oEv) => {

    switch (oEv.target.value) {
        case "Easy":
           // oEv.target.disabled = true;
            //setupPuzzle(escargotAiData);
            loadPuzzle("./resources/easyPuzzleData.txt");
            break;            

        case "Medium":
            //oEv.target.disabled = true;
            loadPuzzle("./resources/mediumPuzzleData.txt");
            break;    
        case "Hard":
   
           // oEv.target.disabled = true;
            loadPuzzle("./resources/hardPuzzleData.txt");
            break;                     
        case "Diabolical":
    
            //oEv.target.disabled = true;
            loadPuzzle("./resources/diabolicalPuzzleData.txt");
            break;
        default:
            break
    }
}

setGameStartData = (aStartData) =>{

    for (let i = 0; i < aStartData.length; i++) {
        let iValue = parseInt(aStartData[i],10);
        const oCell = this.data.cells[i];
        if (iValue > 0) {
            oCell.value = iValue;
            oCell.setFixedValue();
        }
    }
}

oGame = null;

function setupGame(puzzleData) {

    const aPuzzleDataSlices = [];
    for (let i=0; i < puzzleData.length; i+=3) {
        aPuzzleDataSlices.push(puzzleData.slice(i, i+3));
    }
    let sRejiggedPuzzleData = "";
    for (let r=0; r<9;r++) {
        sRejiggedPuzzleData += aPuzzleDataSlices[r] + aPuzzleDataSlices[r+3] + aPuzzleDataSlices[r+6]; //
        console.log(`${r},${r+3},${r+6}`);
    }
    
    //setInfoText("Please wait: the puzzle is being solved...");
    oGame = new SidukoPuzzle();
    //if (typeof(puzzleData) === "object" && puzzleData.length >0) {
        oGame.setPuzzleStartData(Array.from(puzzleData).slice(0, puzzleData.length));
    //}
    const generator = new SidukoHtmlGenerator(oGame);
    const tableDOM = generator.getPuzzleDOM();
    const puzzleElementHolder = document.getElementById("everywhere");
    puzzleElementHolder.textContent = "";
    puzzleElementHolder.appendChild(tableDOM);

    /*
    // check that the puzzle is valid
    const solver = new SidukoSolver(oGame, doPuzzleSolved);
        solver.execute();    
    */
    const eventHandler = new SidukoEventsHandler(Array.from(puzzleData).slice(0, puzzleData.length), tableDOM);
    
}
