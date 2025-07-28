import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../contexts/GameContext';
import { useWallet } from '../contexts/WalletContext';

interface Position {
  x: number;
  y: number;
}

interface MazeGameProps {
  onBack: () => void;
}

// Simple maze generation function
const generateSimpleMaze = (width: number, height: number): number[][] => {
  const maze: number[][] = [];
  
  // Initialize with all walls
  for (let y = 0; y < height; y++) {
    maze[y] = [];
    for (let x = 0; x < width; x++) {
      maze[y][x] = 1; // Wall
    }
  }
  
  // Create paths using recursive backtracking
  const stack: Position[] = [];
  const visited = new Set<string>();
  
  const start = { x: 1, y: 1 };
  maze[start.y][start.x] = 0; // Path
  visited.add(`${start.x},${start.y}`);
  stack.push(start);
  
  const directions = [
    { x: 0, y: -2 }, // Up
    { x: 2, y: 0 },  // Right
    { x: 0, y: 2 },  // Down
    { x: -2, y: 0 }  // Left
  ];
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors: Position[] = [];
    
    for (const dir of directions) {
      const nx = current.x + dir.x;
      const ny = current.y + dir.y;
      
      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && 
          !visited.has(`${nx},${ny}`)) {
        neighbors.push({ x: nx, y: ny });
      }
    }
    
    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      const wallX = current.x + (next.x - current.x) / 2;
      const wallY = current.y + (next.y - current.y) / 2;
      
      maze[next.y][next.x] = 0; // Path
      maze[wallY][wallX] = 0; // Remove wall between
      
      visited.add(`${next.x},${next.y}`);
      stack.push(next);
    } else {
      stack.pop();
    }
  }
  
  // Ensure exit is accessible
  maze[height - 2][width - 2] = 0;
  
  return maze;
};

