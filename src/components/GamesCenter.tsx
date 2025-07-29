import { useState, useEffect } from 'react';

interface GamesCenterProps {
  onBackToHome?: () => void;
  onStartGame?: (gameId: number) => void;
}

export default function GamesCenter({ onBackToHome, onStartGame }: GamesCenterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const games = [
    {
      id: 1,
      title: 'Maze Explorer',
      description: 'Navigate through mysterious ancient mazes filled with hidden treasures and $LOGIQ rewards',
      icon: '🏛️',
      secondaryIcon: '🗝️',
      difficulty: 'Easy',
      reward: '500-5K LOGIQ',
      color: 'from-emerald-500 via-teal-600 to-cyan-700',
      theme: 'Adventure & Exploration',
      features: ['🗺️ Dynamic Maps', '💎 Hidden Treasures', '⚡ Power-ups']
    },
    {
      id: 2,
      title: 'Mind Matrix',
      description: 'Crack complex neural puzzles and unlock the secrets of artificial intelligence',
      icon: '🧠',
      secondaryIcon: '⚡',
      difficulty: 'Medium',
      reward: '1K-25K LOGIQ',
      color: 'from-purple-500 via-indigo-600 to-blue-700',
      theme: 'AI & Neural Networks',
      features: ['🔮 Neural Patterns', '🤖 AI Challenges', '💡 Logic Circuits']
    },
    {
      id: 3,
      title: 'Crypto Cipher',
      description: 'Decode blockchain mysteries and solve cryptographic patterns like a true detective',
      icon: '🔐',
      secondaryIcon: '🕵️',
      difficulty: 'Hard',
      reward: '5K-100K LOGIQ',
      color: 'from-orange-500 via-red-600 to-pink-700',
      theme: 'Cryptography & Detective',
      features: ['🔑 Secret Keys', '📜 Ancient Codes', '🎯 Pattern Hunt']
    },
    {
      id: 4,
      title: 'Quantum Calculator',
      description: 'Master quantum mathematics and solve interdimensional numerical challenges',
      icon: '⚛️',
      secondaryIcon: '🌌',
      difficulty: 'Expert',
      reward: '10K-1M LOGIQ',
      color: 'from-yellow-400 via-orange-500 to-red-600',
      theme: 'Quantum Physics & Math',
      features: ['🌠 Quantum Mechanics', '🔢 Multi-dimensional', '🚀 Space-time Math']
    },
    {
      id: 5,
      title: 'Snake & Ladder',
      description: 'Race against AI in this classic board game. Roll dice, climb ladders, avoid snakes!',
      icon: '🐍',
      secondaryIcon: '🪜',
      difficulty: 'Easy',
      reward: '1K-10K LOGIQ',
      color: 'from-green-500 via-lime-600 to-emerald-700',
      theme: 'Classic vs AI',
      features: ['🤖 AI Opponent', '🎲 Dice Mechanics', '� Win-based Rewards']
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation Bar */}
      <nav className="relative z-50 flex items-center justify-between p-6">
        <button
          onClick={onBackToHome}
          className="flex items-center space-x-3 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-semibold border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 group"
        >
          <span className="text-xl transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
          <span>Back to Home</span>
        </button>

        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Games Center
          </h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-20 pt-8 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Game Center
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Choose Your Challenge, Earn Your Rewards
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {games.map((game, index) => (
              <div
                key={game.id}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-15 rounded-3xl transition-all duration-700`}></div>
                
                {/* Floating Particles for Each Game Theme */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className={`absolute w-2 h-2 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-1000 ${
                        game.id === 1 ? 'bg-emerald-400' :
                        game.id === 2 ? 'bg-purple-400' :
                        game.id === 3 ? 'bg-orange-400' :
                        game.id === 4 ? 'bg-yellow-400' :
                        'bg-green-400'
                      }`}
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative z-10">
                  {/* Header with Multiple Icons and Theme */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="text-5xl group-hover:animate-bounce transition-transform duration-300 group-hover:scale-110">
                        {game.icon}
                      </div>
                      <div className="text-3xl opacity-70 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-pulse">
                        {game.secondaryIcon}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">💰 Reward</div>
                      <div className="text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">
                        {game.reward}
                      </div>
                    </div>
                  </div>

                  {/* Game Theme Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all duration-300 ${
                      game.id === 1 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 group-hover:bg-emerald-500/30' :
                      game.id === 2 ? 'bg-purple-500/20 text-purple-300 border-purple-500/30 group-hover:bg-purple-500/30' :
                      game.id === 3 ? 'bg-orange-500/20 text-orange-300 border-orange-500/30 group-hover:bg-orange-500/30' :
                      game.id === 4 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 group-hover:bg-yellow-500/30' :
                      'bg-green-500/20 text-green-300 border-green-500/30 group-hover:bg-green-500/30'
                    }`}>
                      {game.theme}
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">{game.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors">{game.description}</p>

                  {/* Game Features */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-400 mb-3 font-semibold">🎮 Game Features:</div>
                    <div className="grid grid-cols-1 gap-2">
                      {game.features.map((feature, idx) => (
                        <div 
                          key={idx}
                          className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300 flex items-center"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <span className="mr-2">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">🎯 Difficulty:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 ${
                        game.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 group-hover:bg-green-500/30' :
                        game.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500/30' :
                        game.difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-400 group-hover:bg-orange-500/30' :
                        'bg-red-500/20 text-red-400 group-hover:bg-red-500/30'
                      }`}>
                        {game.difficulty}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => onStartGame?.(game.id)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 group/btn relative overflow-hidden shadow-lg hover:shadow-2xl border border-purple-500/30 hover:border-purple-400/50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                      <span className="relative flex items-center space-x-2">
                        <span>Launch Game</span>
                        <span className="text-lg group-hover/btn:animate-pulse">🚀</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon Section */}
          <div className="text-center bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30">
            <h2 className="text-4xl font-bold text-white mb-6">More Games Coming Soon!</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              We're constantly developing new challenges to test your logic and reward your intelligence. 
              Stay tuned for exciting updates!
            </p>
            <div className="flex justify-center space-x-4">
              <div className="text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎮</div>
              <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🧩</div>
              <div className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🧠</div>
              <div className="text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>🎯</div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-20px) rotate(180deg); 
            opacity: 0.6;
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1;
          }
          50% { 
            transform: scale(1.05); 
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
