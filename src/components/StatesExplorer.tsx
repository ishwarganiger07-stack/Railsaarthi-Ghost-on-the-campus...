import React, { useState } from 'react';
import { ALL_INDIAN_STATES, StateRailwayInfo } from '../data/statesData';
import {
  MapPin,
  Train,
  Layers,
  ArrowRight,
  Search,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface StatesExplorerProps {
  onSelectStation: (stationCode: string) => void;
  onSearchStateTrains: (stateName: string) => void;
}

export const StatesExplorer: React.FC<StatesExplorerProps> = ({
  onSelectStation,
  onSearchStateTrains,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedState, setSelectedState] = useState<StateRailwayInfo | null>(
    ALL_INDIAN_STATES[0] // Andhra Pradesh
  );

  const regions = [
    'All',
    'North',
    'South',
    'East',
    'West',
    'Central',
    'North-East',
    'Union Territory',
  ];

  const filteredStates = ALL_INDIAN_STATES.filter((state) => {
    const matchesRegion =
      selectedRegion === 'All' ||
      (selectedRegion === 'Union Territory'
        ? state.type === 'Union Territory'
        : state.region === selectedRegion);

    const matchesSearch =
      state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.capital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      state.majorStations.some(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.code.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesRegion && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>PAN-INDIA RAILWAY NETWORK</span>
            <span aria-hidden="true">·</span>
            <span>28 States & 8 Union Territories</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Indian States & Union Territories Railway Explorer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Explore state-wise divisional railway junctions, signature state expresses, and track density.
          </p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state, junction or city..."
            className="w-full h-10 pl-9 pr-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Region Filter Segmented Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none shadow-sm">
        {regions.map((reg) => (
          <button
            key={reg}
            onClick={() => setSelectedRegion(reg)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap min-h-[40px] ${
              selectedRegion === reg
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {reg === 'All' ? 'All India (36)' : reg}
          </button>
        ))}
      </div>

      {/* Split view: States List + Selected State Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* States Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[640px] overflow-y-auto pr-1">
          {filteredStates.map((st) => {
            const isSelected = selectedState?.id === st.id;

            return (
              <button
                key={st.id}
                onClick={() => setSelectedState(st)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-2 ring-blue-400/40'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {st.type} · {st.region}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                    {st.railwayZones.join(', ')}
                  </span>
                </div>

                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">
                  {st.name}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mb-2">
                  Capital: {st.capital}
                </p>

                <div className="flex items-center justify-between text-[11px] text-blue-700 dark:text-blue-400 font-semibold pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <span>{st.majorStations.length} Major Junctions</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected State Detail Pane */}
        {selectedState && (
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 sticky top-20">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                <span>{selectedState.type.toUpperCase()} RAILWAY DIRECTORY</span>
                <span aria-hidden="true">·</span>
                <span>{selectedState.region} Region</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {selectedState.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>Capital: <strong className="text-slate-800 dark:text-slate-200">{selectedState.capital}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Track: <strong className="text-slate-800 dark:text-slate-200">{selectedState.totalTrackKm}</strong></span>
              </div>
            </div>

            {/* Major Stations List */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Primary Railway Junctions & Terminals
              </h4>
              <div className="space-y-2">
                {selectedState.majorStations.map((station) => (
                  <div
                    key={station.code}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 dark:text-white">
                          {station.name}
                        </span>
                        <span className="font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded text-[11px]">
                          {station.code}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {station.city} · {station.platforms} Platforms
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectStation(station.code)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 rounded-lg border border-slate-200 dark:border-slate-600 transition-colors"
                    >
                      View Trains
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Trains of this State */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                Signature State Expresses
              </h4>
              <div className="space-y-2">
                {selectedState.signatureTrains.map((tr) => (
                  <div
                    key={tr.number}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {tr.name}
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        #{tr.number}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      Route: {tr.route}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSearchStateTrains(selectedState.name)}
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Explore All Trains Connecting {selectedState.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
