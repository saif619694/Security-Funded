import React, { useState } from 'react';
import { TrendingUp, Shield, Database, Loader2, Zap, Eye, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api } from '@/services/api';

const Header: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExploreInvestments = async () => {
    setIsLoading(true);
    
    try {
      toast({
        title: "Data Collection Started",
        description: "Initiating fresh data collection from security funding sources...",
        variant: "default",
      });

      const response = await api.triggerDataCollection();
      
      toast({
        title: "Success!",
        description: response.message || "Data collection completed successfully.",
        variant: "default",
      });

      window.dispatchEvent(new CustomEvent('dataCollectionComplete'));

      setTimeout(() => {
        const dataSection = document.querySelector('[data-section="data-display"]') || 
                           document.querySelector('#funding-data-section') ||
                           document.querySelector('main');
        
        if (dataSection) {
          dataSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 1500);

    } catch (error) {
      toast({
        title: "Collection Error",
        description: error instanceof Error ? error.message : "Failed to collect data. Please try again.",
        variant: "destructive",
      });
      console.error('Data collection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-black">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black to-orange-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="flex justify-center items-center mb-8">
            <div className="modern-logo">
              <div className="logo-icon-stack">
                <div className="relative">
                  <Shield className="h-8 w-8 text-purple-400 relative z-30" />
                  <Zap className="h-4 w-4 text-orange-400 absolute -top-1 -right-1 z-40" />
                  <Eye className="h-3 w-3 text-blue-400 absolute -bottom-1 -left-1 z-40" />
                </div>
                <Lock className="h-6 w-6 text-purple-300 -ml-2 opacity-60" />
              </div>
              
              <div className="flex flex-col items-start">
                <span className="logo-text">CyberPulse</span>
                <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">
                  Funding Intelligence
                </span>
              </div>
            </div>
          </div>
          
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
          
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl px-6 py-4 shadow-lg">
              <TrendingUp className="h-6 w-6 text-green-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-green-400">$2.1B+</div>
                <div className="text-sm text-gray-400">Total Funding</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm border border-orange-500/30 rounded-xl px-6 py-4 shadow-lg">
              <Database className="h-6 w-6 text-orange-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-orange-400">500+</div>
                <div className="text-sm text-gray-400">Companies</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-xl px-6 py-4 shadow-lg">
              <Shield className="h-6 w-6 text-purple-400" />
              <div className="text-left">
                <div className="text-2xl font-bold text-purple-400">Live</div>
                <div className="text-sm text-gray-400">Data Feed</div>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleExploreInvestments}
            disabled={isLoading}
            className="inline-block p-1 rounded-2xl static-gradient neon-glow hover:scale-105 transform transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="bg-black rounded-2xl px-8 py-4 flex items-center justify-center gap-3 min-w-[300px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span className="text-white font-semibold text-lg">Collecting Fresh Data...</span>
                </>
              ) : (
                <>
                  <Database className="h-5 w-5 text-white" />
                  <span className="text-white font-semibold text-lg">Collect Latest Intelligence</span>
                </>
              )}
            </div>
          </button>
          
          <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto">
            Triggers fresh data collection from security funding sources
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;