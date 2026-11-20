import { useMemo, useState } from 'react';
import { CANONICAL_COUNTY_DATA } from '../../lib/countyStats';
import { runScenarioModel, runSensitivityTest } from '../../services/foodGapEngine';
import type { ChurchData, CountyFilter, RetailerData, SchoolData, ShadingMode, TractData } from '../../types';

export interface DashboardStoryReportProps {
  tracts: TractData[];
  retailers: RetailerData[];
  churches: ChurchData[];
  schools: SchoolData[];
  selectedCounty: CountyFilter;
  onSelectCounty: (county: CountyFilter) => void;
  selectedTract: TractData | null;
  onSelectTract: (tract: TractData) => void;
  mapEngine: 'google' | 'leaflet';
  setMapEngine: (engine: 'google' | 'leaflet') => void;
  isDark: boolean;
}

/** All derived state for the dashboard story page, shared by its section components. */
export function useDashboardModel(props: DashboardStoryReportProps) {
  const {
    tracts,
    retailers,
    churches,
    schools,
    selectedCounty,
    onSelectCounty,
    selectedTract,
    onSelectTract,
    mapEngine,
    setMapEngine,
    isDark,
  } = props;
  // Map color mode: 'severity' (Gap type) or 'poverty' (Poverty rate)
  const [colorBy, setColorBy] = useState<ShadingMode>('severity');

  // Gap Tracts search
  const [gapSearchTerm, setGapSearchTerm] = useState('');

  // Section 4 Scenario Sliders (default +10% poverty, 0% vehicle)
  const [povertyDeltaPct, setPovertyDeltaPct] = useState<number>(10);
  const [vehicleDeltaPct, setVehicleDeltaPct] = useState<number>(0);

  // Collapsible rules at bottom
  const [isRulesExpanded, setIsRulesExpanded] = useState<boolean>(false);

  // Active county statistics
  const currentCountyStats = CANONICAL_COUNTY_DATA[selectedCounty];

  // Tracts filtered by county
  const filteredTracts = useMemo(() => {
    if (selectedCounty === 'All') return tracts;
    return tracts.filter((t) => t.county === selectedCounty);
  }, [tracts, selectedCounty]);

  const filteredRetailers = useMemo(() => {
    if (selectedCounty === 'All') return retailers;
    return retailers.filter((r) => r.county === selectedCounty);
  }, [retailers, selectedCounty]);

  const filteredChurches = useMemo(() => {
    if (selectedCounty === 'All') return churches;
    return (churches || []).filter((c) => c.county === selectedCounty);
  }, [churches, selectedCounty]);

  const filteredSchools = useMemo(() => {
    if (selectedCounty === 'All') return schools;
    return (schools || []).filter((s) => s.county === selectedCounty);
  }, [schools, selectedCounty]);

  // Threshold Sensitivity Test State (-10%, -5%, 0%, +5%, +10%)
  const [sensitivityShiftPct, setSensitivityShiftPct] = useState<number>(5);

  // Complete 490 census tract classification coverage breakdown
  const complete490Breakdown = useMemo(() => {
    const counts = {
      classic: 0,
      vehicle: 0,
      snap: 0,
      blindSpot: 0,
      insufficientData: 0,
      noGap: 0,
      total: filteredTracts.length,
    };
    filteredTracts.forEach((t) => {
      if (t.primary_gap === 'Classic food desert') counts.classic++;
      else if (t.primary_gap === 'Vehicle-compounded gap') counts.vehicle++;
      else if (t.primary_gap === 'SNAP enrollment gap') counts.snap++;
      else if (t.primary_gap === 'Possible blind spot') counts.blindSpot++;
      else if (t.primary_gap === 'Insufficient data') counts.insufficientData++;
      else counts.noGap++;
    });
    return counts;
  }, [filteredTracts]);

  // Sensitivity Test calculation
  const sensitivityResult = useMemo(() => {
    return runSensitivityTest(filteredTracts, sensitivityShiftPct);
  }, [filteredTracts, sensitivityShiftPct]);

  // Section 1: Gap tracts sorted by population (largest first)
  const gapTractsList = useMemo(() => {
    return filteredTracts
      .filter(
        (t) =>
          t.has_gap === 1 ||
          ['Classic food desert', 'Vehicle-compounded gap', 'SNAP enrollment gap'].includes(t.primary_gap),
      )
      .filter((t) => {
        if (!gapSearchTerm.trim()) return true;
        const q = gapSearchTerm.toLowerCase();
        return (
          t.tract_name.toLowerCase().includes(q) ||
          t.GEOID.includes(q) ||
          t.county.toLowerCase().includes(q) ||
          t.primary_gap.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.population - a.population);
  }, [filteredTracts, gapSearchTerm]);

  // Section 2: Top 3 largest tracts per gap type
  const top3Classic = useMemo(() => {
    return filteredTracts
      .filter((t) => t.primary_gap === 'Classic food desert' || t.secondary_gap === 'Classic food desert')
      .sort((a, b) => b.population - a.population)
      .slice(0, 3);
  }, [filteredTracts]);

  const top3Vehicle = useMemo(() => {
    return filteredTracts
      .filter((t) => t.primary_gap === 'Vehicle-compounded gap' || t.secondary_gap === 'Vehicle-compounded gap')
      .sort((a, b) => b.population - a.population)
      .slice(0, 3);
  }, [filteredTracts]);

  const top3Snap = useMemo(() => {
    return filteredTracts
      .filter((t) => t.primary_gap === 'SNAP enrollment gap' || t.secondary_gap === 'SNAP enrollment gap')
      .sort((a, b) => b.population - a.population)
      .slice(0, 3);
  }, [filteredTracts]);

  // Section 3: Blind spots to review
  const blindSpotsList = useMemo(() => {
    return filteredTracts
      .filter((t) => t.primary_gap === 'Possible blind spot')
      .sort((a, b) => b.population - a.population);
  }, [filteredTracts]);

  // Section 4: Scenario Model simulation
  const scenarioResult = useMemo(() => {
    return runScenarioModel(tracts, { povertyDeltaPct, vehicleDeltaPct });
  }, [tracts, povertyDeltaPct, vehicleDeltaPct]);

  // Filtered newly at-risk tracts for Section 4 table
  const newlyAtRiskTracts = useMemo(() => {
    const list = scenarioResult.newlyFlaggedTracts;
    if (selectedCounty === 'All') return [...list].sort((a, b) => b.population - a.population);
    return list.filter((t) => t.county === selectedCounty).sort((a, b) => b.population - a.population);
  }, [scenarioResult.newlyFlaggedTracts, selectedCounty]);

  // Reset scenario sliders
  const handleResetScenario = () => {
    setPovertyDeltaPct(10);
    setVehicleDeltaPct(0);
  };

  // Helper to map plain language recommended action
  const getActionText = (t: TractData) => {
    if (t.primary_gap === 'Classic food desert') return 'Pantry, mobile pantry or partner store';
    if (t.primary_gap === 'Vehicle-compounded gap') return 'Delivery, or mobile stop near transit';
    if (t.primary_gap === 'SNAP enrollment gap') return 'Enrollment outreach and events';
    if (t.primary_gap === 'Possible blind spot') return 'Field check before investing';
    if (t.primary_gap === 'Insufficient data') return 'Collect more data; do not act yet';
    return 'Regular monitoring';
  };

  const countyOrder: CountyFilter[] = ['All', 'Orange', 'Osceola', 'Seminole', 'Lake'];

  return {
    tracts,
    retailers,
    churches,
    schools,
    selectedCounty,
    onSelectCounty,
    selectedTract,
    onSelectTract,
    mapEngine,
    setMapEngine,
    isDark,
    colorBy,
    setColorBy,
    gapSearchTerm,
    setGapSearchTerm,
    povertyDeltaPct,
    setPovertyDeltaPct,
    vehicleDeltaPct,
    setVehicleDeltaPct,
    isRulesExpanded,
    setIsRulesExpanded,
    currentCountyStats,
    filteredTracts,
    filteredRetailers,
    filteredChurches,
    filteredSchools,
    sensitivityShiftPct,
    setSensitivityShiftPct,
    complete490Breakdown,
    sensitivityResult,
    gapTractsList,
    top3Classic,
    top3Vehicle,
    top3Snap,
    blindSpotsList,
    scenarioResult,
    newlyAtRiskTracts,
    handleResetScenario,
    getActionText,
    countyOrder,
  };
}

export type DashboardModel = ReturnType<typeof useDashboardModel>;
