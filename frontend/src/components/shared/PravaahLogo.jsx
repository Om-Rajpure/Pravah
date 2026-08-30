import React from 'react'

export function PravaahIcon({ className = 'w-8 h-8', size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Sun/Dot */}
      <circle cx="72" cy="22" r="9" fill="#E69A2E" />

      {/* Wave 1 (Top / Cyan-Teal) */}
      <path
        d="M 12 36 Q 34 16, 56 36 T 92 36"
        stroke="#2A9D8F"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Wave 2 (Middle Top / Blue) */}
      <path
        d="M 12 52 Q 34 32, 56 52 T 92 52"
        stroke="#1A5B94"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Wave 3 (Middle Bottom / Deep Navy) */}
      <path
        d="M 12 68 Q 34 48, 56 68 T 92 68"
        stroke="#12315B"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Wave 4 (Bottom / Dark Navy) */}
      <path
        d="M 16 84 Q 36 66, 56 84 T 90 84"
        stroke="#0B2342"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function PravaahBrandLogo({
  variant = 'dark', // 'dark' (for dark bg) | 'light' (for light bg)
  showTagline = true,
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const isDarkBg = variant === 'dark'
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Icon */}
      <div className="shrink-0">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Orange sun accent */}
          <circle cx="72" cy="20" r="9" fill="#E69A2E" />

          {/* Flow waves */}
          <path
            d="M 12 34 Q 34 16, 56 34 T 92 34"
            stroke="#2A9D8F"
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 12 50 Q 34 32, 56 50 T 92 50"
            stroke={isDarkBg ? '#38BFB0' : '#1A5B94'}
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 12 66 Q 34 48, 56 66 T 92 66"
            stroke={isDarkBg ? '#7A96B8' : '#12315B'}
            strokeWidth="9"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 16 82 Q 36 64, 56 82 T 90 82"
            stroke={isDarkBg ? '#A0BACC' : '#0B2342'}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col min-w-0">
        <span
          className={`font-black tracking-tight leading-none ${
            size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl'
          } ${isDarkBg ? 'text-white' : 'text-[#12315B]'}`}
        >
          PRAVAAH
        </span>
        {showTagline && (
          <span
            className={`font-bold tracking-[0.14em] uppercase leading-none mt-1 ${
              size === 'sm' ? 'text-[9px]' : 'text-[10.5px]'
            } ${isDarkBg ? 'text-[#38BFB0]' : 'text-[#2A9D8F]'}`}
          >
            City Intelligence
          </span>
        )}
      </div>
    </div>
  )
}
export default PravaahBrandLogo
