// Cell Script
function Cell(columnIndex, rowIndex, w) {
    // Initialize required variables
    this.columnIndex = columnIndex;
    this.rowIndex = rowIndex;
    this.x = columnIndex * w;
    this.y = rowIndex * w;
    this.w = w;
    this.neighborCount = 0;

    // Initialize the required boolean values for game
    this.mine = false;
    this.revealed = false;
    this.flagged = false;
    this.alreadyRevealed = false;
}

// Function used to show the cell and it's contents
Cell.prototype.show = function() {
    
    let xCenter = this.x + (this.w / 2);
    let yCenter = this.y + (this.w / 2);

    /* 
    Draw Squares to hide board, if a square is flagged, draw a flag.
    Otherwise, draw a square.
    */
    if(this.flagged){
        stroke(0);
        noFill();
        rect(this.x, this.y, this.w, this.w);
        line(xCenter-5, yCenter-10, xCenter-5, yCenter+20)
        fill("Red");
        triangle(this.x + 15, this.y + 10, this.x + 23.66, this.y + 15, this.x + 15, this.y + 20)
    }
    else {
        stroke(0);
        noFill();
        rect(this.x, this.y, this.w, this.w);
    }
    /* 
    When revealing a grid square, check if it is a mine, 
    otherwise show the number of neighbors.
    */
    if(this.revealed){
        totalRevealed += this.countRevealed();
        this.alreadyRevealed = true; // Set grid cell as revealed

        if (this.mine){
            fill(127);
            ellipse(xCenter, yCenter, this.w * 0.5);
            fill("Red");
            ellipse(xCenter, yCenter, this.w * 0.15);
        }
        else {
            fill(200);
            rect(this.x, this.y, this.w, this.w);
            if (this.neighborCount > 0) {
                textAlign(CENTER);
                fill("Blue");
                textSize(30);
                text(this.neighborCount, xCenter, this.y +this.w - 10);
            }
        }

    }
}

/*
Function used to determine if a mouse press event is within a cell.
Takes in two arguments, the mouse x position and the mouse y position.
*/
Cell.prototype.contains = function(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w)
}

/* 
Function used to reveal the contents of a cell after selection.
This function takes in which mouse button is pressed. If button is
a Right mouse click, it will flag the square. Otherwise, it will
reveal the contents beneath.
*/
Cell.prototype.reveal = function(mouseEvent) {
    // If user right clicks, set flagged to true.
    if (mouseEvent === RIGHT) {
        // If the grid is unflagged, flag it
        if (!this.flagged){
            this.flagged = true;
            console.log(this.flagged);
        }
        // If grid is flagged, unflag
        else {
            this.flagged = false;
            console.log(this.flagged);
        }
    }
    // Otherwise, reveal neighbors
    else {
        this.revealed = true;
        if (this.neighborCount == 0) {
            // flood fill algorithm:
            this.floodFill();
        }
    }
}

/*
Function used to reveal multiple cells when the cells have no
neighboring mines. This recursively calls itself via reveal function.

*/
Cell.prototype.floodFill = function() {
    // For each cell (left, middle, right)
    for (var xOff = -1; xOff <= 1; xOff++) {
        // For each cell (top, middle, bottom)
        for (var yOff = -1; yOff <= 1; yOff++) {
            // Applies the above offset to the column and row index
            var i = this.columnIndex + xOff;
            var j = this.rowIndex + yOff;
            // If neighbor in current index, store neighbor in grid.
            if (i > -1 && i < cols && j > -1 && j < rows){
                var neighbor = grid[i][j];
                // If neighbor is not a mine and not revealed, reveal neighbor. 
                if (!neighbor.mine && !neighbor.revealed) {
                    neighbor.reveal();
                }
            }
        }
    }
}


//Function used to calculate the number of mines neighboring the selected cell.
Cell.prototype.countMines = function() {
    // If the grid is a mine, set neighbor count to -1.
    if (this.mine) {
        this.neighborCount = -1;
        return;
    }
    // Initialize total mines to 0.
    var total = 0;

    // For each grid surrounding the selected index.
    // Increment the number of surrounding mines.
    for (var xOff = -1; xOff <= 1; xOff++) {
        for (var yOff = -1; yOff <= 1; yOff++) {
            var i = this.columnIndex + xOff;
            var j = this.rowIndex + yOff;
            if (i > -1 && i < cols && j > -1 && j < rows){
                var neighbor = grid[i][j];
                if (neighbor.mine) {
                    total++;
                }
            }
           
        }
    }
    // console.log(total);
    // set the total neighboring mines to neighborCount
    this.neighborCount = total;
}


Cell.prototype.countRevealed = function() {
    if (this.revealed && !this.mine && !this.alreadyRevealed) {
        return 1;
    }
    else {
        return 0;
    }
}