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
/**
 * Initializes the game with starting data.
 * 
 * @param {Object} oGame - The game object to be initialized.
 * @param {Array<string>} aStartData - An array of strings representing the initial values for each cell.
 *                                     Each string should be a single digit or '0' for empty cells.
 * @returns {void}
 */

messageBufferTimeout= null;
oMessageTimeout = null;
oMessageElement = null;
aMessages = [];
function logMessage(message, className = "") {
    if (!message) {
        return;
    }
    console.log(message);
    aMessages.push({message: message});

    const li = document.createElement("li");
    li.textContent = message;
    const ul = document.getElementById("messageList");
    ul.appendChild(li);
    li.scrollIntoView({behavior: "smooth", block: "end"});
    if (className !== "") {
        li.classList.add(className);
    }

    showMessages();

   
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
    if (message) {
        if (!oMessageElement) {
            oMessageElement = document.createElement("div");
            oMessageElement.id = "messageBox";
            oMessageElement.classList.add("messageBox");
            document.getElementById("everywhere").appendChild(oMessageElement);

            oMessageElement.addEventListener("animationend", function() {
                if (oMessageElement.classList.contains("initial")) {
                    oMessageElement.classList.remove("initial");
                    oMessageElement.style.display = "none";
                }                                
            });
        }

        oMessageElement.innerText = message;  
        oMessageElement.style.display = "block";    
        oMessageElement.classList.add("initial");
    }
}


function showMessages() {
    if (!messageBufferTimeout) {

        
        messageBufferTimeout = window.setInterval(() => {  
            if (aMessages.length > 0) {
                const oMessage = aMessages[0];
                if (typeof oMessage.startTime === "undefined") {
                    oMessage.startTime = Date.now();
                    this.__displayMessage(oMessage.message);
                } else {
                    if (Date.now() > (oMessage.startTime + 2200)) {                        
                        aMessages = aMessages.slice(1);
                    };
                }
            }
        },50, this);
    }
        
}




function addLogSeperator() {
    const hr = document.createElement("hr");
    document.getElementById("messageList").appendChild(hr);
}


oMaster = null;
function setupGame(puzzleData) {
    oMaster = new SidukoMain(puzzleData);
    //oMaster.setPuzzleStartData(puzzleData); 
    oMaster.start();

        

    //const eventHandler = new SidukoEventsHandler(oGame, tableDOM, oPlayerData, oGame.solution);   
}
