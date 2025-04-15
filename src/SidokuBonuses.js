class SidokuBonuses {
  //BONUSES WILL HAVE DIFFERENT MULTIPLIERS, WHICH WILL ENABLE THEM SELECT UP TO THE MULTIPLIER OF CELLS

  //ONE BONUS WILL BE A GUARANTEE THAT ALL THE SELECTED TARGET CELLS ARE VALID

  //ANOTHER BOUNS WILL DOUBLE THE TIME,

  //ANOTHER ONE WILL DOUBLE THE NUMBER OF TURNS LEFT

  static revealRandomValue(
    oPuzzle,
    puzzleSolution,
    fnGameEventCallback,
    bonusData
  ) {
    if (typeof fnGameEventCallback !== "function") {
      throw new Error("Invalid callback function");
    }
    const emptyCells = oPuzzle.getData().cells.filter((c) => c.value === 0);
    if (emptyCells.length === 0) {
      return;
    }
    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const sourceCell = puzzleSolution
      .getData()
      .cell(randomCell.column, randomCell.row);
    const iMaxCells = bonusData.maxCellCount;
    let iCellsRevealed = 0;
    for (let i = 0; i < iMaxCells - 1; i++) {
      if (iCellsRevealed >= iMaxCells) {
        break;
      }
      logMessage(
        `Random Cell: ${randomCell.column}, ${randomCell.row}`,
        "randomChoiceStatus"
      );
      if (
        randomCell.value <= 0 &&
        SidukoCellQueries.canSetValue(
          oPuzzle.getData(),
          randomCell,
          sourceCell.value
        )
      ) {
        const oStartFullnessState = SidukoCellQueries.getFullnessState(
          oPuzzle.getData(),
          randomCell
        );

        randomCell.value = sourceCell.value;
        randomCell.element.innerHTML = sourceCell.value;
        randomCell.setSolved();
        randomCell.element.classList.add("aided");
        randomCell.element.classList.add("granted");
        randomCell.entered = true;

        const oEndFullnessState = SidukoCellQueries.getFullnessState(
          oPuzzle.getData(),
          randomCell
        );
        let oFullnessStateChanges = SidukoCellQueries.getFullnessStateChanges(
          oStartFullnessState,
          oEndFullnessState,
          randomCell
        );
        if (!oFullnessStateChanges) {
          oFullnessStateChanges = {};
        }
        oFullnessStateChanges.cellUsed = true;
        oFullnessStateChanges.targetCell = randomCell;
        fnGameEventCallback(oFullnessStateChanges);
        iCellsRevealed++;
      } else if (randomCell.value > 0) {
        console.warn(
          `Could not reveal random value due to existing value. (${randomCell.column},${randomCell.row}) cannot be set to ${randomCell.value}`
        );
      }
    }
    return iCellsRevealed;
  }

  // Picks a random columns and reveals the solution to all the items.
  static revealCellsWithRandomRow(
    oPuzzle,
    puzzleSolution,
    fnGameEventCallback,
    bonusData
  ) {
    if (typeof fnGameEventCallback !== "function") {
      throw new Error("Invalid callback function");
    }
    const emptyCells = oPuzzle.getData().cells.filter((c) => c.value === 0);
    if (emptyCells.length === 0) {
      return;
    }
    const randomRow = Math.floor(Math.random() * 9);
    logMessage(`Random Row: ${randomRow}`, "randomChoiceStatus");
    const iMaxCells = bonusData.maxCellCount;
    let iCellsRevealed = 0;
    for (let iIndex = 0; iIndex < 9; iIndex++) {
      if (iCellsRevealed >= iMaxCells) {
        break;
      }
      const sourceCell = puzzleSolution.getData().cell(iIndex, randomRow);
      const targetCell = oPuzzle.getData().cell(iIndex, randomRow);
      if (
        targetCell.value <= 0 &&
        SidukoCellQueries.canSetValue(
          oPuzzle.getData(),
          targetCell,
          sourceCell.value
        )
      ) {
        const oStartFullnessState = SidukoCellQueries.getFullnessState(
          oPuzzle.getData(),
          targetCell
        );
        targetCell.value = sourceCell.value;
        targetCell.element.innerHTML = sourceCell.value;
        targetCell.setSolved();
        targetCell.element.classList.add("aided");
        targetCell.element.classList.add("granted");
        targetCell.entered = true;

        const oEndFullnessState = SidukoCellQueries.getFullnessState(
          oPuzzle.getData(),
          targetCell
        );
        let oFullnessStateChanges = SidukoCellQueries.getFullnessStateChanges(
          oStartFullnessState,
          oEndFullnessState,
          targetCell
        );
        if (!oFullnessStateChanges) {
          oFullnessStateChanges = {};
        }
        oFullnessStateChanges.cellUsed = true;
        oFullnessStateChanges.targetCell = targetCell;
        fnGameEventCallback(oFullnessStateChanges);

        iCellsRevealed++;
      } else if (targetCell.value > 0) {
        console.warn(
          `Could not reveal random row value due to existing value. (${targetCell.column},${targetCell.row}) cannot be set to ${sourceCell.value}`
        );
      }
    }
    return iCellsRevealed;
  }

  // Picks a random column and reveals the solution to all the items.
  static revealCellsWithRandomColumn(
    oPuzzle,
    puzzleSolution,
    fnGameEventCallback,
    bonusData
  ) {
    if (typeof fnGameEventCallback !== "function") {
      throw new Error("Invalid callback function");
    }
    const emptyCells = oPuzzle.getData().cells.filter((c) => c.value === 0);
    if (emptyCells.length === 0) {
      return;
    }
    const randomColumnn = Math.floor(Math.random() * 9);
    logMessage(`Random Column: ${randomColumnn}`, "randomChoiceStatus");
    const iMaxCells = bonusData.maxCellCount;
    let iCellsRevealed = 0;
    for (let iIndex = 0; iIndex < 9; iIndex++) {
      if (iCellsRevealed >= iMaxCells) {
        break;
      }
      const sourceCell = puzzleSolution.getData().cell(randomColumnn, iIndex);
      const targetCell = oPuzzle.getData().cell(randomColumnn, iIndex);
      if (
        targetCell.value <= 0 &&
        SidukoCellQueries.canSetValue(
          oPuzzle.getData(),
          targetCell,
          sourceCell.value
        )
      ) {
        const oStartFullnessState = SidukoCellQueries.getFullnessState(
          oPuzzle.getData(),
          targetCell
        );
        fnGameEventCallback({
          cellUsed: true,
        });
        targetCell.value = sourceCell.value;
        targetCell.element.innerHTML = sourceCell.value;
        targetCell.setSolved();
        targetCell.element.classList.add("aided");
        targetCell.element.classList.add("granted");
        targetCell.entered = true;
        //SidukoHtmlGenerator.updateCellHints(oPuzzle);

        const oEndFullnessState = SidukoCellQueries.getFullnessState(
          oPuzzle.getData(),
          targetCell
        );
        let oFullnessStateChanges = SidukoCellQueries.getFullnessStateChanges(
          oStartFullnessState,
          oEndFullnessState,
          targetCell
        );
        if (!oFullnessStateChanges) {
          oFullnessStateChanges = {};
        }
        oFullnessStateChanges.cellUsed = true;
        oFullnessStateChanges.targetCell = targetCell;
        fnGameEventCallback(oFullnessStateChanges);

        iCellsRevealed++;
      } else if (targetCell.value > 0) {
        console.warn(
          `Could not reveal random column value due to existing value. (${targetCell.column},${targetCell.row}) cannot be set to ${sourceCell.value}`
        );
      }
    }
    return iCellsRevealed;
  }

  // Picks a random column and reveals the solution to all the items.
  static revealCellsWithRandomInnerTable(
    oPuzzle,
    puzzleSolution,
    fnGameEventCallback,
    bonusData
  ) {
    if (typeof fnGameEventCallback !== "function") {
      throw new Error("Invalid callback function");
    }
    const randomInnerTableId = Math.floor(Math.random() * 9);
    logMessage(`Random Square: ${randomInnerTableId}`, "randomChoiceStatus");
    const emptyCells = oPuzzle
      .getData()
      .cells.filter(
        (c) => c.value === 0 && c.innerTableIndex == randomInnerTableId
      );
    if (emptyCells.length === 0) {
      return;
    }
    const iMaxCells = bonusData.maxCellCount;
    let iCellsRevealed = 0;
    emptyCells.forEach((targetCell) => {
      if (iCellsRevealed < iMaxCells) {
        const sourceCell = puzzleSolution
          .getData()
          .cell(targetCell.column, targetCell.row);
        if (
          targetCell.value <= 0 &&
          SidukoCellQueries.canSetValue(
            oPuzzle.getData(),
            targetCell,
            sourceCell.value
          )
        ) {
          const oStartFullnessState = SidukoCellQueries.getFullnessState(
            oPuzzle.getData(),
            targetCell
          );
          targetCell.value = sourceCell.value;
          targetCell.element.innerHTML = sourceCell.value;
          targetCell.setSolved();
          targetCell.element.classList.add("aided");
          targetCell.element.classList.add("granted");
          targetCell.entered = true;

          const oEndFullnessState = SidukoCellQueries.getFullnessState(
            oPuzzle.getData(),
            targetCell
          );
          let oFullnessStateChanges = SidukoCellQueries.getFullnessStateChanges(
            oStartFullnessState,
            oEndFullnessState,
            targetCell
          );
          if (!oFullnessStateChanges) {
            oFullnessStateChanges = {};
          }
          oFullnessStateChanges.cellUsed = true;
          oFullnessStateChanges.targetCell = targetCell;
          fnGameEventCallback(oFullnessStateChanges);
          iCellsRevealed++;
        } else if (targetCell.value > 0) {
          console.warn(
            `Could not reveal random inner table value due to existing value. (${targetCell.column},${targetCell.row}) cannot be set to ${sourceCell.value}`
          );
        }
      }
    });
    return iCellsRevealed;
  }

  // Picks a random digit and then looks for all the matching cells from the solution and solves them
  static revealCellsWithRandomValue(
    oPuzzle,
    puzzleSolution,
    fnGameEventCallback,
    bonusData
  ) {
    if (typeof fnGameEventCallback !== "function") {
      throw new Error("Invalid callback function");
    }
    const emptyCells = oPuzzle.getData().cells.filter((c) => c.value === 0);
    if (emptyCells.length === 0) {
      return;
    }
    const randomValue = Math.floor(Math.random() * 8) + 1;
    logMessage(`Cell Value: ${randomValue}`, "randomChoiceStatus");
    const aSourceCells = puzzleSolution
      .getData()
      .cells.filter((c) => c.value === randomValue);
    const iMaxCells = bonusData.maxCellCount;
    let iCellsRevealed = 0;
    aSourceCells.forEach((oSourceCell) => {
      if (iCellsRevealed < iMaxCells) {
        const targetCell = oPuzzle
          .getData()
          .cell(oSourceCell.column, oSourceCell.row);

        if (
          targetCell.value <= 0 &&
          SidukoCellQueries.canSetValue(
            oPuzzle.getData(),
            targetCell,
            randomValue
          )
        ) {
          const oStartFullnessState = SidukoCellQueries.getFullnessState(
            oPuzzle.getData(),
            targetCell
          );
          targetCell.value = randomValue;
          targetCell.element.innerHTML = randomValue;
          targetCell.setSolved();
          targetCell.element.classList.add("aided");
          targetCell.element.classList.add("granted");
          targetCell.entered = true;

          const oEndFullnessState = SidukoCellQueries.getFullnessState(
            oPuzzle.getData(),
            targetCell
          );
          let oFullnessStateChanges = SidukoCellQueries.getFullnessStateChanges(
            oStartFullnessState,
            oEndFullnessState,
            targetCell
          );
          if (!oFullnessStateChanges) {
            oFullnessStateChanges = {};
          }
          oFullnessStateChanges.cellUsed = true;
          oFullnessStateChanges.targetCell = targetCell;
          fnGameEventCallback(oFullnessStateChanges);
          iCellsRevealed++;
        } else if (targetCell.value > 0) {
          console.warn(
            `Could not reveal item with random value due to existing value. (${targetCell.column},${targetCell.row}) cannot be set to ${randomValue}`
          );
        }
      }
    });
    // SidukoHtmlGenerator.updateCellHints(oPuzzle);
    return iCellsRevealed;
  }

  //Examines all the cells and looks for the cells for which only 1 value is possible, and solves them
  static autoFillCellsWithOnePossibleValue(
    oPuzzle,
    puzzleSolution,
    fnGameEventCallback,
    bonusData
  ) {
    if (typeof fnGameEventCallback !== "function") {
      throw new Error("Invalid callback function");
    }
    const emptyCells = oPuzzle.getData().cells.filter((c) => c.value === 0);
    if (emptyCells.length === 0) {
      return;
    }
    const iMaxCells = bonusData.maxCellCount;
    let iCellsRevealed = 0;
    emptyCells.forEach((oTargetCell) => {
      if (iCellsRevealed < iMaxCells) {
        const aPossibleValues = SidukoCellQueries.getPossibleValues(
          oPuzzle.getData(),
          oTargetCell
        );
        if (aPossibleValues.length === 1) {
          const oSourceCell = puzzleSolution
            .getData()
            .cell(oTargetCell.column, oTargetCell.row);
          if (
            oTargetCell.value <= 0 &&
            SidukoCellQueries.canSetValue(
              oPuzzle.getData(),
              oTargetCell,
              aPossibleValues[0]
            ) &&
            puzzleSolution.getData().cell(oTargetCell.column, oTargetCell.row)
              .value === aPossibleValues[0]
          ) {
            const oStartFullnessState = SidukoCellQueries.getFullnessState(
              oPuzzle.getData(),
              oTargetCell
            );
            oTargetCell.value = oSourceCell.value;
            oTargetCell.element.innerHTML = oSourceCell.value;
            oTargetCell.setSolved();
            oTargetCell.element.classList.add("aided");
            oTargetCell.element.classList.add("granted");
            oTargetCell.entered = true;

            const oEndFullnessState = SidukoCellQueries.getFullnessState(
              oPuzzle.getData(),
              oTargetCell
            );
            let oFullnessStateChanges =
              SidukoCellQueries.getFullnessStateChanges(
                oStartFullnessState,
                oEndFullnessState,
                oTargetCell
              );
            if (!oFullnessStateChanges) {
              oFullnessStateChanges = {};
            }
            oFullnessStateChanges.cellUsed = true;
            oFullnessStateChanges.targetCell = oTargetCell;
            fnGameEventCallback(oFullnessStateChanges);
            iCellsRevealed++;
          } else if (oTargetCell.value > 0) {
            console.warn(
              `Could not reveal item which has only 1 target due to existing data. (${oTargetCell.column},${oTargetCell.row}) cannot be set to ${oSourceCell.value}`
            );
          }
        }
      }
    });
    return iCellsRevealed;
    // SidukoHtmlGenerator.updateCellHints(oPuzzle);
  }

  static canAutoFillCellsWithOnePossibleValue(oPuzzle, puzzleSolution) {
    const emptyCells = oPuzzle.getData().cells.filter((c) => c.value === 0);
    if (emptyCells.length === 0) {
      return;
    }
    let iCellsRevealed = 0;
    emptyCells.forEach((oTargetCell) => {
      if (iCellsRevealed < 1) {
        const aPossibleValues = SidukoCellQueries.getPossibleValues(
          oPuzzle.getData(),
          oTargetCell
        );
        if (aPossibleValues.length === 1) {
          if (
            oTargetCell.value <= 0 &&
            SidukoCellQueries.canSetValue(
              oPuzzle.getData(),
              oTargetCell,
              aPossibleValues[0]
            ) &&
            puzzleSolution.getData().cell(oTargetCell.column, oTargetCell.row)
              .value === aPossibleValues[0]
          ) {
            iCellsRevealed++;
          }
        }
      }
    });
    return iCellsRevealed > 0;
  }
}
