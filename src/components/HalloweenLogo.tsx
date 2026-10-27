import React from 'react';

interface HalloweenLogoProps {
  className?: string;
  size?: number;
}

export const HalloweenLogo: React.FC<HalloweenLogoProps> = ({
  className = '',
  size = 38,
}) => {
  return (
    <div
      className={`relative rounded-xl bg-gradient-to-br from-amber-600 via-orange-600 to-purple-950 flex items-center justify-center shadow-lg shadow-orange-950/40 p-1.5 ring-2 ring-amber-400/50 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* SVG: Custom Halloween Ghost Train & Jack-o'-lantern */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-white drop-shadow"
      >
        {/* Ghost Vapor / Bat Wing silhouette */}
        <path
          d="M6 14C8 10 12 11 14 13C16 11 20 10 22 14C23 11 27 10 29 13C31 11 35 10 37 14C35 22 28 27 20 28C12 27 5 22 6 14Z"
          fill="#1E1035"
          opacity="0.8"
        />

        {/* Vintage Haunted Locomotive Cowcatcher & Cab */}
        <rect x="11" y="10" width="18" height="15" rx="3" fill="#0D0717" stroke="#F59E0B" strokeWidth="1.2" />
        
        {/* Cab Roof Chimney */}
        <path d="M14 6H17V10H14V6Z" fill="#F59E0B" />
        <ellipse cx="15.5" cy="4.5" rx="3" ry="1.2" fill="#FDE68A" opacity="0.9" />
        
        {/* Glowing Headlight / Jack-o-Lantern Face */}
        <circle cx="20" cy="18" r="5.5" fill="#F97316" />
        {/* Carved Eyes */}
        <polygon points="18,16.5 17,18.5 19,18.5" fill="#451A03" />
        <polygon points="22,16.5 21,18.5 23,18.5" fill="#451A03" />
        {/* Carved Smile */}
        <path d="M17.5 20.5 Q20 22.5 22.5 20.5" stroke="#451A03" strokeWidth="1" fill="none" strokeLinecap="round" />

        {/* Train Wheels with glowing spokes */}
        <circle cx="14" cy="27" r="3.2" fill="#381E72" stroke="#FBBF24" strokeWidth="1.2" />
        <circle cx="26" cy="27" r="3.2" fill="#381E72" stroke="#FBBF24" strokeWidth="1.2" />
        <line x1="14" y1="27" x2="26" y2="27" stroke="#F59E0B" strokeWidth="1.2" />

        {/* Floating Mini Bat */}
        <path d="M30 6 Q32 4 34 7 Q36 4 38 6 Q34 9 30 6 Z" fill="#FDE68A" opacity="0.85" />
      </svg>
    </div>
  );
};
