import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GameState, Position, Maze, LeaderboardEntry } from '../types';
import { MazeGenerator } from '../utils/mazeGenerator';
import { calculateTokenReward } from '../utils';

// Game types
export type GameType = 'maze' | 'guess-number' | 'tic-tac-toe' | 'hangman' | 'memory' | 'reaction' | 'snake' | 'dice';

interface GameSession {
  gameType: GameType;
  score: number;
  tokensEarned: number;
  completedAt: number;
  difficulty: string;
  level?: number; // Add level information for games that have levels
}

interface GameContextType {
  gameState: GameState;
  currentGame: GameType;
  claimedTokens: number;
  totalClaimedTokens: number;
  claimHistory: Array<{ amount: number; gameType: GameType; timestamp: number; }>;
  gameSessions: GameSession[];
  startGame: (gameType?: GameType) => void;
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right') => void;
  nextLevel: () => void;
  selectLevel: (level: number) => void;
  resetGame: () => void;
  finishGame: () => void;
  claimRewards: () => number;
  addGameSession: (session: GameSession) => void;
  switchGame: (gameType: GameType) => void;
  leaderboard: LeaderboardEntry[];
  addLeaderboardEntry: (entry: LeaderboardEntry) => void;
  syncWalletData: (walletAddress: string) => void;
  getMaxCompletedLevel: (gameType: GameType) => number;
  getUserLevel: () => number;
  getTokensForLevel: (level: number) => number;
  getNextLevelTokens: () => number;
  getLevelProgress: () => number;
  getMilestone: () => { rank: string; emoji: string; color: string; nextRank: string | null; tokensNeeded: number };
  formatTokens: (tokens: number) => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'logiplay_game_state';
const LEADERBOARD_KEY = 'logiplay_leaderboard';
const CLAIMED_TOKENS_KEY = 'logiplay_claimed_tokens';
const GAME_SESSIONS_KEY = 'logiplay_game_sessions';

// Get wallet-specific storage keys
const getWalletStorageKey = (baseKey: string, walletAddress?: string) => {
  if (walletAddress) {
    return `${baseKey}_${walletAddress.toLowerCase()}`;
  }
  return baseKey; // fallback to global key
};

// Token calculation with 100B supply logic - Updated for higher rewards
export const calculateGameTokenReward = (gameType: GameType, score: number, difficulty: string = 'normal'): number => {
  const baseRewards: Record<GameType, number> = {
    'maze': 10000,           // 10K-50K tokens per level
    'guess-number': 50000,    // 50K-500K tokens per game
    'tic-tac-toe': 150000,    // 150K tokens per win
    'hangman': 80000,         // 80K-200K tokens per word
    'memory': 120000,         // 120K-300K tokens per completion
    'reaction': 30000,        // 30K-100K tokens based on speed
    'snake': 10000,           // 10K token per point
    'dice': 20000             // 20K-60K tokens per roll
  };
  
  const difficultyMultiplier = {
    'easy': 1.0,
    'normal': 1.5,
    'medium': 2.0,
    'hard': 3.0,
    'expert': 5.0
  };
  
  const baseReward = baseRewards[gameType] || 50000;
  const multiplier = difficultyMultiplier[difficulty as keyof typeof difficultyMultiplier] || 1.0;
  
  return Math.floor(baseReward * score * multiplier);
};

export function GameProvider({ children }: GameProviderProps) {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // If parsing fails, return default state
      }
    }
    return {
      playerPosition: { x: 1, y: 1 },
      maze: null,
      level: 1,
      score: 0,
      tokens: 0,
      isCompleted: false,
      timeStarted: 0,
      bestTimes: {},
    };
  });

  const [currentGame, setCurrentGame] = useState<GameType>('maze');
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    const saved = localStorage.getItem(LEADERBOARD_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // State untuk melacak claimed tokens
  const [claimedTokens, setClaimedTokens] = useState(0);
  const [totalClaimedTokens, setTotalClaimedTokens] = useState(() => {
    const saved = localStorage.getItem(CLAIMED_TOKENS_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.total || 0;
      } catch {
        return 0;
      }
    }
    return 0;
  });

  const [claimHistory, setClaimHistory] = useState<Array<{ amount: number; gameType: GameType; timestamp: number; }>>(() => {
    const saved = localStorage.getItem(CLAIMED_TOKENS_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return data.history || [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Game sessions untuk track semua game yang dimainkan
  const [gameSessions, setGameSessions] = useState<GameSession[]>(() => {
    const saved = localStorage.getItem(GAME_SESSIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Save all state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    const claimedData = {
      total: totalClaimedTokens,
      history: claimHistory
    };
    localStorage.setItem(CLAIMED_TOKENS_KEY, JSON.stringify(claimedData));
  }, [totalClaimedTokens, claimHistory]);

  useEffect(() => {
    localStorage.setItem(GAME_SESSIONS_KEY, JSON.stringify(gameSessions));
  }, [gameSessions]);

  const generateNewMaze = (level: number): Maze => {
    const generator = new MazeGenerator(11, 11);
    return generator.generateMaze(level);
  };

  const startGame = (gameType: GameType = 'maze') => {
    setCurrentGame(gameType);
    
    if (gameType === 'maze') {
      const newMaze = generateNewMaze(gameState.level);
      setGameState(prev => ({
        ...prev,
        maze: newMaze,
        playerPosition: newMaze.start,
        isCompleted: false,
        timeStarted: Date.now(),
      }));
    } else {
      // Reset untuk game lain
      setGameState(prev => ({
        ...prev,
        isCompleted: false,
        timeStarted: Date.now(),
        tokens: 0,
      }));
    }
  };

  const switchGame = (gameType: GameType) => {
    setCurrentGame(gameType);
  };

  const addGameSession = (session: GameSession) => {
    setGameSessions(prev => [...prev, session]);
    
    // Update total tokens
    setGameState(prev => ({
      ...prev,
      tokens: prev.tokens + session.tokensEarned
    }));
  };

  const getMaxCompletedLevel = (gameType: GameType): number => {
    const completedLevels = gameSessions
      .filter(session => session.gameType === gameType && session.level)
      .map(session => session.level!)
      .filter(level => level > 0);
    
    if (completedLevels.length === 0) {
      return 0; // No levels completed yet - player can access level 1
    }
    
    return Math.max(...completedLevels);
  };

  // Leveling system based on total tokens earned
  // Level progression: 1 -> 2 (25K), 2 -> 3 (37.5K), 3 -> 4 (56.25K), etc.
  // Each level requires 50% more tokens than the previous level
  // Level 100 requires approximately 1.5B total tokens
  const getTokensForLevel = (level: number): number => {
    if (level <= 1) return 0;
    
    // More reasonable polynomial progression
    // Level 2: ~50K, Level 10: ~2M, Level 50: ~200M, Level 100: ~5B
    let totalTokensRequired = 0;
    for (let i = 2; i <= level; i++) {
      // Base requirement increases polynomially instead of exponentially
      const baseReq = 25000; // 25K base
      const levelFactor = Math.pow(i - 1, 1.8); // Polynomial growth (not exponential)
      const levelReq = Math.floor(baseReq * levelFactor);
      totalTokensRequired += levelReq;
    }
    
    return totalTokensRequired;
  };

  const getUserLevel = (): number => {
    const tokens = totalClaimedTokens;
    
    // Find the highest level the user can achieve with their tokens
    for (let level = 100; level >= 1; level--) {
      if (tokens >= getTokensForLevel(level)) {
        return level;
      }
    }
    
    return 1; // Minimum level
  };

  const getNextLevelTokens = (): number => {
    const currentLevel = getUserLevel();
    if (currentLevel >= 100) return 0; // Max level reached
    
    return getTokensForLevel(currentLevel + 1);
  };

  const getLevelProgress = (): number => {
    const currentLevel = getUserLevel();
    if (currentLevel >= 100) return 100; // Max level
    
    const currentLevelTokens = getTokensForLevel(currentLevel);
    const nextLevelTokens = getTokensForLevel(currentLevel + 1);
    const userTokens = totalClaimedTokens;
    
    const tokensInCurrentLevel = userTokens - currentLevelTokens;
    const tokensNeededForNextLevel = nextLevelTokens - currentLevelTokens;
    
    return Math.min(100, Math.max(0, (tokensInCurrentLevel / tokensNeededForNextLevel) * 100));
  };

  // Milestone system based on token thresholds
  const getMilestone = () => {
    const tokens = totalClaimedTokens;
    
    const milestones = [
      { threshold: 0, rank: "Rookie", emoji: "🌱", color: "text-green-400", nextThreshold: 50000 },
      { threshold: 50000, rank: "Bronze", emoji: "🥉", color: "text-orange-400", nextThreshold: 200000 },
      { threshold: 200000, rank: "Silver", emoji: "🥈", color: "text-gray-300", nextThreshold: 500000 },
      { threshold: 500000, rank: "Gold", emoji: "🥇", color: "text-yellow-400", nextThreshold: 1000000 },
      { threshold: 1000000, rank: "Platinum", emoji: "💎", color: "text-blue-400", nextThreshold: 2500000 },
      { threshold: 2500000, rank: "Diamond", emoji: "💠", color: "text-cyan-400", nextThreshold: 5000000 },
      { threshold: 5000000, rank: "Master", emoji: "👑", color: "text-purple-400", nextThreshold: 10000000 },
      { threshold: 10000000, rank: "Grandmaster", emoji: "🏆", color: "text-pink-400", nextThreshold: 25000000 },
      { threshold: 25000000, rank: "Champion", emoji: "⭐", color: "text-indigo-400", nextThreshold: 50000000 },
      { threshold: 50000000, rank: "Legend", emoji: "🌟", color: "text-yellow-300", nextThreshold: 100000000 },
      { threshold: 100000000, rank: "Mythic", emoji: "🔥", color: "text-red-400", nextThreshold: 250000000 },
      { threshold: 250000000, rank: "Divine", emoji: "✨", color: "text-purple-300", nextThreshold: 500000000 },
      { threshold: 500000000, rank: "Cosmic", emoji: "🌌", color: "text-blue-300", nextThreshold: 1000000000 },
      { threshold: 1000000000, rank: "Transcendent", emoji: "🚀", color: "text-green-300", nextThreshold: 2500000000 },
      { threshold: 2500000000, rank: "Omnipotent", emoji: "🌠", color: "text-rainbow", nextThreshold: 5000000000 },
      { threshold: 5000000000, rank: "Infinite", emoji: "♾️", color: "text-white", nextThreshold: null },
    ];
    
    // Find current milestone
    let currentMilestone = milestones[0];
    for (let i = milestones.length - 1; i >= 0; i--) {
      if (tokens >= milestones[i].threshold) {
        currentMilestone = milestones[i];
        break;
      }
    }
    
    const nextRank = currentMilestone.nextThreshold 
      ? milestones.find(m => m.threshold === currentMilestone.nextThreshold)?.rank || null
      : null;
    
    const tokensNeeded = currentMilestone.nextThreshold 
      ? currentMilestone.nextThreshold - tokens 
      : 0;
    
    return {
      rank: currentMilestone.rank,
      emoji: currentMilestone.emoji,
      color: currentMilestone.color,
      nextRank,
      tokensNeeded
    };
  };

  // Format tokens for display (1.5M instead of 1,500,000)
  const formatTokens = (tokens: number): string => {
    if (tokens >= 1000000000) {
      return `${(tokens / 1000000000).toFixed(1)}B`;
    } else if (tokens >= 1000000) {
      return `${(tokens / 1000000).toFixed(1)}M`;
    } else if (tokens >= 1000) {
      return `${(tokens / 1000).toFixed(1)}K`;
    }
    return tokens.toLocaleString();
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!gameState.maze || gameState.isCompleted) return;

    const { playerPosition, maze } = gameState;
    let newPosition: Position = { ...playerPosition };

    switch (direction) {
      case 'up':
        newPosition.y = Math.max(0, playerPosition.y - 1);
        break;
      case 'down':
        newPosition.y = Math.min(maze.height - 1, playerPosition.y + 1);
        break;
      case 'left':
        newPosition.x = Math.max(0, playerPosition.x - 1);
        break;
      case 'right':
        newPosition.x = Math.min(maze.width - 1, playerPosition.x + 1);
        break;
    }

    // Check if new position is valid (not a wall)
    const cell = maze.cells[newPosition.y][newPosition.x];
    if (cell.isWall) return;

    // Check if reached the end
    const isCompleted = newPosition.x === maze.end.x && newPosition.y === maze.end.y;
    
    let newTokens = gameState.tokens;
    let newBestTimes = { ...gameState.bestTimes };
    
    if (isCompleted) {
      const timeElapsed = Date.now() - gameState.timeStarted;
      const tokenReward = calculateTokenReward(gameState.level, timeElapsed);
      newTokens += tokenReward;
      
      // Update best time for this level
      if (!newBestTimes[gameState.level] || timeElapsed < newBestTimes[gameState.level]) {
        newBestTimes[gameState.level] = timeElapsed;
      }
    }

    setGameState(prev => ({
      ...prev,
      playerPosition: newPosition,
      isCompleted,
      tokens: newTokens,
      bestTimes: newBestTimes,
    }));
  };

  const nextLevel = () => {
    const newLevel = gameState.level + 1;
    const newMaze = generateNewMaze(newLevel);
    
    setGameState(prev => ({
      ...prev,
      level: newLevel,
      maze: newMaze,
      playerPosition: newMaze.start,
      isCompleted: false,
      timeStarted: Date.now(),
      score: prev.score + 1,
    }));
  };

  const selectLevel = (level: number) => {
    const maxUnlockedLevel = Math.max(gameState.score + 1, gameState.level);
    const targetLevel = Math.min(level, maxUnlockedLevel);
    
    const newMaze = generateNewMaze(targetLevel);
    
    setGameState(prev => ({
      ...prev,
      level: targetLevel,
      maze: newMaze,
      playerPosition: newMaze.start,
      isCompleted: false,
      timeStarted: Date.now(),
    }));
  };

  const resetGame = () => {
    setGameState({
      playerPosition: { x: 1, y: 1 },
      maze: null,
      level: 1,
      score: 0,
      tokens: 0,
      isCompleted: false,
      timeStarted: 0,
      bestTimes: {},
    });
  };

  const finishGame = () => {
    setGameState(prev => ({
      ...prev,
      isCompleted: true,
    }));
  };

  const claimRewards = () => {
    const totalTokens = gameState.tokens;
    
    setTotalClaimedTokens((prev: number) => prev + totalTokens);
    setClaimedTokens(totalTokens);
    
    const newClaim = {
      amount: totalTokens,
      gameType: currentGame,
      timestamp: Date.now()
    };
    setClaimHistory(prev => [...prev, newClaim]);
    
    setGameState(prev => ({
      ...prev,
      tokens: 0,
      isCompleted: false,
    }));
    
    return totalTokens;
  };

  const addLeaderboardEntry = (entry: LeaderboardEntry) => {
    setLeaderboard(prev => {
      const newLeaderboard = [...prev, entry]
        .sort((a, b) => {
          if (a.level !== b.level) return b.level - a.level;
          return a.time - b.time;
        })
        .slice(0, 100);
      
      return newLeaderboard;
    });
  };

  const syncWalletData = (walletAddress: string) => {
    console.log('🔄 Syncing data for wallet:', walletAddress);
    
    // Load wallet-specific data
    const walletGameStateKey = getWalletStorageKey(STORAGE_KEY, walletAddress);
    const walletTokensKey = getWalletStorageKey(CLAIMED_TOKENS_KEY, walletAddress);
    const walletSessionsKey = getWalletStorageKey(GAME_SESSIONS_KEY, walletAddress);
    
    // Load game state for this wallet
    const savedGameState = localStorage.getItem(walletGameStateKey);
    if (savedGameState) {
      try {
        const parsedState = JSON.parse(savedGameState);
        setGameState(parsedState);
      } catch (error) {
        console.warn('Failed to load wallet game state:', error);
      }
    }
    
    // Load claimed tokens for this wallet
    const savedTokens = localStorage.getItem(walletTokensKey);
    if (savedTokens) {
      try {
        const tokenData = JSON.parse(savedTokens);
        setClaimedTokens(tokenData.total || 0);
        setClaimHistory(tokenData.history || []);
      } catch (error) {
        console.warn('Failed to load wallet tokens:', error);
      }
    }
    
    // Load game sessions for this wallet
    const savedSessions = localStorage.getItem(walletSessionsKey);
    if (savedSessions) {
      try {
        const sessions = JSON.parse(savedSessions);
        setGameSessions(sessions);
      } catch (error) {
        console.warn('Failed to load wallet sessions:', error);
      }
    }
    
    console.log('✅ Wallet data synced successfully');
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        currentGame,
        claimedTokens,
        totalClaimedTokens,
        claimHistory,
        gameSessions,
        startGame,
        movePlayer,
        nextLevel,
        selectLevel,
        resetGame,
        finishGame,
        claimRewards,
        addGameSession,
        switchGame,
        leaderboard,
        addLeaderboardEntry,
        syncWalletData,
        getMaxCompletedLevel,
        getUserLevel,
        getTokensForLevel,
        getNextLevelTokens,
        getLevelProgress,
        getMilestone,
        formatTokens,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
