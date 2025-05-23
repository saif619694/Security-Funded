import React from 'react';
import { Building, Calendar, DollarSign, ExternalLink, Globe, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CompanyData, SortField, Investor } from '@/types';

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
  const getInvestorInfo = (investor: Investor): { name: string; url?: string } => {
    return {
      name: investor.name || 'Unknown Investor',
      url: investor.url
    };
  };

  const handleInvestorClick = (investorInfo: { name: string; url?: string }) => {
    if (investorInfo.url) {
      let url = investorInfo.url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

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
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={() => handleSort('company_name')}
          variant="outline"
          className="bg-black/60 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white transition-all"
        >
          <Building className="h-4 w-4 mr-2" />
          Sort by Company
        </Button>
        <Button
          onClick={() => handleSort('amount')}
          variant="outline"
          className="bg-black/60 border-green-500/30 text-green-300 hover:bg-green-500/20 hover:border-green-400 hover:text-white transition-all"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Sort by Amount
        </Button>
        <Button
          onClick={() => handleSort('date')}
          variant="outline"
          className="bg-black/60 border-orange-500/30 text-orange-300 hover:bg-orange-500/20 hover:border-orange-400 hover:text-white transition-all"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Sort by Date
        </Button>
      </div>

      <div className="data-grid">
        {data.map((item) => (
          <Card key={item.id} className="company-card card-hover group">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {item.company_name || 'Unknown Company'}
                  </h3>
                  <Badge className={`${getRoundColor(item.round)} text-sm font-medium`}>
                    {item.round || 'Unknown Round'}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {item.amount === 0 ? 'Undisclosed' : formatAmount(item.amount)}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-1 justify-end">
                    <Calendar className="h-3 w-3" />
                    {item.date ? new Date(item.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    }) : 'Unknown Date'}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 min-h-[3.6rem]">
                {item.description || 'No description available.'}
              </p>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm min-h-[1.25rem]">
                  <Building className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="text-gray-400">Type:</span>
                  <span className="text-blue-300 font-medium">
                    {item.company_type || 'Unknown'}
                  </span>
                </div>
                
                <div className="flex items-start gap-2 text-sm min-h-[1.25rem]">
                  <Users className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Investors:</span>
                  <div className="flex-1">
                    {item.investors && Array.isArray(item.investors) && item.investors.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {item.investors.slice(0, 5).map((investor, idx) => {
                          const investorInfo = getInvestorInfo(investor);
                          const hasUrl = investorInfo.url && investorInfo.url.trim() !== '';
                          
                          return hasUrl ? (
                            <button
                              key={`${investorInfo.name}-${idx}`}
                              onClick={() => handleInvestorClick(investorInfo)}
                              className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs px-3 py-1.5 rounded-lg hover:bg-cyan-500/30 hover:text-white hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-200 cursor-pointer transform hover:scale-105 flex items-center gap-1.5 font-medium"
                              title={`Visit ${investorInfo.name} - ${investorInfo.url}`}
                            >
                              {investorInfo.name}
                            </button>
                          ) : (
                            <Badge 
                              key={`${investorInfo.name}-${idx}`}
                              variant="secondary" 
                              className="bg-gray-600/30 text-gray-300 border-gray-500/40 text-xs px-3 py-1.5 cursor-default rounded-lg"
                              title={`${investorInfo.name} (No URL available)`}
                            >
                              {investorInfo.name}
                            </Badge>
                          );
                        })}
                        {item.investors.length > 5 && (
                          <Badge 
                            variant="secondary" 
                            className="bg-gray-600/30 text-gray-400 border-gray-500/40 text-xs px-3 py-1.5 rounded-lg"
                            title={`Total investors: ${item.investors.length}`}
                          >
                            +{item.investors.length - 5} more
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-xs"></span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm min-h-[1.25rem]">
                  <Globe className="h-4 w-4 text-purple-400 flex-shrink-0" />
                  <span className="text-gray-400">Source:</span>
                  {item.source ? (
                    <span className="text-purple-300 font-medium">{item.source}</span>
                  ) : item.reference ? (
                    <button
                      onClick={() => window.open(item.reference, '_blank')}
                      className="text-purple-300 font-medium hover:text-white transition-colors underline"
                    >
                      Return on Security
                    </button>
                  ) : (
                    <span className="text-gray-500 text-xs">Unknown source</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-800">
                {item.company_url ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-black/40 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white transition-all"
                    onClick={() => window.open(item.company_url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-2" />
                    Website
                  </Button>
                ) : (
                  <div className="flex-1 bg-black/20 border border-gray-700/30 text-gray-500 text-sm rounded-md px-3 py-2 text-center">
                    No Website
                  </div>
                )}
                
                {item.story_link ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-black/40 border-orange-500/30 text-orange-300 hover:bg-orange-500/20 hover:border-orange-400 hover:text-white transition-all"
                    onClick={() => window.open(item.story_link, '_blank')}
                  >
                    <TrendingUp className="h-3 w-3 mr-2" />
                    Story
                  </Button>
                ) : (
                  <div className="flex-1 bg-black/20 border border-gray-700/30 text-gray-500 text-sm rounded-md px-3 py-2 text-center">
                    No Story
                  </div>
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