'use client';

import { useState } from 'react';
import PlayerHUD from '@/components/PlayerHUD';
import WorldMap from '@/components/WorldMap';
import SplashScreen from '@/components/SplashScreen';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <main className="relative z-10 min-h-screen">
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} key="splash" />
        )}
      </AnimatePresence>

      {!showSplash && (
        <>
          <PlayerHUD />
          <WorldMap />

          {/* Quick Menu */}
          <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-40">
            <Link href="/topics">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full shadow-lg flex items-center gap-3 hover:bg-white/20 transition-colors"
              >
                <span className="text-2xl">📚</span>
                <span className="font-bold text-white pr-2 hidden md:block">Konu Özetleri</span>
              </motion.button>
            </Link>

            <Link href="/reading">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full shadow-lg flex items-center gap-3 hover:bg-white/20 transition-colors"
              >
                <span className="text-2xl">📖</span>
                <span className="font-bold text-white pr-2 hidden md:block">Okuma & Anlama</span>
              </motion.button>
            </Link>

            <Link href="/screening">
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full shadow-lg flex items-center gap-3 hover:bg-white/20 transition-colors"
              >
                <span className="text-2xl">🏆</span>
                <span className="font-bold text-white pr-2 hidden md:block">Genel Tarama</span>
              </motion.button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
