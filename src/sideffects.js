class SidukoElementEffects {

  // Create rectangular divs for each table cell and place them eaxtly over the cells.
  // fade the table out whlst animating each of the divs for implode/explode/circle, etc.

  static getElementOverlay(oElem) {
    let dup = document.createElement("div");
    dup.style.position = "absolute";
    const sourceRect = oElem.getBoundingClientRect();
    const pxRect = {
      top: parseInt(sourceRect.top,10) + "px",
      left: parseInt(sourceRect.left,10) + "px",
      width: parseInt(sourceRect.width,10) + "px",
      height: parseInt(sourceRect.height,10) + "px"
    };
    dup.style.top = pxRect.top;
    dup.style.left = pxRect.left;
    dup.style.width = pxRect.width;
    dup.style.height = pxRect.height;
    dup.style.zIndex = 1000;
    dup.innerText = oElem.innerText;
    dup.style.backgroundColor = "white"  ;
    dup.style.color = "black";  
    dup.style.textAlign = "center";
    dup.style.verticalAlign = "middle";
    dup.style.padding = "4px";
    dup.style.lineHeight = "1.8em";
    return dup;
  }

}