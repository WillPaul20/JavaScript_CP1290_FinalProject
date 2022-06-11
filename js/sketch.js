// Function that generates a 2D array.
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

// Runs at startup of web page to create the grid and set the mines
function setup() {

    document.getElementById("restartBtn").classList.toggle("hide");

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

// When the used selects a mine, reveal all mines and display game over
function gameOver() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].revealed = true;
        }
    }
    document.getElementById("restartBtn").classList.toggle("hide");
}

// If user clicks mouse on a cell, reveal it's contents.
function mousePressed(){
    if (mouseButton === LEFT) {
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
    else if (mouseButton === CENTER) {
        console.log("Middle Click")
    }
}

// Loops infinitely after setup is run, draws the background and grid for the game
function draw(){
    background(255);
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }
}

// Create a button to allow user to restart the game after losing.
document.getElementById("restartBtn").onclick = function() {
    setup();
}