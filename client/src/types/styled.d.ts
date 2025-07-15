// src/types/styled.d.ts
import 'styled-components';
import { lightTheme } from '../styles/theme';

// We use lightTheme or darkTheme since both share the same shape.
// You only need one of them to extract the type.
type ThemeType = typeof lightTheme;

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
