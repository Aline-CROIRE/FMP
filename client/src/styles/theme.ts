// src/styles/theme.ts

const designTokens = {
  fontSizes: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem', xl: '1.5rem', xxl: '2rem' },
  spacing: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' },
  borderRadius: '8px',
  shadows: {
    soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    medium: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  transitions: { main: 'all 0.2s ease-in-out' },
};

export const darkTheme = {
  ...designTokens,
  colors: {
    primary: '#FFFFFF', // White becomes the primary accent
    primaryHover: '#E0E0E0',
    bgPrimary: '#121212',   // A true, deep black
    bgSecondary: '#1E1E1E', // Off-black for cards
    bgTertiary: '#2A2A2A',  // Hover states
    textLight: '#EAEAEA',
    textHeading: '#FFFFFF',
    textMuted: '#888888',
    redError: '#CF6679',
    border: '#333333',
    borderFocus: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.4)',
    disabled: '#444444',
  }
};

export const lightTheme = {
  ...designTokens,
  colors: {
    primary: '#000000', // Black becomes the primary accent
    primaryHover: '#333333',
    bgPrimary: '#F5F5F7',
    bgSecondary: '#FFFFFF',
    bgTertiary: '#F0F0F0',
    textLight: '#555555',
    textHeading: '#000000',
    textMuted: '#888888',
    redError: '#B00020',
    border: '#E0E0E0',
    borderFocus: '#000000',
    shadow: 'rgba(0, 0, 0, 0.1)',
    disabled: '#E0E0E0',
  }
};

export const theme = lightTheme; // Default theme