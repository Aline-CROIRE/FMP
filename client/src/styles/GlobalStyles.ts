// src/styles/GlobalStyles.ts
'use client';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
    * { box-sizing: border-box; }
    body {
        margin: 0; padding: 0; font-family: 'Inter', sans-serif;
        -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
        background-color: ${({ theme }) => theme.colors.bgPrimary};
        color: ${({ theme }) => theme.colors.textLight};
        transition: ${({ theme }) => theme.transitions.main};
    }
    html { scroll-behavior: smooth; }
    button, input, select, textarea { font-family: 'Inter', sans-serif; }
`;

export default GlobalStyles;