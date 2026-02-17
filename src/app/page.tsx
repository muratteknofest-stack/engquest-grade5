'use client';

import { useState } from 'react';
import PlayerHUD from '@/components/PlayerHUD';
import WorldMap from '@/components/WorldMap';
import SplashScreen from '@/components/SplashScreen';
import { AnimatePresence } from 'framer-motion';

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
        </>
      )}
    </main>
  );
}
