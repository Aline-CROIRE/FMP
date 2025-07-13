// src/app/providers.tsx
'use client';
import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '@/contexts/AuthContext';
import { theme } from '@/styles/theme';
import StyledComponentsRegistry from '@/lib/registry';
import GlobalStyles from '@/styles/GlobalStyles';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StyledComponentsRegistry>
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    </StyledComponentsRegistry>
  );
}