/**
 * PRAVAAH Mobile Design System — Spacing & Layout Tokens
 * Strict 4px grid multiple: 4, 8, 12, 16, 20, 24, 32, 40, 48
 */

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  huge: 40,
  massive: 48,

  // Screen Padding
  screenPaddingHorizontal: 16,
  screenPaddingVertical: 16,
  cardPadding: 16,
  cardPaddingSm: 12,

  // Touch Target Minimum
  minTouchTarget: 44,

  // Border Radii
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  }
} as const;

export const shadows = {
  subtle: {
    shadowColor: '#12315B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    shadowColor: '#12315B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#12315B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  }
} as const;
