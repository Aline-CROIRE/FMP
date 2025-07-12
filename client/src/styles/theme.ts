import 'styled-components';
import { DefaultTheme } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      bgDark: string;
      bgGray: string;
      primary: string;
      primaryHover: string;
      secondary: string;
      textLight: string;
      textDark: string;
      borderLight: string;
      disabled: string;
      redError: string;
    };
    borderRadius: string;
  }
}

export const theme: DefaultTheme = {
  colors: {
    bgDark: '#18181b',
    bgGray: '#27272a',
    primary: '#22c55e',
    primaryHover: '#16a34a',
    secondary: '#fff',
    textLight: '#fff',
    textDark: '#18181b',
    borderLight: '#e5e7eb',
    disabled: '#d1d5db',
    redError: '#ef4444',
  },
  borderRadius: '0.5rem',
};