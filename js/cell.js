// Cell class

function Cell(i, j, w) {
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w;
    this.neighborCount = 0;
  
    this.bee = false;
    this.revealed = false;
  }

Cell.prototype.show = function() {
    rect(this.x, this.y, this.w, this.w)
}