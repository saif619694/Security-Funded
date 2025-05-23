import React from 'react';
import { Search } from 'lucide-react';
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
    <Card className="mb-8 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search companies, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-600 text-slate-200 placeholder:text-slate-400"
              />
            </div>
            <select
              value={filterRound}
              onChange={(e) => setFilterRound(e.target.value)}
              className="px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-slate-200"
            >
              <option value="">All Rounds</option>
              {availableRounds.map((round) => (
                <option key={round} value={round}>
                  {round}
                </option>
              ))}
            </select>
          </div>
          <div className="text-slate-400 text-sm">
            {resultsCount} companies found
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchBar;