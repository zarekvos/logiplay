import { useState, useEffect } from 'react';

interface LeaderboardProps {
  onBackToHome?: () => void;
}

export default function Leaderboard({ onBackToHome }: LeaderboardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const leaderboardData = {
    weekly: [
      { rank: 1, username: 'AlexCrypto92', score: 15420, games: 42, tokens: '2.5M LOGIQ', avatar: '🏆' },
      { rank: 2, username: 'MindBender_23', score: 14850, games: 38, tokens: '2.1M LOGIQ', avatar: '🥈' },
      { rank: 3, username: 'PuzzleMaster_88', score: 13920, games: 35, tokens: '1.8M LOGIQ', avatar: '🥉' },
      { rank: 4, username: 'GameChanger77', score: 12650, games: 31, tokens: '1.4M LOGIQ', avatar: '🧠' },
      { rank: 5, username: 'DigitalNinja', score: 11840, games: 28, tokens: '1.2M LOGIQ', avatar: '⚡' },
      { rank: 6, username: 'SmartPlayer_99', score: 11200, games: 26, tokens: '1.1M LOGIQ', avatar: '🎯' },
      { rank: 7, username: 'BrainHacker', score: 10850, games: 24, tokens: '950K LOGIQ', avatar: '🚀' },
      { rank: 8, username: 'LogicWizard_7', score: 10400, games: 22, tokens: '820K LOGIQ', avatar: '🧩' },
    ],
    monthly: [
      { rank: 1, username: 'MindBender_23', score: 58420, games: 156, tokens: '12.5M LOGIQ', avatar: '🏆' },
      { rank: 2, username: 'AlexCrypto92', score: 56850, games: 148, tokens: '11.8M LOGIQ', avatar: '🥈' },
      { rank: 3, username: 'GameChanger77', score: 53920, games: 142, tokens: '10.9M LOGIQ', avatar: '🥉' },
      { rank: 4, username: 'PuzzleMaster_88', score: 51650, games: 135, tokens: '9.8M LOGIQ', avatar: '🧠' },
      { rank: 5, username: 'DigitalNinja', score: 48840, games: 128, tokens: '8.7M LOGIQ', avatar: '⚡' },
      { rank: 6, username: 'SmartPlayer_99', score: 46200, games: 118, tokens: '7.9M LOGIQ', avatar: '🎯' },
      { rank: 7, username: 'BrainHacker', score: 43750, games: 112, tokens: '7.1M LOGIQ', avatar: '🚀' },
      { rank: 8, username: 'TokenHunter_21', score: 41300, games: 105, tokens: '6.4M LOGIQ', avatar: '💎' },
    ],
    alltime: [
      { rank: 1, username: 'GameChanger77', score: 298420, games: 824, tokens: '85.6M LOGIQ', avatar: '🏆' },
      { rank: 2, username: 'MindBender_23', score: 276850, games: 756, tokens: '78.2M LOGIQ', avatar: '🥈' },
      { rank: 3, username: 'AlexCrypto92', score: 253920, games: 692, tokens: '69.4M LOGIQ', avatar: '🥉' },
      { rank: 4, username: 'PuzzleMaster_88', score: 231650, games: 628, tokens: '58.9M LOGIQ', avatar: '🧠' },
      { rank: 5, username: 'DigitalNinja', score: 198840, games: 542, tokens: '45.7M LOGIQ', avatar: '⚡' },
      { rank: 6, username: 'CryptoSolver_X', score: 186420, games: 498, tokens: '41.2M LOGIQ', avatar: '🎯' },
      { rank: 7, username: 'LogicMaster_Pro', score: 174590, games: 456, tokens: '37.8M LOGIQ', avatar: '🚀' },
      { rank: 8, username: 'BrainStorm_Elite', score: 162340, games: 423, tokens: '34.1M LOGIQ', avatar: '💎' },
    ]
  };

  const currentData = leaderboardData[activeTab];

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
            Leaderboard
          </h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-20 pt-8 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Top Performers & $LOGIQ Earners
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
              {(['weekly', 'monthly', 'alltime'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 capitalize ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab === 'alltime' ? 'All Time' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 px-8 py-6 border-b border-white/10">
              <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">
                <div>Rank</div>
                <div className="col-span-2">Player</div>
                <div>Score</div>
                <div>Games</div>
                <div>Tokens Earned</div>
              </div>
            </div>

            {/* Leaderboard Entries */}
            <div className="divide-y divide-white/5">
              {currentData.map((player, index) => (
                <div
                  key={player.rank}
                  className="px-8 py-6 hover:bg-white/5 transition-all duration-300 group transform hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="grid grid-cols-6 gap-4 items-center">
                    {/* Rank */}
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                        player.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-lg shadow-yellow-400/50' :
                        player.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-black shadow-lg shadow-gray-400/50' :
                        player.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-black shadow-lg shadow-orange-400/50' :
                        'bg-white/10 text-white border border-white/20'
                      }`}>
                        {player.rank}
                      </div>
                    </div>

                    {/* Player */}
                    <div className="col-span-2 flex items-center space-x-4">
                      <div className="text-3xl transform group-hover:animate-bounce">{player.avatar}</div>
                      <div>
                        <div className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {player.username}
                        </div>
                        <div className="text-sm text-gray-400">
                          {player.rank <= 3 ? '🏅 Elite Player' : player.rank <= 5 ? '⭐ Pro Player' : '🎮 Active Player'}
                        </div>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="text-xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                      {player.score.toLocaleString()}
                    </div>

                    {/* Games */}
                    <div className="text-lg text-gray-300 group-hover:text-white transition-colors">
                      {player.games}
                    </div>

                    {/* Tokens */}
                    <div className="text-lg font-semibold text-yellow-400 group-hover:text-yellow-300 transition-colors">
                      {player.tokens}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
