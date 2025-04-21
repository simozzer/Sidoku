class SidukoWordSearch {
  #puzzle
  #wordList

  constructor(puzzle, wordList) {
    this.#puzzle = puzzle
    this.wordList = wordList
  }

  __containsWordInList(text) {
    text = text.toLowerCase();
    for (let iWordIndex = 0; iWordIndex < this.wordList.length; iWordIndex++) {
      const sWord = this.wordList[iWordIndex].toLowerCase();
      if (text.includes(sWord)) {
        console.log(`Word "${sWord}" found in list`);
        return sWord;
      }
    }

    text = text.split('').reverse().join('');
    for (let iWordIndex = 0; iWordIndex < this.wordList.length; iWordIndex++) {
      const sWord = this.wordList[iWordIndex].toLowerCase();
      if (text.includes(sWord)) {
        console.log(`Word "${sWord}" found in reverse in list`);
        return sWord;
      }
    }
    return false  
  }

  findWords() {
    // find in rows
    for (let rowIndex = 0; rowIndex <9; rowIndex++) {
      const aCellsOnRow = this.#puzzle.getData().cellsInRow(rowIndex);
      const aRowText = aCellsOnRow.map(cell => this.#puzzle.charset[cell.value-1] ? this.#puzzle.charset[cell.value-1] : ' ').toString();
      let sRowText = "";
      for (let charsetIndex = 0; charsetIndex <9; charsetIndex++) {
        sRowText += aRowText[charsetIndex * 2];
      }
      sRowText = sRowText.toLowerCase();

      let sfound = this.__containsWordInList(sRowText);
      if (sfound) {
        console.log(`Word "${this.__containsWordInList(sfound)}" found in row ${rowIndex + 1}`);
      }
    }


    //find in columns
    for (let colIndex = 0; colIndex <9; colIndex++) {
      const aCellsOnCol = this.#puzzle.getData().cellsInColumn(colIndex);
      const aColText = aCellsOnCol.map(cell => this.#puzzle.charset[cell.value-1] ? this.#puzzle.charset[cell.value-1] : ' ').toString();
      let sColText = "";
      for (let charsetIndex = 0; charsetIndex <9; charsetIndex++) {
        sColText += aColText[charsetIndex * 2];
      }
      sColText = sColText.toLowerCase();

      let sfound = this.__containsWordInList(sColText);
      if (sfound) {
        console.log(`Word "${this.__containsWordInList(sfound)}" found in col ${colIndex + 1}`);
      }
    }

    //find in diagonal

    let x =0;
    let y = 0;
    const fnCollect = (x,y) => {
      let chars = "";
      while (x <9 && y < 9) {
        chars += this.#puzzle.charset[this.#puzzle.getData().cell(x,y).value-1]?this.#puzzle.charset[this.#puzzle.getData().cell(x,y).value-1]:' ';        
        x++;
        y++;
      }
      //console.log(chars);
      let sfa = this.__containsWordInList(chars);
      if (sfa) {
        console.log(`Word "${this.__containsWordInList(sfa)}" found in diag`);
      }
      //console.log(chars);
    }

    for(let i=0; i<9; i++) {
      fnCollect(i,0);
    }

    
    for(let i=0; i<9; i++) {
      fnCollect(0,i);
    }


    const fnCollectRev = (x,y) => {
      let chars = "";
      while (x >=0 && y >=0) {
        chars += this.#puzzle.charset[this.#puzzle.getData().cell(x,y).value-1]?this.#puzzle.charset[this.#puzzle.getData().cell(x,y).value-1]:' ';        
        x--;
        y--;
      }      
      let sf = this.__containsWordInList(chars);
      if (sf) {
        console.log(`Word "${this.__containsWordInList(sf)}" found in diag`);
      }      
    }

    for(let i=8; i>=0; i--) {
      fnCollectRev(8,i);
    }

    
    for(let i=8; i>=0; i--) {
      fnCollectRev(i,8,'s');
    }

  }
}