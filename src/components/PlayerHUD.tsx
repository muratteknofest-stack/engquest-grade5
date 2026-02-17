'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import Link from 'next/link';

const XP_PER_LEVEL = 200;

export default function PlayerHUD() {
    const { xp, coins, level, hearts, maxHearts, playerName, equippedItems } = useGameStore();

    const currentLevelXP = xp % XP_PER_LEVEL;
    const xpProgress = (currentLevelXP / XP_PER_LEVEL) * 100;

    return (
        <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="glass-card mx-4 mt-4 px-5 py-3 flex items-center justify-between gap-4"
                style={{ borderRadius: '16px' }}>
                {/* Avatar & Name */}
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                        style={{
                            background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
                            border: '2px solid rgba(255,255,255,0.2)',
                        }}
                    >
                        {equippedItems?.hat ? '🧙' : '🦸'}
                    </motion.div>
                    <div className="hidden sm:block">
                        <p className="text-xs text-[#B2B2D8]">Seviye {level}</p>
                        <p className="text-sm font-bold">{playerName}</p>
                    </div>
                </div>

                {/* XP Bar */}
                <div className="flex-1 max-w-[200px] sm:max-w-[300px]">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#A29BFE] font-semibold">⚡ XP</span>
                        <span className="text-[#B2B2D8]">{currentLevelXP}/{XP_PER_LEVEL}</span>
                    </div>
                    <div className="xp-bar-bg h-3">
                        <motion.div
                            className="xp-bar-fill h-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                {/* Hearts */}
                <div className="flex gap-1">
                    {Array.from({ length: maxHearts }).map((_, i) => (
                        <motion.span
                            key={i}
                            className={`text-lg ${i < hearts ? 'heart' : 'heart-empty'}`}
                            animate={i < hearts ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                        >
                            ❤️
                        </motion.span>
                    ))}
                </div>

                {/* Coins */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(253,203,110,0.2))',
                        border: '1px solid rgba(245,158,11,0.3)',
                    }}
                >
                    <span className="text-base">🪙</span>
                    <span className="text-sm font-bold text-[#FDCB6E]">{coins}</span>
                </motion.div>

                {/* Shop Button */}
                <Link href="/shop">
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
                        style={{
                            background: 'linear-gradient(135deg, rgba(232,67,147,0.3), rgba(108,92,231,0.3))',
                            border: '1px solid rgba(232,67,147,0.3)',
                        }}
                    >
                        🛒
                    </motion.button>
                </Link>
            </div>
        </motion.div>
    );
}
