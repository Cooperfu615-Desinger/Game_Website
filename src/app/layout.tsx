import type { Metadata } from 'next';
import { Russo_One, Chakra_Petch } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { DevColorPanel } from '@/components/theme/DevColorPanel';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { company } from '@/data/company';

const displayFont = Russo_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

const bodyFont = Chakra_Petch({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = { title: company.name, description: company.tagline };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <DevColorPanel />
        </ThemeProvider>
      </body>
    </html>
  );
}
