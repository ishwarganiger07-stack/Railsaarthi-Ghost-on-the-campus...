import React, { useState } from 'react';
import { SearchTrain } from '../types';
import {
  Train,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  Ticket,
  Utensils,
} from 'lucide-react';

interface TrainSearchViewProps {
  fromStation: string;
  toStation: string;
  trains: SearchTrain[];
  isLoading: boolean;
  onTrackTrain: (trainNumber: string) => void;
  onViewCoachLayout: (trainNumber: string) => void;
  onAskAiAboutTrain: (trainName: string) => void;
  onBookSeat?: (trainNumber: string, classCode?: string) => void;
  onOrderFood?: (trainNumber: string) => void;
}

export const TrainSearchView: React.FC<TrainSearchViewProps> = ({
  fromStation,
  toStation,
  trains,
  isLoading,
  onTrackTrain,
  onViewCoachLayout,
  onAskAiAboutTrain,
  onBookSeat,
  onOrderFood,
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('ALL');

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Searching Trains</h3>
        <p className="text-sm text-slate-500 mt-1">Retrieving schedules, real-time availability, and fares...</p>
      </div>
    );
  }

  const classFilters = ['ALL', '1A', '2A', '3A', 'SL', 'CC', 'EC'];

  const filteredTrains = selectedClassFilter === 'ALL'
    ? trains
    : trains.filter((t) => t.classes.some((c) => c.code === selectedClassFilter));

  return (
    <div className="space-y-6">
      {/* Route Header Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>TRAIN SCHEDULE & FARES</span>
            <span aria-hidden="true">·</span>
            <span>IRCTC Live Database</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 flex items-center gap-2.5">
            <span>{fromStation || 'NDLS'}</span>
            <ArrowRight className="w-5 h-5 text-slate-400" />
            <span>{toStation || 'BSB'}</span>
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Found <strong className="text-slate-900 dark:text-white font-mono tabular-nums">{filteredTrains.length}</strong> trains on this sector
          </span>
        </div>

        {/* Segmented Class Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto scrollbar-none">
          {classFilters.map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClassFilter(cls)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap min-h-[36px] ${
                selectedClassFilter === cls
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Train Cards List */}
      <div className="space-y-4">
        {filteredTrains.map((train) => (
          <div
            key={train.trainNumber}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                    {train.trainNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Runs: {train.days.join(', ')}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {train.punctuality} Punctual
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {train.trainName}
                </h3>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onTrackTrain(train.trainNumber)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Track Live</span>
                </button>
                <button
                  onClick={() => onBookSeat && onBookSeat(train.trainNumber)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Book Seat</span>
                </button>
                <button
                  onClick={() => onOrderFood && onOrderFood(train.trainNumber)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/60 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Order Food</span>
                </button>
                <button
                  onClick={() => onViewCoachLayout(train.trainNumber)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Coach Map</span>
                </button>
                <button
                  onClick={() => onAskAiAboutTrain(`${train.trainNumber} ${train.trainName}`)}
                  title="Ask AI questions about this train"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Tips</span>
                </button>
              </div>
            </div>

            {/* Timings row */}
            <div className="grid grid-cols-3 gap-2 py-4 border-b border-slate-100 dark:border-slate-800 text-center sm:text-left">
              <div>
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                  {train.departure}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  {train.from} (Dep)
                </span>
              </div>

              <div className="flex flex-col items-center justify-center">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {train.duration}
                </span>
                <div className="w-full max-w-[120px] h-0.5 bg-slate-200 dark:bg-slate-700 my-1 relative">
                  <div className="w-2 h-2 rounded-full bg-blue-600 absolute right-0 -top-[3px]" />
                </div>
                <span className="text-[10px] text-slate-400 uppercase">Non-stop / Superfast</span>
              </div>

              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white tabular-nums">
                  {train.arrival}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                  {train.to} (Arr)
                </span>
              </div>
            </div>

            {/* Class Availability & Fares Grid */}
            <div className="pt-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Available Classes & Ticket Fares (Click to Book Seat)
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {train.classes.map((cls) => {
                  const isAvailable = cls.status.includes('AVAILABLE');
                  const isRac = cls.status.includes('RAC');

                  return (
                    <button
                      key={cls.code}
                      onClick={() => onBookSeat && onBookSeat(train.trainNumber, cls.code)}
                      className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all text-left group/cls cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white group-hover/cls:text-emerald-600 dark:group-hover/cls:text-emerald-400 transition-colors">
                          {cls.code}
                        </span>
                        <span className="text-xs font-mono font-black text-slate-900 dark:text-white tabular-nums">
                          ₹{cls.fare}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold">
                        <span
                          className={
                            isAvailable
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : isRac
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-red-500 dark:text-red-400'
                          }
                        >
                          {cls.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                        <span className="text-[10px] text-slate-400 truncate">
                          {cls.name}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 opacity-0 group-hover/cls:opacity-100 transition-opacity">
                          Book →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
