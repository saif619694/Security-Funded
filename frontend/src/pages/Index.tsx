import React, { useState, useEffect } from 'react';
import Header from '@/components/cyberpulse/Header';
import SearchBar from '@/components/cyberpulse/SearchBar';
import DataDisplay from '@/components/cyberpulse/DataDisplay';
import Pagination from '@/components/cyberpulse/Pagination';
import { formatAmount, getRoundColor } from '@/utils/formatUtils';
import { CompanyData, SortField, SortDirection } from '@/types';
import { api } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

const Index: React.FC = () => {
  const [data, setData] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterRound, setFilterRound] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [availableRounds, setAvailableRounds] = useState<string[]>([]);
  
  const itemsPerPage = 12;

  // Fetch funding rounds for filter dropdown
  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const response = await api.getFundingRounds();
        setAvailableRounds(response.rounds);
      } catch (error) {
        console.error('Failed to fetch funding rounds:', error);
      }
    };
    fetchRounds();
  }, []);

  // Fetch data whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.getFundingData({
          page: currentPage,
          itemsPerPage,
          sortField,
          sortDirection,
          search: searchTerm,
          filterRound,
        });
        
        setData(response.data);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch funding data. Please try again.",
          variant: "destructive",
        });
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, sortField, sortDirection, searchTerm, filterRound]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRound, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterRound={filterRound}
          setFilterRound={setFilterRound}
          resultsCount={totalCount}
          availableRounds={availableRounds}
        />
        
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <span className="text-lg font-medium">Loading funding intelligence...</span>
            </div>
          </div>
        ) : (
          <>
            <DataDisplay 
              data={data}
              handleSort={handleSort}
              formatAmount={formatAmount}
              getRoundColor={getRoundColor}
            />
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                startIndex={startIndex}
                itemsPerPage={itemsPerPage}
                totalItems={totalCount}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;