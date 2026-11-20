import { ChevronDown, ChevronUp } from 'lucide-react';
import type React from 'react';
import type { DashboardModel } from './useDashboardModel';

export const RulesFooter: React.FC<{ model: DashboardModel }> = ({ model }) => {
  const { isRulesExpanded, setIsRulesExpanded } = model;
  // COLLAPSIBLE AT BOTTOM: How the gaps are calculated
  return (
    <section className="pt-4 border-t border-slate-200 dark:border-slate-800">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs transition-colors">
        <button
          type="button"
          onClick={() => setIsRulesExpanded(!isRulesExpanded)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
        >
          <div>
            <h3 className="text-base font-serif font-semibold text-slate-900 dark:text-slate-100">
              How the gaps are calculated
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Quartile ranking methodology, 5-tier classification rules, and authoritative data sources.
            </p>
          </div>
          <div className="p-1 rounded-md text-slate-500">
            {isRulesExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {isRulesExpanded && (
          <div className="px-5 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-6 text-xs text-slate-700 dark:text-slate-300">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Classification Rules (Specification Section 6.2)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
                  <strong className="text-slate-900 dark:text-slate-100 block">Quartiles within the 490 tracts:</strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    All 490 Central Florida census tracts are ranked against each other (Q1 lowest to Q4 highest) for
                    poverty rate, SNAP participation, and no-vehicle low-access share.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
                  <strong className="text-slate-900 dark:text-slate-100 block">Classic food desert:</strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Poverty rate in Q4 (top 25% highest poverty in the region) AND USDA low-income/low-access flag = 1
                    (&gt;1 mile urban or &gt;10 miles rural from nearest supermarket).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
                  <strong className="text-slate-900 dark:text-slate-100 block">Vehicle-compounded gap:</strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    USDA low-access flag = 1 AND (USDA no-vehicle low-access flag = 1 or no-vehicle low-access share in
                    Q4).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
                  <strong className="text-slate-900 dark:text-slate-100 block">SNAP enrollment gap:</strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Poverty rate in Q4 AND SNAP participation rate in Q1 or Q2 (bottom 50% participation despite high
                    poverty).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
                  <strong className="text-slate-900 dark:text-slate-100 block">Possible blind spot:</strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    No measure in Q4, but two or more of poverty, SNAP, and no-vehicle share in Q3 (moderate elevated
                    need across multiple signals).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-1">
                  <strong className="text-slate-900 dark:text-slate-100 block">
                    Not enough data (Insufficient data):
                  </strong>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Poverty or USDA low-access values missing, or census tract population under 500 residents.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                Authoritative Data Sources (Joined by 11-Digit GEOID)
              </h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                <li>
                  <strong>U.S. Census Bureau ACS 5-Year (2024 vintage):</strong> Table S1701 (Poverty rate &amp; MOE),
                  Table S2201 (SNAP participation rate, households &amp; MOE), Table S0101 (Total population), Table
                  S1901 (Median household income).
                </li>
                <li>
                  <strong>USDA Economic Research Service Food Access Research Atlas:</strong> Urban classification,
                  low-income tract flag, occupied housing units, and vehicle access indicators.
                </li>
                <li>
                  <strong>USDA SNAP Retailer Access Map (SRAM, July 2026 release):</strong> Low-income low-access flags,
                  straight-line distance to grocery stores, and no-vehicle low-access population share.
                </li>
                <li>
                  <strong>USDA Food and Nutrition Service SNAP Retailer Locator:</strong> 1,697 geocoded authorized SNAP
                  food retailers across Orange, Osceola, Seminole, and Lake counties.
                </li>
                <li>
                  <strong>U.S. Census Bureau TIGER/Line 2020 Shapefiles:</strong> Official census tract boundary
                  polygons.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
