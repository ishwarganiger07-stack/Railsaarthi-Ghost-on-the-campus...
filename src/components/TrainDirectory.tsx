import React, { useState } from 'react';
import { ALL_INDIAN_TRAINS, ComprehensiveTrain } from '../data/trainsData';
import {
  Train,
  Search,
  Clock,
  Ticket,
  Layers,
  Sparkles,
} from 'lucide-react';

interface TrainDirectoryProps {
  onBookSeat: (train: ComprehensiveTrain, classCode?: string) => void;
  onTrackLive: (trainNumber: string) => void;
  onViewCoachLayout: (trainNumber: string) => void;
  onAskAi: (trainName: string) => void;
}

export const TrainDirectory: React.FC<TrainDirectoryProps> = ({
  onBookSeat,
  onTrackLive,
  onViewCoachLayout,
  onAskAi,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');

  const categories = [
    'All',
    'Vande Bharat',
    'Rajdhani',
    'Shatabdi',
    'Duronto',
    'Superfast',
    'Express',
    'Jan Shatabdi',
  ];

  const filteredTrains = ALL_INDIAN_TRAINS.filter((t) => {
    const matchesCategory = selectedType === 'All' || t.type === selectedType;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.trainNumber.includes(q) ||
      t.trainName.toLowerCase().includes(q) ||
      t.fromName.toLowerCase().includes(q) ||
      t.toName.toLowerCase().includes(q) ||
      t.from.toLowerCase().includes(q) ||
      t.to.toLowerCase().includes(q) ||
      t.states.some((s) => s.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>ALL-INDIA TRAIN DIRECTORY</span>
            <span aria-hidden="true">·</span>
            <span>Premier Express Network</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Browse All Indian Trains & Book Seats
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search by 5-digit train number, train name, junction code, or state.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search train name or # (e.g. 22436)..."
            className="w-full h-11 pl-10 pr-4 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedType(cat)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap min-h-[40px] ${
              selectedType === cat
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'All' ? `All Trains (${ALL_INDIAN_TRAINS.length})` : cat}
          </button>
        ))}
      </div>

      {/* Train Cards List */}
      <div className="space-y-4">
        {filteredTrains.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800">
            <Train className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Trains Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try searching by train number like '22436', '12952', or 'Vande Bharat'.</p>
          </div>
        ) : (
          filteredTrains.map((train) => (
            <div
              key={train.trainNumber}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-bold text-blue-700 dark:text-blue-400 text-sm">
                      {train.trainNumber}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{train.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>Runs: {train.days.join(', ')}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {train.punctuality} Punctual
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {train.trainName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <span>States: {train.states.join(', ')}</span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => onBookSeat(train)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm whitespace-nowrap"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Book Seats</span>
                  </button>

                  <button
                    onClick={() => onTrackLive(train.trainNumber)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Live GPS</span>
                  </button>

                  <button
                    onClick={() => onViewCoachLayout(train.trainNumber)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Coach Map</span>
                  </button>

                  <button
                    onClick={() => onAskAi(`${train.trainNumber} ${train.trainName}`)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 rounded-xl transition-colors whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Tips</span>
                  </button>
                </div>
              </div>

              {/* Timing Row */}
              <div className="grid grid-cols-3 gap-2 py-4 border-b border-slate-100 dark:border-slate-800 text-center sm:text-left">
                <div>
                  <span className="text-xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                    {train.departure}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                    {train.fromName} ({train.from})
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {train.duration}
                  </span>
                  <div className="w-full max-w-[140px] h-0.5 bg-slate-200 dark:bg-slate-700 my-1 relative">
                    <div className="w-2 h-2 rounded-full bg-blue-600 absolute right-0 -top-[3px]" />
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase">Direct Express</span>
                </div>

                <div className="text-right">
                  <span className="text-xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                    {train.arrival}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                    {train.toName} ({train.to})
                  </span>
                </div>
              </div>

              {/* Classes & Seat Availability strip */}
              <div className="pt-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Select Class to Book
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {train.classes.map((cls) => (
                    <button
                      key={cls.code}
                      onClick={() => onBookSeat(train, cls.code)}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-500 text-left transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {cls.code}
                        </span>
                        <span className="text-xs font-black font-mono text-slate-900 dark:text-white tabular-nums">
                          ₹{cls.fare}
                        </span>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        {cls.status}
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">
                        {cls.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
