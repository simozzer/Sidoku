const shinningStarData = [
  0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 7, 0,
  0, 0, 0, 0, 8, 0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 3, 8, 0, 0, 9, 0, 0, 0, 5, 0, 0,
  0, 1, 0, 0, 6, 0, 8, 0, 2, 0, 0, 0, 4, 0, 6, 0, 0, 0, 0, 7, 2, 0, 0, 0, 0, 9,
  0, 6, 0,
];
const evilPuzzleData = [
  9, 0, 0, 0, 4, 3, 1, 6, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 9,
  0, 8, 0, 0, 0, 1, 9, 3, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 6, 0, 0, 0,
  0, 0, 0, 0, 0, 8, 0, 0, 6, 0, 0, 0, 0, 7, 0, 6, 4, 0, 0, 3, 4, 0, 0, 2, 0, 0,
  0, 0, 0,
];
const hardPuzzleData = [
  1, 0, 0, 6, 0, 5, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 0, 1, 0, 8, 4,
  0, 0, 0, 0, 9, 5, 1, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 2, 0, 8, 0, 6,
  0, 0, 6, 0, 7, 0, 0, 0, 9, 0, 5, 3, 0, 0, 8, 0, 7, 0, 0, 2, 0, 0, 9, 0, 0, 0,
  1, 0, 0,
];
const escargotAiData = [
  1, 0, 0, 0, 0, 7, 0, 9, 0, 0, 3, 0, 0, 2, 0, 0, 0, 8, 0, 0, 9, 6, 0, 0, 5, 0,
  0, 0, 0, 5, 3, 0, 0, 9, 0, 0, 0, 1, 0, 0, 8, 0, 0, 0, 2, 6, 0, 0, 0, 0, 4, 0,
  0, 0, 3, 0, 0, 0, 0, 0, 0, 1, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 0, 0, 7, 0, 0, 0,
  3, 0, 0,
];

class SidukoPuzzle {
  #rowCells = [];
  #columnCells = [];
  #innerTableCells = [];
  #data = new SidukoPuzzleData();
  #solution = null;
  #charset;
  constructor() {
    this.#data = new SidukoPuzzleData();

    // Optimisation. Build a collection of the cells in each column, row and inner table
    for (let i = 0; i < 9; i++) {
      this.#rowCells[i] = this.#data.cells.filter((oCell) => oCell.row === i);
      this.#columnCells[i] = this.#data.cells.filter(
        (oCell) => oCell.column === i
      );
      this.#innerTableCells[i] = this.#data.cells.filter(
        (oCell) => oCell.innerTableIndex === i
      );
    }

    const urlParams = new URLSearchParams(window.location.search);
    const charsetVal = urlParams.get('charset');
  
    switch (charsetVal) {
      case "alpha":
        this.#charset = SidukoConstants.ALPHA_SET;
        break;
      case "emoji":
        this.#charset = SidukoConstants.EMOJI_SET;
        break;
      default:
        this.#charset = SidukoConstants.NUM_SET;
        break;
    }
    
  }

  set solution(value) {
    this.#solution = value;
  }

  get solution() {
    return this.#solution;
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
    return this.#data;
  }

  get charset() {
    return this.#charset;
  }

  set charset(sCharset) {
    this.#charset = sCharset;
  }


  triggerRandomBonus() {
    const fnHandleGamplayChaned = this.gameplayChangedHandler.bind(this);
    const iRand = Math.floor(Math.random() * 6);
    const dummyBoost = new SidukoBoostData("", "", this);
    switch (iRand) {
      case 0:
        logMessage("😍 Revealing a random cell");
        SidokuBonuses.revealRandomValue(
          this,
          this.#solution,
          fnHandleGamplayChaned,
          dummyBoost
        );
        break;
      case 1:
        logMessage("😀 Revealing cells from a random row");
        SidokuBonuses.revealCellsWithRandomRow(
          this,
          this.#solution,
          fnHandleGamplayChaned,
          dummyBoost
        );
        break;
      case 2:
        logMessage("🙌 Revealing cells from a random column");
        SidokuBonuses.revealCellsWithRandomColumn(
          this,
          this.#solution,
          fnHandleGamplayChaned,
          dummyBoost
        );
        break;
      case 3:
        logMessage("💃 Revealing cells from a random inner table");
        SidokuBonuses.revealCellsWithRandomInnerTable(
          this,
          this.#solution,
          fnHandleGamplayChaned,
          dummyBoost
        );
        break;
      case 4:
        logMessage("🤗 Revealing cells which only have 1 possible value");
        SidokuBonuses.autoFillCellsWithOnePossibleValue(
          this,
          this.#solution,
          fnHandleGamplayChaned,
          dummyBoost
        );
        break;
      case 5:
        logMessage("🤟 Revealing cells with a common random value");
        SidokuBonuses.revealCellsWithRandomValue(
          this,
          this.#solution,
          fnHandleGamplayChaned,
          dummyBoost
        );
        break;
      default:
        logMessage("Invalid bonus button click");
        break;
    }
  }
}
