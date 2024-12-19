

// Load the image.
// function preload() {
  
// }

class Block {
  constructor(i, j, size) {
    this.i = i; // Block center x intercept
    this.j = j; // Block center y intercept
    this.size = size; // Block size
    this.g = 0;
    this.h = 0;
    this.f = 0;
    this.neighbors = [];
    this.cameFrom = null;
    this.wall = false;

    if (random(1) < 0.2) {
      this.wall = true;
    }
  }
  display(col) {
    fill(col);
    noStroke();
    rect(
      this.i * this.size + this.size / 2,
      this.j * this.size + this.size / 2,
      this.size
    );
    if (this.wall) {
      image(img, this.i * this.size, this.j * this.size, this.size, this.size);
    }
  }
  addNeighbors(grid, rows, cols) {
    const i = this.i; // represents x axis
    const j = this.j; // represents y axis
    if (i < cols - 1) {
      this.neighbors.push(grid[i + 1][j]);
    }
    if (i > 0) {
      this.neighbors.push(grid[i - 1][j]);
    }
    if (j < rows - 1) {
      this.neighbors.push(grid[i][j + 1]);
    }
    if (j > 0) {
      this.neighbors.push(grid[i][j - 1]);
    }
    if (i < cols - 1 && j < rows - 1) {
      this.neighbors.push(grid[i + 1][j + 1]);
    }
    if (i < cols - 1 && j > 0) {
      this.neighbors.push(grid[i + 1][j - 1]);
    }
    if (i > 0 && j > 0) {
      this.neighbors.push(grid[i - 1][j - 1]);
    }
    if (i > 0 && j < rows - 1) {
      this.neighbors.push(grid[i - 1][j + 1]);
    }
  }
}
