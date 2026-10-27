import React, { useState } from 'react';
import { Layers, Train, Info, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface CoachPositionViewerProps {
  trainNumber: string;
  coachInteriorImageSrc: string;
}

interface CoachRakeItem {
  id: string;
  name: string;
  type: 'ENGINE' | 'EOG' | 'GEN' | 'SL' | 'PC' | '3A' | '2A' | '1A' | 'CC' | 'EC';
  capacity: number;
}

const SAMPLE_RAKES: Record<string, CoachRakeItem[]> = {
  '12952': [
    { id: 'LOC', name: 'LOCO', type: 'ENGINE', capacity: 0 },
    { id: 'EOG1', name: 'EOG', type: 'EOG', capacity: 0 },
    { id: 'H1', name: 'H1 (1AC)', type: '1A', capacity: 24 },
    { id: 'A1', name: 'A1 (2AC)', type: '2A', capacity: 54 },
    { id: 'A2', name: 'A2 (2AC)', type: '2A', capacity: 54 },
    { id: 'PC', name: 'PANTRY', type: 'PC', capacity: 0 },
    { id: 'B1', name: 'B1 (3AC)', type: '3A', capacity: 72 },
    { id: 'B2', name: 'B2 (3AC)', type: '3A', capacity: 72 },
    { id: 'B3', name: 'B3 (3AC)', type: '3A', capacity: 72 },
    { id: 'B4', name: 'B4 (3AC)', type: '3A', capacity: 72 },
    { id: 'B5', name: 'B5 (3AC)', type: '3A', capacity: 72 },
    { id: 'B6', name: 'B6 (3AC)', type: '3A', capacity: 72 },
    { id: 'EOG2', name: 'EOG', type: 'EOG', capacity: 0 },
  ],
  '22436': [
    { id: 'DTC1', name: 'CAB', type: 'ENGINE', capacity: 0 },
    { id: 'C1', name: 'C1 (CC)', type: 'CC', capacity: 78 },
    { id: 'C2', name: 'C2 (CC)', type: 'CC', capacity: 78 },
    { id: 'C3', name: 'C3 (CC)', type: 'CC', capacity: 78 },
    { id: 'C4', name: 'C4 (CC)', type: 'CC', capacity: 78 },
    { id: 'E1', name: 'E1 (EC)', type: 'EC', capacity: 52 },
    { id: 'E2', name: 'E2 (EC)', type: 'EC', capacity: 52 },
    { id: 'C5', name: 'C5 (CC)', type: 'CC', capacity: 78 },
    { id: 'C6', name: 'C6 (CC)', type: 'CC', capacity: 78 },
    { id: 'DTC2', name: 'CAB', type: 'ENGINE', capacity: 0 },
  ],
  '12002': [
    { id: 'LOC', name: 'LOCO', type: 'ENGINE', capacity: 0 },
    { id: 'EOG1', name: 'EOG', type: 'EOG', capacity: 0 },
    { id: 'C1', name: 'C1 (CC)', type: 'CC', capacity: 78 },
    { id: 'C2', name: 'C2 (CC)', type: 'CC', capacity: 78 },
    { id: 'C3', name: 'C3 (CC)', type: 'CC', capacity: 78 },
    { id: 'E1', name: 'E1 (EC)', type: 'EC', capacity: 52 },
    { id: 'C4', name: 'C4 (CC)', type: 'CC', capacity: 78 },
    { id: 'C5', name: 'C5 (CC)', type: 'CC', capacity: 78 },
    { id: 'EOG2', name: 'EOG', type: 'EOG', capacity: 0 },
  ],
};

export const CoachPositionViewer: React.FC<CoachPositionViewerProps> = ({
  trainNumber,
  coachInteriorImageSrc,
}) => {
  const rake = SAMPLE_RAKES[trainNumber] || SAMPLE_RAKES['12952'];
  const [selectedCoach, setSelectedCoach] = useState<CoachRakeItem>(
    rake.find((c) => c.type === '3A' || c.type === 'CC') || rake[2]
  );
  const [highlightedBerth, setHighlightedBerth] = useState<number | null>(27);

  // Helper to determine Berth type in standard 3AC (8 berths per bay)
  const getBerthTypeInfo = (berthNum: number) => {
    const mod = berthNum % 8;
    if (mod === 1 || mod === 4) return { type: 'Lower Berth (LB)', color: 'bg-blue-600 text-white' };
    if (mod === 2 || mod === 5) return { type: 'Middle Berth (MB)', color: 'bg-slate-600 text-white' };
    if (mod === 3 || mod === 6) return { type: 'Upper Berth (UB)', color: 'bg-purple-600 text-white' };
    if (mod === 7) return { type: 'Side Lower (SL)', color: 'bg-amber-600 text-white' };
    return { type: 'Side Upper (SU)', color: 'bg-emerald-600 text-white' };
  };

  return (
    <div className="space-y-6">
      {/* Rake Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>COACH POSITION & RAKE COMPOSITION</span>
              <span aria-hidden="true">·</span>
              <span>Train #{trainNumber}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Platform Coach Sequence & Berth Map
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Locate where your coach stands on the platform (from Locomotive Engine to Guard Brake Van).
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Selected:</span>
            <span className="font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900">
              {selectedCoach.name}
            </span>
          </div>
        </div>

        {/* Horizontal Scrollable Train Rake Diagram */}
        <div className="pt-6 pb-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-4 scrollbar-thin">
            {rake.map((c, index) => {
              const isSelected = selectedCoach.id === c.id;
              const isEngine = c.type === 'ENGINE';
              const isPantry = c.type === 'PC';

              return (
                <button
                  key={c.id}
                  onClick={() => {
                    if (!isEngine) {
                      setSelectedCoach(c);
                    }
                  }}
                  className={`relative flex flex-col items-center justify-between p-2.5 rounded-xl border transition-all shrink-0 min-w-[76px] h-20 ${
                    isSelected
                      ? 'bg-blue-700 text-white border-blue-800 shadow-md ring-2 ring-blue-400'
                      : isEngine
                      ? 'bg-red-800 text-white border-red-900 cursor-default'
                      : isPantry
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="text-[10px] uppercase font-mono opacity-80">
                    {index === 0 ? 'FRONT' : `C-${index}`}
                  </span>
                  <span className="text-xs font-black tracking-tight">{c.name}</span>
                  <span className="text-[9px] opacity-75 font-mono">
                    {c.capacity > 0 ? `${c.capacity}B` : '--'}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 mt-1">
            <span>← Locomotive Engine (Train Front)</span>
            <span>Rear Guard Van (Train End) →</span>
          </div>
        </div>
      </div>

      {/* 2D Berth Map & Interior Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Berth Layout Matrix (8 cols on desktop) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Interactive Berth Matrix: Coach {selectedCoach.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tap any berth number to highlight its type and cabin location
              </p>
            </div>

            {highlightedBerth && (
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block">Selected</span>
                <span className="text-xs font-mono font-bold text-blue-700 dark:text-blue-400">
                  Berth #{highlightedBerth}
                </span>
              </div>
            )}
          </div>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs mb-5 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-blue-600" />
              <span className="text-slate-600 dark:text-slate-300">Lower (LB)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-slate-600" />
              <span className="text-slate-600 dark:text-slate-300">Middle (MB)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-purple-600" />
              <span className="text-slate-600 dark:text-slate-300">Upper (UB)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-600" />
              <span className="text-slate-600 dark:text-slate-300">Side Lower (SL)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-600" />
              <span className="text-slate-600 dark:text-slate-300">Side Upper (SU)</span>
            </div>
          </div>

          {/* 72 Berth Grid simulation (organized by 8-berth cabins) */}
          <div className="space-y-4 max-h-[440px] overflow-y-auto pr-1">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((bayIndex) => {
              const startBerth = bayIndex * 8 + 1;
              const bayBerths = Array.from({ length: 8 }, (_, i) => startBerth + i);

              return (
                <div
                  key={bayIndex}
                  className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800"
                >
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    <span>Cabin / Bay {bayIndex + 1}</span>
                    <span>Berths {startBerth} – {startBerth + 7}</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {bayBerths.map((bNum) => {
                      const { type, color } = getBerthTypeInfo(bNum);
                      const isHighlighted = highlightedBerth === bNum;

                      return (
                        <button
                          key={bNum}
                          onClick={() => setHighlightedBerth(bNum)}
                          className={`h-11 rounded-lg text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                            isHighlighted
                              ? 'ring-3 ring-blue-500 scale-105 z-10 shadow-md'
                              : 'hover:opacity-90'
                          } ${color}`}
                          title={`Berth ${bNum}: ${type}`}
                        >
                          <span>{bNum}</span>
                          <span className="text-[9px] font-sans opacity-80 leading-none">
                            {type.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Berth Info Highlight Box */}
          {highlightedBerth && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200/60 dark:border-blue-900/60 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-3">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  Berth #{highlightedBerth}: {getBerthTypeInfo(highlightedBerth).type}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Located in Cabin {Math.floor((highlightedBerth - 1) / 8) + 1}. Features personal reading light, mobile charger socket, and bottle holder.
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
            </div>
          )}
        </div>

        {/* Coach Interior Image & Passenger Amenities */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative h-56 sm:h-64">
              <img
                src={coachInteriorImageSrc}
                alt="Modern Indian Railways Coach Interior"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                  Modernized LHB Coach Interior
                </span>
                <h4 className="text-base font-bold">Ergonomic Berths & Panoramic Windows</h4>
              </div>
            </div>

            <div className="p-5 text-xs text-slate-600 dark:text-slate-300 space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Dedicated 110V/220V individual USB & socket charging points</span>
              </div>
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Bio-vacuum toilets and automated air fragrance dispensers</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Pristine linen kits with sanitized blankets for AC passengers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
