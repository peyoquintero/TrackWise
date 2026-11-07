export type CountyName = 'Orange' | 'Osceola' | 'Seminole' | 'Lake';
export type CountyFilter = 'All' | CountyName;

export type PrimaryGap =
  | 'Classic food desert'
  | 'Vehicle-compounded gap'
  | 'SNAP enrollment gap'
  | 'Possible blind spot'
  | 'Insufficient data'
  | 'No gap identified';

export type SecondaryGap =
  | 'Classic food desert'
  | 'Vehicle-compounded gap'
  | 'SNAP enrollment gap'
  | 'Possible blind spot'
  | null;

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type ReviewTier = 'Tier 1' | 'Tier 2' | 'Review required';

export interface TractData {
  GEOID: string;
  tract_name: string;
  county: CountyName;
  county_fips: string;
  population: number;
  households: number;
  poverty_rate: number | null;
  poverty_rate_moe: number | null;
  snap_rate: number | null;
  snap_rate_moe: number | null;
  snap_households: number;
  median_household_income: number | null;
  lila_flag: number;
  low_access_flag: number;
  no_vehicle_low_access_flag: number;
  no_vehicle_low_access_pct: number;
  households_no_vehicle: number;
  no_vehicle_pct: number;
  urban_flag: number;
  low_income_tract_flag: number;
  poverty_q: number | null;
  snap_q: number | null;
  vehicle_q: number | null;
  primary_gap: PrimaryGap;
  secondary_gap: SecondaryGap;
  gap_label: string;
  gap_severity: number; // 0 to 4
  has_gap: number; // 1 or 0
  confidence: ConfidenceLevel;
  confidence_score: number;
  supporting_evidence: string;
  limiting_evidence: string;
  recommended_resource: string;
  review_tier: ReviewTier;
  wide_moe: number; // 1 or 0
  is_unknown: number; // 1 or 0
  unknown_reason: string;
  model_gap_now: number;
  scenario_gap_pov10: number;
  scenario_new_gap_pov10: number;
  poverty_rate_pov10: number | null;
  latitude: number;
  longitude: number;
  aland: number;
  awater: number;
}

export interface RetailerData {
  record_id: string;
  store_name: string;
  address: string;
  city: string;
  zip: string;
  longitude: number;
  latitude: number;
  geoid: string;
  county: string;
}

export interface SummaryMetrics {
  total_tracts: number;
  total_population: number;
  gap_tracts_count: number;
  gap_population: number;
  gap_pct_of_pop: number;
  primary_gap_counts: Record<string, number>;
  review_tier_counts: Record<string, number>;
  confidence_counts: Record<string, number>;
  wide_moe_count: number;
  unknown_count: number;
  county_stats: Record<
    string,
    {
      total_tracts: number;
      total_pop: number;
      gap_tracts: number;
      gap_pop: number;
      primary_gaps: Record<string, number>;
      review_tiers: Record<string, number>;
    }
  >;
}

export type ShadingMode = 'severity' | 'poverty' | 'snap' | 'vehicle' | 'confidence';

export type MainTab =
  | 'overview'
  | 'q1_where'
  | 'q2_type'
  | 'q5_unknowns'
  | 'scenario'
  | 'portal'
  | 'dictionary';
