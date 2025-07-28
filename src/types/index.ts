export interface Position {
  x: number;
  y: number;
}

export interface Cell {
  x: number;
  y: number;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  isStart: boolean;
  isEnd: boolean;
}

export interface Maze {
  cells: Cell[][];
  width: number;
  height: number;
  start: Position;
  end: Position;
}

export interface GameState {
  playerPosition: Position;
  maze: Maze | null;
  level: number;
  score: number;
  tokens: number;
  isCompleted: boolean;
  timeStarted: number;
  bestTimes: Record<number, number>;
}

export interface LeaderboardEntry {
  address: string;
  level: number;
  time: number;
  tokens: number;
  timestamp: number;
}
