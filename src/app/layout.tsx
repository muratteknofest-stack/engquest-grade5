import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import AudioManager from '@/components/AudioManager';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EngQuest: 5. Sınıf Macerası',
  description: 'Eğlenceli İngilizce Öğrenme Oyunu',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={outfit.className}>
        <div className="fixed inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] -z-50" />
        <div className="game-bg min-h-screen">
          <AudioManager />
          {children}
        </div>
      </body>
    </html>
  );
}
