import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "EngQuest: 5. Sınıf Macerası",
  description:
    "İngilizce öğrenme macerası! Adaları keşfet, boss'ları yen ve eğlenceli mini oyunlarla 5. sınıf İngilizce müfredatını öğren.",
  keywords: ["English", "learning", "game", "5th grade", "EFL", "education", "İngilizce", "öğrenme", "oyun"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${outfit.variable} font-[family-name:var(--font-outfit)] antialiased`}>
        <div className="game-bg">
          {children}
        </div>
      </body>
    </html>
  );
}
