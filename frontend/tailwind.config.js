/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Architectural Neutral Surfaces
        background: '#F5F3EE',
        surface: '#FBFAF7',
        'surface-muted': '#ECE8E0',
        border: '#DDD8CF',
        'border-strong': '#C9C3B8',

        // Typography Hierarchy
        'text-primary': '#17212B',
        'text-secondary': '#4D5963',
        'text-muted': '#7A8591',

        // ── PRIMARY BRAND SYSTEM ──────────────────────────────────────
        // Primary Navy
        navy: '#12315B',
        'navy-dark': '#0B2342',
        'navy-light': '#1A4070',
        'navy-soft': '#E8EDF4',
        // Brand Blue
        blue: '#2468B8',
        'blue-dark': '#1A50A0',
        'blue-light': '#4A88D0',
        'blue-soft': '#E6EEF8',
        // Teal (Data / Intelligence / Operational)
        teal: '#2D9C8F',
        'teal-dark': '#237A6F',
        'teal-light': '#4DB8A8',
        'teal-soft': '#E4F4F2',
        // Warm Orange (Action / Alert / Brand Accent)
        orange: '#E69A2E',
        'orange-dark': '#C87524',
        'orange-light': '#F0B860',
        'orange-soft': '#FDF3E3',

        // Legacy aliases (keep for backward compat with existing pages)
        terracotta: '#E69A2E',
        'terracotta-dark': '#C87524',
        'terracotta-light': '#F0B860',
        'terracotta-soft': '#FDF3E3',
        'brand-orange': '#E69A2E',
        'brand-orange-dark': '#C87524',
        'brand-orange-light': '#F0B860',
        'brand-orange-soft': '#FDF3E3',

        // Supporting Slate
        slate: '#4D5963',
        'infrastructure-slate': '#4D5963',
        'transport-blue': '#2468B8',

        // Semantic Status Colors
        critical: '#B03A2E',
        'critical-bg': '#F5E4E2',
        'critical-text': '#7A2820',
        warning: '#B8893D',
        'warning-bg': '#FAF2E4',
        high: '#E69A2E',
        low: '#2D9C8F',
        'low-bg': '#E4F4F2',

        // ── SIDEBAR (Deep Navy) ───────────────────────────────────────
        'sidebar-bg': '#0B2342',
        'sidebar-text': '#CBD8E8',
        'sidebar-text-secondary': '#7A96B8',
        'sidebar-selected': '#12315B',
        'sidebar-hover': '#102040',
        'sidebar-indicator': '#E69A2E',

        // Demo bar
        graphite: '#17212B',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'metric': ['2rem', { lineHeight: '1.15', fontWeight: '700' }],
        'metric-lg': ['2.25rem', { lineHeight: '1.15', fontWeight: '700' }],
      },
      borderRadius: {
        card: '12px',
        'card-sm': '8px',
      },
      boxShadow: {
        subtle: '0 1px 3px rgba(18, 49, 91, 0.06)',
        elevated: '0 4px 14px rgba(18, 49, 91, 0.10)',
      },
    },
  },
  plugins: [],
}
