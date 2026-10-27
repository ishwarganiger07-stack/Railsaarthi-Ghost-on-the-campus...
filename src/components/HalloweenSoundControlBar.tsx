import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Ghost, Bell, Wind, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { halloweenAudio } from '../utils/halloweenSound';

export const HalloweenSoundControlBar: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Subscribe to audio engine state
  useEffect(() => {
    const unsubscribe = halloweenAudio.subscribe((playing, muted) => {
      setIsPlaying(playing);
      setIsMuted(muted);
    });

    // Attempt to start continuous soundtrack
    halloweenAudio.startContinuousSoundtrack();

    // Auto-unlock audio on very first user interaction anywhere on document
    const handleFirstGesture = () => {
      setHasInteracted(true);
      halloweenAudio.startContinuousSoundtrack();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      unsubscribe();
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, []);

  const handleTogglePlay = () => {
    halloweenAudio.toggleSoundtrack();
  };

  const handleToggleMute = () => {
    halloweenAudio.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    halloweenAudio.setVolume(val);
  };

  return (
    <aside
      aria-label="Halloween Soundtrack Controls"
      className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col items-end pointer-events-auto"
    >
      {/* Expanded Controls Panel */}
      {isExpanded && (
        <div className="mb-2 w-72 bg-slate-900/95 backdrop-blur-md border border-orange-500/40 rounded-2xl p-4 shadow-2xl text-white space-y-3 ring-1 ring-orange-500/20 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-orange-950/60 pb-2">
            <div className="flex items-center gap-2">
              <Ghost className="w-4 h-4 text-orange-400 animate-bounce" />
              <span className="font-extrabold text-xs text-orange-200 tracking-wide uppercase">
                Halloween Campus Audio
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
              title="Collapse"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Status:</span>
              <span className="font-semibold text-orange-400 flex items-center gap-1.5">
                {isPlaying && !isMuted ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Continuous Playing</span>
                  </>
                ) : isMuted ? (
                  <span className="text-amber-400">Muted</span>
                ) : (
                  <span className="text-slate-400">Paused</span>
                )}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Haunting music-box chords, subterranean drone, and spectral gusts playing in continuous loop.
            </p>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Master Volume</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-orange-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Quick Sound Triggers */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2">
              Sound Effects
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => halloweenAudio.playGhostTrainWhistle()}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-orange-950/80 border border-slate-700 hover:border-orange-500/50 text-[10px] text-slate-200 transition-colors"
              >
                <span>🚂</span>
                <span className="mt-1">Whistle</span>
              </button>
              <button
                type="button"
                onClick={() => halloweenAudio.playHauntedBell()}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-orange-950/80 border border-slate-700 hover:border-orange-500/50 text-[10px] text-slate-200 transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span className="mt-1">Bell</span>
              </button>
              <button
                type="button"
                onClick={() => halloweenAudio.playSpookyWind()}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/80 hover:bg-orange-950/80 border border-slate-700 hover:border-orange-500/50 text-[10px] text-slate-200 transition-colors"
              >
                <Wind className="w-3.5 h-3.5 text-blue-400" />
                <span className="mt-1">Wind</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Compact Bar */}
      <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-orange-500/50 rounded-full px-3.5 py-2 shadow-2xl text-white ring-1 ring-orange-500/20 hover:border-orange-400 transition-all">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="p-1.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-md active:scale-95"
          title={isPlaying ? 'Pause Halloween background sound' : 'Play continuous Halloween background sound'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Animated Sound Wave Indicator */}
        <div className="flex items-center gap-0.5 h-4 px-1" title="Background soundtrack status">
          <span
            className={`w-0.5 bg-orange-400 rounded-full transition-all duration-300 ${
              isPlaying && !isMuted ? 'h-4 animate-pulse' : 'h-1 opacity-40'
            }`}
          />
          <span
            className={`w-0.5 bg-amber-400 rounded-full transition-all duration-500 delay-75 ${
              isPlaying && !isMuted ? 'h-3 animate-pulse' : 'h-1 opacity-40'
            }`}
          />
          <span
            className={`w-0.5 bg-orange-500 rounded-full transition-all duration-300 delay-150 ${
              isPlaying && !isMuted ? 'h-5 animate-pulse' : 'h-1 opacity-40'
            }`}
          />
          <span
            className={`w-0.5 bg-amber-300 rounded-full transition-all duration-700 ${
              isPlaying && !isMuted ? 'h-2 animate-pulse' : 'h-1 opacity-40'
            }`}
          />
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-xs font-semibold text-orange-200 hover:text-white px-1"
        >
          <span className="hidden sm:inline">Halloween Sound:</span>
          <span className="text-orange-400">{isPlaying ? 'Playing' : 'Paused'}</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        {/* Mute Button */}
        <button
          onClick={handleToggleMute}
          className="p-1 rounded-full text-slate-300 hover:text-white transition-colors"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
        </button>
      </div>
    </aside>
  );
};
