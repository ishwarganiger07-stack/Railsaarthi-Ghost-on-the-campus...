import React from 'react';
import { BookedTicket } from '../types';
import {
  Ticket,
  X,
  Printer,
  Train,
  User,
  ArrowRight,
  QrCode,
  Trash2,
  Calendar,
  Layers,
} from 'lucide-react';

interface BookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: BookedTicket[];
  onCheckPnr: (pnr: string) => void;
  onDeleteTicket: (pnr: string) => void;
}

export const BookingsDrawer: React.FC<BookingsDrawerProps> = ({
  isOpen,
  onClose,
  tickets,
  onCheckPnr,
  onDeleteTicket,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-xl bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">My Booked Rail Tickets</h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {tickets.length} Active e-Ticket{tickets.length !== 1 ? 's' : ''} Stored Locally
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {tickets.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900 dark:text-white">No Booked Tickets Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Select any train from the directory or search results and click "Book Seats" to generate a verified e-ticket pass!
              </p>
            </div>
          ) : (
            tickets.map((t) => (
              <div
                key={t.pnr}
                className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3.5"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      PNR Number
                    </span>
                    <span className="text-base font-black font-mono tracking-wider text-emerald-600 dark:text-emerald-400">
                      {t.pnr}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded">
                      {t.ticketStatus}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Class: {t.travelClass} ({t.quota.split(' ')[0]})
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {t.trainNumber} - {t.trainName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>{t.fromName} ({t.from})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>{t.toName} ({t.to})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Journey Date</span>
                    <span className="font-bold">{t.doj}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Fare</span>
                    <span className="font-mono font-black text-blue-700 dark:text-blue-400">₹{t.totalFare}</span>
                  </div>
                </div>

                {/* Allocated Passengers */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Allotted Passengers:
                  </span>
                  {t.passengers.map((p, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-center justify-between py-1 border-b border-slate-200/40 dark:border-slate-800 last:border-b-0"
                    >
                      <span className="font-semibold">{p.name} ({p.age})</span>
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        Coach {p.assignedCoach} / Berth {p.assignedBerth} ({p.assignedBerthType})
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => onCheckPnr(t.pnr)}
                    className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    Track PNR Status
                  </button>

                  <button
                    onClick={() => onDeleteTicket(t.pnr)}
                    className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