export default function MazeGame({ onBack }: MazeGameProps) {
  const { gameState, claimRewards, addGameSession, gameSessions, getMaxCompletedLevel } = useGame();
  const { isConnected } = useWallet();
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 1, y: 1 });
  const [maze, setMaze] = useState<number[][]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [gameTime, setGameTime] = useState<number>(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [showRewards, setShowRewards] = useState(false);
  const [earnedTokens, setEarnedTokens] = useState(0);
  const [canClaimReward, setCanClaimReward] = useState(false);
  const [showLevelSelection, setShowLevelSelection] = useState(true);

  // Calculate total tokens earned from maze games
  const mazeTokensEarned = gameSessions
    .filter(session => session.gameType === 'maze')
    .reduce((total, session) => total + session.tokensEarned, 0);

  // Count completed maze levels
  const completedMazeLevels = gameSessions
    .filter(session => session.gameType === 'maze')
    .length;

  console.log('Maze game sessions:', gameSessions.filter(session => session.gameType === 'maze'));
  console.log('Total maze tokens earned:', mazeTokensEarned);
  console.log('Completed maze levels:', completedMazeLevels);

  const currentLevel = selectedLevel;
  const maxCompletedLevel = getMaxCompletedLevel('maze'); // Get highest completed maze level
  const mazeSize = Math.min(11 + currentLevel * 2, 21); // Increase maze size with level, max 21 for better visibility

  console.log('MazeGame render:', { gameState, currentLevel, mazeSize, maze: maze.length });

  // Initialize maze when level changes
  useEffect(() => {
    if (!showLevelSelection) {
      console.log('Generating maze for level:', currentLevel, 'size:', mazeSize);
      try {
        const newMaze = generateSimpleMaze(mazeSize, mazeSize);
        console.log('Generated maze:', newMaze.length, 'x', newMaze[0]?.length);
        setMaze(newMaze);
        setPlayerPosition({ x: 1, y: 1 });
        setStartTime(Date.now());
        setGameTime(0);
        setIsGameComplete(false);
        setShowRewards(false);
        setCanClaimReward(false);
      } catch (error) {
        console.error('Error generating maze:', error);
        // Fallback simple maze
        const fallbackMaze = Array(15).fill(null).map((_, y) => 
          Array(15).fill(null).map((_, x) => 
            (x === 0 || y === 0 || x === 14 || y === 14 || (x % 2 === 0 && y % 2 === 0)) ? 1 : 0
          )
        );
        setMaze(fallbackMaze);
      }
    }
  }, [currentLevel, mazeSize, showLevelSelection]);

  // Game timer
  useEffect(() => {
    if (!isGameComplete) {
      const timer = setInterval(() => {
        setGameTime(Date.now() - startTime);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [startTime, isGameComplete]);

  const completeLevel = useCallback(() => {
    setIsGameComplete(true);
    
    // Calculate rewards: base 10K + 5K per level + time bonus up to 60K
    const baseReward = 10000;
    const levelBonus = currentLevel * 5000;
    const timeBonus = Math.max(0, 60000 - Math.floor(gameTime / 1000) * 1000);
    const totalTokens = baseReward + levelBonus + timeBonus;
    
    setEarnedTokens(totalTokens);
    setCanClaimReward(true);
    setShowRewards(true);

    // Add game session
    if (addGameSession) {
      addGameSession({
        gameType: 'maze',
        score: totalTokens,
        tokensEarned: totalTokens,
        completedAt: Date.now(),
        difficulty: 'normal',
        level: currentLevel // Add level information
      });
    }
  }, [currentLevel, gameTime, addGameSession]);

  // Check for game completion
  useEffect(() => {
    if (maze.length > 0) {
      const endX = maze[0].length - 2;
      const endY = maze.length - 2;
      
      if (playerPosition.x === endX && playerPosition.y === endY && !isGameComplete) {
        completeLevel();
      }
    }
  }, [playerPosition, maze, isGameComplete, completeLevel]);

  const handleClaimRewards = async () => {
    if (!canClaimReward || !isConnected) return;
    
    try {
      claimRewards(); // Call without parameters
      setCanClaimReward(false);
      
      // Show success feedback
      setTimeout(() => {
        setShowRewards(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to claim rewards:', error);
    }
  };

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (isGameComplete) return;

    setPlayerPosition(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      
      // Check bounds and walls
      if (newX < 0 || newX >= maze[0]?.length || newY < 0 || newY >= maze.length) {
        return prev;
      }
      
      if (maze[newY]?.[newX] === 1) {
        return prev; // Wall collision
      }
      
      return { x: newX, y: newY };
    });
  }, [maze, isGameComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'a':
        case 'arrowleft':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'd':
        case 'arrowright':
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  const startLevel = (level: number) => {
    setSelectedLevel(level);
    setShowLevelSelection(false);
  };

  const backToLevelSelection = () => {
    setShowLevelSelection(true);
    setIsGameComplete(false);
    setShowRewards(false);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  // Level selection interface
  if (showLevelSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Elegant Back Button */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600/80 via-blue-600/80 to-cyan-600/80 backdrop-blur-sm hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40 shadow-2xl hover:shadow-purple-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center space-x-3">
                <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">←</span>
                <span>Back to Games</span>
              </span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-6 animate-pulse">🌌</div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4">
              Quantum Maze
            </h1>
            <p className="text-xl text-blue-200 mb-4">Choose Your Dimensional Level</p>
            <div className="text-cyan-300">
              {maxCompletedLevel === 0 
                ? "Start with Level 1" 
                : `Available Levels: 1 - ${maxCompletedLevel + 1}`}
            </div>
          </div>

          {/* Level Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {Array.from({ length: Math.min(Math.max(maxCompletedLevel + 1, 1), 10) }, (_, i) => {
              const level = i + 1;
              const isCompleted = level <= maxCompletedLevel;
              const isNext = level === maxCompletedLevel + 1;
              const isFirstLevel = level === 1; // Level 1 is always available
              const isAvailable = isCompleted || isNext || isFirstLevel;
              const baseReward = 10000 + (level * 5000);
              
              return (
                <button
                  key={level}
                  onClick={() => startLevel(level)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-400/50 hover:border-green-300 text-white'
                      : isNext || isFirstLevel
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-400/50 hover:border-blue-300 text-white'
                      : 'bg-gradient-to-br from-gray-500/10 to-gray-600/10 border-gray-500/30 text-gray-500 cursor-not-allowed'
                  } ${isAvailable ? 'hover:shadow-2xl shadow-lg' : ''}`}
                  disabled={!isAvailable}
                >
                  <div className="text-center space-y-3">
                    <div className={`text-4xl ${isCompleted ? 'animate-bounce' : (isNext || isFirstLevel) ? 'animate-pulse' : ''}`}>
                      {isCompleted ? '✅' : (isNext || isFirstLevel) ? '🔮' : '🔒'}
                    </div>
                    <div className="text-2xl font-bold">
                      Level {level}
                    </div>
                    <div className="text-sm opacity-80">
                      Size: {Math.min(11 + level * 2, 21)}×{Math.min(11 + level * 2, 21)}
                    </div>
                    <div className="text-xs text-green-300">
                      {baseReward.toLocaleString()} $LOGIQ
                    </div>
                    {isCompleted && (
                      <div className="text-xs text-green-400 font-semibold">
                        ⭐ Completed
                      </div>
                    )}
                    {(isNext || (isFirstLevel && !isCompleted)) && (
                      <div className="text-xs text-blue-400 font-semibold">
                        🚀 Available
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-white/60 text-sm">Completed Levels</div>
                <div className="text-2xl font-bold text-white">{completedMazeLevels}</div>
              </div>
              <div>
                <div className="text-3xl mb-2">🌟</div>
                <div className="text-white/60 text-sm">Maze Tokens Earned</div>
                <div className="text-2xl font-bold text-green-400">{mazeTokensEarned.toLocaleString()} $LOGIQ</div>
              </div>
              <div>
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-white/60 text-sm">Total Score</div>
                <div className="text-2xl font-bold text-cyan-400">{gameState.score.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const restartLevel = () => {
    const newMaze = generateSimpleMaze(mazeSize, mazeSize);
    setMaze(newMaze);
    setPlayerPosition({ x: 1, y: 1 });
    setStartTime(Date.now());
    setGameTime(0);
    setIsGameComplete(false);
    setShowRewards(false);
    setCanClaimReward(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Elegant Back Button */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={backToLevelSelection}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600/80 via-blue-600/80 to-cyan-600/80 backdrop-blur-sm hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40 shadow-2xl hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center space-x-3">
              <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">←</span>
              <span className="hidden sm:inline">Level Selection</span>
              <span className="sm:hidden">Levels</span>
            </span>
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Quantum Maze
            </h1>
            <p className="text-blue-200 text-sm md:text-base">Level {currentLevel}</p>
          </div>
          
          <div className="text-right">
            <div className="text-white text-lg font-semibold">Level {currentLevel}</div>
            <div className="text-blue-200 text-sm">{formatTime(gameTime)}</div>
          </div>
        </div>

        {/* Game HUD */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Level</div>
              <div className="text-white text-xl font-bold">{currentLevel}</div>
            </div>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Time</div>
              <div className="text-white text-xl font-bold">{formatTime(gameTime)}</div>
            </div>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Maze Completed</div>
              <div className="text-cyan-400 text-xl font-bold">{completedMazeLevels}</div>
            </div>
            <div>
              <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Maze Tokens</div>
              <div className="text-green-400 text-xl font-bold">{mazeTokensEarned.toLocaleString()} $LOGIQ</div>
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-6">
          {maze.length > 0 ? (
            <div className="flex justify-center overflow-auto">
              <div 
                className="inline-grid gap-1 bg-gray-900 p-4 rounded-xl border-2 border-gray-700 shadow-2xl"
                style={{
                  gridTemplateColumns: `repeat(${maze[0]?.length || 0}, minmax(20px, 24px))`,
                  gridTemplateRows: `repeat(${maze.length || 0}, minmax(20px, 24px))`
                }}
              >
                {maze.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-200 ${
                        playerPosition.x === x && playerPosition.y === y
                          ? 'bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse scale-110 z-10 relative border-2 border-cyan-200'
                          : x === maze[0].length - 2 && y === maze.length - 2
                          ? 'bg-red-500 rounded-full shadow-lg shadow-red-500/50 animate-pulse border-2 border-red-300'
                          : cell === 1
                          ? 'bg-gray-800 border border-gray-600 rounded-sm'
                          : 'bg-white border border-gray-300 rounded-sm'
                      }`}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-white py-8">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              Generating maze...
            </div>
          )}
          
          {/* Game Legend */}
          <div className="mt-6 bg-black/20 rounded-lg p-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                <span className="text-white/80">Player</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></div>
                <span className="text-white/80">Exit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-800 border border-gray-600 rounded-sm"></div>
                <span className="text-white/80">Wall</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-gray-300 rounded-sm"></div>
                <span className="text-white/80">Path</span>
              </div>
            </div>
          </div>
          
          {/* Controls hint */}
          <div className="mt-4 text-center text-white/70 text-sm">
            Use WASD or Arrow Keys to move • Reach the red exit to complete the level
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6 md:hidden">
          <div></div>
          <button
            onClick={() => movePlayer(0, -1)}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
          >
            ↑
          </button>
          <div></div>
          
          <button
            onClick={() => movePlayer(-1, 0)}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
          >
            ←
          </button>
          <button
            onClick={restartLevel}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 text-xs"
          >
            Reset
          </button>
          <button
            onClick={() => movePlayer(1, 0)}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
          >
            →
          </button>
          
          <div></div>
          <button
            onClick={() => movePlayer(0, 1)}
            className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center"
          >
            ↓
          </button>
          <div></div>
        </div>

        {/* Completion Modal */}
        {showRewards && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-green-400 to-blue-500 p-8 rounded-xl max-w-md w-full text-center transform animate-pulse">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Level {currentLevel} Complete!
              </h2>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
                <div className="text-white/80 text-sm mb-2">Completion Time</div>
                <div className="text-white text-xl font-bold mb-4">{formatTime(gameTime)}</div>
                
                <div className="space-y-2 text-sm text-white/90">
                  <div className="flex justify-between">
                    <span>Base Reward:</span>
                    <span>+{(10000).toLocaleString()} $LOGIQ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level Bonus:</span>
                    <span>+{(currentLevel * 5000).toLocaleString()} $LOGIQ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Bonus:</span>
                    <span>+{Math.max(0, 60000 - Math.floor(gameTime / 1000) * 1000).toLocaleString()} $LOGIQ</span>
                  </div>
                  <div className="border-t border-white/30 pt-2 flex justify-between font-bold">
                    <span>This Level:</span>
                    <span>+{earnedTokens.toLocaleString()} $LOGIQ</span>
                  </div>
                  <div className="flex justify-between text-cyan-300 font-semibold">
                    <span>Total Maze Tokens:</span>
                    <span>{(mazeTokensEarned + earnedTokens).toLocaleString()} $LOGIQ</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {isConnected && canClaimReward && (
                  <button
                    onClick={handleClaimRewards}
                    className="w-full py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 transition-colors"
                  >
                    Claim {earnedTokens.toLocaleString()} $LOGIQ
                  </button>
                )}
                
                {!isConnected && (
                  <div className="text-white/80 text-sm p-3 bg-orange-500/20 rounded-lg border border-orange-400/30">
                    Connect wallet to claim rewards
                  </div>
                )}
                
                <button
                  onClick={() => {
                    setShowRewards(false);
                    if (currentLevel < 10) {
                      startLevel(currentLevel + 1);
                    } else {
                      backToLevelSelection();
                    }
                  }}
                  className="w-full py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors"
                >
                  {currentLevel < 10 ? `Continue to Level ${currentLevel + 1}` : 'Back to Level Selection'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
