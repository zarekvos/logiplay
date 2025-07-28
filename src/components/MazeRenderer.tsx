import React, { useMemo } from 'react';
import { Maze, Position } from '../types';

interface MazeRendererProps {
  maze: Maze;
  playerPosition: Position;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

export default function MazeRenderer({ maze, playerPosition }: MazeRendererProps) {
  const cellSize = useMemo(() => {
    // Calculate cell size based on maze size and available space
    const maxSize = Math.min(600, window.innerWidth - 100);
    return Math.max(8, Math.floor(maxSize / Math.max(maze.width, maze.height)));
  }, [maze.width, maze.height]);

  const mazeStyle = {
    width: maze.width * cellSize,
    height: maze.height * cellSize,
    display: 'grid',
    gridTemplateColumns: `repeat(${maze.width}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${maze.height}, ${cellSize}px)`,
    gap: '1px',
    border: '2px solid #374151',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  };

  const getCellStyle = (cell: any, x: number, y: number) => {
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const isStart = cell.isStart;
    const isEnd = cell.isEnd;
    const isWall = cell.isWall;

    let backgroundColor = '#f9fafb'; // Default path color

    if (isWall) {
      backgroundColor = '#1f2937'; // Wall color
    } else if (isPlayer) {
      backgroundColor = '#3b82f6'; // Player color
    } else if (isEnd) {
      backgroundColor = '#10b981'; // Goal color
    } else if (isStart) {
      backgroundColor = '#6366f1'; // Start color
    }

    return {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      backgroundColor,
      position: 'relative' as const,
      transition: 'all 0.2s ease',
      borderRadius: isPlayer ? '50%' : '0',
      animation: isPlayer ? 'pulse 2s infinite' : isEnd ? 'pulse 2s infinite' : 'none',
    };
  };

  const renderPlayerIcon = () => {
    if (cellSize >= 16) {
      return (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: `${Math.max(8, cellSize * 0.6)}px`,
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          🚀
        </div>
      );
    }
    return null;
  };

  const renderGoalIcon = (cell: any) => {
    if (cell.isEnd && cellSize >= 16) {
      return (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: `${Math.max(8, cellSize * 0.6)}px`,
            color: 'white',
          }}
        >
          🏆
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Level {maze.width > 11 ? Math.floor((maze.width - 11) / 2) + 1 : 1}</h3>
          <div className="text-sm text-gray-300">
            Size: {maze.width}x{maze.height}
          </div>
        </div>
        
        <div style={mazeStyle} className="mx-auto bg-gray-800 shadow-2xl">
          {maze.cells.flat().map((cell, index) => {
            const x = index % maze.width;
            const y = Math.floor(index / maze.width);
            const isPlayer = playerPosition.x === x && playerPosition.y === y;
            
            return (
              <div
                key={`${x}-${y}`}
                style={getCellStyle(cell, x, y)}
                className={`
                  transition-all duration-200
                  ${isPlayer ? 'z-10 shadow-lg shadow-blue-500/50' : ''}
                  ${cell.isEnd ? 'shadow-lg shadow-green-500/50' : ''}
                `}
              >
                {isPlayer && renderPlayerIcon()}
                {renderGoalIcon(cell)}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex justify-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Player</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Goal</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-700 rounded"></div>
            <span>Wall</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span>Path</span>
          </div>
        </div>
      </div>
    </div>
  );
}
