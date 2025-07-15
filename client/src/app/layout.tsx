import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });
export const metadata = { title: "Financial Manager Platform", description: "FMP for kLab" };

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" className={inter.className}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}