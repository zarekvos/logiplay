import { useGame } from '../contexts/GameContext';
import MazeGame from './MazeGame';
import GuessNumberGame from './games/GuessNumberGame';
import TicTacToeGame from './games/TicTacToeGame';
import HangmanGame from './games/HangmanGame';
import MemoryGame from './games/MemoryGame';
import ReactionGame from './games/ReactionGame';
import SnakeGame from './games/SnakeGame';
import DiceGame from './games/DiceGame';

interface GameContainerProps {
  onBack: () => void;
}

export default function GameContainer({ onBack }: GameContainerProps) {
  const { currentGame } = useGame();

  const renderGame = () => {
    switch (currentGame) {
      case 'maze':
        return <MazeGame onBack={onBack} />;
      case 'guess-number':
        return <GuessNumberGame />;
      case 'tic-tac-toe':
        return <TicTacToeGame />;
      case 'hangman':
        return <HangmanGame />;
      case 'memory':
        return <MemoryGame />;
      case 'reaction':
        return <ReactionGame />;
      case 'snake':
        return <SnakeGame />;
      case 'dice':
        return <DiceGame />;
      default:
        return <MazeGame onBack={onBack} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {renderGame()}
    </div>
  );
}
