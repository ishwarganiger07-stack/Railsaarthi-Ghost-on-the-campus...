import React, { useState } from 'react';
import { Search, Navigation, Ticket, MapPin, ArrowRightLeft, Calendar, Layers, Ghost, Volume2, Utensils } from 'lucide-react';
import { halloweenAudio } from '../utils/halloweenSound';

interface HeroSearchProps {
  onSearchTrainLive: (trainNumber: string) => void;
  onSearchPnr: (pnrNumber: string) => void;
  onSearchBetweenStations: (from: string, to: string) => void;
  onSelectCoachRake: (trainNumber: string) => void;
  onOpenSeatBooking?: () => void;
  onOpenFoodOrder?: () => void;
  heroImageSrc: string;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  onSearchTrainLive,
  onSearchPnr,
  onSearchBetweenStations,
  onSelectCoachRake,
  onOpenSeatBooking,
  onOpenFoodOrder,
  heroImageSrc,
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'pnr' | 'between' | 'coach'>('live');

  // Input states
  const [trainQuery, setTrainQuery] = useState('22436');
  const [pnrQuery, setPnrQuery] = useState('4829104812');
  const [fromStation, setFromStation] = useState('NDLS');
  const [toStation, setToStation] = useState('BSB');
  const [coachTrain, setCoachTrain] = useState('12952');

  const handleSwapStations = () => {
    const temp = fromStation;
    setFromStation(toStation);
    setToStation(temp);
  };

