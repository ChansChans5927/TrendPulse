export interface TrendItem {
  rank: number;
  keyword: string;
  category: string;
  volume: number; // 0-100 relative score
  description: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface TrendResponse {
  trends: TrendItem[];
  sources: GroundingSource[];
  timestamp: string;
}

export enum Region {
  KOREA = 'South Korea',
  GLOBAL = 'Global'
}