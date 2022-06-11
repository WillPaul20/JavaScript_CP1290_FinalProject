/*
This function makes an array of columns 
and stores the number of rows within.
It then returns the array.
*/
function make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

// Initialize required variables.
var grid;
var cols;
var rows;
var winStatus = false;
// w = width of each grid
var w = 40;
// Total number of mines determined by user difficulty selection,
var totalMines = 10;

// Runs at startup of web page to create the grid and set the mines
// P5JS Function (Required)
function setup() {
    // Hide restart button from load.
    document.getElementById("restart-button-container").classList.toggle("hide");

    // Draw the canvas
    var cnv = createCanvas(401, 401);
    cnv.parent("canvas-div");
    // Calculate the number of columns and rows
    cols = floor(width / w);
    rows = floor(height / w);
    // Make the grid using the make2DArray function
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

    /*
    Place the mines randomly throughout the grid and using
    splice to ensure that the chosen index for the mine cannot be
    used again.
    */
    for (var numMines = 0; numMines < totalMines; numMines++){
        var index = floor(random(options.length));
        var choice = options[index];
        var i = choice[0];
        var j = choice[1];
        // Deletes spot so it is no longer an option
        options.splice(index, 1);
        grid[i][j].mine = true;
    }

    // Count the number of neighbors for all mines on the grid.
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].countMines();
        }
    }
}

// Loops infinitely after setup is run, draws the background and grid for the game
// P5JS function (Required)
function draw(){
    background(255);
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }
}

// If user clicks mouse on a cell, reveal it's contents.
function mousePressed(){
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) {
                grid[i][j].reveal(mouseButton);

                if (grid[i][j].mine && mouseButton != RIGHT) {
                    gameOver();
                }
            }
        }
    }
}

// When the used selects a mine, reveal all mines and display game over
function gameOver() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].revealed = true;
            grid[i][j].flagged = false;
        }
    }
    // Display restart button when game is over.
    document.getElementById("restart-button-container").classList.toggle("hide");
}

function gameWin() {
    gameOver();
}

// Create a button to allow user to restart the game after losing.
document.getElementById("restartBtn").onclick = function() {
    setup();
}