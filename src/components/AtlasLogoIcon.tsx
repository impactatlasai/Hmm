import React from 'react';

export interface AtlasLogoIconProps {
  size?: number;
  className?: string;
  variant?: 'header' | 'light' | 'primary';
}

/**
 * Atlas AI Education official brand icon.
 * Features the signature architectural "A" monogram integrated with an orbital
 * knowledge horizon (Atlas global scope) and a central AI intelligence nexus spark.
 */
export function AtlasLogoIcon({
  size = 38,
  className = '',
  variant = 'header',
}: AtlasLogoIconProps) {
  const idSuffix = React.useId().replace(/:/g, '');

  if (variant === 'primary') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`priBg_${idSuffix}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0056D2" />
            <stop offset="100%" stopColor="#0B1F4B" />
          </linearGradient>
          <linearGradient id={`priOrbit_${idSuffix}`} x1="6" y1="21" x2="34" y2="19" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="10" fill={`url(#priBg_${idSuffix})`} />
        {/* Orbital Ring behind */}
        <path
          d="M7.5 23C10 19.5 15.5 17.5 21 17.2C27 16.9 31.8 18.2 33.8 20.5"
          stroke={`url(#priOrbit_${idSuffix})`}
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.8"
        />
        {/* Monolithic A in crisp white */}
        <path
          d="M20 7.2L8.5 31.8H14.2L16.8 25.8H23.2L25.8 31.8H31.5L20 7.2ZM20 18.5L21.8 22.8H18.2L20 18.5Z"
          fill="#FFFFFF"
        />
        {/* Front Orbit Swoop */}
        <path
          d="M6.8 23C9 25.5 14.5 27.8 20.8 27.5C26.5 27.2 31.2 24.8 33.2 22"
          stroke={`url(#priOrbit_${idSuffix})`}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* AI Intelligence Spark Core */}
        <path
          d="M20 18C20 20.2 18.5 21.5 16.5 21.5C18.5 21.5 20 22.8 20 25C20 22.8 21.5 21.5 23.5 21.5C21.5 21.5 20 20.2 20 18Z"
          fill="#38BDF8"
        />
        <circle cx="20" cy="21.5" r="1.1" fill="#FFFFFF" />
      </svg>
    );
  }

  // Default: 'header' — High-contrast crisp white squircle tile with gradient A monogram, orbital arc and AI spark
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`bgGrad_${idSuffix}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>

        <linearGradient id={`leftArm_${idSuffix}`} x1="8" y1="31" x2="20" y2="7" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0047BA" />
          <stop offset="55%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id={`rightArm_${idSuffix}`} x1="20" y1="7" x2="32" y2="31" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0056D2" />
          <stop offset="60%" stopColor="#0B1F4B" />
          <stop offset="100%" stopColor="#07132F" />
        </linearGradient>

        <linearGradient id={`orbitGrad_${idSuffix}`} x1="6" y1="21" x2="34" y2="19" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="50%" stopColor="#0066FF" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        <linearGradient id={`sparkGrad_${idSuffix}`} x1="16" y1="16" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>

        <filter id={`tileShadow_${idSuffix}`} x="-10%" y="-10%" width="120%" height="125%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#07132F" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Rounded Tile with Inset Polish */}
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="10"
        fill={`url(#bgGrad_${idSuffix})`}
        stroke="#E2E8F0"
        strokeWidth="1"
        filter={`url(#tileShadow_${idSuffix})`}
      />

      {/* Orbital Ring (Behind / Weaving Layer) */}
      <path
        d="M7.5 23.2C9.8 19.8 15.2 17.5 21 17.2C27.2 16.9 32.2 18.5 34.2 21"
        stroke={`url(#orbitGrad_${idSuffix})`}
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Left Monolithic Pillar of A */}
      <path
        d="M20 7.2L8.5 31.8H14.2L16.8 25.8H20.2V19.8L18.4 14.8L20 7.2Z"
        fill={`url(#leftArm_${idSuffix})`}
      />

      {/* Right Monolithic Pillar of A */}
      <path
        d="M20 7.2L31.5 31.8H25.8L23.2 25.8H19.8V19.8L21.6 14.8L20 7.2Z"
        fill={`url(#rightArm_${idSuffix})`}
      />

      {/* Crossbar Apex Connector in Center */}
      <path
        d="M16.8 25.8H23.2L20.2 19.8H19.8L16.8 25.8Z"
        fill="#0056D2"
        opacity="0.9"
      />

      {/* Forward Orbital Ring (Foreground Swoop across the crossbar) */}
      <path
        d="M6.8 23C8.8 25.4 14.2 27.6 20.6 27.4C26.4 27.1 31.2 24.8 33.2 22"
        stroke={`url(#orbitGrad_${idSuffix})`}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Central Intelligence Core / AI Nexus Star */}
      <path
        d="M20 18C20 20.2 18.5 21.5 16.5 21.5C18.5 21.5 20 22.8 20 25C20 22.8 21.5 21.5 23.5 21.5C21.5 21.5 20 20.2 20 18Z"
        fill={`url(#sparkGrad_${idSuffix})`}
      />
      <circle cx="20" cy="21.5" r="1.1" fill="#FFFFFF" />

      {/* Apex Spark Node */}
      <circle cx="20" cy="7.5" r="1.5" fill="#38BDF8" />
      <circle cx="20" cy="7.5" r="0.75" fill="#FFFFFF" />
    </svg>
  );
}
