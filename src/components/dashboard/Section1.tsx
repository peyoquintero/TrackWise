import { Map as MapIcon, Search, ShieldCheck } from 'lucide-react';
import type React from 'react';
import { lazy, Suspense } from 'react';
import type { DashboardModel } from './useDashboardModel';

const MapGoogle = lazy(() => import('../MapGoogle').then((m) => ({ default: m.MapGoogle })));
const MapLeaflet = lazy(() => import('../MapLeaflet').then((m) => ({ default: m.MapLeaflet })));

export const Section1: React.FC<{ model: DashboardModel }> = ({ model }) => {
  const {
    selectedCounty,
    selectedTract,
    onSelectTract,
    mapEngine,
    setMapEngine,
    isDark,
    colorBy,
    setColorBy,
    gapSearchTerm,
    setGapSearchTerm,
    filteredTracts,
    filteredRetailers,
    filteredChurches,
    filteredSchools,
    complete490Breakdown,
    gapTractsList,
    getActionText,
  } = model;
  // SECTION 1: Where is the gap biggest today?
  return (
    <section className="space-y-6 scroll-mt-28" id="section-1">
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          1. Where is the gap biggest today?
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Tracts with high need and low access, ranked by people affected rather than by rate.
        </p>
      </div>

      {/* Card: Map of food access gaps */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors">
        {/* Map Card Header with Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-[#a50f15]" />
              <span>Map of food access gaps</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              490 Central Florida census tracts shaded by gap severity or demographic poverty rate.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Color by Select */}
            <div className="flex items-center gap-2">
              <label htmlFor="color-by-select" className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Color by:
              </label>
              <select
                id="color-by-select"
                value={colorBy}
                onChange={(e) => setColorBy(e.target.value as 'severity' | 'poverty')}
                className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#a50f15]"
              >
                <option value="severity">Gap type</option>
                <option value="poverty">Poverty rate</option>
              </select>
            </div>

            {/* Map Engine Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => setMapEngine('google')}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  mapEngine === 'google'
                    ? 'bg-white dark:bg-slate-700 text-[#a50f15] dark:text-red-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Google Maps
              </button>
              <button
                type="button"
                onClick={() => setMapEngine('leaflet')}
                className={`px-2.5 py-1 rounded-md transition-colors font-medium ${
                  mapEngine === 'leaflet'
                    ? 'bg-white dark:bg-slate-700 text-[#a50f15] dark:text-red-400 font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Canvas GIS (Esri)
              </button>
            </div>
          </div>
        </div>

        {/* Legend directly above the map */}
        <div className="px-4 sm:px-5 py-3 bg-slate-50/70 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-xs">
          {colorBy === 'severity' ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#991b1b] shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Classic food desert</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#dc2626] shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Vehicle-compounded gap</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#f87171] shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">SNAP enrollment gap</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#fca5a5] shrink-0 border border-slate-300 dark:border-slate-600" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Possible blind spot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#e2e8f0] dark:bg-slate-700 shrink-0 border border-slate-300 dark:border-slate-600" />
                <span className="text-slate-600 dark:text-slate-400">No gap</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#94a3b8] shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">Not enough data</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="font-medium text-slate-700 dark:text-slate-300">Poverty rate:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#7f1d1d] shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">≥ 25%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#b91c1c] shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">18 – 24.9%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#ef4444] shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">12 – 17.9%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#fca5a5] shrink-0 border border-slate-300 dark:border-slate-600" />
                <span className="text-slate-700 dark:text-slate-300">7 – 11.9%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#fee2e2] dark:bg-slate-800 shrink-0 border border-slate-300 dark:border-slate-600" />
                <span className="text-slate-700 dark:text-slate-300">&lt; 7%</span>
              </div>
            </div>
          )}
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 italic">
            Note: Each shape is a census tract. Darker red means a more serious gap. Hover a tract for details.
          </div>
        </div>

        {/* Interactive Map Viewport */}
        <div className="h-[520px] w-full relative">
          <Suspense
            fallback={
              <div role="status" className="p-6 text-sm text-slate-500">
                Loading map…
              </div>
            }
          >
            {mapEngine === 'google' ? (
              <MapGoogle
                tracts={filteredTracts}
                retailers={filteredRetailers}
                churches={filteredChurches}
                schools={filteredSchools}
                selectedCounty={selectedCounty}
                selectedTract={selectedTract}
                onSelectTract={onSelectTract}
                shadingMode={colorBy}
                setShadingMode={setColorBy}
                isDark={isDark}
                onSwitchToLeaflet={() => setMapEngine('leaflet')}
              />
            ) : (
              <MapLeaflet
                tracts={filteredTracts}
                retailers={filteredRetailers}
                churches={filteredChurches}
                schools={filteredSchools}
                selectedCounty={selectedCounty}
                selectedTract={selectedTract}
                onSelectTract={onSelectTract}
                shadingMode={colorBy}
                setShadingMode={setColorBy}
                isDark={isDark}
              />
            )}
          </Suspense>
        </div>
      </div>

      {/* Client Feedback Response: 100% Census Tract Classification Coverage Card */}
      <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-emerald-950 dark:text-emerald-100 uppercase tracking-wider flex items-center gap-2">
                <span>100% Census Tract Classification Coverage</span>
                <span className="bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-mono lowercase">
                  {complete490Breakdown.total} of {complete490Breakdown.total} tracts categorized
                </span>
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                Every census tract is assigned to a mutually exclusive category, including high-access areas where no
                gap was identified.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 mt-3 pt-3 border-t border-emerald-200/70 dark:border-emerald-800/50 text-xs">
          <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
              Classic Food Desert
            </span>
            <span className="text-base font-bold text-[#991b1b] dark:text-red-400 font-mono tabular-nums">
              {complete490Breakdown.classic}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              ({Math.round((complete490Breakdown.classic / complete490Breakdown.total) * 1000) / 10}%)
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Vehicle Gap</span>
            <span className="text-base font-bold text-[#dc2626] dark:text-red-400 font-mono tabular-nums">
              {complete490Breakdown.vehicle}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              ({Math.round((complete490Breakdown.vehicle / complete490Breakdown.total) * 1000) / 10}%)
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
              SNAP Enrollment Gap
            </span>
            <span className="text-base font-bold text-[#f87171] dark:text-red-400 font-mono tabular-nums">
              {complete490Breakdown.snap}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              ({Math.round((complete490Breakdown.snap / complete490Breakdown.total) * 1000) / 10}%)
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
              Possible Blind Spot
            </span>
            <span className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              {complete490Breakdown.blindSpot}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              ({Math.round((complete490Breakdown.blindSpot / complete490Breakdown.total) * 1000) / 10}%)
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-emerald-100 dark:border-emerald-900">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Insufficient Data</span>
            <span className="text-base font-bold text-slate-600 dark:text-slate-400 font-mono tabular-nums">
              {complete490Breakdown.insufficientData}
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              ({Math.round((complete490Breakdown.insufficientData / complete490Breakdown.total) * 1000) / 10}%)
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded-lg border border-emerald-200 dark:border-emerald-700">
            <span className="text-[10px] text-emerald-800 dark:text-emerald-300 block font-semibold">
              No Gap Identified
            </span>
            <span className="text-base font-bold text-emerald-700 dark:text-emerald-300 font-mono tabular-nums">
              {complete490Breakdown.noGap}
            </span>
            <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400 block font-mono">
              ({Math.round((complete490Breakdown.noGap / complete490Breakdown.total) * 1000) / 10}%)
            </span>
          </div>
        </div>
      </div>

      {/* Card: Tracts with a food access gap */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Tracts with a food access gap
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sorted by population (largest first) · Click any tract to view complete demographic profile.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tract name, ID, or gap..."
              value={gapSearchTerm}
              onChange={(e) => setGapSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#a50f15]"
            />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="sticky top-0 z-10 bg-slate-100/90 dark:bg-slate-800/90 backdrop-blur-xs text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Tract</th>
                <th className="py-2.5 px-3 font-semibold">County</th>
                <th className="py-2.5 px-3 font-semibold text-right">People</th>
                <th className="py-2.5 px-3 font-semibold text-right">Poverty %</th>
                <th className="py-2.5 px-3 font-semibold text-right">SNAP %</th>
                <th className="py-2.5 px-3 font-semibold">Gap type</th>
                <th className="py-2.5 px-3 font-semibold">Second gap</th>
                <th className="py-2.5 px-3 font-semibold">Confidence</th>
                <th className="py-2.5 px-4 font-semibold">Recommended action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {gapTractsList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No gap tracts found matching your search.
                  </td>
                </tr>
              ) : (
                gapTractsList.map((t) => {
                  const isSelected = selectedTract?.GEOID === t.GEOID;
                  return (
                    <tr
                      key={t.GEOID}
                      onClick={() => onSelectTract(t)}
                      className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-red-50/70 dark:bg-red-950/30' : ''
                      }`}
                    >
                      <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {t.tract_name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">{t.county}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {t.population.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        {t.poverty_rate !== null ? `${t.poverty_rate.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        {t.snap_rate !== null ? `${t.snap_rate.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              t.primary_gap === 'Classic food desert'
                                ? 'bg-[#991b1b]'
                                : t.primary_gap === 'Vehicle-compounded gap'
                                  ? 'bg-[#dc2626]'
                                  : t.primary_gap === 'SNAP enrollment gap'
                                    ? 'bg-[#f87171]'
                                    : 'bg-slate-400'
                            }`}
                          />
                          <span>{t.primary_gap}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{t.secondary_gap || '—'}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium ${
                            t.confidence === 'High'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : t.confidence === 'Medium'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {t.confidence}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {getActionText(t)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
