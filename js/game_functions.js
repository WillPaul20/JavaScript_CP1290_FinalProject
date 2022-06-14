// Initialize required variables.
var grid;
var cols;
var rows;
var winStatus = true;
var w = 40; // w = width of each grid
var totalMines = 10;
var totalRevealed = 0;


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

// If user clicks mouse on a cell, reveal it's contents.
function mousePressed(){
    for (var i = 0; i < cols; i++){
        for (var j = 0; j < rows; j++) {
            if (grid[i][j].contains(mouseX, mouseY)) {
                grid[i][j].reveal(mouseButton);
                
                if (grid[i][j].mine && mouseButton != RIGHT) {
                    winStatus = false;
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
    // If player lost the game, display game over message
    if (!winStatus) {
        document.getElementById("game-over-message").classList.remove("hide");
    }
    // Otherwise, they won the game!
    else {
        document.getElementById("game-win-message").classList.remove("hide");
    }
    // Display restart button when game is over if they win or lose.
    document.getElementById("restart-button-container").classList.remove("hide");
}


// This function will be called to reset the game state after user selects "play again"
function resetGame() {
    totalRevealed = 0;
    winStatus = true;
    document.getElementById("restart-button-container").classList.add("hide");
    document.getElementById("game-over-message").classList.add("hide");
    document.getElementById("game-win-message").classList.add("hide");
    setup(); // Redraw the game.
}

/*
Function which will set number of bombs in game based on difficulty.
Easy = 5, Moderate = 10, Difficult = 20
Then will redraw game with new number of mines.
*/
function difficultyButton(difficulty) {
    totalMines = difficulty;
    setup(); // Redraw the game.
}

// Runs at startup of web page to create the grid and set the mines
// P5JS Function (Required)
function setup() {
    console.log(`Total Mines: ${totalMines}`);
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
    if (totalRevealed == (100 - totalMines) && winStatus) {
        gameOver();
    }
    else if (!winStatus) {
        gameOver();
    }
    // console.log(totalRevealed);
}