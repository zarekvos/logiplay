import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';

type Player = 'X' | 'O' | null;
type Board = Player[];

export default function TicTacToeGame() {
  const { addGameSession } = useGame();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost' | 'draw'>('playing');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

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

  const minimax = (board: Board, depth: number, isMaximizing: boolean): number => {
    const winner = checkWinner(board);
    
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (getAvailableMoves(board).length === 0) return 0;

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of getAvailableMoves(board)) {
        board[move] = 'O';
        const eval_ = minimax(board, depth + 1, false);
        board[move] = null;
        maxEval = Math.max(maxEval, eval_);
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of getAvailableMoves(board)) {
        board[move] = 'X';
        const eval_ = minimax(board, depth + 1, true);
        board[move] = null;
        minEval = Math.min(minEval, eval_);
      }
      return minEval;
    }
  };

  const getBestMove = (board: Board): number => {
    const availableMoves = getAvailableMoves(board);
    
    if (difficulty === 'easy') {
      // 70% random move, 30% best move
      if (Math.random() < 0.7) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
    } else if (difficulty === 'medium') {
      // 40% random move, 60% best move
      if (Math.random() < 0.4) {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }
    }
    
    // Hard difficulty or when not choosing random move
    let bestMove = -1;
    let bestValue = -Infinity;
    
    for (const move of availableMoves) {
      board[move] = 'O';
      const moveValue = minimax(board, 0, false);
      board[move] = null;
      
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    }
    
    return bestMove;
  };

  const makeMove = (index: number) => {
    if (board[index] || gameStatus !== 'playing' || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner === 'X') {
      setGameStatus('won');
      const baseTokens = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 30 : 50;
      addGameSession({
        gameType: 'tic-tac-toe',
        score: baseTokens,
        tokensEarned: baseTokens,
        difficulty,
        completedAt: Date.now()
      });
      return;
    }

    if (getAvailableMoves(newBoard).length === 0) {
      setGameStatus('draw');
      return;
    }

    // AI move
    setTimeout(() => {
      const aiMove = getBestMove(newBoard);
      newBoard[aiMove] = 'O';
      setBoard([...newBoard]);
      setIsPlayerTurn(true);

      const aiWinner = checkWinner(newBoard);
      if (aiWinner === 'O') {
        setGameStatus('lost');
      } else if (getAvailableMoves(newBoard).length === 0) {
        setGameStatus('draw');
      }
    }, 500);
  };

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
    setGameStarted(true);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
  };

  const getStatusMessage = () => {
    switch (gameStatus) {
      case 'won':
        return '🎉 You Won!';
      case 'lost':
        return '😔 AI Won!';
      case 'draw':
        return '🤝 It\'s a Draw!';
      default:
        return isPlayerTurn ? 'Your Turn (X)' : 'AI Thinking...';
    }
  };

  const getStatusColor = () => {
    switch (gameStatus) {
      case 'won':
        return 'text-green-400';
      case 'lost':
        return 'text-red-400';
      case 'draw':
        return 'text-yellow-400';
      default:
        return 'text-white';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">⭕ Tic Tac Toe</h1>
          <p className="text-gray-300">Beat the AI!</p>
        </div>

        {!gameStarted ? (
          <div className="text-center space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">Choose Difficulty:</label>
              <div className="space-y-2">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level as 'easy' | 'medium' | 'hard')}
                    className={`
                      w-full p-3 rounded-lg font-medium transition-all duration-200 capitalize
                      ${difficulty === level
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }
                    `}
                  >
                    {level} ({level === 'easy' ? '15' : level === 'medium' ? '30' : '50'} tokens)
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Game
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`text-center font-bold text-lg ${getStatusColor()}`}>
              {getStatusMessage()}
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {board.map((cell, index) => (
                <button
                  key={index}
                  onClick={() => makeMove(index)}
                  className="
                    w-20 h-20 bg-white/20 border-2 border-white/30 rounded-lg 
                    text-2xl font-bold text-white hover:bg-white/30 
                    transition-all duration-200 disabled:cursor-not-allowed
                    flex items-center justify-center
                  "
                  disabled={!!cell || gameStatus !== 'playing' || !isPlayerTurn}
                >
                  {cell && (
                    <span className={cell === 'X' ? 'text-blue-400' : 'text-red-400'}>
                      {cell}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {gameStatus !== 'playing' && (
              <div className="space-y-4">
                <button
                  onClick={resetGame}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Play Again
                </button>
                <button
                  onClick={() => setGameStarted(false)}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Change Difficulty
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
