class SidukoEventsHandler {
  #tableDomElement;
  #puzzle;
  #playerData;
  #focusedCell;
  #cellValueEntry;

  constructor(oPuzzle, oTableDomElement, playerData) {
    this.#tableDomElement = oTableDomElement;
    this.#puzzle = oPuzzle;
    this.#playerData = playerData;
    this.#focusedCell = null;    
    this.#cellValueEntry = document.getElementById("cellValueEntryPopup");
    this.attachEvents();
  }

  get focusedCell() {
    return this.#focusedCell;
  }

  set focusedCell(cell) {
    this.#focusedCell = cell;
  }

  attachEvents() {
    this.#tableDomElement.addEventListener(
      "keydown",
      this._onKeyDown.bind(this)
    );
    this.#tableDomElement.addEventListener(
      "keypress",
      this._onKeyPress.bind(this)
    );
    this.#tableDomElement.addEventListener("click", this._onTap.bind(this));
    this.#cellValueEntry.addEventListener(
      "click",
      this._onCellValueEntryChange.bind(this)
    );
    this.#cellValueEntry.addEventListener(
      "blur",
      this._onCellValueEntryBlur.bind(this)
    );
  }

  detatchEvents() {
    this.#tableDomElement.removeEventListener(
      "keydown",
      this._onKeyDown.bind(this)
    );
    this.#tableDomElement.removeEventListener(
      "keypress",
      this._onKeyPress.bind(this)
    );
    this.#tableDomElement.removeEventListener("click", this._onTap.bind(this));
    this.#cellValueEntry.removeEventListener(
      "click",
      this._onCellValueEntryChange.bind(this)
    );
    this.#cellValueEntry.removeEventListener(
      "blur",
      this._onCellValueEntryBlur.bind(this)
    );
  }

 
  gameplayChangedHandler(state) {
    const oGame = this.#puzzle;    
    let bonus = 0;
    if (state) {
      if (state.column) {        
        if (
          oGame
            .getData()
            .cellsInColumn(state.column - 1)
            .map((o) => o.value)
            .toString() ===
          oGame.solution
            .getData()
            .cellsInColumn(state.column - 1)
            .map((o) => o.value)
            .toString()
        ) {
          oGame
            .getData()
            .cellsInColumn(state.column - 1)
            .forEach((cell) => {
              if (!cell.fixedValue) {
                cell.element.classList.add("player_solved");
                cell.setFixedValue();
              }
            });
          SidukoNotifications.getInstance().queueInfo("Column matches solution. Bonus awarded");
          SidukoSounds.getInstance().playSound("si_correct_row");
          bonus++;
        } else {
          SidukoNotifications.getInstance().queueAlert("Column Does not match solution. No bonus awarded");
          SidukoSounds.getInstance().playSound("si_incorrect_row");
        }
        SidukoHtmlGenerator.highlightColumn(oGame, state.column - 1);
      }
      if (state.row) {        
        if (
          oGame
            .getData()
            .cellsInRow(state.row - 1)
            .map((o) => o.value)
            .toString() ===
          oGame.solution
            .getData()
            .cellsInRow(state.row - 1)
            .map((o) => o.value)
            .toString()
        ) {
          oGame
            .getData()
            .cellsInRow(state.row - 1)
            .forEach((cell) => {
              if (!cell.fixedValue) {
                cell.element.classList.add("player_solved");
                cell.setFixedValue();
              }
            });
          SidukoNotifications.getInstance().queueInfo("Row matches solution. Bonus awarded");
          SidukoSounds.getInstance().playSound("si_correct_row");
          bonus++;
        } else {
          SidukoNotifications.getInstance().queueAlert("Row Does not match solution. No bonus awarded");
          SidukoSounds.getInstance().playSound("si_incorrect_row");
        }
        SidukoHtmlGenerator.highlightRow(oGame, state.row - 1);
      }
      if (state.innerTable) {        
        if (
          oGame
            .getData()
            .cellsInInnerTable(state.innerTable - 1)
            .map((o) => o.value)
            .toString() ===
          oGame.solution
            .getData()
            .cellsInInnerTable(state.innerTable - 1)
            .map((o) => o.value)
            .toString()
        ) {
          oGame
            .getData()
            .cellsInInnerTable(state.innerTable - 1)
            .forEach((cell) => {
              if (!cell.fixedValue) {
                cell.element.classList.add("player_solved");
                cell.setFixedValue();
              }
            });
          SidukoNotifications.getInstance().queueInfo("Inner table matches solution. Bonus awarded");
          SidukoSounds.getInstance().playSound("si_correct_row");
          bonus++;
        } else {
          SidukoNotifications.getInstance().queueAlert("Inner table does not match solution. No bonus awarded");
          SidukoSounds.getInstance().playSound("si_incorrect_row");
        }
        SidukoHtmlGenerator.highlightInnerTable(oGame, state.innerTable - 1);
      }
      if (state.board) {
        logMessage(`🔥🔥🔥***Board Filled***🔥🔥🔥`, "board_filled");      
        SidukoElementEffects.explodeAllCells();
        window.alert("Well done. That's if for now, I haven't implemented anything more. Well done!");
      }
      if (state.playerCellUsed) {
        console.log("Cell used by player");
        this.#playerData.doTurnPlayed(true, oGame);
      } else if (state.cellUsed) {
        console.log("cell used by A bonus");
        this.#playerData.doTurnPlayed(false, oGame);
      } else {
        console.log("Unknown state");
      }
      if (bonus > 0) {
        logMessage(`BONUS AWARDED $${bonus}!`);
        this.#playerData.funds += bonus;
        this.#playerData.renderBoosts();
      }
    }
  }

  _onKeyDown(oEvent) {
    if (this.#playerData.guessesRemaining <= 0) {
      return;
    }
    const column = 0 | oEvent.target.dataset.column;
    const row = 0 | oEvent.target.dataset.row;
    console.log(
      `KeyDowm: col: ${column}, row: ${row}, elem: ${oEvent.target.dataset}`
    );
    switch (oEvent.code) {
      case "ArrowLeft":
        if (column > 0) {
          this.#puzzle
            .getData()
            .cell(column - 1, row)
            .element.focus();
        }
        break;

      case "ArrowRight":
        if (column < 8) {
          this.#puzzle
            .getData()
            .cell(column + 1, row)
            .element.focus();
        }

        break;

      case "ArrowUp":
        if (row > 0) {
          this.#puzzle
            .getData()
            .cell(column, row - 1)
            .element.focus();
        }
        break;

      case "ArrowDown":
        if (row < 8) {
          this.#puzzle
            .getData()
            .cell(column, row + 1)
            .element.focus();
        }
        break;
      case "Backspace":
      case "Space":
      case "Delete":
      case "Digit0":
        var oElem = document.querySelector(
          `td[data-column="${column}"][data-row="${row}"]`
        );
        if (oElem.classList.contains("entered")) {
          const oCellData = this.#puzzle.getData().cell(column, row);
          if (oCellData.fixedValue) {
            return;
          }
          oCellData.entered = false;
          oCellData.value = null;
          oCellData.element.innerText = "";
          oCellData.element.classList.remove("entered");

          this._updateCellHints();
          SidukoSounds.getInstance().playSound("si_eraser");
        }
        break;
    }
    oEvent.stopImmediatePropagation();
  }

  _onKeyPress(oEvent) {
    if (this.#playerData.guessesRemaining <= 0) {
      return;
    }    
    const oEventTarget = oEvent.target;
    const iValue = parseInt(oEvent.key, 10);

    if (
      oEventTarget.nodeName === "TD" &&
      [1, 2, 3, 4, 5, 6, 7, 8, 9].indexOf(iValue) >= 0
    ) {
      if (!oEventTarget.classList.contains("fixedval")) {
        const column = 0 | oEventTarget.dataset.column;
        const row = 0 | oEventTarget.dataset.row;
        const oCellData = this.#puzzle.getData().cell(column, row);
        if (oCellData.fixedValue) {
          return;
        }

        if (
          SidukoCellQueries.getPossibleValues(
            this.#puzzle.getData(),
            oCellData
          ).indexOf(iValue) >= 0
        ) {
          const oStartFullnessState = SidukoCellQueries.getFullnessState(
            this.#puzzle.getData(),
            oCellData
          );

          oCellData.value = iValue || 0;
          oCellData.entered = true;
          oEventTarget.innerText = this.#puzzle.charset[parseInt(oEvent.key,10) - 1];
          oEventTarget.classList.add("entered");
          oEventTarget.title = "";

          const fnAnimEnd = (oEvent) => {
            oEventTarget.removeEventListener("animationend", fnAnimEnd);
            oEventTarget.classList.remove("value_entered");
          };
          oEventTarget.addEventListener("animationend", fnAnimEnd);
          oEventTarget.classList.add("value_entered");

          const oEndFullnessState = SidukoCellQueries.getFullnessState(
            this.#puzzle.getData(),
            oCellData
          );
          let oFullnessStateChanges = SidukoCellQueries.getFullnessStateChanges(
            oStartFullnessState,
            oEndFullnessState,
            oCellData
          );
          if (!oFullnessStateChanges) {
            oFullnessStateChanges = {};
          }
          oFullnessStateChanges.playerCellUsed = true;
          oFullnessStateChanges.cell = oCellData;
          this.gameplayChangedHandler(oFullnessStateChanges);

          this._updateCellHints();
          this.__triggerBonuses(oCellData);  
          SidukoSounds.getInstance().playSound("Click1");  
          SidukoElementEffects.slideCellOut(oCellData.element);
                  
        }
      }
      oEvent.stopImmediatePropagation();
    }
  }

  __showValueEntryPopup(oEvent) {
    if (this.__lastFocusedCell == this.#focusedCell) {
      console.log("same cell");

    } else {
      this.__lastFocusedCell = this.#focusedCell;
      this.__badGuessCount = 0;
      console.log("new cell");
    }
    const aPossibleValues = SidukoCellQueries.getPossibleValues(
      this.#puzzle.getData(),
      this.#focusedCell
    );
    const valueEntryTds = Array.from(
      document.querySelectorAll("#cellValueEntryPopup td")
    );
    valueEntryTds.forEach((td) => {
      
      const sCellValue = td.innerText;
      const iValIndex = this.#puzzle.charset.indexOf(sCellValue);
      if (iValIndex >= 0 && this.#playerData.getBoost("Hints").turnsRemaining > 0 &&
          aPossibleValues.indexOf(iValIndex+1) >= 0) 
      {
        td.classList.add("suggested");
      } else {
        td.classList.remove("suggested");
      }
    });
    this.#cellValueEntry.style.top = oEvent.clientY + "px";
    this.#cellValueEntry.style.left = oEvent.clientX + "px";
    const valueClearButton = document.getElementById("cellValueClearButton");
    if (this.#focusedCell.value) {
      valueClearButton.classList.remove("hidden");
    } else {
      valueClearButton.classList.add("hidden");
    }
    this.#cellValueEntry.classList.remove("hidden");
    this.#cellValueEntry.focus();
  }


  _onTap(oEvent) {
    if (this.#playerData.guessesRemaining <= 0) {
      return;
    }    
    if (!document.getElementById("touchScreenCheckBox").checked) {
      return;
    }
    const oEventTarget = oEvent.target;

    console.log(`Tap: elem: ${oEventTarget.dataset}`);

    if (oEventTarget.nodeName === "TD") {
      if (!oEventTarget.classList.contains("fixedval")) {
        const column = 0 | oEventTarget.dataset.column;
        const row = 0 | oEventTarget.dataset.row;
        this.#focusedCell = this.#puzzle.getData().cell(column, row);
        if (this.#focusedCell.fixedValue) {
          return;
        }
        this.__showValueEntryPopup(oEvent);
        oEvent.stopImmediatePropagation();
      }
    }
  }

  __triggerBonuses(oCellData) {
    const oSolutionCell = this.#puzzle.solution.getData().cell(
      oCellData.column,
      oCellData.row
    );
    if (oCellData.bonusTrigger) {
      oCellData.bonusTrigger = false;  

      if (oSolutionCell.value === oCellData.value) {
        SidukoNotifications.getInstance().queueBonus("Bonus triggered...have some free money!");
        this.#playerData.funds++;
      } else {
        SidukoNotifications.getInstance().queueBonus("Penalty triggered...that'll cost you!");
        if (this.#playerData.funds >= 1) {
          this.#playerData.funds--;
        } else if (this.#playerData.guessesRemaining > 5) {
          this.#playerData.guessesRemaining = this.#playerData.guessesRemaining - 5;                    
        }
      }           
    }  

    /*
    if (oCellData.randomBonusTrigger) {
      oCellData.randomBonusTrigger = false;
      if (oSolutionCell.value === oCellData.value) {
        SidukoNotifications.getInstance().queueBonus("Correct Value. Random bonus triggered!");
        SidukoBonuses.triggerRandomBonus(this.#puzzle,()=>{});              
      } else {
        SidukoNotifications.getInstance().queueBonus("Incorrect value. Random bonus failed!");  
      }            
    } 
      */

    
 
  }

  _onCellValueEntryChange(oEvent) {
    const oCellData = this.#focusedCell;
    if (oCellData.fixedValue) {
      return;
    }

    const valueEntry = document.getElementById("cellValueEntryPopup");
    if (oEvent.target.innerText === "Clear") {
      oCellData.value = 0;
      oCellData.entered = false;
      oCellData.element.innerText = "";
      oCellData.element.classList.remove("entered");
      oCellData.element.title = "";

      valueEntry.classList.add("hidden");
      oEvent.stopImmediatePropagation();
      this._updateCellHints();
      SidukoSounds.getInstance().playSound("si_eraser");
      return;
    }

    const sClickedValue = oEvent.target.innerText;
    const iValIndex = this.#puzzle.charset.indexOf(sClickedValue);
    if (iValIndex >= 0 && iValIndex < 9) {
      const iValue = iValIndex + 1;
      if (
        SidukoCellQueries.canSetValue(this.#puzzle.getData(), oCellData, iValue)
      ) {
        const oStartFullnessState = SidukoCellQueries.getFullnessState(
          this.#puzzle.getData(),
          oCellData
        );

        oCellData.value = iValue || 0;
        oCellData.entered = true;
        oCellData.element.innerText = this.#puzzle.charset[iValue-1];
        oCellData.element.classList.add("entered");
        oCellData.element.title = "";

        const oEndFullnessState = SidukoCellQueries.getFullnessState(
          this.#puzzle.getData(),
          oCellData
        );
        let oFullnessStateChanges = SidukoCellQueries.getFullnessStateChanges(
          oStartFullnessState,
          oEndFullnessState,
          oCellData
        );
        if (!oFullnessStateChanges) {
          oFullnessStateChanges = {};
        }
        oFullnessStateChanges.playerCellUsed = true;
        oFullnessStateChanges.cell = oCellData;
        this.gameplayChangedHandler(oFullnessStateChanges);
        valueEntry.classList.add("hidden");

        const fnAnimEnd = (oEvent) => {
          oCellData.element.removeEventListener("animationend", fnAnimEnd);
          oCellData.element.classList.remove("value_entered");
        };
        oCellData.element.addEventListener("animationend", fnAnimEnd);
        oCellData.element.classList.add("value_entered");

        this._updateCellHints();
        this.__triggerBonuses(oCellData);
        SidukoSounds.getInstance().playSound("Click1");
        SidukoElementEffects.slideCellOut(oCellData.element);        


      } else {
        if (!this.__badGuessCount) {
          this.__badGuessCount = 1;          
        } else {
          this.__badGuessCount++;
          if (this.__badGuessCount > 3) {
            //TODO: add a penalty
            SidukoNotifications.getInstance().queueAlert("You're just spamming the guesses, aren't you?.");
            this.__badGuessCount = 0;
          }
        }
      }

      oEvent.stopImmediatePropagation();
    }
  }

  _updateCellHints() {
    const oBoost = this.#playerData.getBoost("Hints");
    if (
      oBoost &&
      typeof oBoost.turnsRemaining === "number" &&
      oBoost.turnsRemaining > 0
    ) {
      SidukoHtmlGenerator.updateCellHints(this.#puzzle);
    } else {
      this.#puzzle.getData().cells.forEach((cell) => {
        cell.element.title = "";
      });
    }
  }

  _onCellValueEntryBlur(oEvent) {
    const valueEntry = document.getElementById("cellValueEntryPopup");
    valueEntry.classList.add("hidden");
    oEvent.stopImmediatePropagation();
  }
}
