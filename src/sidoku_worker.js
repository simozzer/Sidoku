//const shinningStarData = [0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 3, 0, 0, 0, 0, 4, 0, 0, 5, 0, 0, 6, 0, 7, 0, 0, 0, 0, 0, 8, 0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 3, 8, 0, 0, 9, 0, 0, 0, 5, 0, 0, 0, 1, 0, 0, 6, 0, 8, 0, 2, 0, 0, 0, 4, 0, 6, 0, 0, 0, 0, 7, 2, 0, 0, 0, 0, 9, 0, 6, 0];

//todo: CREATE A WORKER WHICH TAKES AN ARRAY LIKE THE ABOVE AND SOLVES IT.. for now this is just a test

onmessage = function(e) {
    //console.log(e.data);
    if (e.data === "close") {
        debugger
        self.close();
        return;
    }
    this.postMessage(e.data);
    e.stopPropagation();
};