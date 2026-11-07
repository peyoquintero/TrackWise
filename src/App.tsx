import React, { useState, useEffect, useMemo } from 'react';
import { TractData, RetailerData, CountyFilter, MainTab, ShadingMode } from './types';
import { Header } from './components/Header';
import { CountyFilterBar } from './components/CountyFilterBar';
import { MapLeaflet } from './components/MapLeaflet';
import { MapGoogle } from './components/MapGoogle';
import { TractDetailModal } from './components/TractDetailModal';
import { RankedTractsTable } from './components/RankedTractsTable';
import { Q2GapTypeView } from './components/Q2GapTypeView';
import { Q5UnknownsView } from './components/Q5UnknownsView';
import { ScenarioModelView } from './components/ScenarioModelView';
import { UploadPortalView } from './components/UploadPortalView';
import { DataDictionaryView } from './components/DataDictionaryView';
import { AlertTriangle, Users, MapPin, Eye, ArrowRight, ShieldCheck, ChevronRight, Map as MapIcon } from 'lucide-react';

export default function App() {
  const [tracts, setTracts] = useState<TractData[]>([]);
  const [retailers, setRetailers] = useState<RetailerData[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<CountyFilter>('All');
  const [selectedTract, setSelectedTract] = useState<TractData | null>(null);
  const [activeTab, setActiveTab] = useState<MainTab>('overview');
  const [shadingMode, setShadingMode] = useState<ShadingMode>('severity');
  const [mapEngine, setMapEngine] = useState<'google' | 'leaflet'>('google');
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Client-side quota exceeded event listener (Section 8 Case A)
  useEffect(() => {
    const quotaHandler = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', quotaHandler);
    return () => window.removeEventListener('gmp-quota-exceeded', quotaHandler);
  }, []);

  // Sync dark class on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Load tracts and retailers from public/data
  useEffect(() => {
    Promise.all([
      fetch('/data/central_florida_food_gaps.json').then((res) => res.json()),
      fetch('/data/central_florida_snap_retailers.json').then((res) => res.json()),
    ])
      .then(([tractsData, retailersData]) => {
        setTracts(tractsData);
        setRetailers(retailersData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load datasets:', err);
        setIsLoading(false);
      });
  }, []);

  // Filtered tracts by county
  const countyTracts = useMemo(() => {
    if (selectedCounty === 'All') return tracts;
    return tracts.filter((t) => t.county === selectedCounty);
  }, [tracts, selectedCounty]);

  const countyRetailers = useMemo(() => {
    if (selectedCounty === 'All') return retailers;
    return retailers.filter((r) => r.county === selectedCounty);
  }, [retailers, selectedCounty]);

  // County Metrics
  const countyMetrics = useMemo(() => {
    const totalTracts = countyTracts.length;
    const gapTractsList = countyTracts.filter((t) => t.has_gap === 1);
    const gapTracts = gapTractsList.length;
    const gapPopulation = gapTractsList.reduce((acc, t) => acc + t.population, 0);
    const blindSpots = countyTracts.filter((t) => t.primary_gap === 'Possible blind spot').length;
    const retailerCount = countyRetailers.length;

    return {
      totalTracts,
      gapTracts,
      gapPopulation,
      blindSpots,
      retailerCount,
    };
  }, [countyTracts, countyRetailers]);

  // Top 10 Priority Tracts (FR-06 & Next Steps)
  const top10Tracts = useMemo(() => {
    return [...countyTracts]
      .filter((t) => t.has_gap === 1)
      .sort((a, b) => b.population - a.population)
      .slice(0, 10);
  }, [countyTracts]);

  // Global CSV export
  const handleExportCsv = () => {
    window.location.href = '/data/central_florida_food_gaps.csv';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-sm font-medium">Loading Central Florida Food Access Gaps Platform...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Google Maps Platform Quota Warning Banner (Section 8 Case A) */}
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* 1. Header (Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        setIsDark={setIsDark}
        onExport={handleExportCsv}
      />

      {/* 2. County Filter Bar (FR-01) */}
      <CountyFilterBar
        selectedCounty={selectedCounty}
        onSelectCounty={setSelectedCounty}
        totalTracts={countyMetrics.totalTracts}
        gapTracts={countyMetrics.gapTracts}
        gapPopulation={countyMetrics.gapPopulation}
        blindSpots={countyMetrics.blindSpots}
        retailerCount={countyMetrics.retailerCount}
      />

      {/* 3. Main Body Content Viewports */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 space-y-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Map Engine Selector Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2">
                <MapIcon className="w-4 h-4 text-red-600" />
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Interactive Central Florida Food Access Map
                </span>
                <span className="text-[11px] text-slate-500 hidden md:inline">
                  (490 Census Tracts · Red-Scale Severity & Demographic Shading)
                </span>
              </div>
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <span className="text-[11px] font-medium text-slate-500 mr-1">Basemap Engine:</span>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setMapEngine('google')}
                    className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                      mapEngine === 'google'
                        ? 'bg-white dark:bg-slate-750 text-red-600 dark:text-red-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Google Maps
                  </button>
                  <button
                    onClick={() => setMapEngine('leaflet')}
                    className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                      mapEngine === 'leaflet'
                        ? 'bg-white dark:bg-slate-750 text-red-600 dark:text-red-400 font-semibold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    Canvas GIS (Esri)
                  </button>
                </div>
              </div>
            </div>

            {/* Split View: Interactive Map & Priority Action Column */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[580px]">
              {/* Map Viewport (FR-02, FR-03, FR-04) */}
              <div className="lg:col-span-8 min-h-[480px] lg:min-h-full">
                {mapEngine === 'google' ? (
                  <MapGoogle
                    tracts={countyTracts}
                    retailers={countyRetailers}
                    selectedCounty={selectedCounty}
                    selectedTract={selectedTract}
                    onSelectTract={setSelectedTract}
                    shadingMode={shadingMode}
                    setShadingMode={setShadingMode}
                    isDark={isDark}
                  />
                ) : (
                  <MapLeaflet
                    tracts={countyTracts}
                    retailers={countyRetailers}
                    selectedCounty={selectedCounty}
                    selectedTract={selectedTract}
                    onSelectTract={setSelectedTract}
                    shadingMode={shadingMode}
                    setShadingMode={setShadingMode}
                    isDark={isDark}
                  />
                )}
              </div>

              {/* Priority Action & High Impact Tracts List */}
              <div className="lg:col-span-4 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Top 10 High-Impact Gap Tracts
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ranked by population living in food access gaps (FR-06)
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('q1_where')}
                    className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {top10Tracts.map((t, index) => {
                    const isSelected = selectedTract?.GEOID === t.GEOID;
                    return (
                      <div
                        key={t.GEOID}
                        onClick={() => setSelectedTract(t)}
                        className={`p-3 px-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                          isSelected ? 'bg-red-50/60 dark:bg-red-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-400 mt-0.5">
                              {(index + 1).toString().padStart(2, '0')}.
                            </span>
                            <div>
                              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                                {t.tract_name}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {t.county} County · {t.primary_gap}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 tabular-nums shrink-0">
                            {t.population.toLocaleString()}
                          </span>
                        </div>

                        <div className="mt-2 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                          <span>
                            Poverty: <b>{t.poverty_rate?.toFixed(1) || '0'}%</b> · SNAP:{' '}
                            <b>{t.snap_rate?.toFixed(1) || '0'}%</b>
                          </span>
                          <span className="font-medium text-red-700 dark:text-red-400">
                            {t.review_tier}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-[11px] text-slate-500 text-center">
                  Click any tract to open detailed demographic profile
                </div>
              </div>
            </div>

            {/* Complete Ranked Tracts Table (FR-06) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    FR-06: Tracts Ranked by People Affected
                  </h3>
                  <p className="text-xs text-slate-500">
                    Comprehensive census tract table with gap type, poverty rate, SNAP participation, and recommended responses.
                  </p>
                </div>
              </div>
              <RankedTractsTable
                tracts={countyTracts}
                onSelectTract={setSelectedTract}
                selectedTract={selectedTract}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Q1 Where */}
        {activeTab === 'q1_where' && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Q1: Where Are the Food-Access Gaps? (FR-01 to FR-06)
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
                The solution identifies 149 of 490 census tracts (30%) in Central Florida with active food access barriers, home to approximately 948,600 residents (34% of the region's 2.79M population). Orange County concentrates the majority of classic food deserts (49 tracts).
              </p>
            </div>

            <div className="min-h-[550px] w-full">
              {mapEngine === 'google' ? (
                <MapGoogle
                  tracts={countyTracts}
                  retailers={countyRetailers}
                  selectedCounty={selectedCounty}
                  selectedTract={selectedTract}
                  onSelectTract={setSelectedTract}
                  shadingMode={shadingMode}
                  setShadingMode={setShadingMode}
                  isDark={isDark}
                />
              ) : (
                <MapLeaflet
                  tracts={countyTracts}
                  retailers={countyRetailers}
                  selectedCounty={selectedCounty}
                  selectedTract={selectedTract}
                  onSelectTract={setSelectedTract}
                  shadingMode={shadingMode}
                  setShadingMode={setShadingMode}
                  isDark={isDark}
                />
              )}
            </div>

            <RankedTractsTable
              tracts={countyTracts}
              onSelectTract={setSelectedTract}
              selectedTract={selectedTract}
            />
          </div>
        )}

        {/* Tab 3: Q2 Gap Types */}
        {activeTab === 'q2_type' && <Q2GapTypeView tracts={countyTracts} />}

        {/* Tab 4: Q5 Unknowns */}
        {activeTab === 'q5_unknowns' && (
          <Q5UnknownsView tracts={countyTracts} onSelectTract={setSelectedTract} />
        )}

        {/* Tab 5: Scenario Studio */}
        {activeTab === 'scenario' && (
          <ScenarioModelView tracts={countyTracts} onSelectTract={setSelectedTract} />
        )}

        {/* Tab 6: Upload Portal */}
        {activeTab === 'portal' && <UploadPortalView />}

        {/* Tab 7: Data Dictionary & Method */}
        {activeTab === 'dictionary' && <DataDictionaryView />}
      </main>

      {/* 4. Slide-over Tract Inspector Drawer (FR-04) */}
      <TractDetailModal
        tract={selectedTract}
        onClose={() => setSelectedTract(null)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 text-xs text-slate-500 transition-colors">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Central Florida Food Access Gaps Platform · DataKind Beacon Challenge 2 · DevFest Florida 2026
          </div>
          <div className="flex items-center gap-3">
            <span>Orange, Osceola, Seminole & Lake Counties (490 Tracts)</span>
            <span aria-hidden="true">·</span>
            <span>Census ACS 2024 & USDA SRAM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
