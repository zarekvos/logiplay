import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';

export default function GuessNumberGame() {
  const { addGameSession } = useGame();
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [maxAttempts, setMaxAttempts] = useState<number>(7);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [range, setRange] = useState<{ min: number; max: number }>({ min: 1, max: 100 });

  const difficultySettings = {
    easy: { min: 1, max: 100, attempts: 7 },
    medium: { min: 1, max: 500, attempts: 9 },
    hard: { min: 1, max: 1000, attempts: 10 }
  };

  useEffect(() => {
    const settings = difficultySettings[difficulty];
    setRange({ min: settings.min, max: settings.max });
    setMaxAttempts(settings.attempts);
  }, [difficulty]);

  const startGame = () => {
    const settings = difficultySettings[difficulty];
    const randomNumber = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    setTargetNumber(randomNumber);
    setAttempts(0);
    setGameStarted(true);
    setGameOver(false);
    setWon(false);
    setFeedback('');
    setGuess('');
  };

  const makeGuess = () => {
    const guessNumber = parseInt(guess);
    if (isNaN(guessNumber) || guessNumber < range.min || guessNumber > range.max) {
      setFeedback(`Please enter a number between ${range.min} and ${range.max}`);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (guessNumber === targetNumber) {
      setWon(true);
      setGameOver(true);
      setFeedback('🎉 Congratulations! You found the number!');
      
      // Calculate tokens based on attempts and difficulty
      const baseTokens = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50;
      const efficiencyBonus = Math.max(0, maxAttempts - newAttempts) * 5;
      const totalTokens = baseTokens + efficiencyBonus;
      
      addGameSession({
        gameType: 'guess-number',
        score: totalTokens,
        tokensEarned: totalTokens,
        difficulty,
        completedAt: Date.now()
      });
    } else if (newAttempts >= maxAttempts) {
      setGameOver(true);
      setFeedback(`Game Over! The number was ${targetNumber}`);
    } else {
      const remaining = maxAttempts - newAttempts;
      if (guessNumber < targetNumber) {
        setFeedback(`Too low! ${remaining} attempts left`);
      } else {
        setFeedback(`Too high! ${remaining} attempts left`);
      }
    }
    setGuess('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !gameOver) {
      makeGuess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎯 Number Guess</h1>
          <p className="text-gray-300">Guess the hidden number!</p>
        </div>

        {!gameStarted ? (
          <div className="text-center space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">Choose Difficulty:</label>
              <div className="space-y-2">
                {Object.entries(difficultySettings).map(([key, settings]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key as 'easy' | 'medium' | 'hard')}
                    className={`
                      w-full p-3 rounded-lg font-medium transition-all duration-200
                      ${difficulty === key
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }
                    `}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)} ({settings.min}-{settings.max}, {settings.attempts} attempts)
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
            <div className="text-center">
              <p className="text-white mb-2">
                Guess a number between {range.min} and {range.max}
              </p>
              <p className="text-gray-300 text-sm">
                Attempts: {attempts}/{maxAttempts}
              </p>
            </div>

            {!gameOver && (
              <div className="space-y-4">
                <input
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={handleKeyPress}
                  min={range.min}
                  max={range.max}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center text-xl"
                  placeholder="Enter your guess"
                  autoFocus
                />
                <button
                  onClick={makeGuess}
                  disabled={!guess}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:scale-100"
                >
                  Make Guess
                </button>
              </div>
            )}

            {feedback && (
              <div className={`
                p-4 rounded-lg text-center font-medium
                ${won ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : gameOver ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}
              `}>
                {feedback}
              </div>
            )}

            {gameOver && (
              <button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Play Again
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
