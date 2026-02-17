'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface RewardPopupProps {
    show: boolean;
    xp: number;
    coins: number;
    message?: string;
    onClose: () => void;
}

const confettiColors = ['#FF6B6B', '#FDCB6E', '#6C5CE7', '#00CEC9', '#E84393', '#00B894'];

export default function RewardPopup({ show, xp, coins, message, onClose }: RewardPopupProps) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                >
                    {/* Confetti particles */}
                    {Array.from({ length: 20 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-3 h-3 rounded-sm"
                            style={{
                                background: confettiColors[i % confettiColors.length],
                                left: `${Math.random() * 100}%`,
                            }}
                            initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
                            animate={{
                                y: [0, window?.innerHeight || 800],
                                opacity: [1, 0],
                                rotate: [0, 720],
                                x: [(Math.random() - 0.5) * 200],
                            }}
                            transition={{
                                duration: 2 + Math.random(),
                                delay: Math.random() * 0.5,
                                ease: 'easeIn',
                            }}
                        />
                    ))}

                    {/* Reward card */}
                    <motion.div
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, y: -100 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        className="glass-card p-8 text-center pointer-events-auto"
                        style={{
                            border: '2px solid rgba(253,203,110,0.4)',
                            boxShadow: '0 0 60px rgba(253,203,110,0.3)',
                        }}
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl mb-4"
                        >
                            🎉
                        </motion.div>

                        <h2 className="text-xl font-bold text-[#FDCB6E] mb-3">
                            {message || 'Harika!'}
                        </h2>

                        <div className="flex items-center justify-center gap-6">
                            {xp > 0 && (
                                <motion.div
                                    initial={{ x: -30, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-2xl">⚡</span>
                                    <span className="text-lg font-bold text-[#A29BFE]">+{xp} XP</span>
                                </motion.div>
                            )}
                            {coins > 0 && (
                                <motion.div
                                    initial={{ x: 30, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex items-center gap-2"
                                >
                                    <span className="text-2xl">🪙</span>
                                    <span className="text-lg font-bold text-[#FDCB6E]">+{coins} Altın</span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
}
