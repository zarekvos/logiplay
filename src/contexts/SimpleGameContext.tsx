import { createContext, useContext, ReactNode } from 'react';

interface SimpleGameContextType {
  gameState: {
    currentLevel: number;
    level: number;
    score: number;
    tokens: number;
    isPlaying: boolean;
    gameStartTime: number;
    gameEndTime: number;
  };
  leaderboard: any[];
}

const SimpleGameContext = createContext<SimpleGameContextType | undefined>(undefined);

interface SimpleGameProviderProps {
  children: ReactNode;
}

export function SimpleGameProvider({ children }: SimpleGameProviderProps) {
  const value: SimpleGameContextType = {
    gameState: {
      currentLevel: 1,
      level: 1,
      score: 0,
      tokens: 0,
      isPlaying: false,
      gameStartTime: 0,
      gameEndTime: 0,
    },
    leaderboard: [],
  };

  return (
    <SimpleGameContext.Provider value={value}>
      {children}
    </SimpleGameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(SimpleGameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a SimpleGameProvider');
  }
  return context;
}
