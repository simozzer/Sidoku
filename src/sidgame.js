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
    console.log(message);
    showMessage(message);
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


function __displayMessage(message){
    let oMessageElement = document.getElementById("messageBox");
    if (!oMessageElement) {
        oMessageElement = document.createElement("div");
        oMessageElement.id = "messageBox";
        oMessageElement.classList.add("messageBox");
        oMessageElement.classList.add("initial");
        document.getElementById("everywhere").appendChild(oMessageElement);
    }

    oMessageElement.textContent = message;  
    oMessageElement.style.display = "block";    

    oMessageElement.classList.remove("initial");
    oMessageElement.classList.add("initial");
    oMessageElement.addEventListener("animationend", function() {
        oMessageElement.style.display = "none";
        oMessageElement.classList.remove("initial");
    });
}


aMessageBuffer = [];
messageBufferTimeout = null;
function showMessage(message) {
    if (!message) {
        return;
    }

    aMessageBuffer.push(message);

    if (!messageBufferTimeout) {
        __displayMessage(aMessageBuffer.shift());
        
        messageBufferTimeout = window.setInterval(() => {  
            if (aMessageBuffer.length >0) {
                __displayMessage(aMessageBuffer.shift());
                
            } else {
                window.clearInterval(messageBufferTimeout);
                messageBufferTimeout = null;
            }
        }, 1800, this);
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
    
    const generator = new SidukoHtmlGenerator(oGame);
    const tableDOM = generator.getPuzzleDOM();
    const puzzleElementHolder = document.getElementById("everywhere");    
    puzzleElementHolder.textContent = "";
    puzzleElementHolder.appendChild(tableDOM);

    

    oSolution = new SidukoPuzzle();
    setGameStartData(oSolution, puzzleData);
    oGame. solution = oSolution;
    const solver = new SidukoSolver(oSolution,(data) => {});

    oPlayerData = new SidukoPlayerData();
    oPlayerData.funds = 3;
    oPlayerData.guessesRemaining = -1;
    oPlayerData.guessesUntilNextBonus = 3;
    solver.execute().then(() => {

        //document.getElementById("bonusButton").disabled = false;
        if (oPlayerData.guessesRemaining < 0) {
            const emptyCellCount = oGame.getData().cells.filter((cell) => cell.value === 0).length
            oPlayerData.guessesRemaining = Math.round(emptyCellCount * 1.7);

            oPlayerData.guessesUntilNextBonus = Math.round(oPlayerData.guessesRemaining / 12);

            oPlayerData.addBoost("Row","Reveals up to a specified number of cells in a random row");
            oPlayerData.addBoost("Column","Reveals up to a specified number of cells in a random column");
            oPlayerData.addBoost("InnerTable","Reveals up to a specified number of cells in a random inner table");

            // Show tooltips on each turn whilst we still have turns remaining
            let oBoost = oPlayerData.addBoost("Hints","Shows tooltips for the possible values in a cell");
            oBoost.turnsRemaining = 8;
            oBoost.decrementsEachTurn = true;

            oBoost = oPlayerData.addBoost("Seeker","After a number has been entered solves values that can only exist in 1 cell");
            oBoost.turnsRemaining = 5;
            oBoost.decrementsEachTurn = false;


            oPlayerData.renderBoosts();

            document.getElementById("playerBoostsTableBody").addEventListener('click',(oEv) => {
                let rowElement;
                if (oEv.target.tagName === "TD") {
                    rowElement = oEv.target.parentNode;
                } else if (oEv.target.tagName === "TR") {
                    rowElement = oEv.target;
                } else {
                    console.warn("Invalid click event target for Boost", oEv.target);
                }
                const sBoostName = rowElement.childNodes[0].innerText;
                console.log("Boost clicked:", sBoostName);
            });
        }
        

    }, this);
        

    const eventHandler = new SidukoEventsHandler(oGame, tableDOM, oPlayerData, oGame.solution);   
}
