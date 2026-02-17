'use client';
import { useEffect, useState } from 'react';
import { soundManager } from '@/lib/sound';

export default function AudioManager() {
    const [isMuted, setIsMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted) {
                setHasInteracted(true);
                soundManager.startBGM();
            }
        };

        window.addEventListener('click', handleInteraction);
        return () => window.removeEventListener('click', handleInteraction);
    }, [hasInteracted]);

    const toggleMute = () => {
        const muted = soundManager.toggleMute();
        setIsMuted(muted);
    };

    // Only show after interaction
    if (!hasInteracted) return null;

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                toggleMute();
            }}
            className="fixed bottom-4 right-4 z-[90] bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm border border-white/10"
            title={isMuted ? "Sesi Aç" : "Sesi Kapat"}
        >
            <span className="text-2xl">{isMuted ? '🔇' : '🔊'}</span>
        </button>
    );
}
