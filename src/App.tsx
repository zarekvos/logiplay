import { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import { WalletProvider } from './contexts/WalletContext';
import ModernHomePage from './components/ModernHomePage';
import AboutPage from './components/AboutPage';
import GamesCenter from './components/GamesCenter';
import Leaderboard from './components/Leaderboard';
import GameContainer from './components/GameContainer';
import GuessNumberGameEnhanced from './components/games/GuessNumberGameEnhanced';
import TicTacToeGameEnhanced from './components/games/TicTacToeGameEnhanced';
import MemoryGameEnhanced from './components/games/MemoryGameEnhanced';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'game' | 'games' | 'leaderboard'>('home');
  const [selectedGameId, setSelectedGameId] = useState<number>(1);

  const handleStartGame = (gameId?: number) => {
    if (gameId) setSelectedGameId(gameId);
    setCurrentView('game');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleShowAbout = () => {
    setCurrentView('about');
  };

  const handleShowGames = () => {
    setCurrentView('games');
  };

  const handleBackToGames = () => {
    setCurrentView('games');
  };

  const handleShowLeaderboard = () => {
    setCurrentView('leaderboard');
  };

  return (
    <WalletProvider>
      <GameProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          {currentView === 'home' && (
            <ModernHomePage 
              onStartGame={handleStartGame} 
              onShowAbout={handleShowAbout}
              onShowGames={handleShowGames}
              onShowLeaderboard={handleShowLeaderboard}
            />
          )}
          {currentView === 'about' && (
            <AboutPage onBackToHome={handleBackToHome} onShowGames={handleShowGames} />
          )}
          {currentView === 'games' && (
            <GamesCenter onBackToHome={handleBackToHome} onStartGame={handleStartGame} />
          )}
          {currentView === 'leaderboard' && (
            <Leaderboard onBackToHome={handleBackToHome} />
          )}
          {currentView === 'game' && (
            <>
              {selectedGameId === 1 && <GameContainer onBack={handleBackToGames} />}
              {selectedGameId === 2 && <GuessNumberGameEnhanced onBack={handleBackToGames} />}
              {selectedGameId === 3 && <TicTacToeGameEnhanced onBack={handleBackToGames} />}
              {selectedGameId === 4 && <MemoryGameEnhanced onBack={handleBackToGames} />}
            </>
          )}
        </div>
      </GameProvider>
    </WalletProvider>
  );
}

export default App;
