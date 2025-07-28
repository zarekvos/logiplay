import { useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useGame } from '../contexts/GameContext';
import ClaimedTokensDisplay from './ClaimedTokensDisplay';

interface HomePageProps {
  onStartGame: () => void;
  onShowAbout?: () => void;
}

export default function HomePage({ onStartGame }: HomePageProps) {
  const { isConnected, address, connectWallet, isLoading } = useWallet();
  const { gameState } = useGame();

  useEffect(() => {
    // Auto-scroll to stats when connected
    if (isConnected) {
      console.log('Wallet connected:', address);
    }
  }, [isConnected, address]);

  const handleStartGame = () => {
    if (!isConnected) {
      connectWallet().then(() => {
        // After wallet connection, the button text will change
        // and user can click again to start the game
      });
      return;
    }
    onStartGame();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-black/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">🧠</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-game">LogiPlay</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <div className="flex items-center space-x-3 bg-green-500/20 px-4 py-2 rounded-lg border border-green-500/30">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-100 text-sm font-mono">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet'}
              </span>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? '🔄 Connecting...' : '🔗 Connect Wallet'}
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h2 className="text-6xl font-bold text-white font-game mb-4">
              Welcome to <span className="gradient-text">LogiPlay</span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-2xl mx-auto font-medium">
              Challenge your mind. Embrace Web3.
            </p>
          </div>

          {/* Hero Description */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 max-w-4xl mx-auto">
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed text-lg">
                LogiPlay is a Web3-powered gaming platform that brings together timeless logic-based mini-games 
                and modern blockchain identity. Whether you're solving a maze, racing against your own reaction time, 
                or outsmarting your opponent in Tic Tac Toe — every move sharpens your mind and rewards your progress.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                🚀 Powered by <span className="text-yellow-400 font-semibold">$LOGIQ</span>, our native utility token, 
                LogiPlay transforms casual games into meaningful experiences. No grinding, no randomness — just pure logic, 
                skill, and satisfaction.
              </p>
              <div className="text-center">
                <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Play smart. Earn smarter.
                </p>
              </div>
            </div>
          </div>

          {/* Game Stats */}
          {gameState.level > 1 && (
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 max-w-md mx-auto">
              <h4 className="text-lg font-semibold text-white mb-4">Your Progress</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-400">{gameState.level}</div>
                  <div className="text-xs text-gray-400">Level</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{gameState.score}</div>
                  <div className="text-xs text-gray-400">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">{gameState.tokens}</div>
                  <div className="text-xs text-gray-400">$LOGIQ</div>
                </div>
              </div>
            </div>
          )}

          {/* Claimed Tokens Display */}
          <div className="max-w-md mx-auto">
            <ClaimedTokensDisplay />
          </div>

          {/* Call to Action */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-white">🚀 Start Your Gaming Journey</h3>
            <p className="text-lg text-gray-300">
              Step into the world of LogiPlay — solve puzzles, earn $LOGIQ, and become a Web3 gaming champion!
            </p>
            
            <button
              onClick={handleStartGame}
              disabled={isLoading}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 neon-glow disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? '🔄 Connecting...' : isConnected ? '🎮 Start Playing Now' : '🔗 Connect Wallet & Play'}
            </button>
            
            {!isConnected && !isLoading && (
              <p className="text-gray-400 text-sm mt-2">
                MetaMask wallet required to play LogiPlay
              </p>
            )}
          </div>

          {/* Footer Credit */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-gray-400 text-sm">
              Made with ❤️ by <span className="text-purple-400 font-semibold">Zarekvos</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
