// src/styles/GlobalStyles.ts
'use client';
import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const GlobalStyles = createGlobalStyle`
    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 0;
        font-family: 'Inter', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: ${theme.colors.textLight};

 background-image: conic-gradient(
  from 180deg at center,
  #2a2a2a,
  #3c3c3c,
  #4a4a4a,
  #2a2a2a
);
background-attachment: fixed;




    }
    
    html {
        scroll-behavior: smooth;
    }

    button {
        font-family: 'Inter', sans-serif;
    }
`;

export default GlobalStyles;