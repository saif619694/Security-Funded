
import React from 'react';
import { Building, ArrowUpDown, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CompanyData {
  id: number;
  description: string;
  company_name: string;
  company_url: string;
  amount: number;
  round: string;
  investors: string[];
  story_link: string;
  source: string;
  date: string;
  company_type: string;
  reference: string;
}

interface DataTableProps {
  data: CompanyData[];
  handleSort: (field: string) => void;
  formatAmount: (amount: number) => string;
  getRoundColor: (round: string) => string;
}

const DataTable = ({ data, handleSort, formatAmount, getRoundColor }: DataTableProps) => {
  return (
    <Card className="bg-slate-800/30 border-slate-700 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left p-4 text-slate-300 font-semibold">
                  <button
                    onClick={() => handleSort('company_name')}
                    className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                  >
                    <Building className="h-4 w-4" />
                    Company
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  <button
                    onClick={() => handleSort('amount')}
                    className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                  >
                    <DollarSign className="h-4 w-4" />
                    Amount
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">Round</th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  <button
                    onClick={() => handleSort('date')}
                    className="flex items-center gap-2 hover:text-cyan-400 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    Date
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">Source</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-slate-700/50 data-row transition-all duration-200">
                  <td className="p-4">
                    <div>
                      <div className="font-semibold text-slate-200 mb-1">{item.company_name}</div>
                      <div className="text-sm text-slate-400 line-clamp-2">{item.description}</div>
                      <Badge variant="secondary" className="mt-2 bg-slate-700/50 text-slate-300">
                        {item.company_type}
                      </Badge>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-lg font-bold text-cyan-400">
                      {formatAmount(item.amount)}
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={`${getRoundColor(item.round)} border`}>
                      {item.round}
                    </Badge>
                  </td>
                  <td className="p-4 text-slate-300">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-slate-300">{item.source}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-cyan-500/20 hover:border-cyan-500 hover:text-cyan-400"
                        onClick={() => window.open(item.company_url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-cyan-500/20 hover:border-cyan-500 hover:text-cyan-400"
                        onClick={() => window.open(item.story_link, '_blank')}
                      >
                        Story
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
