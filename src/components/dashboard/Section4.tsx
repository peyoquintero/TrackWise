import { Activity, RotateCcw, Sliders } from 'lucide-react';
import type React from 'react';
import { onActivate } from '../../lib/a11y';
import { CANONICAL_COUNTY_DATA } from '../../lib/countyStats';
import type { DashboardModel } from './useDashboardModel';

export const Section4: React.FC<{ model: DashboardModel }> = ({ model }) => {
  const {
    selectedCounty,
    onSelectCounty,
    onSelectTract,
    povertyDeltaPct,
    setPovertyDeltaPct,
    vehicleDeltaPct,
    setVehicleDeltaPct,
    currentCountyStats,
    filteredTracts,
    sensitivityShiftPct,
    setSensitivityShiftPct,
    sensitivityResult,
    scenarioResult,
    newlyAtRiskTracts,
    handleResetScenario,
  } = model;
  // SECTION 4: Looking ahead (What-If Scenario)
  return (
    <section className="space-y-6 scroll-mt-28" id="section-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          4. Looking ahead
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">A what-if scenario, not a forecast.</p>
      </div>

      {/* Card with two sliders + Reset button */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#a50f15]" />
            <span>Simulation Sliders</span>
          </h3>

          <button
            type="button"
            onClick={handleResetScenario}
            className="flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset sliders (+10% pov, 0% vehicle)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* Slider 1: Poverty rate change */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Poverty rate change</span>
              <span className="font-mono font-bold text-sm text-[#a50f15] dark:text-red-400 tabular-nums">
                {povertyDeltaPct > 0 ? `+${povertyDeltaPct}%` : `${povertyDeltaPct}%`}
              </span>
            </div>
            <input
              type="range"
              min={-20}
              max={40}
              step={5}
              value={povertyDeltaPct}
              onChange={(e) => setPovertyDeltaPct(Number(e.target.value))}
              className="w-full accent-[#a50f15] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-20%</span>
              <span>0%</span>
              <span>+10% (default)</span>
              <span>+40%</span>
            </div>
          </div>

          {/* Slider 2: Households without a car change */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Households without a car change</span>
              <span className="font-mono font-bold text-sm text-[#a50f15] dark:text-red-400 tabular-nums">
                {vehicleDeltaPct > 0 ? `+${vehicleDeltaPct}%` : `${vehicleDeltaPct}%`}
              </span>
            </div>
            <input
              type="range"
              min={-20}
              max={50}
              step={5}
              value={vehicleDeltaPct}
              onChange={(e) => setVehicleDeltaPct(Number(e.target.value))}
              className="w-full accent-[#a50f15] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>-20%</span>
              <span>0% (default)</span>
              <span>+25%</span>
              <span>+50%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Four stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors">
          <span className="text-xs font-medium text-slate-500 block mb-1">Tracts with a food gap</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {currentCountyStats.gapTracts} <span className="text-sm font-sans font-normal text-slate-400">→</span>{' '}
            <span className="text-[#a50f15] dark:text-red-400">
              {selectedCounty === 'All'
                ? scenarioResult.gapTractsCount
                : scenarioResult.tractsWithScenario.filter((t) => t.county === selectedCounty && t.isScenarioGap)
                    .length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Today vs scenario projected gap tracts
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors">
          <span className="text-xs font-medium text-slate-500 block mb-1">People living in gap tracts</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {selectedCounty === 'All'
              ? scenarioResult.gapPopulation.toLocaleString()
              : scenarioResult.tractsWithScenario
                  .filter((t) => t.county === selectedCounty && t.isScenarioGap)
                  .reduce((acc, t) => acc + t.population, 0)
                  .toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Total residents in projected gap tracts
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors">
          <span className="text-xs font-medium text-slate-500 block mb-1">Newly at-risk tracts</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold tabular-nums text-[#a50f15] dark:text-red-400">
            +{newlyAtRiskTracts.length}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Not flagged today, flagged under the scenario
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors">
          <span className="text-xs font-medium text-slate-500 block mb-1">People in newly at-risk tracts</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold tabular-nums text-[#a50f15] dark:text-red-400">
            +{newlyAtRiskTracts.reduce((s, t) => s + t.population, 0).toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Where outreach would need to expand
          </p>
        </div>
      </div>

      {/* Two cards: Tracts with a gap by county & Newly at-risk tracts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card: Tracts with a gap by county (horizontal paired bars) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Tracts with a gap by county</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Horizontal paired comparison: today in grey vs scenario in dark red.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {(['Orange', 'Osceola', 'Lake', 'Seminole'] as const).map((c) => {
              const baseCount = CANONICAL_COUNTY_DATA[c].gapTracts;
              const scenarioCount = scenarioResult.tractsWithScenario.filter(
                (t) => t.county === c && t.isScenarioGap,
              ).length;
              const maxVal = Math.max(120, scenarioCount, baseCount);
              const basePct = (baseCount / maxVal) * 100;
              const scenPct = (scenarioCount / maxVal) * 100;
              const isSelected = selectedCounty === c;

              return (
                // biome-ignore lint/a11y/useSemanticElements: row contains block-level chart markup, which is invalid inside <button>
                <div
                  key={c}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectCounty(c)}
                  onKeyDown={onActivate(() => onSelectCounty(c))}
                  className={`space-y-1.5 p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-red-50/70 dark:bg-red-950/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{c} County</span>
                    <span className="font-mono font-medium text-slate-600 dark:text-slate-400 tabular-nums">
                      {baseCount} today → <strong className="text-[#a50f15] dark:text-red-400">{scenarioCount}</strong>{' '}
                      scenario
                    </span>
                  </div>

                  <div className="space-y-1">
                    {/* Today bar */}
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-400 dark:bg-slate-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(5, basePct))}%` }}
                      />
                    </div>
                    {/* Scenario bar */}
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#a50f15] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, Math.max(5, scenPct))}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-xs bg-slate-400" />
              <span>Today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-xs bg-[#a50f15]" />
              <span>Scenario projection</span>
            </div>
          </div>
        </div>

        {/* Card: Newly at-risk tracts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Newly at-risk tracts</span>
              <span className="text-xs font-mono font-normal text-slate-500">{newlyAtRiskTracts.length} tracts</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tracts crossing gap threshold under scenario; sorted by population.
            </p>
          </div>

          <div className="overflow-x-auto max-h-[320px] overflow-y-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800/90 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2 px-3 font-semibold">Tract</th>
                  <th className="py-2 px-3 font-semibold">County</th>
                  <th className="py-2 px-3 text-right font-semibold">People</th>
                  <th className="py-2 px-3 text-right font-semibold">Projected Poverty %</th>
                  <th className="py-2 px-3 font-semibold">Projected Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {newlyAtRiskTracts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      No newly at-risk tracts under current slider settings.
                    </td>
                  </tr>
                ) : (
                  newlyAtRiskTracts.map((t) => {
                    const projPov = t.poverty_rate !== null ? t.poverty_rate * (1 + povertyDeltaPct / 100) : null;
                    return (
                      <tr
                        key={t.GEOID}
                        onClick={() => onSelectTract(t)}
                        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {t.tract_name}
                        </td>
                        <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{t.county}</td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                          {t.population.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-right font-mono tabular-nums text-[#a50f15] dark:text-red-400 font-semibold whitespace-nowrap">
                          {projPov !== null ? `${projPov.toFixed(1)}%` : '—'}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {t.lila_flag === 1
                            ? 'Classic food desert'
                            : t.low_access_flag === 1
                              ? 'Vehicle-compounded gap'
                              : 'SNAP enrollment gap'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Client Feedback Response: Threshold Sensitivity & Classification Stability Tool */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#a50f15]" />
              <span>Threshold Sensitivity &amp; Classification Stability Analysis</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tests how robust classifications are when regional quartile cutoffs (75th percentile) are shifted by small
              increments.
            </p>
          </div>

          {/* Threshold Shift Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-1.5">Shift Cutoffs:</span>
            {[-10, -5, 0, 5, 10].map((shift) => (
              <button
                type="button"
                key={shift}
                onClick={() => setSensitivityShiftPct(shift)}
                className={`px-2.5 py-1 rounded-md font-mono font-medium transition-colors ${
                  sensitivityShiftPct === shift
                    ? 'bg-[#a50f15] text-white shadow-xs font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {shift > 0 ? `+${shift}%` : `${shift}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Stability Score Meter & Summary Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-1">
            <span className="text-[11px] font-medium text-emerald-900 dark:text-emerald-300 block">
              Classification Stability
            </span>
            <div className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400 font-mono tabular-nums">
              {sensitivityResult.stabilityPercentage}%
            </div>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
              {sensitivityResult.stableTractsCount} of {filteredTracts.length} tracts remain unchanged under a{' '}
              {sensitivityShiftPct > 0 ? `+${sensitivityShiftPct}%` : `${sensitivityShiftPct}%`} shift
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 block">Baseline Gap Tracts</span>
            <div className="text-2xl font-serif font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {sensitivityResult.baselineGapCount}
            </div>
            <p className="text-[11px] text-slate-500">Current specification 149 gaps</p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 block">Shifted Threshold Gaps</span>
            <div className="text-2xl font-serif font-bold text-[#a50f15] dark:text-red-400 font-mono tabular-nums">
              {sensitivityResult.shiftedGapCount}
            </div>
            <p className="text-[11px] text-slate-500">
              Gaps under {sensitivityShiftPct > 0 ? `+${sensitivityShiftPct}%` : `${sensitivityShiftPct}%`} cutoff tweak
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 block">Boundary Transition Tracts</span>
            <div className="text-2xl font-serif font-bold text-amber-600 dark:text-amber-400 font-mono tabular-nums">
              {sensitivityResult.boundaryTractsCount}
            </div>
            <p className="text-[11px] text-slate-500">Tracts near percentile cutoff boundary</p>
          </div>
        </div>

        {/* Table of Boundary Tracts */}
        {sensitivityResult.changedTracts.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>
                Boundary Tracts Shifting Under{' '}
                {sensitivityShiftPct > 0 ? `+${sensitivityShiftPct}%` : `${sensitivityShiftPct}%`} Cutoff Tweak (
                {sensitivityResult.changedTracts.length})
              </span>
            </h4>
            <div className="overflow-x-auto max-h-[220px] overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Tract</th>
                    <th className="py-2 px-3 font-semibold">County</th>
                    <th className="py-2 px-3 text-right font-semibold">People</th>
                    <th className="py-2 px-3 font-semibold">Baseline Classification</th>
                    <th className="py-2 px-3 font-semibold">Shifted Classification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {sensitivityResult.changedTracts.map(({ tract, baselineGap, shiftedGap }) => (
                    <tr key={tract.GEOID} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-medium text-slate-900 dark:text-slate-100">{tract.tract_name}</td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{tract.county}</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">
                        {tract.population.toLocaleString()}
                      </td>
                      <td className="py-2 px-3 font-medium">{baselineGap}</td>
                      <td className="py-2 px-3 font-semibold text-[#a50f15] dark:text-red-400">{shiftedGap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
