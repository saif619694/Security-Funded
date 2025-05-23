import React from 'react';
import { Building, Calendar, DollarSign, ExternalLink, Globe, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompanyData, SortField } from '@/types';

interface DataDisplayProps {
  data: CompanyData[];
  handleSort: (field: SortField) => void;
  formatAmount: (amount: number) => string;
  getRoundColor: (round: string) => string;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ 
  data, 
  handleSort, 
  formatAmount, 
  getRoundColor 
}) => {
  if (data.length === 0) {
    return (
      <Card className="company-card border-purple-500/20">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Building className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">No funding data found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sort Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={() => handleSort('company_name')}
          variant="outline"
          className="bg-black/60 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all"
        >
          <Building className="h-4 w-4 mr-2" />
          Sort by Company
        </Button>
        <Button
          onClick={() => handleSort('amount')}
          variant="outline"
          className="bg-black/60 border-green-500/30 text-green-300 hover:bg-green-500/20 hover:border-green-400 transition-all"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Sort by Amount
        </Button>
        <Button
          onClick={() => handleSort('date')}
          variant="outline"
          className="bg-black/60 border-orange-500/30 text-orange-300 hover:bg-orange-500/20 hover:border-orange-400 transition-all"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Sort by Date
        </Button>
      </div>

      {/* Data Grid */}
      <div className="data-grid">
        {data.map((item) => (
          <Card key={item.id} className="company-card card-hover group">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {item.company_name}
                  </h3>
                  <Badge className={`${getRoundColor(item.round)} text-sm font-medium`}>
                    {item.round}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {item.amount === 0 ? 'Undisclosed' : formatAmount(item.amount)}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                {item.description}
              </p>

              {/* Company Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-400">Type:</span>
                  <span className="text-blue-300 font-medium">{item.company_type}</span>
                </div>
                
                {item.investors && item.investors.length > 0 && (
                  <div className="flex items-start gap-2 text-sm">
                    <Users className="h-4 w-4 text-orange-400 mt-0.5" />
                    <span className="text-gray-400">Investors:</span>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-1">
                        {item.investors.slice(0, 3).map((investor, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                            {investor}
                          </Badge>
                        ))}
                        {item.investors.length > 3 && (
                          <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                            +{item.investors.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-purple-400" />
                  <span className="text-gray-400">Source:</span>
                  <span className="text-purple-300 font-medium">{item.source}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t border-gray-800">
                {item.company_url && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-black/40 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 transition-all"
                    onClick={() => window.open(item.company_url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Website
                  </Button>
                )}
                {item.story_link && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-black/40 border-orange-500/30 text-orange-300 hover:bg-orange-500/20 hover:border-orange-400 transition-all"
                    onClick={() => window.open(item.story_link, '_blank')}
                  >
                    <TrendingUp className="h-3 w-3 mr-2" />
                    Story
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DataDisplay;