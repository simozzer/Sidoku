
class SidukoBoostData {
    #name
    #maxCellCount
    #accuracy
    #turnsRemaining
    #description
    #decrementsEachTurn
    #domElement
    #exhausted;
    #forSale;
    #puzzle;
    #buyHint;
    #boostable;

    constructor(name, description, puzzle) {
        this.#name = name;
        this.#maxCellCount = 1;
        this.#accuracy = 0.3;
        this.#turnsRemaining = null;
        this.#description = description;
        this.#decrementsEachTurn = false;
        this.#domElement = null;
        this.#exhausted = false;
        this.#forSale = false;
        this.#puzzle = puzzle;
        this.#buyHint = "";
        this.#boostable = false;
    }

    get puzzle() {
        return this.#puzzle;
    }
    
    get name() {
        return this.#name;
    }

    get accuracy() {
        return this.#accuracy;
    }

    get description() {
        return this.#description;
    }

    get maxCellCount() {
        return this.#maxCellCount;
    }

    set maxCellCount(value) {
        this.#maxCellCount = value;
    }

    get buyHint() {
        return this.#buyHint;
    }

    set buyHint(value) {
        this.#buyHint = value;
    }

    get boostable() {
        return this.#boostable;
    }

    set boostable(value) {
        this.#boostable = value;
    }
    
    boostAccuracy() {
        if (this.accuracy < 1) {
            this.#accuracy += 0.1;
        }
    }

    boostMaxCellCount() {
        if (this.#maxCellCount < 5) {
            this.#maxCellCount += 1
        }
    }

    get turnsRemaining() {
        return this.#turnsRemaining;
    }

    set turnsRemaining(value) {
        this.#turnsRemaining = value;     
    }

    get decrementsEachTurn() {
        return this.#decrementsEachTurn;
    }

    get exhausted() {
        return this.#exhausted;        
    }

    get forSale() {
        return this.#forSale;
    }

    set forSale(value) {
        this.#forSale = value;
        if (value && this.#domElement) {
            this.#domElement.classList.add("forSale");
        } else {
            this.#domElement.classList.remove("forSale");
        }
    }

    set exhausted(value) {
        this.#exhausted = value;
        if (value && this.#domElement) {
            this.#domElement.classList.add("exhausted");
            this.#turnsRemaining = null;
        } else if (this.#domElement) {
            this.#domElement.classList.remove("exhausted");
        }
    }

    getCanUse() {
        return (this.#turnsRemaining > 0 && !this.exhausted);
    }

    use() {

        if (this.getCanUse()) {
            this.#turnsRemaining--;            
           // todo:: OVERRIDE IN INHERITED CLASSES
            return true;
            
        }
    }

    set decrementsEachTurn(value) {
        this.#decrementsEachTurn = value;
    }

    get domElement() {
        return this.#domElement;
    }

    set domElement(value) {
        this.#domElement = value;
    }

}

class SidukoHintsBoostData extends SidukoBoostData {

    getCanUse(playerData) {
        if (super.getCanUse()) {        
            console.log("hints boost can use");
            return true;
        }
        return false;
    }

    use() {

        if (this.getCanUse()) {
            this.turnsRemaining += SidukoBoostData;            
            return true;
            
        }
        return false;
    }
}

class SidukoSeekerBoostData extends SidukoBoostData {

    getCanUse(playerData) {
        if (super.getCanUse()) {        
    //        console.log("sekker boost can use");
            return SidokuBonuses.canAutoFillCellsWithOnePossibleValue(this.puzzle, this.puzzle.solution,()=>{},this);
        }
        return false;
    }

    use() {

        if (this.getCanUse()) {

            SidokuBonuses.autoFillCellsWithOnePossibleValue(this.puzzle, this.puzzle.solution,()=>{},this);            
            this.turnsRemaining--;
            return true;
            // (this.#puzzle,this.#puzzle.solution)            
        }
        return false;
    }
}

class SidukoRowBoostData extends SidukoBoostData {

    
    use() {

        if (this.getCanUse()) {

            SidokuBonuses.revealCellsWithRandomRow(this.puzzle, this.puzzle.solution,()=>{},this);            
            this.turnsRemaining--;
            return true;
            // (this.#puzzle,this.#puzzle.solution)            
        }
        return false;
    }

}

class SidukoColumnBoostData extends SidukoBoostData {

    
    use() {

        if (this.getCanUse()) {

            SidokuBonuses.revealCellsWithRandomColumn(this.puzzle, this.puzzle.solution,()=>{},this);            
            this.turnsRemaining--;
            return true;
            // (this.#puzzle,this.#puzzle.solution)            
        }
        return false;
    }

}


class SidukoInnerTableBoostData extends SidukoBoostData {

    
    use() {

        if (this.getCanUse()) {

            SidokuBonuses.revealCellsWithRandomInnerTable(this.puzzle, this.puzzle.solution,()=>{},this);            
            this.turnsRemaining--;
            return true;
            // (this.#puzzle,this.#puzzle.solution)            
        }
        return false;
    }

}

class SidukoRandomBoostData extends SidukoBoostData {

    
    use() {

        if (this.getCanUse()) {

            SidokuBonuses.revealRandomValue(this.puzzle, this.puzzle.solution,()=>{},this);            
            this.turnsRemaining--;
            return true;
            // (this.#puzzle,this.#puzzle.solution)            
        }
        return false;
    }

}

class SidukoRandomValueBoostData extends SidukoBoostData {    
    use() {
        if (this.getCanUse()) {
            SidokuBonuses.revealCellsWithRandomValue(this.puzzle, this.puzzle.solution,()=>{},this);            
            this.turnsRemaining--;
            return true;
            // (this.#puzzle,this.#puzzle.solution)            
        }
        return false;
    }
}

