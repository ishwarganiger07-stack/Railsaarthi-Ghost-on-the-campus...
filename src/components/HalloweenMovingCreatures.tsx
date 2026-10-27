import React, { useState, useEffect } from 'react';
import { halloweenAudio } from '../utils/halloweenSound';

interface Creature {
  id: number;
  type: 'ghost' | 'bat' | 'pumpkin' | 'wisp';
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  size: number; // in pixels
  speedX: number;
  speedY: number;
  direction: 1 | -1;
  rotation: number;
  isSpooked?: boolean;
}

export const HalloweenMovingCreatures: React.FC = () => {
  const [creatures, setCreatures] = useState<Creature[]>([]);

  // Initialize lively creatures across the screen
  useEffect(() => {
    const initialCreatures: Creature[] = [
      // Floating Ghosts
      { id: 1, type: 'ghost', x: 12, y: 18, size: 48, speedX: 0.12, speedY: 0.08, direction: 1, rotation: 0 },
      { id: 2, type: 'ghost', x: 82, y: 35, size: 56, speedX: -0.15, speedY: -0.06, direction: -1, rotation: 0 },
      { id: 3, type: 'ghost', x: 45, y: 65, size: 42, speedX: 0.09, speedY: -0.11, direction: 1, rotation: 0 },
      { id: 4, type: 'ghost', x: 70, y: 82, size: 50, speedX: -0.13, speedY: 0.07, direction: -1, rotation: 0 },

      // Flying Bats
      { id: 5, type: 'bat', x: 5, y: 12, size: 36, speedX: 0.35, speedY: 0.14, direction: 1, rotation: 0 },
      { id: 6, type: 'bat', x: 92, y: 22, size: 32, speedX: -0.42, speedY: -0.08, direction: -1, rotation: 0 },
      { id: 7, type: 'bat', x: 30, y: 8, size: 40, speedX: 0.38, speedY: 0.12, direction: 1, rotation: 0 },
      { id: 8, type: 'bat', x: 60, y: 15, size: 28, speedX: -0.48, speedY: 0.16, direction: -1, rotation: 0 },

      // Floating Jack-o'-Lanterns
      { id: 9, type: 'pumpkin', x: 22, y: 45, size: 44, speedX: 0.08, speedY: 0.1, direction: 1, rotation: 0 },
      { id: 10, type: 'pumpkin', x: 88, y: 68, size: 46, speedX: -0.09, speedY: -0.07, direction: -1, rotation: 0 },
      { id: 11, type: 'pumpkin', x: 8, y: 75, size: 40, speedX: 0.07, speedY: -0.09, direction: 1, rotation: 0 },

      // Spectral Wisps
      { id: 12, type: 'wisp', x: 38, y: 28, size: 24, speedX: -0.06, speedY: 0.05, direction: 1, rotation: 0 },
      { id: 13, type: 'wisp', x: 78, y: 50, size: 28, speedX: 0.07, speedY: -0.08, direction: -1, rotation: 0 },
      { id: 14, type: 'wisp', x: 52, y: 88, size: 22, speedX: -0.08, speedY: 0.06, direction: 1, rotation: 0 },
    ];

    setCreatures(initialCreatures);
  }, []);

  // Smooth animation loop using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 16.67, 2.0); // normalize ~60fps
      lastTime = currentTime;

      setCreatures((prev) =>
        prev.map((c) => {
          let nextX = c.x + c.speedX * delta;
          let nextY = c.y + c.speedY * delta;
          let nextDirection = c.direction;
          let nextSpeedX = c.speedX;
          let nextSpeedY = c.speedY;

          // Bounce or wrap gracefully at viewport borders
          if (nextX > 96) {
            nextX = 96;
            nextSpeedX = -Math.abs(nextSpeedX);
            nextDirection = -1;
          } else if (nextX < 2) {
            nextX = 2;
            nextSpeedX = Math.abs(nextSpeedX);
            nextDirection = 1;
          }

          if (nextY > 92) {
            nextY = 92;
            nextSpeedY = -Math.abs(nextSpeedY);
          } else if (nextY < 4) {
            nextY = 4;
            nextSpeedY = Math.abs(nextSpeedY);
          }

          // Gentle sinusoidal bobbing
          const wobble = Math.sin(currentTime * 0.003 + c.id) * 0.04;
          nextY += wobble;

          return {
            ...c,
            x: nextX,
            y: nextY,
            speedX: nextSpeedX,
            speedY: nextSpeedY,
            direction: nextDirection,
          };
        })
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Spook on click/touch with sound and spin
  const handleSpook = (id: number) => {
    halloweenAudio.playGhostChime();

    setCreatures((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            isSpooked: true,
            speedX: c.speedX * 2.5,
            speedY: c.speedY * 2.5,
          };
        }
        return c;
      })
    );

    setTimeout(() => {
      setCreatures((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            return {
              ...c,
              isSpooked: false,
              speedX: c.speedX / 2.5,
              speedY: c.speedY / 2.5,
            };
          }
          return c;
        })
      );
    }, 1500);
  };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-30 pointer-events-none overflow-hidden select-none"
    >
      {creatures.map((c) => {
        return (
          <div
            key={c.id}
            onClick={() => handleSpook(c.id)}
            style={{
              transform: `translate3d(${c.x}vw, ${c.y}vh, 0) scaleX(${c.direction})`,
              width: `${c.size}px`,
              height: `${c.size}px`,
              transition: c.isSpooked ? 'transform 0.4s ease-out' : 'none',
            }}
            className={`absolute top-0 left-0 pointer-events-auto cursor-pointer will-change-transform ${
              c.isSpooked ? 'animate-spin' : ''
            }`}
            title={`Spooky ${c.type}! Tap to spook.`}
          >
            {c.type === 'ghost' && (
              <div className="relative w-full h-full filter drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] group">
                <svg
                  viewBox="0 0 100 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full opacity-85 hover:opacity-100 transition-opacity"
                >
                  {/* Ghost Body */}
                  <path
                    d="M50 8C27.9 8 10 25.9 10 48V95C10 99.4 14.8 102.3 18.8 100.2L26 96.5L34 101.5L42 96.5L50 101.5L58 96.5L66 101.5L74 96.5L81.2 100.2C85.2 102.3 90 99.4 90 95V48C90 25.9 72.1 8 50 8Z"
                    fill="url(#ghostGlow)"
                  />
                  {/* Ghost Eyes */}
                  <ellipse cx="38" cy="42" rx="5" ry="8" fill="#0f172a" />
                  <ellipse cx="62" cy="42" rx="5" ry="8" fill="#0f172a" />
                  <circle cx="36" cy="40" r="1.5" fill="#38bdf8" />
                  <circle cx="60" cy="40" r="1.5" fill="#38bdf8" />
                  {/* Spooky Mouth */}
                  <ellipse cx="50" cy="58" rx="6" ry="9" fill="#0f172a" />
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="ghostGlow" x1="50" y1="8" x2="50" y2="105" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ffffff" stopOpacity="0.95" />
                      <stop offset="0.7" stopColor="#e0f2fe" stopOpacity="0.8" />
                      <stop offset="1" stopColor="#bae6fd" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Floating spectral aura */}
                <div className="absolute inset-0 bg-blue-300/10 rounded-full blur-md -z-10 animate-pulse" />
              </div>
            )}

            {c.type === 'bat' && (
              <div className="relative w-full h-full filter drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
                <svg
                  viewBox="0 0 100 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full animate-[wiggle_0.4s_ease-in-out_infinite] hover:scale-125 transition-transform"
                >
                  {/* Bat Wings with Flap */}
                  <path
                    d="M50 30C42 20 28 10 12 18C16 26 22 28 20 38C14 36 6 38 2 46C15 50 28 46 36 40C40 46 45 44 50 42C55 44 60 46 64 40C72 46 85 50 98 46C94 38 86 36 80 38C78 28 84 26 88 18C72 10 58 20 50 30Z"
                    fill="#1e1b4b"
                  />
                  {/* Bat Ears & Head */}
                  <polygon points="46,26 44,16 48,22" fill="#312e81" />
                  <polygon points="54,26 56,16 52,22" fill="#312e81" />
                  <ellipse cx="50" cy="28" rx="5" ry="6" fill="#312e81" />
                  {/* Glowing Red Eyes */}
                  <circle cx="48" cy="27" r="1.2" fill="#ef4444" />
                  <circle cx="52" cy="27" r="1.2" fill="#ef4444" />
                </svg>
              </div>
            )}

            {c.type === 'pumpkin' && (
              <div className="relative w-full h-full filter drop-shadow-[0_0_14px_rgba(249,115,22,0.8)]">
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full hover:scale-110 transition-transform"
                >
                  {/* Stem */}
                  <path d="M48 18C48 10 54 8 58 6C56 12 53 14 52 18" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
                  {/* Pumpkin Body */}
                  <ellipse cx="50" cy="56" rx="42" ry="34" fill="#ea580c" />
                  <ellipse cx="50" cy="56" rx="28" ry="34" fill="#f97316" />
                  <ellipse cx="50" cy="56" rx="14" ry="32" fill="#fb923c" />
                  {/* Carved Eyes */}
                  <polygon points="35,46 43,48 38,40" fill="#451a03" />
                  <polygon points="65,46 57,48 62,40" fill="#451a03" />
                  <polygon points="50,52 47,58 53,58" fill="#451a03" />
                  {/* Glowing Candle Inside Eyes */}
                  <polygon points="36,45 41,47 38,42" fill="#fef08a" />
                  <polygon points="64,45 59,47 62,42" fill="#fef08a" />
                  {/* Carved Jack-o'-Lantern Smile */}
                  <path
                    d="M30 64C36 72 64 72 70 64C66 68 58 70 50 70C42 70 34 68 30 64Z"
                    fill="#451a03"
                  />
                  {/* Teeth */}
                  <rect x="42" y="64" width="4" height="4" fill="#fef08a" />
                  <rect x="54" y="67" width="4" height="4" fill="#fef08a" />
                </svg>
              </div>
            )}

            {c.type === 'wisp' && (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_16px_#34d399] animate-ping opacity-75" />
                <div className="absolute w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_10px_#67e8f9]" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
