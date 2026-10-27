import React, { useState } from 'react';
import { ComplaintRecord } from '../types';
import {
  PhoneCall,
  ShieldAlert,
  HeartPulse,
  Sparkles,
  AlertOctagon,
  CheckCircle2,
  Clock,
  Send,
  Ticket,
} from 'lucide-react';

interface RailMadadEmergencyProps {
  onFileComplaint: (data: {
    category: string;
    pnr: string;
    trainNumber: string;
    coach: string;
    berth: string;
    description: string;
    phone: string;
  }) => Promise<ComplaintRecord | null>;
}

export const RailMadadEmergency: React.FC<RailMadadEmergencyProps> = ({
  onFileComplaint,
}) => {
  const [category, setCategory] = useState<'Security' | 'Medical Emergency' | 'Coach Cleanliness' | 'Catering Issue'>('Security');
  const [trainNumber, setTrainNumber] = useState('12952');
  const [pnr, setPnr] = useState('4829104812');
  const [coach, setCoach] = useState('B3');
  const [berth, setBerth] = useState('27');
  const [phone, setPhone] = useState('9876543210');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<ComplaintRecord | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    const result = await onFileComplaint({
      category,
      pnr,
      trainNumber,
      coach,
      berth,
      description,
      phone,
    });
    setIsSubmitting(false);

    if (result) {
      setActiveComplaint(result);
      setDescription('');
    }
  };

  return (
    <div className="space-y-6">
      {/* 139 Quick SOS Header */}
      <div className="bg-gradient-to-r from-red-900 to-rose-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 uppercase tracking-wider mb-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Official Rail Madad 139 Integrated Helpline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              One Rail, One Helpline: Dial 139
            </h2>
            <p className="mt-2 text-sm text-rose-100">
              Immediate medical aid, RPF security escorts, child welfare, lost property, and passenger grievances on running trains.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <a
              href="tel:139"
              className="px-6 py-3.5 bg-white text-red-900 hover:bg-rose-50 text-sm font-bold rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-md"
            >
              <PhoneCall className="w-4 h-4 text-red-700" />
              <span>Dial 139 Helpline</span>
            </a>
          </div>
        </div>
      </div>

      {/* Grievance & SOS Dispatch Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            File Instant Complaint / Assistance Request
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
            Auto-dispatched to Onboard TTE, Train Superintendent, and Railway Protection Force (RPF).
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Emergency Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'Security', label: 'RPF Security', icon: ShieldAlert },
                  { id: 'Medical Emergency', label: 'Medical Doctor', icon: HeartPulse },
                  { id: 'Coach Cleanliness', label: 'OBHS Hygiene', icon: Sparkles },
                  { id: 'Catering Issue', label: 'Pantry / Food', icon: Ticket },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = category === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setCategory(item.id as any)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all min-h-[64px] ${
                        isSelected
                          ? 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-800 dark:text-red-300 ring-2 ring-red-400/40 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1 text-red-600 dark:text-red-400" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Travel context */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Train Number
                </label>
                <input
                  type="text"
                  value={trainNumber}
                  onChange={(e) => setTrainNumber(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Coach
                </label>
                <input
                  type="text"
                  value={coach}
                  onChange={(e) => setCoach(e.target.value.toUpperCase())}
                  className="w-full h-10 px-3 text-xs font-mono font-bold uppercase bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Berth No
                </label>
                <input
                  type="text"
                  value={berth}
                  onChange={(e) => setBerth(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 text-xs font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Describe Issue or Emergency
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe clearly (e.g., Passenger in Coach B3 Berth 27 requires immediate doctor on next stop due to severe chest pain; or Unauthorized hawkers bothering passengers...)"
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Dispatching to Railway Control...' : 'Transmit Alert to Railway Division'}</span>
            </button>
          </form>

          {/* Active Complaint Confirmation Record */}
          {activeComplaint && (
            <div className="mt-5 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300">
                  REF TOKEN: {activeComplaint.referenceId}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {activeComplaint.status}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                Your alert has been notified to the Onboard Division Controller & Station Master of the approaching junction. Expected response time: <strong>{activeComplaint.expectedResolution}</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Railway Helplines Directory Card */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Important National Railway Numbers
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Rail Madad 139</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Security, Medical, Inquiry</span>
              </div>
              <a href="tel:139" className="font-mono font-bold text-blue-700 dark:text-blue-400 hover:underline">
                139
              </a>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">RPF Women Security</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Meri Saheli RPF Patrol</span>
              </div>
              <a href="tel:139" className="font-mono font-bold text-blue-700 dark:text-blue-400 hover:underline">
                139 / 182
              </a>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">Emergency Disaster Service</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">National Railway Control</span>
              </div>
              <a href="tel:1072" className="font-mono font-bold text-blue-700 dark:text-blue-400 hover:underline">
                1072
              </a>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">National Emergency</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Police, Ambulance, Fire</span>
              </div>
              <a href="tel:112" className="font-mono font-bold text-blue-700 dark:text-blue-400 hover:underline">
                112
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
