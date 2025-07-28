import { useState, useEffect } from 'react';
import { Gamepad2, Trophy, Info } from 'lucide-react';

interface ModernNavbarProps {
  onShowAbout?: () => void;
  onShowGames?: () => void;
  onShowLeaderboard?: () => void;
  isConnected: boolean;
  address?: string;
  connectWallet: () => Promise<void>;
  isLoading: boolean;
}

export default function ModernNavbar({ 
  onShowAbout, 
  onShowGames, 
  onShowLeaderboard, 
  isConnected, 
  address, 
  connectWallet, 
  isLoading 
}: ModernNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      id: 'games', 
      label: 'Games', 
      icon: '🎮', 
      lucideIcon: Gamepad2,
      action: onShowGames 
    },
    { 
      id: 'leaderboard', 
      label: 'Leaderboard', 
      icon: '🏆', 
      lucideIcon: Trophy,
      action: onShowLeaderboard 
    },
    { 
      id: 'about', 
      label: 'About', 
      icon: '💡', 
      lucideIcon: Info,
      action: onShowAbout 
    }
  ];

  return (
    <>
      {/* Animated Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Modern Navbar */}
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
        ${scrolled 
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl' 
          : 'bg-transparent'
        }
      `}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo Section with Brain Animation */}
            <div className="flex items-center space-x-4 group">
              
              <div className="relative">
                <h1 className="text-3xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent tracking-tight">
                  LogiPlay
                </h1>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setActiveHover(item.id)}
                  onMouseLeave={() => setActiveHover(null)}
                  className="relative px-6 py-3 rounded-xl font-semibold text-gray-300 hover:text-white transition-all duration-300 group overflow-hidden"
                >
                  {/* Animated Background */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl 
                    transform transition-all duration-300 ease-out
                    ${activeHover === item.id ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
                  `}></div>
                  
                  {/* Content */}
                  <div className="relative flex items-center space-x-2">
                    <span className={`text-lg transition-transform duration-300 ${activeHover === item.id ? 'animate-bounce' : ''}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  
                  {/* Hover underline */}
                  <div className={`
                    absolute bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400
                    transition-all duration-300 
                    ${activeHover === item.id ? 'w-4/5' : 'w-0'}
                  `}></div>
                </button>
              ))}
            </div>

            {/* Wallet Connection - Ultra Modern */}
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="relative group">
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-xl px-6 py-3 rounded-2xl border border-green-500/30 shadow-lg">
                    {/* Animated Status Dot */}
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-20"></div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-green-100 text-sm font-medium">
                        Connected
                      </span>
                      <span className="text-green-200 text-xs font-mono">
                        {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Wallet'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Wallet Connected ✨
                  </div>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:scale-100 shadow-2xl group"
                >
                  {/* Animated Background Shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  <span className="relative flex items-center space-x-2">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🔗</span>
                        <span>Connect Wallet</span>
                      </>
                    )}
                  </span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button className="md:hidden p-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-200">
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  <div className="w-full h-0.5 bg-current transform transition-all duration-200"></div>
                  <div className="w-full h-0.5 bg-current transform transition-all duration-200"></div>
                  <div className="w-full h-0.5 bg-current transform transition-all duration-200"></div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Animated Border Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </nav>
    </>
  );
}
