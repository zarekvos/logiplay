import { useGame } from '../contexts/GameContext';
import { GameType } from '../contexts/GameContext';

interface GameNavbarProps {
  onBackToGames?: () => void;
}

const gameIcons: Record<GameType, string> = {
  maze: '🗿',
  'guess-number': '🧠',
  'tic-tac-toe': '🕵️',
  memory: '⚛️',
  hangman: '🎪',
  reaction: '⚡',
  snake: '🐍',
  dice: '🎲'
};

const gameNames: Record<GameType, string> = {
  maze: 'Maze Explorer',
  'guess-number': 'Mind Matrix',
  'tic-tac-toe': 'Crypto Cipher',
  memory: 'Quantum Memory',
  hangman: 'Word Hangman',
  reaction: 'Reaction Test',
  snake: 'Snake Game',
  dice: 'Dice Battle'
};

// Only show enhanced/working games
const availableGames: GameType[] = ['maze', 'guess-number', 'tic-tac-toe', 'memory'];

export default function GameNavbar({ onBackToGames }: GameNavbarProps) {
  const { currentGame, switchGame } = useGame();

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 shadow-lg border-b border-purple-500/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Back Button */}
          <div className="flex items-center space-x-4">
            {onBackToGames && (
              <button
                onClick={onBackToGames}
                className="text-white hover:text-yellow-400 transition-colors duration-200 flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <span>←</span>
                <span className="hidden sm:inline">Back to Games</span>
              </button>
            )}
            <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              🧠 LogiPlay Gaming
            </div>
          </div>

          {/* Game Selection */}
          <div className="hidden md:flex items-center space-x-1">
            {availableGames.map((game) => (
              <button
                key={game}
                onClick={() => switchGame(game)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${currentGame === game
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <span className="text-lg">{gameIcons[game]}</span>
                <span className="hidden lg:inline">{gameNames[game]}</span>
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <select
              value={currentGame}
              onChange={(e) => switchGame(e.target.value as GameType)}
              className="bg-purple-800 text-white border border-purple-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {availableGames.map((game) => (
                <option key={game} value={game}>
                  {gameIcons[game]} {gameNames[game]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile Game Grid (visible on small screens) */}
        <div className="md:hidden pb-4">
          <div className="grid grid-cols-2 gap-2">
            {availableGames.map((game) => (
              <button
                key={game}
                onClick={() => switchGame(game)}
                className={`
                  flex flex-col items-center p-3 rounded-lg text-xs font-medium transition-all duration-200
                  ${currentGame === game
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <span className="text-2xl mb-1">{gameIcons[game]}</span>
                <span className="text-center leading-tight">{gameNames[game]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
