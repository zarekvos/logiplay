import { useState } from 'react';
import { useGame } from '../../contexts/GameContext';

type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export default function DiceGame() {
  const { addGameSession } = useGame();
  const [playerDice, setPlayerDice] = useState<DiceValue[]>([]);
  const [aiDice, setAiDice] = useState<DiceValue[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<'player' | 'ai' | 'tie' | null>(null);
  const [rounds, setRounds] = useState<number>(3);
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [aiScore, setAiScore] = useState<number>(0);
  const [rolling, setRolling] = useState<boolean>(false);

  const diceEmojis: Record<DiceValue, string> = {
    1: '⚀',
    2: '⚁',
    3: '⚂',
    4: '⚃',
    5: '⚄',
    6: '⚅'
  };

  const rollDice = (): DiceValue => {
    return (Math.floor(Math.random() * 6) + 1) as DiceValue;
  };

  const calculateScore = (dice: DiceValue[]): number => {
    return dice.reduce((sum, die) => sum + die, 0);
  };

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setWinner(null);
    setCurrentRound(0);
    setPlayerScore(0);
    setAiScore(0);
    setPlayerDice([]);
    setAiDice([]);
  };

  const rollRound = async () => {
    setRolling(true);
    
    // Simulate rolling animation
    for (let i = 0; i < 10; i++) {
      setPlayerDice([rollDice(), rollDice()]);
      setAiDice([rollDice(), rollDice()]);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Final roll
    const finalPlayerDice = [rollDice(), rollDice()];
    const finalAiDice = [rollDice(), rollDice()];
    
    setPlayerDice(finalPlayerDice);
    setAiDice(finalAiDice);
    setRolling(false);
    
    const playerRoundScore = calculateScore(finalPlayerDice);
    const aiRoundScore = calculateScore(finalAiDice);
    
    const newPlayerScore = playerScore + playerRoundScore;
    const newAiScore = aiScore + aiRoundScore;
    
    setPlayerScore(newPlayerScore);
    setAiScore(newAiScore);
    
    const newCurrentRound = currentRound + 1;
    setCurrentRound(newCurrentRound);
    
    if (newCurrentRound >= rounds) {
      setGameOver(true);
      
      let gameWinner: 'player' | 'ai' | 'tie';
      if (newPlayerScore > newAiScore) {
        gameWinner = 'player';
        const baseTokens = rounds === 1 ? 10 : rounds === 3 ? 25 : 50;
        const scoreBonus = Math.floor((newPlayerScore - newAiScore) * 2);
        const totalTokens = baseTokens + scoreBonus;
        
        addGameSession({
          gameType: 'dice',
          score: totalTokens,
          tokensEarned: totalTokens,
          difficulty: rounds === 1 ? 'easy' : rounds === 3 ? 'medium' : 'hard',
          completedAt: Date.now()
        });
      } else if (newPlayerScore < newAiScore) {
        gameWinner = 'ai';
      } else {
        gameWinner = 'tie';
        // Small consolation prize for tie
        addGameSession({
          gameType: 'dice',
          score: 5,
          tokensEarned: 5,
          difficulty: rounds === 1 ? 'easy' : rounds === 3 ? 'medium' : 'hard',
          completedAt: Date.now()
        });
      }
      
      setWinner(gameWinner);
    }
  };

  const getGameStatusMessage = () => {
    if (!gameStarted) return 'Ready to roll?';
    if (rolling) return 'Rolling...';
    if (gameOver) {
      if (winner === 'player') return '🎉 You Won!';
      if (winner === 'ai') return '😔 AI Won!';
      return '🤝 It\'s a Tie!';
    }
    return `Round ${currentRound + 1} of ${rounds}`;
  };

  const getStatusColor = () => {
    if (gameOver) {
      if (winner === 'player') return 'text-green-400';
      if (winner === 'ai') return 'text-red-400';
      return 'text-yellow-400';
    }
    return 'text-white';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-lg w-full border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎲 Dice Battle</h1>
          <p className="text-gray-300">Roll higher to win!</p>
        </div>

        {!gameStarted ? (
          <div className="text-center space-y-6">
            <div>
              <label className="block text-white font-medium mb-3">Choose Game Length:</label>
              <div className="space-y-2">
                {[
                  { rounds: 1, label: 'Quick (1 round)', tokens: '10', difficulty: 'easy' },
                  { rounds: 3, label: 'Standard (3 rounds)', tokens: '25', difficulty: 'medium' },
                  { rounds: 5, label: 'Marathon (5 rounds)', tokens: '50', difficulty: 'hard' }
                ].map(({ rounds: r, label, tokens }) => (
                  <button
                    key={r}
                    onClick={() => setRounds(r)}
                    className={`
                      w-full p-3 rounded-lg font-medium transition-all duration-200
                      ${rounds === r
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }
                    `}
                  >
                    {label} (up to {tokens} tokens)
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
              {getGameStatusMessage()}
            </div>

            {/* Score Display */}
            <div className="flex justify-between items-center bg-white/5 rounded-lg p-4">
              <div className="text-center">
                <div className="text-blue-400 font-bold">You</div>
                <div className="text-2xl font-bold text-white">{playerScore}</div>
              </div>
              <div className="text-white text-lg font-bold">VS</div>
              <div className="text-center">
                <div className="text-red-400 font-bold">AI</div>
                <div className="text-2xl font-bold text-white">{aiScore}</div>
              </div>
            </div>

            {/* Dice Display */}
            {(playerDice.length > 0 || aiDice.length > 0) && (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="text-center">
                    <div className="text-blue-400 font-medium mb-2">Your Dice</div>
                    <div className="flex space-x-2">
                      {playerDice.map((dice, index) => (
                        <div key={index} className="text-4xl">
                          {diceEmojis[dice]}
                        </div>
                      ))}
                    </div>
                    <div className="text-white font-bold mt-1">
                      {calculateScore(playerDice)}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-red-400 font-medium mb-2">AI Dice</div>
                    <div className="flex space-x-2">
                      {aiDice.map((dice, index) => (
                        <div key={index} className="text-4xl">
                          {diceEmojis[dice]}
                        </div>
                      ))}
                    </div>
                    <div className="text-white font-bold mt-1">
                      {calculateScore(aiDice)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!gameOver ? (
              <button
                onClick={rollRound}
                disabled={rolling}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg disabled:scale-100"
              >
                {rolling ? '🎲 Rolling...' : `Roll Round ${currentRound + 1}`}
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={startGame}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Play Again
                </button>
                <button
                  onClick={() => setGameStarted(false)}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
                >
                  Change Settings
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
