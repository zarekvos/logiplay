import { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryGameProps {
  onBack?: () => void;
}

export default function MemoryGameEnhanced({ onBack }: MemoryGameProps) {
  const { addGameSession, claimRewards } = useGame();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showingCards, setShowingCards] = useState<boolean>(false);
  const [tokensEarned, setTokensEarned] = useState<number>(0);
  const [canClaim, setCanClaim] = useState<boolean>(false);

  const difficultySettings = {
    easy: { 
      pairs: 6, 
      gridCols: 3, 
      reward: 1000000, 
      name: 'Quantum Basics',
      symbols: ['⚛️', '🌌', '💫', '🔬', '🧬', '🌟']
    },
    medium: { 
      pairs: 8, 
      gridCols: 4, 
      reward: 2500000, 
      name: 'Quantum Advanced',
      symbols: ['⚛️', '🌌', '💫', '🔬', '🧬', '🌟', '🚀', '⭐']
    },
    hard: { 
      pairs: 12, 
      gridCols: 4, 
      reward: 7500000, 
      name: 'Quantum Master',
      symbols: ['⚛️', '🌌', '💫', '🔬', '🧬', '🌟', '🚀', '⭐', '🌠', '🔭', '🌀', '💥']
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, startTime]);

  const createCards = (symbols: string[]): Card[] => {
    const pairs = [...symbols, ...symbols];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    return shuffled.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));
  };

  const startGame = () => {
    const settings = difficultySettings[difficulty];
    const newCards = createCards(settings.symbols);
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameStarted(true);
    setGameOver(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    
    // Show all cards briefly at start
    setShowingCards(true);
    setTimeout(() => setShowingCards(false), 2000);
  };

  const flipCard = (cardId: number) => {
    if (flippedCards.length === 2 || showingCards) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prevCards => 
      prevCards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard?.symbol === secondCard?.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(c => 
              c.id === firstId || c.id === secondId 
                ? { ...c, isMatched: true } 
                : c
            )
          );
          setMatches(prev => prev + 1);
          setFlippedCards([]);
          
          // Check if game is complete
          const newMatches = matches + 1;
          if (newMatches === difficultySettings[difficulty].pairs) {
            setGameOver(true);
            const timeBonus = Math.max(0, 60000 - elapsedTime) / 1000;
            const moveBonus = Math.max(0, difficultySettings[difficulty].pairs * 2 - moves);
            const totalReward = Math.floor(
              difficultySettings[difficulty].reward + 
              timeBonus * 100 + 
              moveBonus * 1000
            );
            
            setTokensEarned(totalReward);
            setCanClaim(true);
            
            addGameSession({
              gameType: 'memory' as const,
              score: totalReward,
              tokensEarned: totalReward,
              completedAt: Date.now(),
              difficulty: difficulty
            });
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(c => 
              c.id === firstId || c.id === secondId 
                ? { ...c, isFlipped: false } 
                : c
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handleClaimRewards = () => {
    if (canClaim && tokensEarned > 0) {
      claimRewards();
      setCanClaim(false);
      setTokensEarned(0);
    }
  };

  const resetGame = () => {
    setCards([]);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameStarted(false);
    setGameOver(false);
    setElapsedTime(0);
    setShowingCards(false);
    setTokensEarned(0);
    setCanClaim(false);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 via-orange-900 to-red-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Beautiful Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={onBack}
          className="group relative overflow-hidden bg-gradient-to-r from-yellow-600/80 via-orange-600/80 to-red-600/80 backdrop-blur-sm hover:from-yellow-700 hover:via-orange-700 hover:to-red-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40 shadow-2xl hover:shadow-yellow-500/25"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative flex items-center space-x-3">
            <span className="text-2xl group-hover:rotate-12 transition-transform duration-300">←</span>
            <span className="hidden sm:inline">Back to Games</span>
            <span className="sm:hidden">Games</span>
          </span>
        </button>
      </div>

      {/* Background Quantum Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-orange-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-red-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Quantum Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }}></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/30 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-pulse">⚛️</div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent mb-2">
            Quantum Calculator
          </h1>
          <p className="text-yellow-300">Master Quantum Memory Patterns</p>
        </div>

        {!gameStarted ? (
          /* Game Setup */
          <div className="max-w-md mx-auto space-y-6">
            <div>
              <label className="block text-yellow-300 mb-3 font-semibold">🌌 Quantum Difficulty:</label>
              <div className="space-y-2">
                {Object.entries(difficultySettings).map(([key, settings]) => (
                  <button
                    key={key}
                    onClick={() => setDifficulty(key as any)}
                    className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                      difficulty === key
                        ? 'bg-yellow-500/30 border-yellow-400 text-white'
                        : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/20'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{settings.name}</span>
                      <span className="text-sm">{settings.reward.toLocaleString()} LOGIQ</span>
                    </div>
                    <div className="text-sm opacity-75">
                      {settings.pairs} pairs • {settings.gridCols}x{Math.ceil(settings.pairs * 2 / settings.gridCols)} grid
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center space-x-2">
                <span>Initialize Quantum Memory</span>
                <span className="text-xl animate-bounce">🚀</span>
              </span>
            </button>
          </div>
        ) : (
          /* Game Interface */
          <div className="space-y-6">
            {/* Game Stats */}
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="bg-yellow-500/20 rounded-xl p-4 border border-yellow-500/30 text-center">
                <div className="text-sm text-yellow-300">Time</div>
                <div className="text-xl font-bold text-white">{formatTime(elapsedTime)}</div>
              </div>
              <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-500/30 text-center">
                <div className="text-sm text-orange-300">Moves</div>
                <div className="text-xl font-bold text-white">{moves}</div>
              </div>
              <div className="bg-red-500/20 rounded-xl p-4 border border-red-500/30 text-center">
                <div className="text-sm text-red-300">Matches</div>
                <div className="text-xl font-bold text-white">{matches}/{difficultySettings[difficulty].pairs}</div>
              </div>
              <div className="bg-purple-500/20 rounded-xl p-4 border border-purple-500/30 text-center">
                <div className="text-sm text-purple-300">Accuracy</div>
                <div className="text-xl font-bold text-white">
                  {moves > 0 ? Math.round((matches / moves) * 100) : 100}%
                </div>
              </div>
            </div>

            {showingCards && (
              <div className="text-center bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-200 font-medium">🧠 Memorize the quantum patterns...</p>
              </div>
            )}

            {/* Game Board */}
            <div className="bg-black/30 rounded-xl p-6 border border-gray-600/30">
              <div 
                className={`grid gap-3 max-w-2xl mx-auto`}
                style={{ 
                  gridTemplateColumns: `repeat(${difficultySettings[difficulty].gridCols}, 1fr)` 
                }}
              >
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => flipCard(card.id)}
                    disabled={card.isMatched || card.isFlipped || flippedCards.length === 2 || showingCards}
                    className={`aspect-square bg-gradient-to-br rounded-xl flex items-center justify-center text-4xl font-bold transition-all duration-500 transform hover:scale-105 border-2 ${
                      card.isMatched
                        ? 'from-green-600 to-emerald-700 border-green-400 animate-pulse cursor-not-allowed'
                        : card.isFlipped || showingCards
                        ? 'from-yellow-600 to-orange-700 border-yellow-400 cursor-not-allowed'
                        : 'from-gray-700 to-gray-800 border-gray-600 hover:border-yellow-400 hover:from-yellow-600/20 hover:to-orange-600/20 cursor-pointer'
                    } ${
                      showingCards ? 'scale-105' : ''
                    }`}
                    style={{
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div className={`transition-all duration-300 ${
                      card.isFlipped || card.isMatched || showingCards 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-75'
                    }`}>
                      {card.isFlipped || card.isMatched || showingCards ? card.symbol : '❓'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {gameOver && (
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">🎉</div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-green-300 mb-2">Quantum Memory Mastered!</h3>
                  <p className="text-green-200">
                    Completed in {moves} moves and {formatTime(elapsedTime)}
                  </p>
                </div>
                
                {/* Reward Section */}
                {tokensEarned > 0 && (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 space-y-3">
                    <div className="text-yellow-300 font-semibold">⚛️ Quantum Rewards</div>
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
                  className="w-full max-w-md mx-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Reset Quantum Field
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
