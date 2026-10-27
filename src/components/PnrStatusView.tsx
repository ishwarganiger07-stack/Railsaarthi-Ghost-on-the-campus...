import React from 'react';
import { PnrData } from '../types';
import {
  Ticket,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  ArrowRight,
  ShieldCheck,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';

interface PnrStatusViewProps {
  pnrData: PnrData | null;
  isLoading: boolean;
  onViewCoachLayout: (trainNumber: string) => void;
}

export const PnrStatusView: React.FC<PnrStatusViewProps> = ({
  pnrData,
  isLoading,
  onViewCoachLayout,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connecting to PRS Center</h3>
        <p className="text-sm text-slate-500 mt-1">Retrieving passenger current status and charting details...</p>
      </div>
    );
  }

  if (!pnrData) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center">
        <Ticket className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No PNR Searched</h3>
        <p className="text-xs text-slate-500 mt-1">Enter your 10-digit Indian Railways PNR number in the search box above.</p>
      </div>
    );
  }

  const isConfirmed = pnrData.confirmationProbability === 100;

  return (
    <div className="space-y-6">
      {/* PNR Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>PNR NUMBER</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-900 dark:text-white font-bold tracking-wider">
                {pnrData.pnr}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {pnrData.trainNumber} - {pnrData.trainName}
            </h2>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="font-medium text-slate-800 dark:text-slate-200">{pnrData.boardingStation}</span>
              <ArrowRight className="w-3.5 h-3.5" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{pnrData.destinationStation}</span>
              <span aria-hidden="true">·</span>
              <span>Class: <strong className="text-slate-900 dark:text-white">{pnrData.travelClass}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Quota: <strong className="text-slate-900 dark:text-white">{pnrData.quota}</strong></span>
            </div>
          </div>

          {/* Confirmation Grade Pill-free block */}
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-700 shrink-0">
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                Prediction Score
              </span>
              <span className={`text-base font-extrabold ${isConfirmed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {pnrData.confirmationProbability}% {pnrData.probabilityGrade}
              </span>
            </div>
            {isConfirmed ? (
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            ) : (
              <Clock className="w-8 h-8 text-amber-500" />
            )}
          </div>
        </div>

        {/* Chart Status Banner */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Charting Status:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {pnrData.chartStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Journey Date:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {pnrData.doj}
            </span>
          </div>

          <button
            onClick={() => onViewCoachLayout(pnrData.trainNumber)}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Locate Coach on Train Rake</span>
          </button>
        </div>

        {/* Passenger List */}
        <div className="pt-5">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
            Passenger Status & Berth Allocation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pnrData.passengers.map((p) => {
              const hasBerth = p.coach !== '--' && p.berth !== '--';

              return (
                <div
                  key={p.number}
                  className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        Passenger {p.number}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Current</span>
                      <span className={`text-sm font-black font-mono ${p.currentStatus === 'CNF' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {p.currentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Seat / Coach details */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/60 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Coach</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                        {p.coach}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Berth</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">
                        {p.berth}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block">Berth Type</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                        {p.berthType}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Booking Status: <strong className="font-mono text-slate-700 dark:text-slate-300">{p.bookingStatus}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Helpful Railway Rules Box */}
      <div className="bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl p-5 border border-blue-200/60 dark:border-blue-900/40 text-slate-700 dark:text-slate-300">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Important Indian Railways PNR Guidelines</h4>
            <p>
              • <strong>Chart Preparation:</strong> Final charts are prepared 4 hours prior to scheduled departure. Second charts are prepared 30 minutes before departure.
            </p>
            <p>
              • <strong>Waitlisted e-Tickets:</strong> If an e-ticket remains on the waitlist after chart preparation, the passenger name is dropped, and full fare is refunded automatically to source account. Passengers with fully waitlisted e-tickets are not permitted to board reserved coaches.
            </p>
            <p>
              • <strong>RAC Privilege:</strong> Reservation Against Cancellation (RAC) guarantees boarding with an allocated sitting berth, usually Side Lower (SL). If any confirmed passenger cancels or does not board, RAC is automatically upgraded to full sleeping berth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
