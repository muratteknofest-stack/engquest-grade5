'use client';

import PlayerHUD from '@/components/PlayerHUD';
import WorldMap from '@/components/WorldMap';

export default function Home() {
  return (
    <main className="relative z-10">
      <PlayerHUD />
      <WorldMap />
    </main>
  );
}
