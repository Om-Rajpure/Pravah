/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Architectural Neutral Surfaces
        background: '#F5F2EC',
        surface: '#FBFAF7',
        'surface-muted': '#ECE8E0',
        border: '#DDD8CF',
        'border-strong': '#C9C3B8',

        // Typography Hierarchy
        'text-primary': '#292827',
        'text-secondary': '#6B6761',
        'text-muted': '#918C84',

        // Brand Terracotta / Rust
        terracotta: '#B85C3E',
        'terracotta-dark': '#91452F',
        'terracotta-light': '#E8C9BC',
        'terracotta-soft': '#F4E7E1',
        'brand-orange': '#B85C3E',
        'brand-orange-dark': '#91452F',
        'brand-orange-light': '#E8C9BC',
        'brand-orange-soft': '#F4E7E1',

        // Supporting Infrastructure Slate
        slate: '#536873',
        'infrastructure-slate': '#536873',
        'transport-blue': '#536873',

        // Semantic Status Colors
        critical: '#A94338',
        'critical-bg': '#F5E4E2',
        'critical-text': '#7A3029',
        warning: '#B8893D',
        'warning-bg': '#FAF2E4',
        high: '#B85C3E',
        low: '#52755F',
        'low-bg': '#E9F0EC',

        // Operations Sidebar Theme
        'sidebar-bg': '#292827',
        'sidebar-text': '#D9D5CE',
        'sidebar-text-secondary': '#A8A39B',
        'sidebar-selected': '#3B3532',
        'sidebar-hover': '#353330',
        'sidebar-indicator': '#B85C3E',
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
        subtle: '0 1px 3px rgba(41, 40, 39, 0.05)',
        elevated: '0 4px 14px rgba(41, 40, 39, 0.07)',
      },
    },
  },
  plugins: [],
}
