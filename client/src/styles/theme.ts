// src/styles/theme.ts
export const theme = {
  colors: {
    // Using the requested dark green palette
    primary: '#006400', // The main dark green for primary actions
    primaryHover: '#004d00', // A darker shade for hover

    // Backgrounds with depth
    bgPrimary: '#1a1d22', // The main, very dark page background
    bgSecondary: '#252a31', // A slightly lighter tone for cards, modals, tables
    bgTertiary: '#313842', // For hover states on table rows, active elements

    // Text colors for hierarchy
    textLight: '#e2e8f0', // Main text color
    textHeading: '#ffffff', // For prominent titles
    textMuted: '#8f9ba8', // For secondary info, placeholders

    // System & Accent Colors
    redError: '#e53e3e',
    border: '#404753',
    borderFocus: '#006400', // Use primary color for focus glow
    shadow: 'rgba(0, 0, 0, 0.4)',

    // ✅ Added disabled color
    disabled: '#6c757d', // A muted gray for disabled buttons or UI
  },

  fontSizes: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    md: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.5rem', // 24px
    xxl: '2.25rem', // 36px
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  borderRadius: '8px',

  shadows: {
    main: '0 4px 12px rgba(0, 0, 0, 0.4)',
    focus: '0 0 0 3px rgba(0, 100, 0, 0.6)',
  },

  transitions: {
    main: 'all 0.2s ease-in-out',
  },
};
