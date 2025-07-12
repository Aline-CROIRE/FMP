// src/app/layout.tsx
import StyledComponentsRegistry from '@/lib/registry' // Import the registry
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Financial Manager Platform",
  description: "Built with styled-components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Wrap your children with the registry */}
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}