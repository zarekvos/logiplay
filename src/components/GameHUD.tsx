import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { formatTime } from '../utils';

export default function GameHUD() {
  const { gameState } = useGame();
  const [currentTime, setCurrentTime] = useState(0);

  // Update timer
  useEffect(() => {
    if (!gameState.isCompleted && gameState.timeStarted > 0) {
      const timer = setInterval(() => {
        setCurrentTime(Date.now() - gameState.timeStarted);
      }, 100);

      return () => clearInterval(timer);
    }
  }, [gameState.isCompleted, gameState.timeStarted]);

  return (
    <div className="flex items-center space-x-6">
      {/* Level */}
      <div className="bg-white/10 rounded-lg px-3 py-1 border border-white/20">
        <div className="text-xs text-gray-300">Level</div>
        <div className="text-lg font-bold text-white">{gameState.level}</div>
      </div>

      {/* Timer */}
      <div className="bg-white/10 rounded-lg px-3 py-1 border border-white/20">
        <div className="text-xs text-gray-300">Time</div>
        <div className="text-lg font-bold text-white font-mono">
          {gameState.isCompleted 
            ? formatTime(Date.now() - gameState.timeStarted)
            : formatTime(currentTime)
          }
        </div>
      </div>

      {/* Tokens */}
      <div className="bg-gradient-to-r from-green-600/20 to-green-500/20 rounded-lg px-3 py-1 border border-green-500/30">
        <div className="text-xs text-green-200">$LOGIQ Tokens</div>
        <div className="text-lg font-bold text-green-400">{gameState.tokens}</div>
      </div>

      {/* Score */}
      <div className="bg-white/10 rounded-lg px-3 py-1 border border-white/20">
        <div className="text-xs text-gray-300">Completed</div>
        <div className="text-lg font-bold text-white">{gameState.score}</div>
      </div>
    </div>
  );
}
