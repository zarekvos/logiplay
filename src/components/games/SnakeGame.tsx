import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../../contexts/GameContext';

interface SnakeOrLadder {
  start: number;
  end: number;
  type: 'snake' | 'ladder';
}

interface SnakeAndLadderGameProps {
  onBack?: () => void;
}

interface Player {
  id: string;
  name: string;
  position: number;
  isAI: boolean;
  color: string;
  emoji: string;
}

export default function SnakeAndLadderGame({ onBack }: SnakeAndLadderGameProps) {
  const { addGameSession } = useGame();
  const [players, setPlayers] = useState<Player[]>([
    { id: 'human', name: 'You', position: 1, isAI: false, color: 'text-blue-400', emoji: '🔵' },
    { id: 'ai', name: 'AI Bot', position: 1, isAI: true, color: 'text-red-400', emoji: '🔴' }
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');
  const [winner, setWinner] = useState<Player | null>(null);
  const [moves, setMoves] = useState(0);
  const [gameStartTime] = useState(Date.now());
  const [showMessage, setShowMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [aiTurnInProgress, setAiTurnInProgress] = useState(false);
  const [isSwitchingTurn, setIsSwitchingTurn] = useState(false);

  // Traditional Snake and Ladder positions
  const snakesAndLadders: SnakeOrLadder[] = [
    // Ladders
    { start: 1, end: 38, type: 'ladder' },
    { start: 4, end: 14, type: 'ladder' },
    { start: 9, end: 31, type: 'ladder' },
    { start: 21, end: 42, type: 'ladder' },
    { start: 28, end: 84, type: 'ladder' },
    { start: 36, end: 44, type: 'ladder' },
    { start: 51, end: 67, type: 'ladder' },
    { start: 71, end: 91, type: 'ladder' },
    { start: 80, end: 100, type: 'ladder' },
    
    // Snakes
    { start: 16, end: 6, type: 'snake' },
    { start: 47, end: 26, type: 'snake' },
    { start: 49, end: 11, type: 'snake' },
    { start: 56, end: 53, type: 'snake' },
    { start: 62, end: 19, type: 'snake' },
    { start: 64, end: 60, type: 'snake' },
    { start: 87, end: 24, type: 'snake' },
    { start: 93, end: 73, type: 'snake' },
    { start: 95, end: 75, type: 'snake' },
    { start: 98, end: 78, type: 'snake' }
  ];

  // Get board position coordinates (row, col) for a given square number
  const getPositionCoordinates = (position: number) => {
    const row = Math.floor((position - 1) / 10);
    const col = row % 2 === 0 ? (position - 1) % 10 : 9 - ((position - 1) % 10);
    return { row: 9 - row, col };
  };

  // Check if position has snake or ladder
  const getSnakeOrLadder = (position: number) => {
    return snakesAndLadders.find(item => item.start === position);
  };

  // Calculate realistic token rewards (max 1M from 100B supply)
  const calculateTokenReward = (playerWon: boolean, totalMoves: number, gameTime: number) => {
    if (!playerWon) return 0; // No reward if AI wins
    
    // Base reward calculation - realistic amounts
    const baseReward = 1000; // 1K base
    const efficiencyBonus = Math.max(0, (50 - totalMoves) * 50); // Bonus for fewer moves
    const speedBonus = Math.max(0, (300000 - gameTime) / 1000); // Bonus for faster completion (5 min max)
    
    // Random bonus 0-20%
    const randomMultiplier = 1 + (Math.random() * 0.2);
    
    const totalReward = Math.floor((baseReward + efficiencyBonus + speedBonus) * randomMultiplier);
    
    // Cap at 10K LOGIQ for this game (realistic from 100B supply)
    return Math.min(totalReward, 10000);
  };

  // Check win condition
  const checkWinCondition = useCallback((position: number, playerIndex: number): void => {
    if (position === 100) {
      const winningPlayer = players[playerIndex];
      setGameStatus('won');
      setWinner(winningPlayer);
      setAiTurnInProgress(false); // Reset AI turn flag when game ends
      
      if (!winningPlayer.isAI) {
        // Player wins - calculate reward
        const gameTime = Date.now() - gameStartTime;
        const tokensEarned = calculateTokenReward(true, moves, gameTime);
        
        addGameSession({
          gameType: 'snake',
          score: moves,
          tokensEarned,
          difficulty: 'normal',
          completedAt: Date.now()
        });
        
        setShowMessage(`🎉 Congratulations! You won in ${moves} moves! Earned ${tokensEarned.toLocaleString()} $LOGIQ!`);
      } else {
        // AI wins
        setShowMessage(`🤖 AI Bot wins! Better luck next time! Try again to earn $LOGIQ tokens!`);
      }
    } else {
      // Switch to next player after a short delay
      setIsSwitchingTurn(true);
      setTimeout(() => {
        const nextPlayerIndex = (playerIndex + 1) % players.length;
        setCurrentPlayerIndex(nextPlayerIndex);
        setIsSwitchingTurn(false);
        
        // Clear any messages when switching turns
        if (!players[nextPlayerIndex]?.isAI) {
          setShowMessage('');
        }
      }, 800);
    }
  }, [players, moves, gameStartTime, addGameSession]);

  // Move player
  const movePlayer = useCallback((diceRoll: number, playerIndex: number): void => {
    setIsAnimating(true);
    const currentPlayer = players[playerIndex];
    const newPosition = Math.min(currentPlayer.position + diceRoll, 100);
    
    // Update player position
    setPlayers(prev => prev.map((player, index) => 
      index === playerIndex ? { ...player, position: newPosition } : player
    ));
    
    if (!currentPlayer.isAI) {
      setMoves(prev => prev + 1);
    }
    
    setTimeout(() => {
      // Check for snake or ladder
      const snakeOrLadder = getSnakeOrLadder(newPosition);
      if (snakeOrLadder) {
        setTimeout(() => {
          setPlayers(prev => prev.map((player, index) => 
            index === playerIndex ? { ...player, position: snakeOrLadder.end } : player
          ));
          
          if (snakeOrLadder.type === 'snake') {
            setShowMessage(`${currentPlayer.emoji} ${currentPlayer.name} hit a snake! Slide down to ${snakeOrLadder.end}`);
          } else {
            setShowMessage(`${currentPlayer.emoji} ${currentPlayer.name} found a ladder! Climb up to ${snakeOrLadder.end}`);
          }
          
          setTimeout(() => {
            setShowMessage('');
            setIsAnimating(false);
            // Reset AI turn flag if it was AI's turn
            if (currentPlayer.isAI) {
              setAiTurnInProgress(false);
            }
            checkWinCondition(snakeOrLadder.end, playerIndex);
          }, 2000);
        }, 1000);
      } else {
        setIsAnimating(false);
        // Reset AI turn flag if it was AI's turn
        if (currentPlayer.isAI) {
          setAiTurnInProgress(false);
        }
        checkWinCondition(newPosition, playerIndex);
      }
    }, 500);
  }, [players, checkWinCondition]);

  // AI Turn Logic
  const executeAITurn = useCallback((): void => {
    if (gameStatus === 'won' || !players[currentPlayerIndex]?.isAI || aiTurnInProgress) return;
    
    setAiTurnInProgress(true);
    
    setTimeout(() => {
      setIsRolling(true);
      setShowMessage('🤖 AI is thinking...');
      
      // AI rolling animation
      let rollCount = 0;
      const rollInterval = setInterval(() => {
        setDiceValue(Math.floor(Math.random() * 6) + 1);
        rollCount++;
        
        if (rollCount >= 8) {
          clearInterval(rollInterval);
          const aiDiceValue = Math.floor(Math.random() * 6) + 1;
          setDiceValue(aiDiceValue);
          setIsRolling(false);
          setShowMessage(`🤖 AI rolled ${aiDiceValue}!`);
          
          // Move AI player - flag will be reset in movePlayer
          setTimeout(() => {
            movePlayer(aiDiceValue, currentPlayerIndex);
          }, 200);
        }
      }, 150);
    }, 1000); // AI thinks for 1 second
  }, [currentPlayerIndex, gameStatus, players, movePlayer]);

  // Roll dice animation
  const rollDice = useCallback((): void => {
    if (isRolling || gameStatus === 'won' || (players[currentPlayerIndex]?.isAI ?? false)) return;
    
    setIsRolling(true);
    setShowMessage('');
    
    // Dice rolling animation
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 10) {
        clearInterval(rollInterval);
        const finalDiceValue = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalDiceValue);
        setIsRolling(false);
        movePlayer(finalDiceValue, currentPlayerIndex);
      }
    }, 100);
  }, [isRolling, gameStatus, currentPlayerIndex, players, movePlayer]);

  // Execute AI turn effect
  useEffect(() => {
    const currentPlayer = players[currentPlayerIndex];
    
    // Only execute AI turn if:
    // 1. Current player is AI
    // 2. Game is still playing
    // 3. Not currently animating
    // 4. Not currently rolling dice
    // 5. AI turn is not already in progress
    // 6. Not switching turns
    // 7. No message is being shown (except AI messages)
    if (
      currentPlayer?.isAI && 
      gameStatus === 'playing' && 
      !isAnimating && 
      !isRolling && 
      !aiTurnInProgress &&
      !isSwitchingTurn &&
      (!showMessage || showMessage.includes('🤖'))
    ) {
      // Add a small delay to ensure state is fully updated
      const timer = setTimeout(() => {
        executeAITurn();
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayerIndex, executeAITurn, gameStatus, isAnimating, isRolling, players, aiTurnInProgress, isSwitchingTurn, showMessage]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        rollDice();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [rollDice]);

  // Reset game
  const resetGame = () => {
    setPlayers([
      { id: 'human', name: 'You', position: 1, isAI: false, color: 'text-blue-400', emoji: '🔵' },
      { id: 'ai', name: 'AI Bot', position: 1, isAI: true, color: 'text-red-400', emoji: '🔴' }
    ]);
    setCurrentPlayerIndex(0);
    setDiceValue(1);
    setGameStatus('playing');
    setWinner(null);
    setMoves(0);
    setShowMessage('');
    setIsAnimating(false);
    setAiTurnInProgress(false);
    setIsSwitchingTurn(false);
  };

  // Render board squares
  const renderBoard = () => {
    const squares = [];
    
    for (let i = 100; i >= 1; i--) {
      const { row, col } = getPositionCoordinates(i);
      const snakeOrLadder = getSnakeOrLadder(i);
      const playersHere = players.filter(player => player.position === i);
      
      squares.push(
        <div
          key={i}
          className={`
            relative w-12 h-12 sm:w-16 sm:h-16 border border-white/20 flex items-center justify-center text-sm font-bold
            ${i % 2 === 0 ? 'bg-purple-900/30' : 'bg-blue-900/30'}
            ${playersHere.length > 0 ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-black z-10' : ''}
            ${snakeOrLadder?.type === 'snake' ? 'bg-red-600/40' : ''}
            ${snakeOrLadder?.type === 'ladder' ? 'bg-green-600/40' : ''}
            transition-all duration-300
          `}
          style={{
            gridRow: row + 1,
            gridColumn: col + 1
          }}
        >
          {/* Square number */}
          <span className={`text-white/60 text-sm ${playersHere.length > 0 ? 'text-yellow-300' : ''}`}>
            {i}
          </span>
          
          {/* Snake or Ladder icon */}
          {snakeOrLadder && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl">
                {snakeOrLadder.type === 'snake' ? '🐍' : '🪜'}
              </span>
            </div>
          )}
          
          {/* Players */}
          {playersHere.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              {playersHere.length === 1 ? (
                <div className={`transition-all duration-500 ${isAnimating ? 'animate-bounce' : ''}`}>
                  <span className="text-3xl sm:text-4xl animate-pulse">{playersHere[0].emoji}</span>
                </div>
              ) : (
                <div className="flex space-x-1">
                  {playersHere.map((player) => (
                    <span key={player.id} className="text-2xl sm:text-3xl animate-pulse">{player.emoji}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    return squares;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Bar */}
        {onBack && (
          <nav className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-semibold border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 group"
            >
              <span className="text-xl transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
              <span>Back to Games</span>
            </button>
          </nav>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-4">
            🐍 Snake & Ladder 🪜
          </h1>
          <p className="text-gray-300 text-xl">Climb ladders, avoid snakes, reach 100!</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* Game Board */}
          <div className="flex-1 bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <div className="grid grid-cols-10 gap-2 max-w-2xl mx-auto">
              {renderBoard()}
            </div>
          </div>

          {/* Game Controls & Info */}
          <div className="xl:w-96 space-y-6">
            {/* Players Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">👥 Players</h3>
              
              <div className="space-y-4">
                {players.map((player, index) => (
                  <div 
                    key={player.id}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                      index === currentPlayerIndex 
                        ? 'bg-yellow-500/20 border border-yellow-400/50 shadow-lg' 
                        : 'bg-black/20 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{player.emoji}</span>
                      <div>
                        <div className={`font-bold text-lg ${player.color}`}>{player.name}</div>
                        <div className="text-sm text-gray-400">
                          {player.isAI ? '🤖 AI Player' : '👤 Human Player'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">{player.position}/100</div>
                      {index === currentPlayerIndex && gameStatus === 'playing' && (
                        <div className="text-sm text-yellow-400 animate-pulse">Current Turn</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Game Status */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6">🎮 Game Status</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-lg">Your Moves:</span>
                  <span className="text-blue-400 font-bold text-xl">{moves}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-lg">Current Turn:</span>
                  <span className={`font-bold text-lg ${players[currentPlayerIndex]?.color}`}>
                    {players[currentPlayerIndex]?.name}
                  </span>
                </div>
                
                {winner && (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-4 border border-yellow-400/30">
                    <div className="text-center">
                      <div className="text-3xl mb-3">{winner.emoji}</div>
                      <div className={`font-bold text-lg ${winner.color}`}>
                        {winner.name} Wins!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dice */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
              <h3 className="text-2xl font-bold text-white mb-6">🎲 Dice</h3>
              
              <div className={`w-24 h-24 mx-auto bg-white rounded-xl flex items-center justify-center text-5xl font-bold text-black mb-6 transition-transform duration-200 shadow-lg ${isRolling ? 'animate-spin' : ''}`}>
                {diceValue}
              </div>
              
              <button
                onClick={rollDice}
                disabled={isRolling || gameStatus === 'won' || isAnimating || (players[currentPlayerIndex]?.isAI ?? false)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {isRolling ? 'Rolling...' : 
                 (players[currentPlayerIndex]?.isAI ?? false) ? 'AI Turn' : 
                 gameStatus === 'won' ? 'Game Over' : 'Roll Dice'}
              </button>
              
              <p className="text-gray-400 text-base mt-3">
                {(players[currentPlayerIndex]?.isAI ?? false) ? 
                  '🤖 AI is playing' : 
                  'Press Space or Enter to roll'
                }
              </p>
            </div>

            {/* Reward Info */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/30">
              <h3 className="text-xl font-bold text-white mb-4">💰 Rewards</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Base Reward:</span>
                  <span className="text-yellow-400 font-bold">1,000 $LOGIQ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Efficiency Bonus:</span>
                  <span className="text-green-400">Up to 2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Speed Bonus:</span>
                  <span className="text-blue-400">Up to 5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Random Bonus:</span>
                  <span className="text-purple-400">0-20%</span>
                </div>
                <hr className="border-white/20 my-2" />
                <div className="flex justify-between">
                  <span className="text-white font-bold">Max Possible:</span>
                  <span className="text-yellow-300 font-bold">10,000 $LOGIQ</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-400 mt-3">
                💡 Tip: Win quickly with fewer moves for maximum rewards!
              </p>
            </div>

            {/* Rules */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4">📋 Rules</h3>
              
              <ul className="text-gray-300 text-sm space-y-2">
                <li>• 🎯 Race against AI to reach 100 first</li>
                <li>• 🎲 Take turns rolling dice</li>
                <li>• 🪜 Ladders boost you up</li>
                <li>• 🐍 Snakes slide you down</li>
                <li>• 🏆 Only winner gets $LOGIQ tokens</li>
                <li>• ⚡ Faster wins = bigger rewards</li>
              </ul>
            </div>

            {/* Reset Button */}
            {(gameStatus === 'won' || moves > 0) && (
              <button
                onClick={resetGame}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🔄 New Game
              </button>
            )}
          </div>
        </div>

        {/* Message Display */}
        {showMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 max-w-lg text-center border border-white/20">
              <p className="text-white text-lg font-semibold mb-6">{showMessage}</p>
              
              {/* Game Over Buttons */}
              {gameStatus === 'won' && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    🔄 Play Again
                  </button>
                  {onBack && (
                    <button
                      onClick={onBack}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                    >
                      🏠 Back to Games
                    </button>
                  )}
                </div>
              )}
              
              {/* Close button for other messages */}
              {gameStatus === 'playing' && (
                <button
                  onClick={() => setShowMessage('')}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  ✕ Close
                </button>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <h3 className="text-lg font-bold text-white mb-3">🗺️ Board Legend</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔵</span>
              <span className="text-gray-300">You (Human)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🔴</span>
              <span className="text-gray-300">AI Bot</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🪜</span>
              <span className="text-gray-300">Ladder (up)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🐍</span>
              <span className="text-gray-300">Snake (down)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
