const restrictedAreas = [
  { name: 'airport', minI: 14, maxI: 33, minJ: 18, maxJ: 37 },
  { name: 'noFlyZone1', minI: 98, maxI: 112, minJ: 10, maxJ: 24 },
  { name: 'noFlyZone2', minI: 85, maxI: 99, minJ: 40, maxJ: 54 },
  { name: 'building1', minI: 55, maxI: 60, minJ: 5, maxJ: 14 },
  { name: 'building2', minI: 63, maxI: 68, minJ: 5, maxJ: 14 },
  { name: 'building3', minI: 71, maxI: 76, minJ: 5, maxJ: 14 },
  { name: 'building4', minI: 71, maxI: 76, minJ: 20, maxJ: 29 },
  { name: 'building5', minI: 80, maxI: 85, minJ: 20, maxJ: 29 },
  { name: 'building6', minI: 89, maxI: 94, minJ: 20, maxJ: 29 },
  { name: 'building7', minI: 65, maxI: 70, minJ: 32, maxJ: 41 },
  { name: 'building8', minI: 118, maxI: 123, minJ: 2, maxJ: 11 },
  { name: 'building9', minI: 128, maxI: 133, minJ: 2, maxJ: 11 },
  { name: 'building10', minI: 138, maxI: 143, minJ: 2, maxJ: 11 },
  { name: 'building11', minI: 24, maxI: 29, minJ: 55, maxJ: 64 },
  { name: 'building12', minI: 35, maxI: 40, minJ: 55, maxJ: 64 },
  { name: 'building13', minI: 66, maxI: 71, minJ: 54, maxJ: 63 },
  { name: 'building14', minI: 108, maxI: 113, minJ: 44, maxJ: 53 },
  { name: 'building15', minI: 119, maxI: 124, minJ: 44, maxJ: 53 },
  { name: 'building16', minI: 130, maxI: 135, minJ: 44, maxJ: 53 },
];

const isWall = (i, j) => {
  return restrictedAreas.some(area => 
    i >= area.minI && i <= area.maxI && 
    j >= area.minJ && j <= area.maxJ
  );
};

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

    if(isWall(i, j)){
      this.wall = true;
    }
    // if (random(1) < 0.2) {
    //   this.wall = true;
    // }
  }
  display(col) {
    // fill(col);
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
