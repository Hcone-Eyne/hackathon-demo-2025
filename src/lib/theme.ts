/**
 * DBT Prototype Design System
 * Mobile-first design with 8px grid system
 */

export const theme = {
  // Spacing scale (8px grid)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // Typography scale
  fontSize: {
    body: {
      mobile: '16px',
      desktop: '16px',
    },
    button: {
      mobile: '16px',
      desktop: '18px',
    },
    h4: {
      mobile: '18px',
      desktop: '22px',
    },
    h3: {
      mobile: '20px',
      desktop: '24px',
    },
    h2: {
      mobile: '24px',
      desktop: '32px',
    },
    h1: {
      mobile: '28px',
      desktop: '36px',
    },
  },

  // Touch targets
  minTouchTarget: '44px',

  // Breakpoints
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },

  // Border radius
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    full: '9999px',
  },

  // Transitions
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type Theme = typeof theme;
