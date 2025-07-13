// src/types/styled.d.ts
import 'styled-components';
import { theme } from '../styles/theme';

// This gets the type definition from our actual theme object.
type ThemeType = typeof theme;

// This tells the styled-components module that its default export
// should have the same shape as our custom theme, enabling
// full autocompletion and type-checking everywhere.
declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}