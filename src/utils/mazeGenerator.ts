import { Maze, Cell, Position } from '../types';

export class MazeGenerator {
  private width: number;
  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  private createEmptyGrid(): Cell[][] {
    const grid: Cell[][] = [];
    for (let y = 0; y < this.height; y++) {
      grid[y] = [];
      for (let x = 0; x < this.width; x++) {
        grid[y][x] = {
          x,
          y,
          isWall: true,
          isVisited: false,
          isPath: false,
          isStart: false,
          isEnd: false,
        };
      }
    }
    return grid;
  }

  private getNeighbors(cell: Cell, grid: Cell[][]): Cell[] {
    const neighbors: Cell[] = [];
    const { x, y } = cell;

    // Check all 4 directions (up, right, down, left)
    const directions = [
      { dx: 0, dy: -2 }, // up
      { dx: 2, dy: 0 },  // right
      { dx: 0, dy: 2 },  // down
      { dx: -2, dy: 0 }  // left
    ];

    for (const dir of directions) {
      const newX = x + dir.dx;
      const newY = y + dir.dy;

      if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {
        neighbors.push(grid[newY][newX]);
      }
    }

    return neighbors;
  }

  private removeWallBetween(cell1: Cell, cell2: Cell, grid: Cell[][]): void {
    const wallX = (cell1.x + cell2.x) / 2;
    const wallY = (cell1.y + cell2.y) / 2;
    
    if (wallX >= 0 && wallX < this.width && wallY >= 0 && wallY < this.height) {
      grid[wallY][wallX].isWall = false;
      grid[wallY][wallX].isPath = true;
    }
  }

  public generateMaze(level: number): Maze {
    // Increase maze size with level (but keep it reasonable)
    const baseSize = 11;
    const sizeIncrease = Math.min(level - 1, 10) * 2;
    const mazeSize = baseSize + sizeIncrease;
    
    this.width = mazeSize;
    this.height = mazeSize;

    const grid = this.createEmptyGrid();
    const stack: Cell[] = [];
    
    // Start from position (1, 1) to ensure odd coordinates
    const startCell = grid[1][1];
    startCell.isWall = false;
    startCell.isPath = true;
    startCell.isStart = true;
    startCell.isVisited = true;
    
    stack.push(startCell);

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = this.getNeighbors(current, grid).filter(n => !n.isVisited);

      if (neighbors.length > 0) {
        // Choose random neighbor
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        
        // Remove wall between current and chosen neighbor
        this.removeWallBetween(current, randomNeighbor, grid);
        
        // Mark neighbor as visited and add to stack
        randomNeighbor.isWall = false;
        randomNeighbor.isPath = true;
        randomNeighbor.isVisited = true;
        stack.push(randomNeighbor);
      } else {
        // Backtrack
        stack.pop();
      }
    }

    // Set end position (bottom-right corner, ensuring it's a path)
    let endX = this.width - 2;
    let endY = this.height - 2;
    
    // Make sure end position is a path
    grid[endY][endX].isWall = false;
    grid[endY][endX].isPath = true;
    grid[endY][endX].isEnd = true;

    // Create some additional paths for complexity
    this.addRandomPaths(grid, level);

    return {
      cells: grid,
      width: this.width,
      height: this.height,
      start: { x: 1, y: 1 },
      end: { x: endX, y: endY }
    };
  }

  private addRandomPaths(grid: Cell[][], level: number): void {
    const pathsToAdd = Math.min(level * 2, 10);
    
    for (let i = 0; i < pathsToAdd; i++) {
      const x = Math.floor(Math.random() * (this.width - 2)) + 1;
      const y = Math.floor(Math.random() * (this.height - 2)) + 1;
      
      if (grid[y][x].isWall) {
        // Check if creating this path would connect existing paths
        const hasPathNeighbor = this.hasPathNeighbor(x, y, grid);
        if (hasPathNeighbor) {
          grid[y][x].isWall = false;
          grid[y][x].isPath = true;
        }
      }
    }
  }

  private hasPathNeighbor(x: number, y: number, grid: Cell[][]): boolean {
    const directions = [
      { dx: 0, dy: -1 }, // up
      { dx: 1, dy: 0 },  // right
      { dx: 0, dy: 1 },  // down
      { dx: -1, dy: 0 }  // left
    ];

    for (const dir of directions) {
      const newX = x + dir.dx;
      const newY = y + dir.dy;

      if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height) {
        if (grid[newY][newX].isPath) {
          return true;
        }
      }
    }

    return false;
  }
}

// Pathfinding algorithm to ensure maze is solvable
export function findPath(maze: Maze, start: Position, end: Position): Position[] | null {
  const { cells, width, height } = maze;
  const visited = new Set<string>();
  const queue: { pos: Position; path: Position[] }[] = [];
  
  queue.push({ pos: start, path: [start] });
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;

    if (pos.x === end.x && pos.y === end.y) {
      return path;
    }

    const directions = [
      { dx: 0, dy: -1 }, // up
      { dx: 1, dy: 0 },  // right
      { dx: 0, dy: 1 },  // down
      { dx: -1, dy: 0 }  // left
    ];

    for (const dir of directions) {
      const newX = pos.x + dir.dx;
      const newY = pos.y + dir.dy;
      const key = `${newX},${newY}`;

      if (
        newX >= 0 && newX < width &&
        newY >= 0 && newY < height &&
        !visited.has(key) &&
        !cells[newY][newX].isWall
      ) {
        visited.add(key);
        queue.push({
          pos: { x: newX, y: newY },
          path: [...path, { x: newX, y: newY }]
        });
      }
    }
  }

  return null; // No path found
}