  const handleLiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trainQuery.trim()) {
      halloweenAudio.playGhostTrainWhistle();
      onSearchTrainLive(trainQuery.trim());
    }
  };

  const handlePnrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrQuery.trim()) {
      halloweenAudio.playHauntedBell();
      onSearchPnr(pnrQuery.trim());
    }
  };

  const handleBetweenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromStation && toStation) {
      halloweenAudio.playSpookyWind();
      onSearchBetweenStations(fromStation.trim(), toStation.trim());
    }
  };

  const handleCoachSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (coachTrain.trim()) {
      onSelectCoachRake(coachTrain.trim());
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      {/* Background with spooky measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImageSrc}
          alt="Haunted Halloween railway campus station at midnight"
          className="w-full h-full object-cover object-center brightness-75 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-purple-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 tracking-wider uppercase mb-3">
            <span className="flex items-center gap-1.5 bg-orange-950/80 border border-orange-500/40 px-2.5 py-1 rounded-full text-orange-300">
              <Ghost className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
              <span>Halloween Special</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>University Railway Terminal Est. 1885</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight [text-wrap:balance]">
            RailSaarthi <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">Ghost on a Campus</span>
          </h1>

          <p className="mt-3 text-base sm:text-lg text-slate-300 max-w-2xl">
            Track midnight express trains piercing through campus fog, predict PNR confirmations under the harvest moon, and sound the spectral ghost train whistle.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {onOpenSeatBooking && (
              <button
                type="button"
                onClick={onOpenSeatBooking}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Book Train Seat 🎫</span>
              </button>
            )}

            {onOpenFoodOrder && (
              <button
                type="button"
                onClick={onOpenFoodOrder}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-xs font-bold text-white shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>Book Food Order to Seat 🍱</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => halloweenAudio.playGhostTrainWhistle()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-950/80 hover:bg-orange-900 border border-orange-500/40 text-xs font-semibold text-orange-200 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Blow Ghost Whistle 🚂💨</span>
            </button>
          </div>
        </div>

        {/* Tabbed Search Box Card with Halloween Dark Theme */}
        <div className="bg-slate-900/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-2xl border border-orange-900/50 text-white max-w-4xl ring-1 ring-orange-500/20">
          {/* Functional Segmented Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl mb-6 overflow-x-auto scrollbar-none border border-slate-800">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 min-h-[44px] ${
                activeTab === 'live'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Live Ghost Tracking</span>
            </button>
            <button
              onClick={() => setActiveTab('pnr')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 min-h-[44px] ${
                activeTab === 'pnr'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>PNR Forecast</span>
            </button>
            <button
              onClick={() => setActiveTab('between')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 min-h-[44px] ${
                activeTab === 'between'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Search Campus Routes</span>
            </button>
            <button
              onClick={() => setActiveTab('coach')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 min-h-[44px] ${
                activeTab === 'coach'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Coach & Berth</span>
            </button>
          </div>

          {/* Form Content by Tab */}
          {activeTab === 'live' && (
            <form onSubmit={handleLiveSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Enter Train Number or Name
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={trainQuery}
                      onChange={(e) => setTrainQuery(e.target.value)}
                      placeholder="e.g. 22436, 12002, 12952, Vande Bharat"
                      className="w-full h-11 pl-10 pr-4 text-sm font-medium bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-white"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-950/60"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Track Midnight Train</span>
                  </button>
                </div>
              </div>

              {/* Sample Quick Chips */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-400">
                <span className="font-medium text-orange-400">Popular:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrainQuery('22436');
                    onSearchTrainLive('22436');
                  }}
                  className="hover:text-orange-300 underline decoration-slate-600"
                >
                  22436 Vande Bharat
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrainQuery('12002');
                    onSearchTrainLive('12002');
                  }}
                  className="hover:text-orange-300 underline decoration-slate-600"
                >
                  12002 Shatabdi
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrainQuery('12952');
                    onSearchTrainLive('12952');
                  }}
                  className="hover:text-orange-300 underline decoration-slate-600"
                >
                  12952 Rajdhani
                </button>
              </div>
            </form>
          )}

          {activeTab === 'pnr' && (
            <form onSubmit={handlePnrSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    10-Digit Indian Railways PNR Number
                  </label>
                  <div className="relative">
                    <Ticket className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={10}
                      value={pnrQuery}
                      onChange={(e) => setPnrQuery(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 4829104812"
                      className="w-full h-11 pl-10 pr-4 text-sm font-medium bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none tracking-widest font-mono text-white"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-950/60"
                  >
                    <Search className="w-4 h-4" />
                    <span>Forecast PNR</span>
                  </button>
                </div>
              </div>

              {/* Sample PNR Chips */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-400">
                <span className="font-medium text-orange-400">Try demo PNRs:</span>
                <button
                  type="button"
                  onClick={() => {
                    setPnrQuery('4829104812');
                    onSearchPnr('4829104812');
                  }}
                  className="hover:text-orange-300 font-mono underline decoration-slate-600"
                >
                  4829104812 (Confirmed 3A)
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setPnrQuery('8291049281');
                    onSearchPnr('8291049281');
                  }}
                  className="hover:text-orange-300 font-mono underline decoration-slate-600"
                >
                  8291049281 (WL Prediction)
                </button>
              </div>
            </form>
          )}

          {activeTab === 'between' && (
            <form onSubmit={handleBetweenSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3 items-end">
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    From Station
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fromStation}
                      onChange={(e) => setFromStation(e.target.value.toUpperCase())}
                      placeholder="NDLS (New Delhi)"
                      className="w-full h-11 pl-10 pr-3 text-sm font-semibold uppercase bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="md:col-span-1 flex justify-center pb-1">
                  <button
                    type="button"
                    onClick={handleSwapStations}
                    title="Swap stations"
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    To Station
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={toStation}
                      onChange={(e) => setToStation(e.target.value.toUpperCase())}
                      placeholder="BSB (Varanasi)"
                      className="w-full h-11 pl-10 pr-3 text-sm font-semibold uppercase bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="md:col-span-1">
                  <button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center transition-all shadow-md shadow-orange-950/60"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Station shortcuts */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-400">
                <span className="font-medium text-orange-400">Campus Express routes:</span>
                <button
                  type="button"
                  onClick={() => {
                    setFromStation('NDLS');
                    setToStation('BSB');
                    onSearchBetweenStations('NDLS', 'BSB');
                  }}
                  className="hover:text-orange-300 underline decoration-slate-600"
                >
                  NDLS → BSB (Varanasi)
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => {
                    setFromStation('NDLS');
                    setToStation('MMCT');
                    onSearchBetweenStations('NDLS', 'MMCT');
                  }}
                  className="hover:text-orange-300 underline decoration-slate-600"
                >
                  NDLS → MMCT (Mumbai)
                </button>
              </div>
            </form>
          )}

          {activeTab === 'coach' && (
            <form onSubmit={handleCoachSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Train Number for Coach Rake & Berth Layout
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={coachTrain}
                      onChange={(e) => setCoachTrain(e.target.value)}
                      placeholder="e.g. 12952, 22436, 12002"
                      className="w-full h-11 pl-10 pr-4 text-sm font-medium bg-slate-950 border border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-white"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-950/60"
                  >
                    <Layers className="w-4 h-4" />
                    <span>View Coach Map</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
