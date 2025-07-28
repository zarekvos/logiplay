import { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import { WalletProvider } from './contexts/WalletContext';
import ModernHomePage from './components/ModernHomePage';
import ModernAboutPage from './components/ModernAboutPage';
import GameNavbar from './components/GameNavbar';
import GameContainer from './components/GameContainer';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'game'>('home');

  const handleStartGame = () => {
    setCurrentView('game');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleShowAbout = () => {
    setCurrentView('about');
  };

  return (
    <WalletProvider>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          {currentView === 'home' && (
            <ModernHomePage onStartGame={handleStartGame} onShowAbout={handleShowAbout} />
          )}
          {currentView === 'about' && (
            <ModernAboutPage onBackToHome={handleBackToHome} />
          )}
          {currentView === 'game' && (
            <>
              <GameNavbar />
              <GameContainer onBack={handleBackToHome} />
              <div className="fixed top-4 left-4 z-50">
                <button
                  onClick={handleBackToHome}
                  className="bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/20 hover:border-white/40 transition-all duration-200 flex items-center space-x-2"
                >
                  <span>←</span>
                  <span>Back to Home</span>
                </button>
              </div>
            </>
          )}
        </div>
      </GameProvider>
    </WalletProvider>
  );
}

export default App;
