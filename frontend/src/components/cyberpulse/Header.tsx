import React, { useState } from 'react';
import { TrendingUp, Shield, Database, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api } from '@/services/api';

const Header: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleExploreInvestments = async () => {
    setIsLoading(true);
    try {
      // Call the correct API endpoint
      const response = await api.getFundingData({
        page: 1,
        itemsPerPage: 12,
        sortField: 'date',
        sortDirection: 'desc',
        search: '',
        filterRound: '',
      });

      // Show success message
      toast({
        title: "Success!",
        description: `Successfully loaded ${response.totalCount} funding records from the latest intelligence feed.`,
        variant: "default",
      });

      // Scroll to the data section using the correct selector
      setTimeout(() => {
        const dataSection = document.querySelector('[class*="max-w-"]');
        if (dataSection) {
          dataSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load latest funding data. Please try again.",
        variant: "destructive",
      });
      console.error('Failed to fetch latest data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-black">
      {/* Static background - REMOVED ALL PULSE ANIMATIONS */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black to-orange-900/20"></div>
        {/* Static gradient orbs - NO ANIMATIONS */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Static Logo/Brand - NO PULSE */}
          <div className="flex justify-center items-center mb-6">
            <div className="flex items-center space-x-3 p-4 rounded-2xl gradient-border relative">
              {/* Static glow effect - NO ANIMATION */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 blur-md"></div>
              <Shield className="h-8 w-8 text-purple-400 relative z-10" />
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent relative z-10 drop-shadow-lg">
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
          
          {/* Static Stats - NO PULSE */}
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
          
          {/* Enhanced CTA with API integration */}
          <button
            onClick={handleExploreInvestments}
            disabled={isLoading}
            className="inline-block p-1 rounded-2xl vibrant-gradient neon-glow hover:scale-105 transform transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="bg-black rounded-2xl px-8 py-4 flex items-center justify-center gap-3 min-w-[280px]">
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                  <span className="text-white font-semibold text-lg">Loading Intelligence...</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-5 w-5 text-white" />
                  <span className="text-white font-semibold text-lg">Explore Latest Investments</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;