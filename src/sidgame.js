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

setGameStartData = (oGame, aStartData) =>{

    for (let i = 0; i < aStartData.length; i++) {
        let iValue = parseInt(aStartData[i],10);
        const oCell = oGame.getData().cells[i];
        if (iValue > 0) {
            oCell.value = iValue;
            oCell.setFixedValue();
        }
    }
}

oGame = null;
puzzleData = null;
oSolution = null;
function setupGame(puzzleData) {

    //setInfoText("Please wait: the puzzle is being solved...");
    oGame = new SidukoPuzzle();
    //if (typeof(puzzleData) === "object" && puzzleData.length >0) {
        //oGame.setPuzzleStartData(Array.from(puzzleData).slice(0, puzzleData.length));
        setGameStartData(oGame, puzzleData);
    //}

    // Todo:: update hints
    const generator = new SidukoHtmlGenerator(oGame);
    const tableDOM = generator.getPuzzleDOM();
    const puzzleElementHolder = document.getElementById("everywhere");    
    puzzleElementHolder.textContent = "";
    puzzleElementHolder.appendChild(tableDOM);

    oSolution = new SidukoPuzzle();
    setGameStartData(oSolution, puzzleData);
    const solver = new SidukoSolver(oSolution,(data) => {
        debugger
    })
    solver.execute();
    
    // check that the puzzle is valid
   // const solver = new SidukoSolver(oGame, doPuzzleSolved);
   //     solver.execute();    
    
    const eventHandler = new SidukoEventsHandler(oGame, tableDOM);
    
}
