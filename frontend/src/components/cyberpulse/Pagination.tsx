import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
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
    <div className="mt-8 flex items-center justify-between">
      <div className="text-slate-400 text-sm">
        Showing {Math.min(startIndex + 1, totalItems)} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} results
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="border-slate-600 text-slate-300 hover:bg-cyan-500/20 hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex gap-1">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-1 text-slate-400">...</span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page as number)}
                className={page === currentPage 
                  ? "cyber-gradient text-slate-900 font-semibold" 
                  : "border-slate-600 text-slate-300 hover:bg-cyan-500/20 hover:border-cyan-500 hover:text-cyan-400"
                }
              >
                {page}
              </Button>
            )
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border-slate-600 text-slate-300 hover:bg-cyan-500/20 hover:border-cyan-500 hover:text-cyan-400 disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;