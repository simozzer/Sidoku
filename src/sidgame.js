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

oMessageTimeout = null;
function logMessage(message, className = "") {
    if (!message) {
        return;
    }
    const li = document.createElement("li");
    li.textContent = message;
    const ul = document.getElementById("rightPanel").childNodes[0];
    ul.appendChild(li);
    if (className) {
        li.className = className;
    }
    ul.classList.add("rightPanelLogMessage");
   

    //if (oMessageTimeout) {
        //clearTimeout(oMessageTimeout);
        //oMessageTimeout = null;        
    //};
    if (!oMessageTimeout) {
        oMessageTimeout = window.setInterval(() => {
            let liIndex = ul.childNodes.length - 1;
            while(liIndex > 15) {
                ul.removeChild(ul.childNodes[0]);
                liIndex--;
            }
            ul.classList.remove("rightPanelLogMessage");
        },150,{li,ul});
    }
}

oGame = null;
puzzleData = null;
oSolution = null;
oButtonPressTimeout = null;
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
        const btn = document.getElementById("bonusButton");

        btn.style.display = "inline";
        btn.onclick = () => { 
            btn.disabled = true;
            try {
        
                let iRand = Math.floor(Math.random() * 5);
                if (iRand >= 3) {
                    console.log(`Bonus button clicked: ${iRand}`);
                    iRand = Math.floor(Math.random() * 6);
                    switch (iRand) {
                        case 0:
                            logMessage("😍 Revealing a random cell");
                            SidokuBonuses.revealRandomValue(oGame, oSolution);
                            break;
                        case 1:
                            logMessage("😀 Revealing cells from a random row");
                            SidokuBonuses.revealCellsWithRandomRow(oGame, oSolution);
                            break;
                        case 2:
                            logMessage("🙌 Revealing cells from a random column");
                            SidokuBonuses.revealCellsWithRandomColumn(oGame, oSolution);
                            break;
                        case 3:
                            logMessage("💃 Revealing cells from a random inner table");
                            SidokuBonuses.revealCellsWithRandomInnerTable(oGame, oSolution);
                            break;
                        case 4:
                            logMessage("🤗 Revealing cells which only have 1 possible value");
                            SidokuBonuses.autoFillCellsWithOnePossibleValue(oGame, oSolution);
                            break;
                        case 5:
                            logMessage("🤟 Revealing cells with a oommon random value");
                            SidokuBonuses.revealCellsWithRandomValue(oGame, oSolution);
                            break;
                        default:
                            logMessage("Invalid bonus button click");
                            break;
                    }
                } else {
                    logMessage("!!No bonus this time!!", "redError");
                }
            } finally {
                if (oButtonPressTimeout) {
                    clearTimeout(oButtonPressTimeout);
                    oButtonPressTimeout = null;
                }
                oButtonPressTimeout = setTimeout(() => {
                    btn.disabled = false;
                    clearTimeout(oButtonPressTimeout);
                    oButtonPressTimeout = null;
                }, 250,btn);
                
            }
        };
    });
    
    solver.execute().then(() => {
        document.getElementById("bonusButton").disabled = false;
    }, this);
    
    // check that the puzzle is valid
   // const solver = new SidukoSolver(oGame, doPuzzleSolved);
   //     solver.execute();    
    
    const eventHandler = new SidukoEventsHandler(oGame, tableDOM);   
}
