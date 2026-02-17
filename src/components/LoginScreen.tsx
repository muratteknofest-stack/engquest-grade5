'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function LoginScreen() {
    const { playerName, setPlayerName } = useGameStore();
    const [name, setName] = useState('');
    const [isOpen, setIsOpen] = useState(playerName === 'Adventurer');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim().length > 0) {
            setPlayerName(name.trim());
            setIsOpen(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0A1E]/90 backdrop-blur-sm px-4"
            >
                <motion.div
                    initial={{ scale: 0.8, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="glass-card w-full max-w-md p-8 text-center border-2 border-[#6C5CE7]"
                >
                    <div className="text-6xl mb-6">👋</div>
                    <h2 className="text-3xl font-bold text-white mb-2">Hoş Geldin!</h2>
                    <p className="text-[#B2B2D8] mb-8">Maceraya başlamadan önce adını öğrenebilir miyiz?</p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Adın veya Takma Adın"
                            className="bg-[#1A1A2E] border-2 border-[#6C5CE7]/50 rounded-xl px-5 py-4 text-lg text-white placeholder:text-[#666] focus:outline-none focus:border-[#00CEC9] transition-colors text-center"
                            maxLength={15}
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={name.trim().length === 0}
                            className="btn-game btn-game-primary py-4 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🚀 Başla
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
