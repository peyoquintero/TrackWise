import type React from 'react';
import { CANONICAL_COUNTY_DATA } from '../../lib/countyStats';
import type { DashboardModel } from './useDashboardModel';

export const Section2: React.FC<{ model: DashboardModel }> = ({ model }) => {
  const { selectedCounty, onSelectCounty, onSelectTract, currentCountyStats, top3Classic, top3Vehicle, top3Snap } =
    model;
  // SECTION 2: What kind of help does each place need?
  return (
    <section className="space-y-6 scroll-mt-28" id="section-2">
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          2. What kind of help does each place need?
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          The gap type decides the action. Counts include tracts where the type is the main or the second gap.
        </p>
      </div>

      {/* Three cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Classic food desert */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#991b1b] shrink-0" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">Classic food desert</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              High poverty and far from a SNAP-authorized store.
            </p>
            <div className="pt-1">
              <span className="text-xs text-slate-500 block mb-0.5">Recommended action:</span>
              <strong className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Pantry, mobile pantry or a partner store
              </strong>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg">
              <div>
                <div className="text-2xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {currentCountyStats.classic}
                </div>
                <div className="text-[11px] text-slate-500">tracts</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {currentCountyStats.classicPop.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500">people</div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-500 block mb-1.5 uppercase tracking-wider">
                Three largest tracts:
              </span>
              <div className="space-y-1.5 text-xs">
                {top3Classic.length === 0 ? (
                  <span className="text-slate-400 italic text-[11px]">None in this county</span>
                ) : (
                  top3Classic.map((t) => (
                    <button
                      type="button"
                      key={t.GEOID}
                      onClick={() => onSelectTract(t)}
                      className="w-full text-left flex items-center justify-between p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                        {t.tract_name}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-slate-500 shrink-0">
                        {t.population.toLocaleString()}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Vehicle-compounded gap */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#dc2626] shrink-0" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">Vehicle-compounded gap</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Many households without a car live far from a SNAP store.
            </p>
            <div className="pt-1">
              <span className="text-xs text-slate-500 block mb-0.5">Recommended action:</span>
              <strong className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Delivery, or a mobile stop near transit
              </strong>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg">
              <div>
                <div className="text-2xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {currentCountyStats.vehicleTotal}
                </div>
                <div className="text-[11px] text-slate-500">tracts (main/sec)</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {currentCountyStats.vehicleTotalPop.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500">people</div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-500 block mb-1.5 uppercase tracking-wider">
                Three largest tracts:
              </span>
              <div className="space-y-1.5 text-xs">
                {top3Vehicle.length === 0 ? (
                  <span className="text-slate-400 italic text-[11px]">None in this county</span>
                ) : (
                  top3Vehicle.map((t) => (
                    <button
                      type="button"
                      key={t.GEOID}
                      onClick={() => onSelectTract(t)}
                      className="w-full text-left flex items-center justify-between p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                        {t.tract_name}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-slate-500 shrink-0">
                        {t.population.toLocaleString()}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: SNAP enrollment gap */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#f87171] shrink-0" />
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">SNAP enrollment gap</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              High poverty but low SNAP use, so eligible households may not be enrolled.
            </p>
            <div className="pt-1">
              <span className="text-xs text-slate-500 block mb-0.5">Recommended action:</span>
              <strong className="text-xs font-semibold text-slate-900 dark:text-slate-100 block">
                Enrollment outreach and events
              </strong>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-center bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg">
              <div>
                <div className="text-2xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {currentCountyStats.snapTotal}
                </div>
                <div className="text-[11px] text-slate-500">tracts (main/sec)</div>
              </div>
              <div>
                <div className="text-2xl font-serif font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {currentCountyStats.snapTotalPop.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500">people</div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-slate-500 block mb-1.5 uppercase tracking-wider">
                Three largest tracts:
              </span>
              <div className="space-y-1.5 text-xs">
                {top3Snap.length === 0 ? (
                  <span className="text-slate-400 italic text-[11px]">None in this county</span>
                ) : (
                  top3Snap.map((t) => (
                    <button
                      type="button"
                      key={t.GEOID}
                      onClick={() => onSelectTract(t)}
                      className="w-full text-left flex items-center justify-between p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                        {t.tract_name}
                      </span>
                      <span className="font-mono text-[11px] tabular-nums text-slate-500 shrink-0">
                        {t.population.toLocaleString()}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table: Gap type by county */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Gap type by county</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Primary gap classifications across Central Florida counties (spec v1.1).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-4 font-semibold">County</th>
                <th className="py-2.5 px-4 text-right font-semibold">Classic food desert</th>
                <th className="py-2.5 px-4 text-right font-semibold">Vehicle-compounded gap</th>
                <th className="py-2.5 px-4 text-right font-semibold">SNAP enrollment gap</th>
                <th className="py-2.5 px-4 text-right font-semibold">Total gap tracts</th>
                <th className="py-2.5 px-4 text-right font-semibold">People in gap tracts</th>
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
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{data.classic}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{data.vehiclePrimary}</td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">{data.snapPrimary}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                      {data.gapTracts}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                      {data.gapPopulation.toLocaleString()}
                    </td>
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
                <td className="py-2.5 px-4 text-right font-mono tabular-nums">{CANONICAL_COUNTY_DATA.All.classic}</td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                  {CANONICAL_COUNTY_DATA.All.vehiclePrimary}
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                  {CANONICAL_COUNTY_DATA.All.snapPrimary}
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#a50f15] dark:text-red-400 font-bold">
                  {CANONICAL_COUNTY_DATA.All.gapTracts}
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums font-bold">
                  {CANONICAL_COUNTY_DATA.All.gapPopulation.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
};
