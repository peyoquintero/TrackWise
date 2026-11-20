import { HelpCircle, Info } from 'lucide-react';
import type React from 'react';
import { CANONICAL_COUNTY_DATA } from '../../lib/countyStats';
import type { DashboardModel } from './useDashboardModel';

export const Section3: React.FC<{ model: DashboardModel }> = ({ model }) => {
  const { selectedCounty, onSelectCounty, onSelectTract, currentCountyStats, blindSpotsList } = model;
  // SECTION 3: What do we not know?
  return (
    <section className="space-y-6 scroll-mt-28" id="section-3">
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          3. What do we not know?
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Where the data cannot give a clear answer, so a person should look before acting.
        </p>
      </div>

      {/* Four stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors">
          <span className="text-xs font-medium text-slate-500 block mb-1">Possible blind spots</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {currentCountyStats.blindSpots}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Moderate need on several signals; no automatic recommendation
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors">
          <span className="text-xs font-medium text-slate-500 block mb-1">People in blind spots</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
            ~{currentCountyStats.blindSpotPop.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Worth checking with local partners
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors">
          <span className="text-xs font-medium text-slate-500 block mb-1">Gap tracts with uncertain estimates</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {currentCountyStats.uncertainEstimates}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Poverty or SNAP margin of error is over half the estimate
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors">
          <span className="text-xs font-medium text-slate-500 block mb-1">Tracts not evaluated</span>
          <div className="text-2xl sm:text-3xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {currentCountyStats.notEvaluated}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            Under 500 people or missing poverty or grocery data
          </p>
        </div>
      </div>

      {/* Table: What we do not know, by county */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">What we do not know, by county</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Breakdown of uncertainty indicators across the four Central Florida counties.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-4 font-semibold">County</th>
                <th className="py-2.5 px-4 text-right font-semibold">Blind spots</th>
                <th className="py-2.5 px-4 text-right font-semibold">People in blind spots</th>
                <th className="py-2.5 px-4 text-right font-semibold">Gap tracts with uncertain estimates</th>
                <th className="py-2.5 px-4 text-right font-semibold">Not evaluated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {(['Orange', 'Osceola', 'Lake', 'Seminole'] as const).map((c) => {
                const data = CANONICAL_COUNTY_DATA[c];
                const isHighlighted = selectedCounty === c;
                return (
                  <tr
                    key={c}
                    onClick={() => onSelectCounty(c)}
                    className={`cursor-pointer transition-colors ${
                      isHighlighted
                        ? 'bg-red-50/70 dark:bg-red-950/30 font-semibold text-slate-900 dark:text-white border-l-4 border-l-[#a50f15]'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-2.5 px-4 font-medium">{c} County</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{data.blindSpots}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                      ~{data.blindSpotPop.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{data.uncertainEstimates}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{data.notEvaluated}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-850 font-semibold text-slate-900 dark:text-slate-100">
              <tr
                onClick={() => onSelectCounty('All')}
                className={`cursor-pointer ${selectedCounty === 'All' ? 'bg-red-50/70 dark:bg-red-950/30 border-l-4 border-l-[#a50f15]' : ''}`}
              >
                <td className="py-2.5 px-4 font-serif">Total (All Central Florida)</td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold">
                  {CANONICAL_COUNTY_DATA.All.blindSpots}
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold">
                  ~{CANONICAL_COUNTY_DATA.All.blindSpotPop.toLocaleString()}
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold">
                  {CANONICAL_COUNTY_DATA.All.uncertainEstimates}
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold">
                  {CANONICAL_COUNTY_DATA.All.notEvaluated}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Client Feedback Response: Confidence Scoring Methodology & Rationale Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#a50f15]" />
              <span>Confidence Scoring Rationale &amp; Margin of Error (MOE) Parameters</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Technical explanation of Census ACS margin-of-error benchmarks, population stability cutoffs, and SNAP MOE
              integration.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 font-medium">Confidence Tiers:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">High (4 pts)</span>
            <span className="text-slate-300">·</span>
            <span className="font-semibold text-blue-700 dark:text-blue-400">Medium (2-3 pts)</span>
            <span className="text-slate-300">·</span>
            <span className="font-semibold text-amber-700 dark:text-amber-400">Low (0-1 pt)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50/80 dark:bg-slate-850 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Poverty MOE (&le; 30%)</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              <strong>Why 30%?</strong> The U.S. Census Bureau considers a relative margin of error (MOE / estimate)
              &le; 30% as statistically reliable for small area estimates. MOE &gt; 50% triggers an uncertainty warning.
            </p>
          </div>

          <div className="p-3 bg-slate-50/80 dark:bg-slate-850 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>SNAP MOE Integration</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              <strong>Why SNAP MOE?</strong> SNAP participation from ACS S2201 carries its own sampling error. Evaluated
              alongside poverty MOE to confirm whether low SNAP rates reflect true under-enrollment.
            </p>
          </div>

          <div className="p-3 bg-slate-50/80 dark:bg-slate-850 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Population (&ge; 2,500)</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              <strong>Why 2,500 pop?</strong> Central Florida tracts average ~4,500 residents. Tracts under 2,500 have
              small sample bases in Census ACS, leading to volatile year-over-year rate swings.
            </p>
          </div>

          <div className="p-3 bg-slate-50/80 dark:bg-slate-850 rounded-lg border border-slate-200/70 dark:border-slate-800 space-y-1.5">
            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Secondary Corroboration</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              <strong>Why multi-gap?</strong> Awarded +1 point when a secondary gap classification (e.g. Vehicle gap
              alongside Classic desert) reinforces multi-dimensional need across indicators.
            </p>
          </div>
        </div>
      </div>

      {/* Two cards side by side: Known data limits & Blind spots to review */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card: Known data limits */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors space-y-3">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#a50f15]" />
            <span>Known data limits</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Documented constraints to keep in mind when evaluating recommendations.
          </p>

          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 pt-1">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a50f15] mt-1.5 shrink-0" />
              <span>
                <strong>No CDC transportation data for Central Florida:</strong> The CDC PLACES transport measures are
                blank for these four counties, so USDA households without a vehicle are used instead.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a50f15] mt-1.5 shrink-0" />
              <span>
                <strong>Distances are straight-line:</strong> Euclidean distance does not capture driving routes,
                transit availability, or physical barriers like highways (I-4, SR-408) and lakes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a50f15] mt-1.5 shrink-0" />
              <span>
                <strong>Census survey margins of error:</strong> ACS figures are 5-year sample estimates that carry wide
                margins of error in small residential tracts (e.g. MOE &gt; 30% of estimate).
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a50f15] mt-1.5 shrink-0" />
              <span>
                <strong>Pantry and food bank locations are not in the data:</strong> Only SNAP-authorized retail stores
                are recorded; informal food distribution networks are not reflected.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a50f15] mt-1.5 shrink-0" />
              <span>
                <strong>Low SNAP use has multiple meanings:</strong> A low SNAP participation rate can reflect lower
                need rather than under-enrollment; local outreach verification is needed before acting.
              </span>
            </li>
          </ul>
        </div>

        {/* Card: Blind spots to review */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors flex flex-col">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <span>Blind spots to review</span>
              <span className="text-xs font-mono font-normal text-slate-500">{blindSpotsList.length} tracts</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Elevated need across multiple signals; sorted by population (largest first).
            </p>
          </div>

          <div className="overflow-x-auto max-h-[300px] overflow-y-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800/90 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2 px-3 font-semibold">Tract</th>
                  <th className="py-2 px-3 font-semibold">County</th>
                  <th className="py-2 px-3 text-right font-semibold">People</th>
                  <th className="py-2 px-3 text-right font-semibold">Poverty %</th>
                  <th className="py-2 px-3 text-right font-semibold">No car %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {blindSpotsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      No blind spots found for this county.
                    </td>
                  </tr>
                ) : (
                  blindSpotsList.map((t) => (
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
                      <td className="py-2 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        {t.poverty_rate !== null ? `${t.poverty_rate.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums whitespace-nowrap">
                        {t.no_vehicle_pct ? `${(t.no_vehicle_pct * 100).toFixed(1)}%` : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
