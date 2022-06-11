function make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

var grid;
var cols;
var rows;
var w = 40;
var totalMines = 10;

function setup() {

    var cnv = createCanvas(401, 401);
    var x = 20;
    var y = 75;
    cnv.parent("canvas-div");

    cols = floor(width / w);
    rows = floor(height / w);
    grid = make2DArray(cols, rows);
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j, w);
        }
    }

    // Pick totalMines Spots
    var options = [];
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++) {
            options.push([i, j]);
        }
    }


    for (var numMines = 0; numMines < totalMines; numMines++){
        var index = floor(random(options.length));
        var choice = options[index];
        var i = choice[0];
        var j = choice[1];
        // Deletes spot so it is no longer an option
        options.splice(index, 1);
        grid[i][j].mine = true;
    }


    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].countMines();
        }
    }
}

function gameOver() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].revealed = true;
        }
    }
}

function mousePressed(){
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) {
                grid[i][j].reveal();

                if (grid[i][j].mine) {
                    gameOver();
                }
            }
        }
    }
}

function draw(){
    // Loops infinitely after setup is run
    background(255);
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }
}