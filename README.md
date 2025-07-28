# MazeFi 🧩

Navigate the Labyrinth. Earn Tokens. Conquer Challenges.

MazeFi is a Web3-based maze puzzle game that combines the thrill of exploration with the power of blockchain. It introduces a new way to play and earn in crypto — no gas fees, no risk, just skill and strategy.

![MazeFi Game Screenshot](https://via.placeholder.com/800x400/1f2937/3b82f6?text=MazeFi+Game+Screenshot)

## 🎮 What is MazeFi?

MazeFi is an interactive browser-based maze puzzle game, where players must find their way out of increasingly complex labyrinths. Each successfully completed level rewards you with simulated $MZFI tokens, unlocking the next stage of the adventure.

MazeFi is more than just a game — it's a lightweight GameFi experience, fun, addictive, and accessible to everyone.

## ✨ Key Features

- 🔐 **Wallet Connection**: Connect your Web3 wallet (like MetaMask) to identify yourself as a player
- 🧭 **Progressive Mazes**: Each level becomes more challenging with increased complexity
- 🏆 **Simulated Rewards**: Earn virtual $MZFI tokens — reward is off-chain, shown as JSON
- 🌐 **No Blockchain Risk**: No transactions, no gas fees, no signatures
- 📱 **Mobile Friendly**: Touch controls for mobile devices
- 🎯 **Leaderboard**: Compete globally for the fastest maze times and top scores

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MetaMask browser extension (or any Web3 wallet)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mazefi.git
cd mazefi
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

5. Connect your MetaMask wallet and start playing!

## 🎯 How to Play

1. **Connect Wallet**: Click "Connect Wallet" and approve the MetaMask connection
2. **Start Game**: Click "Start Playing Now" to begin your first maze
3. **Navigate**: Use arrow keys or WASD to move through the maze
4. **Reach Goal**: Find the green exit to complete the level
5. **Earn Tokens**: Receive $MZFI tokens based on your completion time
6. **Progress**: Advance to increasingly challenging levels

### Controls

- **Desktop**: Arrow keys or WASD
- **Mobile**: Touch the directional buttons
- **Objective**: Navigate from the blue start to the green goal

## 🧠 Why Maze?

The maze represents:
- **Intelligence & Strategy** - Plan your route carefully
- **Patience & Focus** - Stay calm under pressure  
- **Journey & Destination** - Enjoy the process, not just the goal

With MazeFi, we turn the maze into a Web3 experience that lets you:
- Train your mind
- Explore crypto interfaces  
- Play, earn, and compete — frictionlessly

## 🏗️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Web3**: MetaMask integration (ethers.js)
- **State Management**: React Context API
- **Build Tool**: Vite
- **Storage**: LocalStorage for game state and leaderboard

## 📊 Game Mechanics

### Token Rewards
- **Base Reward**: 100 $MZFI per level
- **Level Bonus**: 50 $MZFI × level number
- **Time Bonus**: Up to 60 $MZFI for fast completion (under 60 seconds)

### Level Progression
- Mazes increase in size and complexity
- Starting size: 11×11
- Each level adds 2×2 cells (up to reasonable limits)
- More complex path generation at higher levels

### Leaderboard
- Tracks best times per level
- Global ranking by level completion and total tokens
- Persistent storage across browser sessions

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
│   ├── HomePage.tsx     # Landing page with game description
│   ├── MazeGame.tsx     # Main game interface
│   ├── MazeRenderer.tsx # Maze visualization
│   └── GameHUD.tsx      # Game UI elements
├── contexts/            # React contexts
│   ├── WalletContext.tsx # Web3 wallet management
│   └── GameContext.tsx   # Game state management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
│   ├── mazeGenerator.ts # Maze generation algorithms
│   └── index.ts         # Helper functions
└── hooks/               # Custom React hooks
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Maze Generation Algorithm

The game uses a recursive backtracking algorithm to generate mazes:

1. Start with a grid of walls
2. Create a path from a random starting cell
3. Recursively visit unvisited neighbors
4. Backtrack when stuck
5. Add additional complexity based on level

## 🔒 Security & Privacy

- **No Private Keys**: Game never requests private keys or signatures
- **No Transactions**: All rewards are simulated, no blockchain interaction
- **Local Storage**: Game state stored locally in your browser
- **No Data Collection**: No personal data sent to external servers

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code style
2. Add TypeScript types for all new features
3. Test on both desktop and mobile
4. Ensure responsive design
5. Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎮 Play Now

Ready to start your maze adventure? 

👉 **[Play MazeFi Now](https://your-deployment-url.com)**

Connect your wallet and become a Web3 maze legend!

---

*MazeFi - Navigate the future of gaming* 🚀
