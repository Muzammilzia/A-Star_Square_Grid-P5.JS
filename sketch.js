let droneImg;
let img;
let map;
// Load the image.
function preload() {
  droneImg = loadImage("/delivery-drone.webp");
  img = loadImage("/building.webp");
  map = loadImage("/map.png")
}

let grid = [];

// colors
const Grid_Boxes_Color = "#FAFAFA";
const Open_Set_Color = "#2196F3";
const Closed_Set_Color = "#F44336";
const Path_Color = "#4CAF50";
const Source_Node_Color = "Orange";
const Target_Node_Color = "Yellow";

w = 1500;
h = 700;
const gridWidth = w;
const gridHeight = h;
const blockSize = 10;
const rows = gridHeight / blockSize;
const columns = gridWidth / blockSize;

let openSet = [];
let closedSet = [];
// let path = []
let source;
let target;
let current;

let solutionFound = true;

function heuristic(a, b) {
  return (abs(a.i - b.i) + abs(a.j - b.j)) * 10;
}

function setup() {
  createCanvas(w, h);
  frameRate(30);
  rectMode(CENTER);
  for (let i = 0; i < columns; i++) {
    const column = [];
    for (let j = 0; j < rows; j++) {
      column.push(new Block(i, j, blockSize));
    }
    grid.push(column);
  }
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid, rows, columns);
    }
  }

  let resetButton = createButton("reset");
  let autoSelectSourceAndTargetButton = createButton(
    "Auto Select Source and Target"
  );
  resetButton.position(24, 630);
  resetButton.mousePressed(resetSketch);
  autoSelectSourceAndTargetButton.position(120, 630);
  autoSelectSourceAndTargetButton.mousePressed(autoSelectSourceAndTarget);
}

function draw() {
  if (source && target) {
    if (openSet.length > 0) {
      // still searching...
      let winnerIndex = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winnerIndex].f) {
          winnerIndex = i;
        }
      }

      current = openSet[winnerIndex];

      if (current === target) {
        // found
        console.log("DONE");
        noLoop();
      }

      openSet.splice(winnerIndex, 1);
      closedSet.push(current);

      const neighbors = current.neighbors;

      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];

        if (!closedSet.includes(neighbor) && !neighbor.wall) {
          let nextG
          if (current.i === neighbor.i || current.j === neighbor.j) {
            nextG = current.g + 10;
          } else {
            nextG = current.g + 14;
          }

          if (openSet.includes(neighbor)) {
            if (nextG < neighbor.g) {
              neighbor.g = nextG;
              neighbor.cameFrom = current;
            }
          } else {
            neighbor.g = nextG;
            neighbor.cameFrom = current;
            openSet.push(neighbor);
          }

          neighbor.h = heuristic(neighbor, target);
          neighbor.f = neighbor.g + neighbor.h;
        }
      }
    } else {
      // no possible path
      console.log("SOLUTION NOT POSSIBLE");
      prompt("SOLUTION NOT POSSIBLE");
      noLoop();
    }
  }

  image(map, 0, 0, w, h)

  noFill()
  // display the grid
  // for (let i = 0; i < columns; i++) {
  //   for (let j = 0; j < rows; j++) {
  //     grid[i][j].display(color(Grid_Boxes_Color));
  //   }
  // }

  // display the openSet
  // for (let i = 0; i < openSet.length; i++) {
  //   openSet[i].display(color(Open_Set_Color));
  // }

  // display the closedList
  // for (let i = 0; i < closedSet.length; i++) {
  //   closedSet[i].display(color(Closed_Set_Color));
  // }

  const path = [];
  if (source && target && current) {
    let temp = current;
    path.push(temp);
    while (temp && temp.cameFrom) {
      path.push(temp.cameFrom);
      temp = temp.cameFrom;
    }
  }

  // add icons
  textAlign(CENTER, CENTER);
  textSize(blockSize / 2); // Adjust size as needed
  fill(0); // Text color

  if(source){
    source.display(color(Grid_Boxes_Color));
  }
  if (target) {
    target.display(color(Grid_Boxes_Color));

    text(
      "🎯",
      target.i * blockSize + blockSize / 2,
      target.j * blockSize + blockSize / 2
    );
  }

  // display the path
  for (let k = 0; k < path.length; k++) {
    // path[k].display(color(Path_Color));
    stroke("magenta");
    strokeWeight(4);

    if (k === 0) {
      image(
        droneImg,
        path[k].i * blockSize,
        path[k].j * blockSize,
        blockSize,
        blockSize
      );
    }
    if (k > 0) {
      line(
        path[k - 1].i * blockSize + blockSize / 2,
        path[k - 1].j * blockSize + blockSize / 2,
        path[k].i * blockSize + blockSize / 2,
        path[k].j * blockSize + blockSize / 2
      );
    }
  }

  if (source) {
    text(
      "🚩",
      source.i * blockSize + blockSize / 2,
      source.j * blockSize + blockSize / 2
    );
  }
}

function resetSketch() {
  openSet = [];
  closedSet = [];
  grid = [];
  source = undefined;
  target = undefined;
  setup();
  loop();
}

function mousePressed() {
  console.log(Math.floor(mouseX / blockSize), Math.floor(mouseY / blockSize));
  if(isWall(Math.floor(mouseX / blockSize), Math.floor(mouseY / blockSize))){
    prompt("Restricted areas can not be selected as source or destination.")
    return
  }
  if (
    Math.floor(mouseY / blockSize) < 0 ||
    Math.floor(mouseX / blockSize) < 0
  ) {
    // cliked outside
    return;
  }
  let newI = Math.floor(mouseX / blockSize);
  let newJ = Math.floor(mouseY / blockSize);

  if (!source) {
    source = grid[newI][newJ];
  } else {
    target = grid[newI][newJ];
  }

  openSet = [];
  closedSet = [];
  openSet.push(source);
  loop();
}

function autoSelectSourceAndTarget() {
  resetSketch();
  do {
    source = grid[floor(random(columns))][floor(random(rows))];
    target = grid[floor(random(columns))][floor(random(rows))];
  } while ((source === target) || isWall(source.i, source.j) || isWall(target.i, target.j));

  console.log(source, target);
  //   source = grid[0][0];
  //   target = grid[columns - 1][rows - 1];

  source.wall = false;
  target.wall = false;

  openSet.push(source);
  loop();
}
