import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';

type Player = 'X' | 'O' | null;
type Board = Player[];

interface TicTacToeGameProps {
  onBack?: () => void;
}

export default function TicTacToeGameEnhanced({ onBack }: TicTacToeGameProps) {
  const { addGameSession, claimRewards } = useGame();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'draw'>('playing');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O'>('X');
  const [aiThinking, setAiThinking] = useState<boolean>(false);
  const [tokensEarned, setTokensEarned] = useState<number>(0);
  const [canClaim, setCanClaim] = useState<boolean>(false);

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const difficultySettings = {
    easy: { name: 'Rookie Detective', reward: 750000, description: 'AI makes obvious mistakes' },
    medium: { name: 'Master Detective', reward: 1500000, description: 'Balanced AI opponent' },
    hard: { name: 'Criminal Mastermind', reward: 3500000, description: 'Unbeatable AI logic' }
  };

  const checkWinner = (board: Board): Player => {
    for (const line of winningLines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const getAvailableMoves = (board: Board): number[] => {
    return board.map((cell, index) => cell === null ? index : -1).filter(val => val !== -1);
  };

  const minimax = (board: Board, depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
    const winner = checkWinner(board);
    const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
    
    if (winner === aiSymbol) return 10 - depth;
    if (winner === playerSymbol) return depth - 10;
    if (getAvailableMoves(board).length === 0) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of getAvailableMoves(board)) {
        board[move] = aiSymbol;
        const eval_ = minimax(board, depth + 1, false, alpha, beta);
        board[move] = null;
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of getAvailableMoves(board)) {
        board[move] = playerSymbol;
        const eval_ = minimax(board, depth + 1, true, alpha, beta);
        board[move] = null;
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  const getBestMove = (board: Board): number => {
    const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
    let bestScore = -Infinity;
    let bestMove = -1;

    // Add some randomness for easy mode
    if (difficulty === 'easy' && Math.random() < 0.4) {
      const availableMoves = getAvailableMoves(board);
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    for (const move of getAvailableMoves(board)) {
      board[move] = aiSymbol;
      const score = minimax(board, 0, false);
      board[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  };

  const makeMove = (index: number) => {
    if (board[index] || gameStatus !== 'playing' || !isPlayerTurn || aiThinking) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);
    setMoveCount(prev => prev + 1);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner) {
      if (winner === playerSymbol) {
        setGameStatus('won');
        const reward = Math.floor(difficultySettings[difficulty].reward * (1 - moveCount * 0.1));
        setTokensEarned(reward);
        setCanClaim(true);
        addGameSession({
          gameType: 'tic-tac-toe' as const,
          score: reward,
          tokensEarned: reward,
          completedAt: Date.now(),
          difficulty: difficulty
        });
      } else {
        setGameStatus('lost');
      }
    } else if (getAvailableMoves(newBoard).length === 0) {
      setGameStatus('draw');
    } else {
      // AI move
      setAiThinking(true);
      setTimeout(() => {
        const aiMove = getBestMove(newBoard);
        if (aiMove !== -1) {
          const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
          newBoard[aiMove] = aiSymbol;
          setBoard([...newBoard]);
          
          const aiWinner = checkWinner(newBoard);
          if (aiWinner) {
            setGameStatus('lost');
          } else if (getAvailableMoves(newBoard).length === 0) {
            setGameStatus('draw');
          }
        }
        setAiThinking(false);
        setIsPlayerTurn(true);
      }, 1000);
    }
  };

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(playerSymbol === 'X');
    setGameStatus('playing');
    setGameStarted(true);
    setMoveCount(0);
    setAiThinking(false);
  };

  const handleClaimRewards = () => {
    if (canClaim && tokensEarned > 0) {
      claimRewards();
      setCanClaim(false);
      setTokensEarned(0);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
    setGameStarted(false);
    setMoveCount(0);
    setAiThinking(false);
    setTokensEarned(0);
    setCanClaim(false);
  };

  const getCellIcon = (value: Player) => {
    if (!value) return '';
    if (value === 'X') return '🕵️';  // Detective
    return '🔍';  // Magnifying glass for evidence
  };

  const getStatusMessage = () => {
    if (gameStatus === 'won') return '🎉 Case Solved! You outsmarted the criminal!';
    if (gameStatus === 'lost') return '💀 Case Closed! The criminal escaped!';
    if (gameStatus === 'draw') return '🤝 Case Unsolved! It\'s a stalemate!';
    if (aiThinking) return '🤔 Criminal is planning next move...';
    if (isPlayerTurn) return '🕵️ Your move, Detective!';
    return '🔍 Analyzing evidence...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Beautiful Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={onBack}
          className="group relative overflow-hidden bg-gradient-to-r from-red-600/80 via-orange-600/80 to-yellow-600/80 backdrop-blur-sm hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40 shadow-2xl hover:shadow-red-500/25"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative flex items-center space-x-3">
            <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">←</span>
            <span className="hidden sm:inline">Back to Games</span>
            <span className="sm:hidden">Games</span>
          </span>
        </button>
      </div>

      {/* Background Crime Scene */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-orange-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-yellow-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Evidence Board Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zm0 0h20v20H20V20zm0-20h20v20H20V0zM0 20h20v20H0V20zM0 0h20v20H0V0z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative z-10 max-w-lg w-full bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-pulse">🔐</div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-red-300 via-orange-300 to-yellow-300 bg-clip-text text-transparent mb-2">
            Crypto Cipher
          </h1>
          <p className="text-red-300">Detective vs Criminal Mastermind</p>
        </div>

        {!gameStarted ? (
          /* Game Setup */
          <div className="space-y-6">
            <div>
              <label className="block text-red-300 mb-3 font-semibold">🎯 Criminal Difficulty:</label>
              <div className="space-y-2">
                {Object.entries(difficultySettings).map(([key, settings]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key as any)}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                      difficulty === key
                        ? 'bg-red-500/30 border-red-400 text-white'
                        : 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{settings.name}</span>
                      <span className="text-sm">{settings.reward.toLocaleString()} LOGIQ</span>
                    </div>
                    <div className="text-sm opacity-75">{settings.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-red-300 mb-3 font-semibold">🕵️ Choose Your Symbol:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPlayerSymbol('X')}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    playerSymbol === 'X'
                      ? 'bg-red-500/30 border-red-400 text-white'
                      : 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
                  }`}
                >
                  <div className="text-3xl mb-2">🕵️</div>
                  <div className="text-sm">Detective (X)</div>
                  <div className="text-xs opacity-75">Go First</div>
                </button>
                <button
                  onClick={() => setPlayerSymbol('O')}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    playerSymbol === 'O'
                      ? 'bg-red-500/30 border-red-400 text-white'
                      : 'bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20'
                  }`}
                >
                  <div className="text-3xl mb-2">🔍</div>
                  <div className="text-sm">Evidence (O)</div>
                  <div className="text-xs opacity-75">Wait & Counter</div>
                </button>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <span>Start Investigation</span>
                <span className="text-xl animate-bounce">🔍</span>
              </span>
            </button>
          </div>
        ) : (
          /* Game Interface */
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
              <p className="text-red-200 font-medium">{getStatusMessage()}</p>
            </div>

            {/* Game Board */}
            <div className="bg-black/30 rounded-xl p-6 border border-gray-600/30">
              <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => makeMove(index)}
                    disabled={gameStatus !== 'playing' || !isPlayerTurn || aiThinking || cell !== null}
                    className={`aspect-square bg-gradient-to-br from-gray-700 to-gray-800 border-2 rounded-xl flex items-center justify-center text-4xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                      cell === null && gameStatus === 'playing' && isPlayerTurn && !aiThinking
                        ? 'border-red-500/50 hover:border-red-400 hover:bg-red-500/10 cursor-pointer'
                        : 'border-gray-600/30 cursor-not-allowed'
                    } ${
                      aiThinking && cell === null ? 'animate-pulse' : ''
                    }`}
                  >
                    {getCellIcon(cell)}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30">
                <div className="text-sm text-red-300">Moves Made</div>
                <div className="text-2xl font-bold text-white">{moveCount}</div>
              </div>
              <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-500/30">
                <div className="text-sm text-orange-300">Difficulty</div>
                <div className="text-lg font-bold text-white capitalize">{difficulty}</div>
              </div>
            </div>

            {gameStatus !== 'playing' && (
              <div className="text-center space-y-4">
                <div className={`text-6xl ${gameStatus === 'won' ? 'animate-bounce' : 'animate-pulse'}`}>
                  {gameStatus === 'won' ? '🏆' : gameStatus === 'lost' ? '💀' : '🤝'}
                </div>
                
                {/* Reward Section */}
                {gameStatus === 'won' && tokensEarned > 0 && (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 space-y-3">
                    <div className="text-yellow-300 font-semibold">🕵️ Detective Rewards</div>
                    <div className="text-3xl font-bold text-yellow-400">{tokensEarned.toLocaleString()} LOGIQ</div>
                    {canClaim ? (
                      <button
                        onClick={handleClaimRewards}
                        className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 animate-pulse"
                      >
                        💰 Claim Rewards
                      </button>
                    ) : (
                      <div className="text-green-400 font-semibold">✅ Rewards Claimed!</div>
                    )}
                  </div>
                )}
                
                <button
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                >
                  New Investigation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
