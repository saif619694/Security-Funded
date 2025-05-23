const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
  investors: (string | Investor)[];
  story_link: string;
  source: string;
  date: string;
  company_type: string;
  reference: string;
}

export interface FundingDataResponse {
  data: CompanyData[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface FundingDataParams {
  page: number;
  itemsPerPage: number;
  sortField: string;
  sortDirection: string;
  search?: string;
  filterRound?: string;
}

export const api = {
  async getFundingData(params: FundingDataParams): Promise<FundingDataResponse> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      itemsPerPage: params.itemsPerPage.toString(),
      sortField: params.sortField,
      sortDirection: params.sortDirection,
      ...(params.search && { search: params.search }),
      ...(params.filterRound && { filterRound: params.filterRound }),
    });

    const response = await fetch(`${API_BASE_URL}/api/funding-data?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch funding data');
    }
    return response.json();
  },

  async getFundingRounds(): Promise<{ rounds: string[] }> {
    const response = await fetch(`${API_BASE_URL}/api/funding-rounds`);
    if (!response.ok) {
      throw new Error('Failed to fetch funding rounds');
    }
    return response.json();
  },
};