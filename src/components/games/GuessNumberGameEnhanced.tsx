import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';

interface GuessNumberGameProps {
  onBack?: () => void;
}

export default function GuessNumberGameEnhanced({ onBack }: GuessNumberGameProps) {
  const { addGameSession, claimRewards } = useGame();
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
  const [guessHistory, setGuessHistory] = useState<{number: number, feedback: string, distance: number}[]>([]);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [tokensEarned, setTokensEarned] = useState<number>(0);
  const [canClaim, setCanClaim] = useState<boolean>(false);

  const difficultySettings = {
    easy: { min: 1, max: 100, attempts: 7, reward: 500000 },
    medium: { min: 1, max: 500, attempts: 9, reward: 1250000 },
    hard: { min: 1, max: 1000, attempts: 10, reward: 3500000 }
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
    setFeedback('Welcome to the Mind Matrix! The AI has chosen a number...');
    setGuess('');
    setGuessHistory([]);
    setHintUsed(false);
  };

  const calculateDistance = (guessNum: number): number => {
    const distance = Math.abs(targetNumber - guessNum);
    const maxDistance = Math.max(targetNumber - range.min, range.max - targetNumber);
    return Math.round((1 - distance / maxDistance) * 100);
  };

  const makeGuess = () => {
    const guessNumber = parseInt(guess);
    if (isNaN(guessNumber) || guessNumber < range.min || guessNumber > range.max) {
      setFeedback(`⚠️ Neural Network Error: Input must be between ${range.min} and ${range.max}`);
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    const distance = calculateDistance(guessNumber);
    let feedbackMsg = '';
    
    if (guessNumber === targetNumber) {
      setWon(true);
      setGameOver(true);
      feedbackMsg = '🎉 NEURAL LINK ESTABLISHED! You cracked the AI\'s code!';
      const reward = Math.floor(difficultySettings[difficulty].reward * (1 - (newAttempts - 1) / maxAttempts * 0.3));
      setTokensEarned(reward);
      setCanClaim(true);
      addGameSession({
        gameType: 'guess-number' as const,
        score: reward,
        tokensEarned: reward,
        completedAt: Date.now(),
        difficulty: difficulty
      });
    } else if (newAttempts >= maxAttempts) {
      setGameOver(true);
      feedbackMsg = `💀 Neural overload! The number was ${targetNumber}. AI wins this round.`;
    } else {
      if (guessNumber < targetNumber) {
        feedbackMsg = `🔺 Neural probe too low. Signal strength: ${distance}%`;
      } else {
        feedbackMsg = `🔻 Neural probe too high. Signal strength: ${distance}%`;
      }
    }

    setGuessHistory(prev => [...prev, { 
      number: guessNumber, 
      feedback: guessNumber < targetNumber ? 'TOO LOW' : 'TOO HIGH', 
      distance 
    }]);
    setFeedback(feedbackMsg);
    setGuess('');
  };

  const getHint = () => {
    if (hintUsed) return;
    setHintUsed(true);
    const digitCount = targetNumber.toString().length;
    const firstDigit = targetNumber.toString()[0];
    setFeedback(`🔮 AI Hint: The number has ${digitCount} digits and starts with ${firstDigit}`);
  };

  const handleClaimRewards = () => {
    if (canClaim && tokensEarned > 0) {
      claimRewards();
      setCanClaim(false);
      setTokensEarned(0);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setWon(false);
    setAttempts(0);
    setGuess('');
    setFeedback('');
    setGuessHistory([]);
    setHintUsed(false);
    setTokensEarned(0);
    setCanClaim(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Beautiful Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={onBack}
          className="group relative overflow-hidden bg-gradient-to-r from-purple-600/80 via-indigo-600/80 to-blue-600/80 backdrop-blur-sm hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40 shadow-2xl hover:shadow-purple-500/25"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative flex items-center space-x-3">
            <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">←</span>
            <span className="hidden sm:inline">Back to Games</span>
            <span className="sm:hidden">Games</span>
          </span>
        </button>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Neural Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-purple-400/20 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-blue-400/5 animate-pulse" 
                   style={{ animationDelay: `${i * 50}ms` }}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-md w-full bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-pulse">🧠</div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mb-2">
            Mind Matrix
          </h1>
          <p className="text-purple-300">Crack the Neural Network Code</p>
        </div>

        {!gameStarted ? (
          /* Game Setup */
          <div className="space-y-6">
            <div>
              <label className="block text-purple-300 mb-3 font-semibold">🎯 Neural Difficulty:</label>
              <div className="space-y-2">
                {Object.entries(difficultySettings).map(([key, settings]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key as any)}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                      difficulty === key
                        ? 'bg-purple-500/30 border-purple-400 text-white'
                        : 'bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold capitalize">{key}</span>
                      <span className="text-sm">{settings.reward.toLocaleString()} LOGIQ</span>
                    </div>
                    <div className="text-sm opacity-75">
                      Range: {settings.min}-{settings.max} • Attempts: {settings.attempts}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <span>Initialize Neural Link</span>
                <span className="text-xl animate-bounce">⚡</span>
              </span>
            </button>
          </div>
        ) : (
          /* Game Interface */
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30">
                <div className="text-sm text-purple-300">Attempts</div>
                <div className="text-2xl font-bold text-white">{attempts}/{maxAttempts}</div>
              </div>
              <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
                <div className="text-sm text-blue-300">Range</div>
                <div className="text-lg font-bold text-white">{range.min}-{range.max}</div>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-xl p-4">
                <p className="text-indigo-200 text-center font-medium">{feedback}</p>
              </div>
            )}

            {/* Guess History */}
            {guessHistory.length > 0 && (
              <div className="bg-black/30 rounded-xl p-4 border border-gray-600/30 max-h-32 overflow-y-auto">
                <div className="text-sm text-gray-300 mb-2">Neural Probe History:</div>
                <div className="space-y-1">
                  {guessHistory.slice(-3).map((entry, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-white">{entry.number}</span>
                      <span className={`${entry.feedback === 'TOO LOW' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {entry.feedback} ({entry.distance}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!gameOver && (
              <div className="space-y-4">
                <div>
                  <input
                    type="number"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && makeGuess()}
                    placeholder="Enter neural probe value..."
                    className="w-full bg-black/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    min={range.min}
                    max={range.max}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={makeGuess}
                    disabled={!guess}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    Neural Probe
                  </button>
                  
                  {!hintUsed && (
                    <button
                      onClick={getHint}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      🔮 Hint
                    </button>
                  )}
                </div>
              </div>
            )}

            {gameOver && (
              <div className="text-center space-y-4">
                <div className={`text-6xl ${won ? 'animate-bounce' : 'animate-pulse'}`}>
                  {won ? '🎉' : '💀'}
                </div>
                
                {/* Reward Section */}
                {won && tokensEarned > 0 && (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 space-y-3">
                    <div className="text-yellow-300 font-semibold">🎯 Neural Link Rewards</div>
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
                  Reset Neural Matrix
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
