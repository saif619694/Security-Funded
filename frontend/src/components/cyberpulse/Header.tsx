import React from 'react';
import { TrendingUp, Shield, Database } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-black">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black to-orange-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Logo/Brand */}
          <div className="flex justify-center items-center mb-6">
            <div className="flex items-center space-x-3 p-4 rounded-2xl gradient-border">
              <Shield className="h-8 w-8 text-purple-400" />
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                CyberPulse
              </span>
            </div>
          </div>
          
          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl font-black mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent neon-text">
              FUNDING
            </span>
            <br />
            <span className="text-white">INTELLIGENCE</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Real-time analytics on cybersecurity investments, funding rounds, and market trends. 
            Track the pulse of cyber innovation with comprehensive data insights.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl px-6 py-4">
              <TrendingUp className="h-6 w-6 text-green-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-green-400">$2.1B+</div>
                <div className="text-sm text-gray-400">Total Funding</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm border border-orange-500/30 rounded-xl px-6 py-4">
              <Database className="h-6 w-6 text-orange-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-orange-400">500+</div>
                <div className="text-sm text-gray-400">Companies</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl px-6 py-4">
              <Shield className="h-6 w-6 text-purple-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-purple-400">Live</div>
                <div className="text-sm text-gray-400">Data Feed</div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="inline-block p-1 rounded-2xl vibrant-gradient neon-glow">
            <div className="bg-black rounded-2xl px-8 py-4">
              <span className="text-white font-semibold text-lg">Explore Latest Investments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;