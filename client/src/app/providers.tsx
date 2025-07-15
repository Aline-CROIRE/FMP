'use client';
import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { CustomThemeProvider } from '@/contexts/ThemeContext';
import StyledComponentsRegistry from '@/lib/registry';
import GlobalStyles from '@/styles/GlobalStyles';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <CustomThemeProvider>
        <GlobalStyles />
        <AuthProvider>{children}</AuthProvider>
      </CustomThemeProvider>
    </StyledComponentsRegistry>
  );
}