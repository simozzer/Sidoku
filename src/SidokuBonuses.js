class SidokuBonuses {

    static revealRandomValue(oPuzzle, puzzleSolution, fnGameEventCallback) {
        if (typeof fnGameEventCallback !== 'function') {
            throw new Error('Invalid callback function');
        }
        const emptyCells = oPuzzle.getData().cells.filter(c => c.value === 0);
        if (emptyCells.length === 0) {             
            return;
        }
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const sourceCell = puzzleSolution.getData().cell(randomCell.column,randomCell.row);     
        logMessage(`Random Cell: ${randomCell.column}, ${randomCell.row}`, "randomChoiceStatus");
        if ((randomCell.value <= 0)  && SidukoCellQueries.canSetValue(oPuzzle.getData(), randomCell, sourceCell.value)) {  
            const oStartFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), randomCell);                  

            randomCell.value = sourceCell.value;
            randomCell.element.innerHTML = sourceCell.value;
            randomCell.setSolved();
            randomCell.element.classList.add('aided');
            randomCell.element.classList.add('granted');
            randomCell.entered = true;
            fnGameEventCallback({
                cellUsed: true
            });
            SidukoHtmlGenerator.updateCellHints(oPuzzle);    

            const oEndFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), randomCell);                
            const oFullnessStateChanges = {};
            if (oStartFullnessState.column !== oEndFullnessState.column) {
                oFullnessStateChanges['column'] = true;
            } 
            if (oStartFullnessState.row !== oEndFullnessState.row) {
                oFullnessStateChanges['row'] = true;
            }
            if (oStartFullnessState.innerTableIndex !== oEndFullnessState.innerTableIndex) {
                oFullnessStateChanges['innerTable'] = true;
            }
            if (oStartFullnessState.board !== oEndFullnessState.board) {
                oFullnessStateChanges['board'] = true;
            }
            fnGameEventCallback(oFullnessStateChanges);
        } else if (randomCell.value > 0) {
            console.warn(`Could not reveal random value due to existing value. (${randomCell.column},${randomCell.row}) cannot be set to ${randomCell.value}`);
        }
    }


    // Picks a random columns and reveals the solution to all the items.
    static revealCellsWithRandomRow(oPuzzle, puzzleSolution, fnGameEventCallback) {
        if (typeof fnGameEventCallback !== 'function') {
            throw new Error('Invalid callback function');
        }
        const emptyCells = oPuzzle.getData().cells.filter(c => c.value === 0);
        if (emptyCells.length === 0) {             
            return;
        }
        const randomRow = Math.floor(Math.random() * 9);
        logMessage(`Random Row: ${randomRow}`, "randomChoiceStatus");
        for (let iIndex = 0; iIndex < 9; iIndex++) {
            const sourceCell = puzzleSolution.getData().cell(iIndex,randomRow);
            const targetCell = oPuzzle.getData().cell(iIndex, randomRow);
            if ((targetCell.value <= 0)  && SidukoCellQueries.canSetValue(oPuzzle.getData(), targetCell, sourceCell.value)) {
                const oStartFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), targetCell);  
                targetCell.value = sourceCell.value;                
                targetCell.element.innerHTML = sourceCell.value;
                targetCell.setSolved();
                targetCell.element.classList.add('aided');
                targetCell.element.classList.add('granted');
                targetCell.entered = true;
                fnGameEventCallback({
                    cellUsed: true
                });
                SidukoHtmlGenerator.updateCellHints(oPuzzle);    

                const oEndFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), targetCell);    
                const oFullnessStateChanges = {};
                if (oStartFullnessState.column !== oEndFullnessState.column) {
                    oFullnessStateChanges['column'] = true;
                } 
                if (oStartFullnessState.row !== oEndFullnessState.row) {
                    oFullnessStateChanges['row'] = true;
                }
                if (oStartFullnessState.innerTableIndex !== oEndFullnessState.innerTableIndex) {
                    oFullnessStateChanges['innerTable'] = true;
                }
                if (oStartFullnessState.board !== oEndFullnessState.board) {
                    oFullnessStateChanges['board'] = true;
                }
                fnGameEventCallback(oFullnessStateChanges);
            } else if (targetCell.value > 0) {
                console.warn(`Could not reveal random row value due to existing value. (${targetCell.column},${targetCell.row}) cannot be set to ${sourceCell.value}`);
            }
        }                    
            
    }

    // Picks a random column and reveals the solution to all the items.
    static revealCellsWithRandomColumn(oPuzzle, puzzleSolution, fnGameEventCallback) {
        if (typeof fnGameEventCallback !== 'function') {
            throw new Error('Invalid callback function');
        }
        const emptyCells = oPuzzle.getData().cells.filter(c => c.value === 0);
        if (emptyCells.length === 0) {             
            return;
        }
        const randomColumnn = Math.floor(Math.random() * 9);
        logMessage(`Random Column: ${randomColumnn}`, "randomChoiceStatus");
        for (let iIndex = 0; iIndex < 9; iIndex++) {
            const sourceCell = puzzleSolution.getData().cell(randomColumnn,iIndex);
            const targetCell = oPuzzle.getData().cell(randomColumnn, iIndex);
            if ((targetCell.value <= 0)  && SidukoCellQueries.canSetValue(oPuzzle.getData(), targetCell, sourceCell.value)) {
                const oStartFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), targetCell);
                fnGameEventCallback({
                    cellUsed: true
                });
                targetCell.value = sourceCell.value;                
                targetCell.element.innerHTML = sourceCell.value;
                targetCell.setSolved();
                targetCell.element.classList.add('aided');
                targetCell.element.classList.add('granted');
                targetCell.entered = true;
                SidukoHtmlGenerator.updateCellHints(oPuzzle);
                
                const oEndFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), targetCell);    
                const oFullnessStateChanges = {};
                if (oStartFullnessState.column !== oEndFullnessState.column) {
                    oFullnessStateChanges['column'] = true;
                } 
                if (oStartFullnessState.row !== oEndFullnessState.row) {
                    oFullnessStateChanges['row'] = true;
                }
                if (oStartFullnessState.innerTableIndex !== oEndFullnessState.innerTableIndex) {
                    oFullnessStateChanges['innerTable'] = true;
                }
                if (oStartFullnessState.board !== oEndFullnessState.board) {
                    oFullnessStateChanges['board'] = true;
                }
                fnGameEventCallback(oFullnessStateChanges);
            } else if (targetCell.value > 0) {
                console.warn(`Could not reveal random column value due to existing value. (${targetCell.column},${targetCell.row}) cannot be set to ${sourceCell.value}`);
            }
        }                            
    }

    
    // Picks a random column and reveals the solution to all the items.
    static revealCellsWithRandomInnerTable(oPuzzle, puzzleSolution, fnGameEventCallback) {
        if (typeof fnGameEventCallback !== 'function') {
            throw new Error('Invalid callback function');
        }      
        const randomInnerTableId = Math.floor(Math.random() * 9);
        logMessage(`Random Square: ${randomInnerTableId}`, "randomChoiceStatus");
        const emptyCells = oPuzzle.getData().cells.filter(c => (c.value === 0) && (c.innerTableIndex == randomInnerTableId));
        if (emptyCells.length === 0) {             
            return;
        }
        emptyCells.forEach(targetCell => {
            const sourceCell = puzzleSolution.getData().cell(targetCell.column, targetCell.row);
            if ((targetCell.value <= 0)  && SidukoCellQueries.canSetValue(oPuzzle.getData(), targetCell, sourceCell.value)) {  
                const oStartFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), targetCell);              
                targetCell.value = sourceCell.value;                
                targetCell.element.innerHTML = sourceCell.value;
                targetCell.setSolved();
                targetCell.element.classList.add('aided');
                targetCell.element.classList.add('granted');
                targetCell.entered = true;
                fnGameEventCallback({
                    cellUsed: true
                });
                SidukoHtmlGenerator.updateCellHints(oPuzzle);

                const oEndFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), targetCell);    
                const oFullnessStateChanges = {};
                if (oStartFullnessState.column !== oEndFullnessState.column) {
                    oFullnessStateChanges['column'] = true;
                } 
                if (oStartFullnessState.row !== oEndFullnessState.row) {
                    oFullnessStateChanges['row'] = true;
                }
                if (oStartFullnessState.innerTableIndex !== oEndFullnessState.innerTableIndex) {
                    oFullnessStateChanges['innerTable'] = true;
                }
                if (oStartFullnessState.board !== oEndFullnessState.board) {
                    oFullnessStateChanges['board'] = true;
                }                
                fnGameEventCallback(oFullnessStateChanges);             
            } else if (targetCell.value > 0) {
                console.warn(`Could not reveal random inner table value due to existing value. (${targetCell.column},${targetCell.row}) cannot be set to ${sourceCell.value}`);
            }
        });                          
    }

    // Picks a random digit and then looks for all the matching cells from the solution and solves them
    static revealCellsWithRandomValue(oPuzzle, puzzleSolution, fnGameEventCallback) {
        if (typeof fnGameEventCallback !== 'function') {
            throw new Error('Invalid callback function');
        }
        const emptyCells = oPuzzle.getData().cells.filter(c => c.value === 0);
        if (emptyCells.length === 0) {             
            return;
        }
        const randomValue = Math.floor(Math.random() * 8) + 1;
        logMessage(`Cell Value: ${randomValue}`, "randomChoiceStatus");
        const aSourceCells = puzzleSolution.getData().cells.filter(c => c.value === randomValue);

        aSourceCells.forEach(oSourceCell => {
            const targetCell = oPuzzle.getData().cell(oSourceCell.column, oSourceCell.row);
            
            if ((targetCell.value <= 0)  && SidukoCellQueries.canSetValue(oPuzzle.getData(), targetCell, randomValue)){
                const oStartFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), targetCell);
                targetCell.value = randomValue;                
                targetCell.element.innerHTML = randomValue;
                targetCell.setSolved();
                targetCell.element.classList.add('aided');
                targetCell.element.classList.add('granted');
                targetCell.entered = true;
                fnGameEventCallback({
                    cellUsed: true
                });
                
                const oEndFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), targetCell);    
                const oFullnessStateChanges = {};
                if (oStartFullnessState.column !== oEndFullnessState.column) {
                    oFullnessStateChanges['column'] = true;
                } 
                if (oStartFullnessState.row !== oEndFullnessState.row) {
                    oFullnessStateChanges['row'] = true;
                }
                if (oStartFullnessState.innerTableIndex !== oEndFullnessState.innerTableIndex) {
                    oFullnessStateChanges['innerTable'] = true;
                }
                if (oStartFullnessState.board !== oEndFullnessState.board) {
                    oFullnessStateChanges['board'] = true;
                }
                fnGameEventCallback(oFullnessStateChanges);                   
            } else if (targetCell.value > 0) {
                console.warn(`Could not reveal item with random value due to existing value. (${targetCell.column},${targetCell.row}) cannot be set to ${randomValue}`);
            }
        });  
        SidukoHtmlGenerator.updateCellHints(oPuzzle);        
        
    }

    //Examines all the cells and looks for the cells for which only 1 value is possible, and solves them
    static autoFillCellsWithOnePossibleValue(oPuzzle, puzzleSolution, fnGameEventCallback) {
        if (typeof fnGameEventCallback !== 'function') {
            throw new Error('Invalid callback function');
        }
        const emptyCells = oPuzzle.getData().cells.filter(c => c.value === 0);
        if (emptyCells.length === 0) {             
            return;
        }
        emptyCells.forEach(oTargetCell => {
            const aPossibleValues = SidukoCellQueries.getPossibleValues(oPuzzle.getData(), oTargetCell);
            if (aPossibleValues.length === 1) {
                const oSourceCell = puzzleSolution.getData().cell(oTargetCell.column, oTargetCell.row);
                if ((!oTargetCell.value <= 0) && SidukoCellQueries.canSetValue(oPuzzle.getData(), oTargetCell, aPossibleValues[0])) {  
                    const oStartFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), targetCell);        
                    oTargetCell.value = oSourceCell.value
                    oTargetCell.element.innerHTML = oSourceCell.value;
                    oTargetCell.setSolved();
                    oTargetCell.element.classList.add('aided');
                    oTargetCell.element.classList.add('granted');
                    oTargetCell.entered = true;
                    fnGameEventCallback({
                        cellUsed: true
                    });

                    const oEndFullnessState = SidukoCellQueries.getFullnessState(oPuzzle.getData(), oTargetCell);    
                    const oFullnessStateChanges = {};
                    if (oStartFullnessState.column !== oEndFullnessState.column) {
                        oFullnessStateChanges['column'] = true;
                    } 
                    if (oStartFullnessState.row !== oEndFullnessState.row) {
                        oFullnessStateChanges['row'] = true;
                    }
                    if (oStartFullnessState.innerTableIndex !== oEndFullnessState.innerTableIndex) {
                        oFullnessStateChanges['innerTable'] = true;
                    }
                    if (oStartFullnessState.board !== oEndFullnessState.board) {
                        oFullnessStateChanges['board'] = true;
                    }
                    fnGameEventCallback(oFullnessStateChanges);  
                } else if (oTargetCell.value > 0) {
                    console.warn(`Could not reveal item which has only 1 target due to existing data. (${targetCell.column},${targetCell.row}) cannot be set to ${oSourceCell.value}`);
                }               
            }
        });          
        SidukoHtmlGenerator.updateCellHints(oPuzzle);
    }
}