import React, { useState, useEffect } from 'react';
import { HalloweenLogo } from './HalloweenLogo';
import { Sparkles, Volume2, VolumeX, Ghost, Bell, Wind, Ticket, Utensils } from 'lucide-react';
import { halloweenAudio } from '../utils/halloweenSound';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenAiAssistant: () => void;
  onOpenSeatBooking?: () => void;
  onOpenFoodOrder?: () => void;
  bookedTicketsCount?: number;
  onOpenBookingsDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  onOpenAiAssistant,
  onOpenSeatBooking,
  onOpenFoodOrder,
  bookedTicketsCount = 0,
  onOpenBookingsDrawer,
}) => {
  const [isAmbientOn, setIsAmbientOn] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);

  useEffect(() => {
    const unsub = halloweenAudio.subscribe((playing, muted) => {
      setIsAmbientOn(playing && !muted);
    });
    return () => unsub();
  }, []);

  const handleToggleAmbient = () => {
    halloweenAudio.toggleSoundtrack();
  };

  const handlePlayWhistle = () => {
    halloweenAudio.playGhostTrainWhistle();
  };

  const handlePlayBell = () => {
    halloweenAudio.playHauntedBell();
  };

  const handlePlayWind = () => {
    halloweenAudio.playSpookyWind();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-orange-950/50 text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Halloween Brand wordmark */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 text-left font-bold tracking-tight text-lg sm:text-xl whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-lg p-1"
        >
          <HalloweenLogo size={36} />
          <div className="flex flex-col">
            <span className="font-extrabold text-white leading-tight">
              RailSaarthi <span className="text-orange-500">Ghost</span>
            </span>
            <span className="text-[10px] text-orange-400 font-medium tracking-wider uppercase -mt-0.5">
              on a campus
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 single-line nav links with spooky accents */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('live')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-orange-400 py-1 ${
              activeSection === 'live'
                ? 'text-orange-400 font-semibold border-b-2 border-orange-500'
                : ''
            }`}
          >
            Live Running
          </button>
          <button
            onClick={() => onNavigate('pnr')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-orange-400 py-1 ${
              activeSection === 'pnr'
                ? 'text-orange-400 font-semibold border-b-2 border-orange-500'
                : ''
            }`}
          >
            PNR Enquiry
          </button>
          <button
            onClick={() => onNavigate('search')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-orange-400 py-1 ${
              activeSection === 'search'
                ? 'text-orange-400 font-semibold border-b-2 border-orange-500'
                : ''
            }`}
          >
            Train Search
          </button>
          <button
            onClick={() => onNavigate('coach')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-orange-400 py-1 ${
              activeSection === 'coach'
                ? 'text-orange-400 font-semibold border-b-2 border-orange-500'
                : ''
            }`}
          >
            Coach & Platform
          </button>
          <button
            onClick={() => onNavigate('amenities')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-orange-400 py-1 ${
              activeSection === 'amenities'
                ? 'text-orange-400 font-semibold border-b-2 border-orange-500'
                : ''
            }`}
          >
            Station & Food
          </button>
          <button
            onClick={() => onNavigate('madad')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-red-400 py-1 ${
              activeSection === 'madad'
                ? 'text-red-400 font-semibold border-b-2 border-red-500'
                : ''
            }`}
          >
            Rail Madad 139
          </button>
        </nav>

        {/* Zone 3: Halloween Sound Controls + Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Halloween Sound Board Button */}
          <div className="relative">
            <button
              onClick={() => setShowSoundMenu(!showSoundMenu)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-orange-200 bg-orange-950/70 hover:bg-orange-900/80 border border-orange-800/60 rounded-xl transition-all shadow-sm"
              title="Halloween sound effects"
            >
              {isAmbientOn ? (
                <Volume2 className="w-4 h-4 text-orange-400 animate-pulse" />
              ) : (
                <Ghost className="w-4 h-4 text-orange-400" />
              )}
              <span className="hidden sm:inline">Spooky Sound</span>
            </button>

            {/* Dropdown Menu */}
            {showSoundMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-orange-900/70 rounded-2xl p-2 shadow-2xl z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                  Campus Sound Effects
                </div>
                <button
                  onClick={() => {
                    handlePlayWhistle();
                    setShowSoundMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-orange-950/80 rounded-lg flex items-center justify-between text-slate-200 hover:text-orange-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>👻</span>
                    <span>Ghost Train Whistle</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Choo-Choo</span>
                </button>
                <button
                  onClick={() => {
                    handlePlayBell();
                    setShowSoundMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-orange-950/80 rounded-lg flex items-center justify-between text-slate-200 hover:text-orange-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Haunted Station Bell</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Toll</span>
                </button>
                <button
                  onClick={() => {
                    handlePlayWind();
                    setShowSoundMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-orange-950/80 rounded-lg flex items-center justify-between text-slate-200 hover:text-orange-300 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5 text-blue-400" />
                    <span>Eerie Campus Wind</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Howl</span>
                </button>
                <div className="pt-1 border-t border-orange-950/80">
                  <button
                    onClick={() => {
                      handleToggleAmbient();
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between font-semibold transition-colors ${
                      isAmbientOn
                        ? 'bg-orange-950 text-orange-300 border border-orange-800/60'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isAmbientOn ? <Volume2 className="w-3.5 h-3.5 text-orange-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
                      <span>Halloween Background Music</span>
                    </span>
                    <span className="text-[10px] font-mono">{isAmbientOn ? 'PLAYING' : 'OFF'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Book Seat CTA */}
          {onOpenSeatBooking && (
            <button
              onClick={onOpenSeatBooking}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Book Seat</span>
            </button>
          )}

          {/* Book Food CTA */}
          {onOpenFoodOrder && (
            <button
              onClick={onOpenFoodOrder}
              className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 rounded-xl shadow-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Book Food</span>
            </button>
          )}

          {/* Stored Tickets button if any */}
          {bookedTicketsCount > 0 && onOpenBookingsDrawer && (
            <button
              onClick={onOpenBookingsDrawer}
              className="flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded-xl hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Tickets ({bookedTicketsCount})</span>
            </button>
          )}

          {/* Ask AI CTA */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl shadow-md shadow-orange-950/50 transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden sm:inline">Ghost Travel AI</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
