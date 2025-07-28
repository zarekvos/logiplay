import { useState, useEffect } from 'react';

interface ModernAboutPageProps {
  onBackToHome: () => void;
}

export default function ModernAboutPage({ onBackToHome }: ModernAboutPageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      id: 'logic',
      icon: '🧠',
      title: 'Pure Logic Gaming',
      description: 'No luck, no pay-to-win. Just your intelligence versus increasingly challenging puzzles.',
      gradient: 'from-purple-600 to-blue-600',
      details: ['Strategic thinking required', 'Pattern recognition', 'Problem-solving skills', 'Mental agility training']
    },
    {
      id: 'web3',
      icon: '🔗',
      title: 'Web3 Identity',
      description: 'Connect your wallet to unlock achievements, track progress, and showcase your intellectual prowess.',
      gradient: 'from-blue-600 to-cyan-600',
      details: ['MetaMask integration', 'Decentralized identity', 'Achievement tracking', 'Cross-platform progress']
    },
    {
      id: 'rewards',
      icon: '💎',
      title: '$LOGIQ Token Economy',
      description: 'Earn $LOGIQ tokens based on performance, speed, and difficulty level conquered.',
      gradient: 'from-yellow-500 to-orange-500',
      details: ['Performance-based rewards', 'Speed bonuses', 'Difficulty multipliers', 'Token utility coming soon']
    },
    {
      id: 'community',
      icon: '👥',
      title: 'Global Leaderboards',
      description: 'Compete with players worldwide and prove your intellectual superiority.',
      gradient: 'from-green-500 to-emerald-500',
      details: ['Real-time rankings', 'Achievement showcases', 'Competitive seasons', 'Community challenges']
    }
  ];

  const gamesList = [
    { name: 'Maze Navigator', icon: '🌀', difficulty: 'Progressive', description: 'Navigate through procedurally generated mazes' },
    { name: 'Memory Master', icon: '🃏', difficulty: 'Medium', description: 'Test your memory with pattern sequences' },
    { name: 'Quick Math', icon: '🔢', difficulty: 'Dynamic', description: 'Solve mathematical challenges against time' },
    { name: 'Color Logic', icon: '🎨', difficulty: 'Hard', description: 'Decode color patterns and sequences' },
    { name: 'Word Weaver', icon: '📝', difficulty: 'Coming Soon', description: 'Word puzzles and vocabulary challenges' },
    { name: 'Pattern Pro', icon: '🔮', difficulty: 'Coming Soon', description: 'Advanced pattern recognition games' },
    { name: 'Logic Locks', icon: '🔐', difficulty: 'Coming Soon', description: 'Unlock complex logical puzzles' },
    { name: 'Mind Maze', icon: '🧩', difficulty: 'Coming Soon', description: 'Multi-dimensional thinking challenges' }
  ];

  const stats = [
    { label: 'Total Games', value: '8+', icon: '🎮', color: 'text-blue-400' },
    { label: 'Token Supply', value: '100B', icon: '💰', color: 'text-yellow-400' },
    { label: 'Difficulty Levels', value: '∞', icon: '📈', color: 'text-purple-400' },
    { label: 'Players Worldwide', value: 'Growing', icon: '🌍', color: 'text-green-400' }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      
      {/* Dynamic Mouse Follower */}
      <div 
        className="fixed pointer-events-none z-10 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          animation: 'grid-float 25s linear infinite'
        }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-slow ${4 + Math.random() * 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Back Button */}
      <button
        onClick={onBackToHome}
        className="fixed top-8 left-8 z-50 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white p-4 rounded-2xl border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-110 group"
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl group-hover:animate-bounce">←</span>
          <span className="font-semibold">Back to Home</span>
        </div>
      </button>

      <div className="relative z-20 pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section with Logo */}
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* LogiPlay Logo Integration */}
            <div className="flex flex-col items-center mb-12">
              {/* Brain Logo SVG Recreation */}
              <div className="relative mb-8 group">
                <div className="w-32 h-32 relative">
                  {/* Gradient Brain Shape */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full opacity-90 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Brain Pattern Overlay */}
                  <div className="absolute inset-4 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-16 h-16 text-white/90">
                      <path d="M20,30 Q30,20 40,30 Q50,25 60,30 Q70,20 80,30 Q80,40 75,50 Q80,60 80,70 Q70,80 60,70 Q50,75 40,70 Q30,80 20,70 Q20,60 25,50 Q20,40 20,30 Z" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="3" 
                            className="animate-pulse"/>
                      <path d="M30,40 Q40,35 50,40 Q60,35 70,40" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"/>
                      <path d="M25,55 Q35,50 45,55 Q55,50 75,55" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2"/>
                    </svg>
                  </div>
                  
                  {/* Glowing Ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 opacity-0 group-hover:opacity-30 blur-xl scale-150 transition-all duration-500"></div>
                </div>
              </div>

              {/* LogiPlay Title */}
              <div className="relative">
                <h1 className="text-8xl md:text-9xl font-black mb-6 relative">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Logi
                  </span>
                  <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Play
                  </span>
                </h1>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse"></div>
              </div>

              <p className="text-3xl text-gray-300 font-light mt-8 max-w-3xl">
                Where <span className="text-purple-400 font-semibold">intelligence meets blockchain</span>, 
                and every puzzle solved is a step towards <span className="text-cyan-400 font-semibold">digital mastery</span>.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:animate-bounce">{stat.icon}</div>
                  <div className={`text-4xl font-black ${stat.color} mb-2`}>{stat.value}</div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="group relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 cursor-pointer"
                onMouseEnter={() => setActiveSection(feature.id)}
                onMouseLeave={() => setActiveSection(null)}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-500`}></div>
                
                <div className="relative">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-3xl group-hover:animate-bounce transition-all duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-white">{feature.title}</h3>
                  </div>
                  
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">{feature.description}</p>
                  
                  <div className={`space-y-3 transition-all duration-500 ${activeSection === feature.id ? 'opacity-100 max-h-48' : 'opacity-70 max-h-32 overflow-hidden'}`}>
                    {feature.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 bg-gradient-to-r ${feature.gradient} rounded-full`}></div>
                        <span className="text-gray-300">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Games Showcase */}
          <div className="mb-20">
            <h2 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Game Collection
            </h2>
            <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
              A curated selection of mind-bending challenges designed to test every aspect of your cognitive abilities
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gamesList.map((game, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-105 group"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4 group-hover:animate-spin transition-all duration-500">{game.icon}</div>
                    <h4 className="text-xl font-bold text-white mb-2">{game.name}</h4>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                      game.difficulty === 'Coming Soon' 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {game.difficulty}
                    </div>
                    <p className="text-gray-400 text-sm">{game.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Creator Section */}
          <div className="text-center bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
            <div className="mb-8">
              <h3 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                Built by Visionaries
              </h3>
              <p className="text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8">
                LogiPlay represents the culmination of passion for both intellectual challenges and blockchain innovation. 
                Our mission is to bridge the gap between traditional puzzle gaming and the limitless possibilities of Web3.
              </p>
            </div>

            <div className="flex flex-col items-center space-y-6">
              <div className="bg-gradient-to-r from-purple-500 to-cyan-500 p-1 rounded-2xl">
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl font-black text-white">
                      Z
                    </div>
                    <div className="text-left">
                      <h4 className="text-2xl font-bold text-white">Zarekvos</h4>
                      <p className="text-purple-300 font-medium">Founder & Lead Developer</p>
                      <p className="text-gray-400 text-sm">Building the future of logic-based GameFi</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-lg text-gray-300 mb-4">
                  "Every great puzzle begins with a single question: <em>How far can the human mind go?</em>"
                </p>
                <div className="flex items-center justify-center space-x-2 text-purple-400">
                  <span className="text-2xl">🚀</span>
                  <span className="font-semibold">Join us on this intellectual journey</span>
                  <span className="text-2xl">🧠</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes grid-float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, -30px) rotate(2deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-30px) rotate(180deg) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
