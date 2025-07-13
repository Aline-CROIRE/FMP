// src/lib/registry.tsx
'use client';
import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    // This is a key part of the fix: it clears the server-side styles after they've been read.
    styledComponentsStyleSheet.instance.clearTag(); 
    return <>{styles}</>;
  });

  // On the client side, we just render the children directly.
  if (typeof window !== 'undefined') return <>{children}</>;

  // On the server side, we wrap the children with the StyleSheetManager
  // to collect all the styles.
  return (
    <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
      {children}
    </StyleSheetManager>
  );
}