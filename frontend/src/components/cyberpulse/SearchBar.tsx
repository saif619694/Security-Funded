import React from 'react';
import { Search, Filter, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterRound: string;
  setFilterRound: (round: string) => void;
  resultsCount: number;
  availableRounds?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  filterRound, 
  setFilterRound, 
  resultsCount,
  availableRounds = []
}) => {
  return (
    <div className="mb-12">
      <Card className="company-card border-purple-500/20 card-hover">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Input */}
            <div className="flex-1 w-full">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5 group-hover:text-purple-300 transition-colors" />
                <Input
                  placeholder="Search companies, descriptions, technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 bg-black/60 border-purple-500/30 text-white placeholder:text-gray-500 text-lg rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </div>
            </div>
            
            {/* Filter Dropdown */}
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 h-4 w-4" />
                <select
                  value={filterRound}
                  onChange={(e) => setFilterRound(e.target.value)}
                  className="pl-10 pr-8 py-4 bg-black/60 border border-orange-500/30 rounded-xl text-white text-lg appearance-none cursor-pointer hover:border-orange-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all min-w-[160px]"
                >
                  <option value="">All Rounds</option>
                  {availableRounds.map((round) => (
                    <option key={round} value={round} className="bg-gray-900">
                      {round}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </div>
              
              {/* Results Counter */}
              <div className="flex items-center gap-2 bg-black/60 border border-green-500/30 rounded-xl px-6 py-4">
                <TrendingUp className="h-5 w-5 text-green-400" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{resultsCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">Companies</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchBar;