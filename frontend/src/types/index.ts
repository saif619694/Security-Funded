export interface Investor {
  name: string;
  url?: string;
}

export interface CompanyData {
  id: string;
  description: string;
  company_name: string;
  company_url: string;
  amount: number;
  round: string;
  investors: Investor[]; // Updated to be consistent - always Investor objects
  story_link: string;
  source: string;
  date: string;
  company_type: string;
  reference: string;
}

export type SortField = 'company_name' | 'amount' | 'date';
export type SortDirection = 'asc' | 'desc';