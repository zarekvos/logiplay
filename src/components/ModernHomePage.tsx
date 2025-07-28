import { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useGame } from '../contexts/GameContext';
import ClaimedTokensDisplay from './ClaimedTokensDisplay';
import ModernNavbar from './ModernNavbar';

interface HomePageProps {
  onStartGame: () => void;
  onShowAbout?: () => void;
  onShowGames?: () => void;
  onShowLeaderboard?: () => void;
}

export default function HomePage({ onShowAbout, onShowGames, onShowLeaderboard }: HomePageProps) {
  const { isConnected, address, connectWallet, isLoading } = useWallet();
  const { gameState, totalClaimedTokens, syncWalletData, getUserLevel, getLevelProgress, getMilestone, formatTokens, setDemoMode } = useGame();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sync wallet data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      syncWalletData(address);
    }
  }, [isConnected, address, syncWalletData]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDemoMode = () => {
    setDemoMode(true);
    if (onShowGames) {
      onShowGames(); // Navigate to games center in demo mode
    }
  };

  const handleWalletMode = () => {
    if (!isConnected) {
      connectWallet().then(() => {
        setDemoMode(false);
        if (onShowGames) {
          onShowGames();
        }
      });
    } else {
      setDemoMode(false);
      if (onShowGames) {
        onShowGames();
      }
    }
  };

  const gameStats = [
    { icon: '🎮', value: '8+', label: 'Games', color: 'from-blue-500 to-cyan-500' },
    { icon: '🧠', value: '∞', label: 'Challenges', color: 'from-purple-500 to-pink-500' },
    { icon: '💰', value: '100B', label: '$LOGIQ Supply', color: 'from-yellow-500 to-orange-500' },
    { icon: '🌐', value: 'Web3', label: 'Powered', color: 'from-green-500 to-emerald-500' }
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Instant Play',
      description: 'No downloads, no waiting. Click and play immediately.',
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      icon: '🎯',
      title: 'Skill-Based',
      description: 'Pure logic and strategy. Your brain is your weapon.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: '💎',
      title: 'Earn $LOGIQ',
      description: 'Performance-based rewards with real utility.',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '🔗',
      title: 'Web3 Native',
      description: 'Connect wallet, own achievements, trade tokens.',
      gradient: 'from-green-500 to-cyan-500'
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Mouse Follower */}
      <div 
        className="fixed pointer-events-none z-10 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Modern Navbar */}
      <ModernNavbar
        onShowAbout={onShowAbout}
        onShowGames={onShowGames}
        onShowLeaderboard={onShowLeaderboard}
        isConnected={isConnected}
        address={address || undefined}
        connectWallet={connectWallet}
        isLoading={isLoading}
      />

      {/* Main Content */}
      <main className="relative z-20 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Main Title with Stunning Animation */}
            <div className="relative mb-8">
              <h1 className="text-7xl md:text-9xl font-black mb-6 relative">
                <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Logi
                </span>
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                  Play
                </span>
              </h1>
              
              {/* Animated Underline */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full">
                <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Subtitle with Typewriter Effect */}
            <div className="mb-12">
              <p className="text-2xl md:text-4xl font-bold text-gray-300 mb-4">
                Challenge your mind.
              </p>
              <p className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Embrace Web3.
              </p>
            </div>

            {/* Hero Description Card */}
            <div className="max-w-4xl mx-auto mb-16 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 group">
              <div className="space-y-6">
                <p className="text-xl text-gray-300 leading-relaxed">
                  LogiPlay is a <span className="text-cyan-400 font-semibold">Web3-powered gaming platform</span> that brings together 
                  timeless logic-based mini-games and modern blockchain identity. Whether you're solving a maze, 
                  racing against your reaction time, or outsmarting opponents — every move 
                  <span className="text-purple-400 font-semibold"> sharpens your mind</span> and 
                  <span className="text-yellow-400 font-semibold"> rewards your progress</span>.
                </p>
                
                <div className="flex items-center justify-center space-x-4 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20">
                  <span className="text-3xl">🚀</span>
                  <p className="text-lg text-gray-300">
                    Powered by <span className="text-yellow-400 font-bold text-xl">$LOGIQ</span> — 
                    transforming casual games into meaningful experiences
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Play smart. Earn smarter.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {gameStats.map((stat, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${stat.color} p-1 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="bg-black/20 backdrop-blur-xl p-6 rounded-2xl text-center h-full">
                    <div className="text-4xl mb-3">{stat.icon}</div>
                    <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
              {/* Demo Mode Button */}
              <button
                onClick={handleDemoMode}
                className="relative overflow-hidden bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center space-x-3">
                  <span className="text-2xl">🎮</span>
                  <span>Try Demo Mode</span>
                </span>
              </button>

              {/* Wallet Mode Button */}
              <button
                onClick={handleWalletMode}
                disabled={isLoading}
                className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-2xl group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative flex items-center space-x-3">
                  <span className="text-2xl">💰</span>
                  <span>
                    {isLoading ? 'Connecting...' : isConnected ? 'Play & Earn $LOGIQ' : 'Connect & Earn'}
                  </span>
                </span>
              </button>

              {/* Info Text */}
              <div className="text-center max-w-md">
                <p className="text-white/80 text-sm mb-2">
                  🎮 <span className="text-green-400 font-semibold">Demo Mode</span>: Try all games instantly, no wallet needed
                </p>
                <p className="text-white/80 text-sm">
                  💰 <span className="text-blue-400 font-semibold">Earn Mode</span>: Connect wallet to claim real $LOGIQ tokens
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                
                <div className="relative">
                  <div className="text-5xl mb-6 group-hover:animate-bounce">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Game Progress & Tokens */}
          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Current Ranking Card */}
            <div className="flex-1 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30 shadow-2xl">
              <h4 className="text-2xl font-bold text-white mb-6 text-center">🏅 Your Current Ranking</h4>
              
              {isConnected ? (
                <div className="space-y-6">
                  {/* Current Rank Display */}
                  <div className="text-center">
                    <div className={`inline-flex items-center space-x-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30`}>
                      <span className="text-4xl">{getMilestone().emoji}</span>
                      <div>
                        <div className={`text-2xl font-bold ${getMilestone().color}`}>
                          {getMilestone().rank}
                        </div>
                        <div className="text-sm text-gray-400">Current Rank</div>
                      </div>
                    </div>
                  </div>

                  {/* Ranking Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">🏆</div>
                      <div className="text-xl font-bold text-yellow-400">{getUserLevel()}</div>
                      <div className="text-sm text-gray-400">Global Level</div>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4 text-center">
                      <div className="text-3xl mb-2">💰</div>
                      <div className="text-xl font-bold text-green-400">{formatTokens(totalClaimedTokens)}</div>
                      <div className="text-sm text-gray-400">Total Earned</div>
                    </div>
                  </div>

                  {/* Progress to Next Rank */}
                  {getMilestone().nextRank && (
                    <div className="bg-black/20 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progress to {getMilestone().nextRank}</span>
                        <span className="text-sm text-yellow-400">{formatTokens(getMilestone().tokensNeeded)} needed</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getLevelProgress()}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Achievement Badges */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className={`text-center p-3 rounded-lg ${getUserLevel() >= 5 ? 'bg-yellow-500/20 border border-yellow-400/30' : 'bg-gray-500/20 border border-gray-600/30'}`}>
                      <div className="text-2xl mb-1">{getUserLevel() >= 5 ? '🌟' : '⭐'}</div>
                      <div className="text-xs text-gray-400">Level 5+</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${totalClaimedTokens >= 100000 ? 'bg-blue-500/20 border border-blue-400/30' : 'bg-gray-500/20 border border-gray-600/30'}`}>
                      <div className="text-2xl mb-1">{totalClaimedTokens >= 100000 ? '💎' : '💠'}</div>
                      <div className="text-xs text-gray-400">100K Tokens</div>
                    </div>
                    <div className={`text-center p-3 rounded-lg ${getUserLevel() >= 10 ? 'bg-purple-500/20 border border-purple-400/30' : 'bg-gray-500/20 border border-gray-600/30'}`}>
                      <div className="text-2xl mb-1">{getUserLevel() >= 10 ? '👑' : '🔒'}</div>
                      <div className="text-xs text-gray-400">Level 10+</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔗</div>
                  <h5 className="text-xl font-semibold text-white mb-4">Connect your wallet to see your position and earned tokens!</h5>
                  <button
                    onClick={() => connectWallet()}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                  >
                    {isLoading ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                </div>
              )}
            </div>

            {/* Progress Card */}
            {(getUserLevel() > 1 || totalClaimedTokens > 0) && (
              <div className="flex-1 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl">
                <h4 className="text-2xl font-bold text-white mb-6 text-center">🏆 Your Progress</h4>
                
                {/* Level and Milestone Display */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-white font-semibold text-lg">Level {getUserLevel()}</span>
                      <div className={`text-sm font-medium mt-1 ${getMilestone().color}`}>
                        {getMilestone().emoji} {getMilestone().rank}
                      </div>
                    </div>
                    <div className="text-right">
                      {getMilestone().nextRank ? (
                        <span className="text-gray-300 text-sm">
                          Next: {getMilestone().nextRank}<br/>
                          <span className="text-yellow-400">{formatTokens(getMilestone().tokensNeeded)} needed</span>
                        </span>
                      ) : (
                        <span className="text-rainbow text-sm font-bold animate-pulse">
                          🎉 Max Rank Achieved!
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {getUserLevel() < 100 && (
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${getLevelProgress()}%` }}
                      ></div>
                    </div>
                  )}
                  
                  <div className="text-center text-sm text-gray-400">
                    {getUserLevel() >= 100 
                      ? '🎉 Maximum level achieved!' 
                      : `${getLevelProgress().toFixed(1)}% to Level ${getUserLevel() + 1}`
                    }
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-2xl font-black text-blue-400 mb-1" title={`Level ${getUserLevel()}`}>
                      {getUserLevel()}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">User Level</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4">
                    <div className="text-2xl font-black text-purple-400 mb-1" title={gameState.score.toString()}>
                      {gameState.score}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">Completed</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4">
                    <div 
                      className="text-xl sm:text-2xl font-black text-green-400 mb-1 break-words leading-tight" 
                      title={`${gameState.tokens.toLocaleString()} $LOGIQ`}
                    >
                      {formatTokens(gameState.tokens)}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">Current $LOGIQ</div>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4">
                    <div 
                      className="text-xl sm:text-2xl font-black text-yellow-400 mb-1 break-words leading-tight" 
                      title={`${totalClaimedTokens.toLocaleString()} $LOGIQ`}
                    >
                      {formatTokens(totalClaimedTokens)}
                    </div>
                    <div className="text-xs text-gray-400 font-medium">Total Claimed</div>
                  </div>
                </div>
              </div>
            )}

            {/* Claimed Tokens */}
            <div className="flex-1">
              <ClaimedTokensDisplay />
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-12 border-t border-white/10">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <span className="text-xl font-bold text-white">LogiPlay</span>
            </div>
            <p className="text-gray-400 text-lg mb-2">
              Made with ❤️ by <span className="text-purple-400 font-bold text-xl">Zarekvos</span>
            </p>
            <p className="text-gray-500">
              Building the future of logic-based GameFi 🚀
            </p>
          </div>
        </div>
      </main>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}
