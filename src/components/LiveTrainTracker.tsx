import React, { useState } from 'react';
import { TrainLiveStatus } from '../types';
import {
  Navigation,
  RefreshCw,
  Gauge,
  MapPin,
  Clock,
  Share2,
  CheckCircle2,
  Radio,
  Train,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';

interface LiveTrainTrackerProps {
  statusData: TrainLiveStatus | null;
  isLoading: boolean;
  onRefresh: () => void;
  onSearchOther: (trainNumber: string) => void;
}

export const LiveTrainTracker: React.FC<LiveTrainTrackerProps> = ({
  statusData,
  isLoading,
  onRefresh,
  onSearchOther,
}) => {
  const [copied, setCopied] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'upcoming'>('all');

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connecting to Railway GPS Feed</h3>
        <p className="text-sm text-slate-500 mt-1">Retrieving real-time telemetry, platform allocations, and speed data...</p>
      </div>
    );
  }

  if (!statusData) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <Train className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Train Tracked Yet</h3>
        <p className="text-xs text-slate-500 mt-1">Enter a train number in the search bar above to track live running status.</p>
      </div>
    );
  }

  const progressPercent = Math.min(
    100,
    Math.round((statusData.coveredDistanceKm / (statusData.totalDistanceKm || 1)) * 100)
  );

  const handleShare = () => {
    const text = `Live Status for ${statusData.trainNumber} ${statusData.trainName}: Currently at ${statusData.currentStation}, ${statusData.statusText}. Next stop: ${statusData.nextStation}. Tracked via RailSaarthi.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayedHalts = filterMode === 'all'
    ? statusData.halts
    : statusData.halts.filter((h) => h.status === 'current' || h.status === 'upcoming');

  return (
    <div className="space-y-6">
      {/* Train Info Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400">
              <span className="font-mono">{statusData.trainNumber}</span>
              <span aria-hidden="true">·</span>
              <span>Daily Superfast Express</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {statusData.trainName}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>{statusData.source}</span>
              <span aria-hidden="true">→</span>
              <span>{statusData.destination}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
              title="Refresh status"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
              title="Share live status"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Live Status Telemetry Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Current Location</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">{statusData.currentStation}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Running Condition</span>
            <div className="flex items-center gap-1.5 text-sm sm:text-base font-bold">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className={statusData.delayMinutes === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                {statusData.statusText}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Live Speed</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              <Gauge className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="font-mono tabular-nums">{statusData.speedKmh} km/h</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Next Halt</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              <Radio className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="truncate">{statusData.nextStation}</span>
            </div>
          </div>
        </div>

        {/* Journey Distance Progress Bar */}
        <div className="pt-5">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>
              Covered <strong className="text-slate-900 dark:text-white font-mono tabular-nums">{statusData.coveredDistanceKm} km</strong> of {statusData.totalDistanceKm} km
            </span>
            <span className="font-mono tabular-nums font-semibold text-blue-700 dark:text-blue-400">
              {progressPercent}% Complete
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Route Timeline & Station Halts */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Station Halts & Platform Schedule</h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Platform numbers subject to live station master allocation
            </span>
          </div>

          {/* Interactive filter toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Halts ({statusData.halts.length})
            </button>
            <button
              onClick={() => setFilterMode('upcoming')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                filterMode === 'upcoming'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Remaining Only
            </button>
          </div>
        </div>

        {/* Station Timeline */}
        <div className="space-y-4">
          {displayedHalts.map((halt, idx) => {
            const isCurrent = halt.status === 'current';
            const isPassed = halt.status === 'passed';
            const isUpcoming = halt.status === 'upcoming';

            return (
              <div
                key={halt.stationCode}
                className={`relative flex items-start gap-4 p-3.5 rounded-xl transition-colors ${
                  isCurrent
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {/* Visual Icon Node */}
                <div className="flex flex-col items-center mt-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? 'bg-blue-700 text-white shadow-md shadow-blue-600/30 ring-4 ring-blue-100 dark:ring-blue-900/40'
                        : isPassed
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        : 'bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-500'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <Train className="w-3.5 h-3.5" />
                    ) : (
                      <span className="font-mono text-[10px]">{idx + 1}</span>
                    )}
                  </div>
                </div>

                {/* Station Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-white text-base">
                        {halt.stationName}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {halt.stationCode}
                      </span>
                      {isCurrent && (
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 animate-pulse">
                          (Current Location)
                        </span>
                      )}
                    </div>

                    {/* Platform allocation */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Platform:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200/60 dark:border-amber-800/40">
                        PF {halt.platform}
                      </span>
                    </div>
                  </div>

                  {/* Timing & Distance strip */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      <span>Sch Arr: </span>
                      <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                        {halt.scheduledArrival}
                      </span>
                      <span className="mx-1">·</span>
                      <span>Sch Dep: </span>
                      <span className="font-mono tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                        {halt.scheduledDeparture}
                      </span>
                    </div>

                    <div>
                      <span>Distance: </span>
                      <span className="font-mono tabular-nums">{halt.distanceKm} km</span>
                    </div>

                    {halt.delayMinutes > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        Delayed by {halt.delayMinutes} mins
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        On Time
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
