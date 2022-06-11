// Cell class

function Cell(columnIndex, rowIndex, w) {
    this.columnIndex = columnIndex;
    this.rowIndex = rowIndex;
    this.x = columnIndex * w;
    this.y = rowIndex * w;
    this.w = w;
    this.neighborCount = 0;

    this.mine = false;
    this.revealed = false;
}


Cell.prototype.show = function() {
    stroke(0);
    noFill();
    rect(this.x, this.y, this.w, this.w);
    let xCenter = this.x + (this.w / 2);
    let yCenter = this.y + (this.w / 2);
    if(this.revealed){
        if (this.mine){
            fill(127);
            ellipse(xCenter, yCenter, this.w * 0.5);
        }
        else {
            fill(200);
            rect(this.x, this.y, this.w, this.w);
            if (this.neighborCount > 0) {
                textAlign(CENTER);
                fill(("Red"));
                textSize(30);
                text(this.neighborCount, xCenter, this.y +this.w - 10);
            }
        }
    }
}


Cell.prototype.contains = function(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w)
}


Cell.prototype.reveal = function() {
    this.revealed = true;
    if (this.neighborCount == 0) {
        // flood fill algorithm:
        this.floodFill();
    }
}


Cell.prototype.floodFill = function() {
    for (var xOff = -1; xOff <= 1; xOff++) {
        for (var yOff = -1; yOff <= 1; yOff++) {
            var i = this.columnIndex + xOff;
            var j = this.rowIndex + yOff;
            if (i > -1 && i < cols && j > -1 && j < rows){
                var neighbor = grid[i][j];
                if (!neighbor.mine && !neighbor.revealed) {
                    neighbor.reveal();
                }
            }
        }
    }
}


Cell.prototype.countMines = function() {
    if (this.mine) {
        this.neighborCount = -1;
        return;
    }
    var total = 0;

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
    this.neighborCount = total;
}