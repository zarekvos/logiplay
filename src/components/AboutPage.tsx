import { useState, useEffect } from 'react';

interface AboutPageProps {
  onBackToHome?: () => void;
  onShowGames?: () => void;
}

export default function AboutPage({ onBackToHome, onShowGames }: AboutPageProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sections = [
    {
      id: 'vision',
      title: 'Our Vision',
      icon: '🚀',
      content: 'To revolutionize casual gaming by merging timeless logic puzzles with cutting-edge Web3 technology, creating meaningful experiences that reward intelligence and strategic thinking.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'mission',
      title: 'Our Mission',
      icon: '🎯',
      content: 'Building an inclusive gaming ecosystem where every solved puzzle, every strategic move, and every moment of brilliance is recognized and rewarded through our $LOGIQ token economy.',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'technology',
      title: 'Technology',
      icon: '⚡',
      content: 'Powered by React 18, TypeScript, and Web3 integration. Our platform delivers lightning-fast gameplay with seamless wallet connectivity and real-time token rewards.',
      gradient: 'from-cyan-500 to-blue-600'
    }
  ];

  const stats = [
    { label: 'Games Available', value: '8+', icon: '🎮', color: 'text-blue-400' },
    { label: 'Token Supply', value: '100B', icon: '💰', color: 'text-yellow-400' },
    { label: 'Players Worldwide', value: '∞', icon: '🌍', color: 'text-green-400' },
    { label: 'Challenges Solved', value: '∞', icon: '🧩', color: 'text-purple-400' }
  ];

  const features = [
    {
      title: 'Instant Gameplay',
      description: 'No downloads, no installations. Click and play immediately in your browser.',
      icon: '⚡',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Skill-Based Rewards',
      description: 'Performance-based $LOGIQ token distribution. The better you play, the more you earn.',
      icon: '🎯',
      gradient: 'from-blue-400 to-purple-500'
    },
    {
      title: 'Web3 Integration',
      description: 'Connect your wallet to track achievements, earn tokens, and join the decentralized gaming future.',
      icon: '🔗',
      gradient: 'from-green-400 to-cyan-500'
    },
    {
      title: 'Cross-Platform',
      description: 'Optimized for desktop, tablet, and mobile. Play anywhere, anytime, on any device.',
      icon: '📱',
      gradient: 'from-pink-400 to-red-500'
    }
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

      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite'
        }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

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
            LogiPlay
          </h1>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-20 pt-8 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Title and Subtitle */}
            <div className="mb-12">
              <h1 className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                About LogiPlay
              </h1>
              <p className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Where Logic Meets Web3 Innovation
              </p>
            </div>

            {/* Description Card */}
            <div className="max-w-5xl mx-auto mb-16 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                LogiPlay represents the next evolution in gaming — a platform where traditional logic puzzles meet 
                the power of blockchain technology. We've created an ecosystem that not only challenges your mind 
                but also rewards your intelligence with real value.
              </p>
              <div className="flex items-center justify-center space-x-4 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20">
                <span className="text-3xl">💡</span>
                <p className="text-lg text-gray-300">
                  Built by <span className="text-purple-400 font-bold text-xl">Zarekvos</span> — 
                  Pioneering the future of intellectual gaming
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4 group-hover:animate-bounce">{stat.icon}</div>
                  <div className={`text-3xl font-black mb-2 ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Sections */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center text-white mb-12">Our Story</h2>
            
            {/* Section Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
                {sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(index)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      activeSection === index
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Section Content */}
            <div className="max-w-4xl mx-auto">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`transform transition-all duration-500 ${
                    activeSection === index 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-10 opacity-0 absolute'
                  }`}
                >
                  {activeSection === index && (
                    <div className={`bg-gradient-to-br ${section.gradient} p-1 rounded-3xl shadow-2xl`}>
                      <div className="bg-black/20 backdrop-blur-xl p-8 rounded-3xl">
                        <div className="text-center">
                          <div className="text-6xl mb-6">{section.icon}</div>
                          <h3 className="text-3xl font-bold text-white mb-6">{section.title}</h3>
                          <p className="text-xl text-gray-200 leading-relaxed">{section.content}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold text-center text-white mb-12">Why Choose LogiPlay?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
                  
                  <div className="relative">
                    <div className="text-5xl mb-6 group-hover:animate-bounce">{feature.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Challenge Your Mind?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join thousands of players who are already earning $LOGIQ tokens while sharpening their cognitive abilities. 
              The future of gaming is here, and it's powered by your intelligence.
            </p>
            <button
              onClick={onShowGames || onBackToHome}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center space-x-3">
                <span className="text-2xl">🚀</span>
                <span>Start Playing Now</span>
              </span>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center pt-20 border-t border-white/10 mt-20">
            <div className="flex items-center justify-center space-x-4 mb-4">
            
            </div>
            <p className="text-gray-400 text-lg mb-2">
              Crafted with ❤️ by <span className="text-purple-400 font-bold text-xl">Zarekvos</span>
            </p>
            <p className="text-gray-500">
              Building the bridge between gaming and Web3 innovation 🌉
            </p>
          </div>
        </div>
      </main>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}