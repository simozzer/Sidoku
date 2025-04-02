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
    const ul = document.getElementById("messageList");
    ul.appendChild(li);
    li.scrollIntoView({behavior: "smooth", block: "end"});
    if (className !== "") {
        li.classList.add(className);
    }

   
    if (oMessageTimeout) {
        window.clearInterval(oMessageTimeout);
        oMessageTimeout = null;
    }
    
    if (ul.childNodes.length > 0) {            
        oMessageTimeout = window.setInterval(() => {   
            const ul = document.getElementById("messageList");         
            if (ul.childNodes.length > 0) {
                ul.removeChild(ul.childNodes[0]);
            }

        },8500 / ul.childNodes.length);
    }
}

function addLogSeperator() {
    const hr = document.createElement("hr");
    document.getElementById("messageList").appendChild(hr);
}


oPlayerData = null;
oGame = null;
puzzleData = null;
oSolution = null;
oButtonPressTimeout = null;
function setupGame(puzzleData) {
    
    oGame = new SidukoPuzzle();
    setGameStartData(oGame, puzzleData);
    

    // Todo:: update hints
    const generator = new SidukoHtmlGenerator(oGame);
    const tableDOM = generator.getPuzzleDOM();
    const puzzleElementHolder = document.getElementById("everywhere");    
    puzzleElementHolder.textContent = "";
    puzzleElementHolder.appendChild(tableDOM);

    

    const gameplayChangedHandler = function(state) {
        // TODO: grant a smaller bonus if the answer was provided to the player
        if (state) {
            if (state.column) {
                logMessage(`✨***Column Filled***✨`, "column_filled");
            }
            if (state.row) {
                logMessage(`🎉***Row Filled***🎉`, "row_filled");
            }
            if (state.innerTable) {
                logMessage(`👍***Inner Table Filled***👍`, "inner_table_filled");
            }
            if (state.board) {
                logMessage(`🔥🔥🔥***Board Filled***🔥🔥🔥`, "board_filled");
            }
        }
    };

    const fnHandleGamplayChaned = gameplayChangedHandler.bind(oGame);
    

    oSolution = new SidukoPuzzle();
    setGameStartData(oSolution, puzzleData);
    oGame.solution = oSolution;
    const solver = new SidukoSolver(oSolution,(data) => {
        const btn = document.getElementById("bonusButton");

        btn.style.display = "inline";
        btn.onclick = () => { 
            btn.disabled = true;
            try {
        
                let iRand = Math.floor(Math.random() * 5);
                if (iRand >= 3) {
                    console.log(`Bonus button clicked: ${iRand}`);
                        
                    // Choose a random bonus
                    iRand = Math.floor(Math.random() * 6);
                    switch (iRand) {
                        case 0:
                            logMessage("😍 Revealing a random cell");
                            SidokuBonuses.revealRandomValue(oGame, oSolution,fnHandleGamplayChaned);
                            break;
                        case 1:
                            logMessage("😀 Revealing cells from a random row");
                            SidokuBonuses.revealCellsWithRandomRow(oGame, oSolution, fnHandleGamplayChaned);
                            break;
                        case 2:
                            logMessage("🙌 Revealing cells from a random column");
                            SidokuBonuses.revealCellsWithRandomColumn(oGame, oSolution, fnHandleGamplayChaned);
                            break;
                        case 3:
                            logMessage("💃 Revealing cells from a random inner table");
                            SidokuBonuses.revealCellsWithRandomInnerTable(oGame, oSolution, fnHandleGamplayChaned);
                            break;
                        case 4:
                            logMessage("🤗 Revealing cells which only have 1 possible value");
                            SidokuBonuses.autoFillCellsWithOnePossibleValue(oGame, oSolution, fnHandleGamplayChaned);
                            break;
                        case 5:
                            logMessage("🤟 Revealing cells with a common random value");
                            SidokuBonuses.revealCellsWithRandomValue(oGame, oSolution, fnHandleGamplayChaned);
                            break;
                        default:
                            logMessage("Invalid bonus button click");
                            break;
                    }
                } else {
                    logMessage("!!No bonus this time!!", "redError");
                }
            } finally {
                addLogSeperator();
                if (oButtonPressTimeout) {
                    clearTimeout(oButtonPressTimeout);
                    oButtonPressTimeout = null;
                }
                oButtonPressTimeout = setTimeout(() => {
                    btn.disabled = false;
                    clearTimeout(oButtonPressTimeout);
                    oButtonPressTimeout = null;
                }, 500,btn);
                
            }
        };
    });
    oPlayerData = new SidukoPlayerData();
    oPlayerData.funds = 8;
    oPlayerData.guessesRemaining = -1;
    oPlayerData.guessesUntilNextBonus = 8;
    solver.execute().then(() => {

        document.getElementById("bonusButton").disabled = false;
        if (oPlayerData.guessesRemaining < 0) {
            const emptyCellCount = oGame.getData().cells.filter((cell) => cell.value === 0).length
            oPlayerData.guessesRemaining = Math.round(emptyCellCount * 1.7);

            oPlayerData.guessesUntilNextBonus = Math.round(oPlayerData.guessesRemaining / 12);
        }
        

    }, this);
    
    // check that the puzzle is valid
   // const solver = new SidukoSolver(oGame, doPuzzleSolved);
   //     solver.execute();    

    const eventHandler = new SidukoEventsHandler(oGame, tableDOM, oPlayerData);   
}
