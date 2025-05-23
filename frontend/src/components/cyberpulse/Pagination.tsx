import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  itemsPerPage: number;
  totalItems: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  startIndex,
  itemsPerPage,
  totalItems,
  setCurrentPage,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="mt-12">
      <div className="company-card border-purple-500/20 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Results Info */}
          <div className="text-gray-400 text-sm">
            Showing <span className="text-purple-300 font-semibold">{Math.min(startIndex + 1, totalItems)}</span> to{' '}
            <span className="text-purple-300 font-semibold">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{' '}
            <span className="text-purple-300 font-semibold">{totalItems.toLocaleString()}</span> results
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-black/60 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            {/* Page Numbers */}
            <div className="flex gap-1">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <div key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                ) : (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page as number)}
                    className={
                      page === currentPage 
                        ? "bg-gradient-to-r from-purple-500 to-orange-500 text-white font-bold shadow-lg neon-glow" 
                        : "bg-black/60 border-gray-600 text-gray-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white transition-all"
                    }
                  >
                    {page}
                  </Button>
                )
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-black/60 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;