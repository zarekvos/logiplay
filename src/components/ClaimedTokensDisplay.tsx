import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { useWallet } from '../contexts/WalletContext';

export default function ClaimedTokensDisplay() {
  const { totalClaimedTokens, claimHistory, getUserLevel, getNextLevelTokens, getLevelProgress, getMilestone, formatTokens: gameFormatTokens, isDemo, demoTokens } = useGame();
  const { isConnected, connectWallet } = useWallet();
  const [showHistory, setShowHistory] = useState(false);

  const formatTokens = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecentClaims = () => {
    return claimHistory
      .slice(-5) // Last 5 claims
      .reverse(); // Most recent first
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          💰 {isDemo ? 'Demo Tokens' : 'Total Claimed Tokens'}
        </h3>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
      </div>

      {/* Demo Mode Indicator */}
      {isDemo && (
        <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-orange-400 text-lg">🎮</span>
            <div className="flex-1">
              <p className="text-orange-200 font-medium text-sm">Demo Mode Active</p>
              <p className="text-orange-300/80 text-xs">
                Tokens shown are for demo only. Connect wallet to earn real $LOGIQ!
              </p>
            </div>
          </div>
          {!isConnected && (
            <button
              onClick={connectWallet}
              className="mt-2 w-full bg-orange-500/30 hover:bg-orange-500/40 text-orange-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Connect Wallet to Start Earning
            </button>
          )}
        </div>
      )}

      {/* Level Progress Section */}
      <div className="bg-black/20 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-medium">🎖️ Level {getUserLevel()}</span>
          {getUserLevel() < 100 && (
            <span className="text-gray-400 text-sm">
              {(getNextLevelTokens() - totalClaimedTokens).toLocaleString()} more to Level {getUserLevel() + 1}
            </span>
          )}
        </div>
        
        {getUserLevel() < 100 && (
          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getLevelProgress()}%` }}
            ></div>
          </div>
        )}
        
        <div className="text-center text-xs text-gray-400">
          {getUserLevel() >= 100 
            ? '🏆 Maximum level achieved!' 
            : `${getLevelProgress().toFixed(1)}% progress to next level`
          }
        </div>
      </div>

      {/* Total Claimed Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-green-400 mb-2" title={`${isDemo ? demoTokens : totalClaimedTokens.toLocaleString()} $LOGIQ`}>
          {formatTokens(isDemo ? demoTokens : totalClaimedTokens)} $LOGIQ
        </div>
        <p className="text-gray-400 text-sm">
          {isDemo 
            ? `Demo tokens earned from gameplay` 
            : `Total tokens claimed from ${claimHistory.length} claim${claimHistory.length !== 1 ? 's' : ''}`
          }
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress to next milestone</span>
          <span>{(totalClaimedTokens % 1000)} / 1000</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(totalClaimedTokens % 1000) / 10}%` }}
          ></div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-400">
            {claimHistory.length}
          </div>
          <div className="text-xs text-gray-400">Total Claims</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-purple-400">
            {claimHistory.length > 0 ? Math.round(totalClaimedTokens / claimHistory.length) : 0}
          </div>
          <div className="text-xs text-gray-400">Avg per Claim</div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {totalClaimedTokens >= 1000 && (
          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs border border-yellow-500/30">
            🏆 1K Club
          </span>
        )}
        {totalClaimedTokens >= 5000 && (
          <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs border border-purple-500/30">
            💎 5K Master
          </span>
        )}
        {totalClaimedTokens >= 10000 && (
          <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs border border-red-500/30">
            🔥 10K Legend
          </span>
        )}
        {claimHistory.length >= 10 && (
          <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs border border-blue-500/30">
            🎯 Veteran
          </span>
        )}
      </div>

      {/* Claim History */}
      {showHistory && (
        <div className="border-t border-white/20 pt-4">
          <h4 className="text-sm font-semibold text-white mb-3">Recent Claims</h4>
          {claimHistory.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No claims yet. Complete levels and claim your rewards!
            </p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {getRecentClaims().map((claim, index) => (
                <div 
                  key={claim.timestamp} 
                  className="flex justify-between items-center bg-white/5 rounded-lg p-3 border border-white/10"
                >
                  <div>
                    <div className="text-green-400 font-semibold">
                      +{formatTokens(claim.amount)} $LOGIQ
                    </div>
                    <div className="text-xs text-gray-400">
                      {claim.gameType} • {formatDate(claim.timestamp)}
                    </div>
                  </div>
                  <div className="text-xs text-blue-400">
                    #{claimHistory.length - index}
                  </div>
                </div>
              ))}
              {claimHistory.length > 5 && (
                <div className="text-center">
                  <span className="text-xs text-gray-400">
                    ... and {claimHistory.length - 5} more claims
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Milestone System */}
      {totalClaimedTokens > 0 && (
        <div className="border-t border-white/20 pt-4 mt-4">
          <div className="text-center">
            <div className="mb-3">
              <p className="text-xs text-gray-400 mb-1">Current Rank</p>
              <div className={`text-lg font-bold ${getMilestone().color} flex items-center justify-center gap-2`}>
                <span className="text-2xl">{getMilestone().emoji}</span>
                <span>{getMilestone().rank}</span>
              </div>
            </div>
            
            {getMilestone().nextRank && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Next Rank: {getMilestone().nextRank}</p>
                <div className="text-sm text-yellow-400 font-semibold mb-2">
                  {gameFormatTokens(getMilestone().tokensNeeded)} more needed
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getLevelProgress()}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-gray-500">
                  Progress to {getMilestone().nextRank}
                </p>
              </div>
            )}
            
            {!getMilestone().nextRank && (
              <div className="mt-2">
                <div className="text-sm text-rainbow font-bold animate-pulse">
                  🎉 Maximum Rank Achieved! 🎉
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  You have reached the pinnacle of achievement!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
