import type React from 'react';
import { CANONICAL_COUNTY_DATA } from '../lib/countyStats';
import { RulesFooter } from './dashboard/RulesFooter';
import { Section1 } from './dashboard/Section1';
import { Section2 } from './dashboard/Section2';
import { Section3 } from './dashboard/Section3';
import { Section4 } from './dashboard/Section4';
import { type DashboardStoryReportProps, useDashboardModel } from './dashboard/useDashboardModel';

export { CANONICAL_COUNTY_DATA };

export const DashboardStoryReport: React.FC<DashboardStoryReportProps> = (props) => {
  const model = useDashboardModel(props);
  const { selectedCounty, onSelectCounty, currentCountyStats, countyOrder } = model;
  return (
    <div className="space-y-10 pb-16 font-sans">
      {/* =========================================================================
          TOP OF PAGE: Title & Headline sentence that updates with county filter
          ========================================================================= */}
      <section className="space-y-3 pt-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          Central Florida food access gaps
        </h1>
        <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-4xl">
          <strong className="font-semibold text-slate-900 dark:text-white tabular-nums">
            {currentCountyStats.gapPopulation.toLocaleString()}
          </strong>{' '}
          people live in{' '}
          <strong className="font-semibold text-slate-900 dark:text-white tabular-nums">
            {currentCountyStats.gapTracts}
          </strong>{' '}
          census tracts with a food access gap {currentCountyStats.headlineLocation}. Each gap type points to a
          different kind of help.
        </p>
      </section>

      {/* =========================================================================
          STICKY COUNTY FILTER: Controls every section on the page
          ========================================================================= */}
      <div className="sticky top-[57px] z-30 -mx-4 md:-mx-6 px-4 md:px-6 py-2.5 bg-[#f8f9fa]/95 dark:bg-slate-950/95 backdrop-blur-md border-y border-slate-200/90 dark:border-slate-800 transition-colors">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-2 shrink-0">County filter:</span>
          {countyOrder.map((c) => {
            const isActive = selectedCounty === c;
            const data = CANONICAL_COUNTY_DATA[c];
            return (
              <button
                type="button"
                key={c}
                onClick={() => onSelectCounty(c)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-[#a50f15] text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {c === 'All' ? 'All (490 tracts)' : `${c} (${data.totalTracts})`}
              </button>
            );
          })}
        </div>
      </div>

      <Section1 model={model} />
      <Section2 model={model} />
      <Section3 model={model} />
      <Section4 model={model} />
      <RulesFooter model={model} />
    </div>
  );
};
