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

  #history = [];
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
  

    //https://www.vertex42.com/ExcelTips/unicode-symbols.html#currency
    switch (charsetVal) {
      case "alpha":
        this.charset = SidukoConstants.ALPHA_SET;
        break;
      case "emoji":
        this.charset = SidukoConstants.EMOJI_SET;
        break;
      case "roman":
        this.charset = SidukoConstants.ROMAN_SET;
        break;
      case "color":
        this.charset = SidukoConstants.COLOR_SET;
        break;      
      default:
        this.charset = SidukoConstants.NUM_SET;
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

  getHistory() {
    return this.#history;
  }

}
