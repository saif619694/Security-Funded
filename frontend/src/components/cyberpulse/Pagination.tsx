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
  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="text-slate-400 text-sm">
        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} results
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
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={page === currentPage 
                ? "cyber-gradient text-slate-900 font-semibold" 
                : "border-slate-600 text-slate-300 hover:bg-cyan-500/20 hover:border-cyan-500 hover:text-cyan-400"
              }
            >
              {page}
            </Button>
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
