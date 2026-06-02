export interface AreaProfile {
  name: string;
  industry: string;
  convenience: number;
  youngPeopleRatio: number;
  businessMaturity: number;
  comfort: number;
  commuteScore: number;
}

export interface RentStats {
  wholeRentAvg: number;
  wholeRentMin: number;
  wholeRentMax: number;
  sharedRentAvg: number;
  sharedRentMin: number;
  sharedRentMax: number;
}

export interface LivingCost {
  rent: number;
  food: number;
  transport: number;
  entertainment: number;
  total: number;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  layout: string;
  rentType: '整租' | '合租';
  source: string;
  publishDays: number;
  isDirectLandlord: boolean;
  isSublease: boolean;
  hasRealPhotos: boolean;
  isRepeated: boolean;
  hasAgentKeywords: boolean;
  credibilityScore: number;
  url: string;
}

export interface Recommendation {
  areaName: string;
  matchScore: number;
  reasons: string[];
}

export interface UserPreference {
  workLocation: string;
  budget: number;
  rentType: '整租' | '合租';
  preferences: string[];
}

export interface AreaData {
  profile: AreaProfile;
  rentStats: RentStats;
  livingCost: LivingCost;
  listings: Listing[];
}

export type PreferenceOption =
  | '安静'
  | '通勤短'
  | '商业繁华'
  | '性价比高'
  | '年轻人多'
  | '靠近地铁';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ChatHistory {
  id: string;
  timestamp: number;
  preference: UserPreference;
  recommendations: Recommendation[];
  duration: number;
}
