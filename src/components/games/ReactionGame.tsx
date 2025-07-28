import { useGame } from '../../contexts/GameContext';

export default function ReactionGame() {
  const { addGameSession } = useGame();

  const handleTestWin = () => {
    addGameSession({
      gameType: 'reaction',
      score: 40,
      tokensEarned: 40,
      difficulty: 'hard',
      completedAt: Date.now()
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl text-center">
        <h1 className="text-4xl font-bold text-white mb-4">⚡ Reaction Time</h1>
        <p className="text-gray-300 mb-8">Coming Soon!</p>
        <p className="text-gray-400 mb-6">This game is under development.</p>
        <button
          onClick={handleTestWin}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Test Token Reward (40 LOGIQ)
        </button>
      </div>
    </div>
  );
}
