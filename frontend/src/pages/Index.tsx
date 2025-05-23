import React, { useState, useMemo } from 'react';
import Header from '@/components/cyberpulse/Header';
import SearchBar from '@/components/cyberpulse/SearchBar';
import DataTable from '@/components/cyberpulse/DataTable';
import Pagination from '@/components/cyberpulse/Pagination';
import { formatAmount, getRoundColor } from '@/utils/formatUtils';
import { sampleData } from '@/data/sampleData';
import { CompanyData, SortField, SortDirection } from '@/types';

const Index: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterRound, setFilterRound] = useState<string>('');
  
  const itemsPerPage = 5;

  const filteredAndSortedData = useMemo<CompanyData[]>(() => {
    let filtered = sampleData.filter(item =>
      item.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterRound) {
      filtered = filtered.filter(item => item.round === filterRound);
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortField as keyof CompanyData];
      const bValue = b[sortField as keyof CompanyData];
      
      if (sortField === 'amount') {
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [searchTerm, sortField, sortDirection, filterRound]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterRound={filterRound}
          setFilterRound={setFilterRound}
          resultsCount={filteredAndSortedData.length}
        />
        <DataTable 
          data={currentData}
          handleSort={handleSort}
          formatAmount={formatAmount}
          getRoundColor={getRoundColor}
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          totalItems={filteredAndSortedData.length}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Index;
