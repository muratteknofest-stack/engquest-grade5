'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import Link from 'next/link';

interface ZoneNodeProps {
    id: number;
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    bgGradient: string[];
    index: number;
    hasContent: boolean;
}

export default function ZoneNode({
    id,
    title,
    subtitle,
    icon,
    color,
    bgGradient,
    index,
    hasContent,
}: ZoneNodeProps) {
    const { completedUnits } = useGameStore();

    const isCompleted = completedUnits.includes(id);
    const isUnlocked = id === 1 || completedUnits.includes(id - 1);
    const isLeft = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isLeft ? -60 : 60, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
                delay: index * 0.12,
            }}
            className={`flex items-center gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'} mb-6`}
        >
            {/* Zone Circle */}
            {isUnlocked ? (
                <Link href={hasContent ? `/unit/${id}` : '#'}>
                    <motion.div
                        whileHover={hasContent ? { scale: 1.12, rotate: 3 } : {}}
                        whileTap={hasContent ? { scale: 0.95 } : {}}
                        className="relative cursor-pointer"
                        style={{ filter: hasContent ? 'none' : 'saturate(0.5)' }}
                    >
                        {/* Glow ring */}
                        <motion.div
                            className="absolute inset-[-4px] rounded-full"
                            style={{
                                background: `linear-gradient(135deg, ${bgGradient[0]}, ${bgGradient[1]})`,
                                opacity: 0.5,
                            }}
                            animate={
                                isCompleted
                                    ? {}
                                    : {
                                        boxShadow: [
                                            `0 0 20px ${color}40`,
                                            `0 0 40px ${color}60`,
                                            `0 0 20px ${color}40`,
                                        ],
                                    }
                            }
                            transition={{ duration: 2, repeat: Infinity }}
                        />

                        {/* Main circle */}
                        <div
                            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl sm:text-4xl z-10"
                            style={{
                                background: `linear-gradient(135deg, ${bgGradient[0]}, ${bgGradient[1]})`,
                                border: '3px solid rgba(255,255,255,0.3)',
                                boxShadow: `0 8px 32px ${color}40`,
                            }}
                        >
                            {icon}
                            {isCompleted && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#00B894] flex items-center justify-center text-sm border-2 border-[#0F0A1E]"
                                >
                                    ⭐
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </Link>
            ) : (
                <div className="relative">
                    <div
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-3xl sm:text-4xl"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '3px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        🔒
                    </div>
                </div>
            )}

            {/* Zone Info Card */}
            <motion.div
                whileHover={isUnlocked ? { x: isLeft ? 4 : -4 } : {}}
                className="glass-card px-5 py-3 max-w-[220px] sm:max-w-[280px]"
                style={{
                    opacity: isUnlocked ? 1 : 0.5,
                    borderLeft: isLeft ? `3px solid ${color}` : 'none',
                    borderRight: !isLeft ? `3px solid ${color}` : 'none',
                }}
            >
                <h3
                    className="font-bold text-sm sm:text-base"
                    style={{ color: isUnlocked ? color : '#666' }}
                >
                    {title}
                </h3>
                <p className="text-xs text-[#B2B2D8] mt-0.5">{subtitle}</p>
                {isCompleted && (
                    <span className="inline-block text-xs text-[#00B894] mt-1 font-semibold">
                        ✅ Tamamlandı!
                    </span>
                )}
                {isUnlocked && !isCompleted && hasContent && (
                    <span className="inline-block text-xs mt-1 font-semibold" style={{ color }}>
                        ▶ Oynamaya hazır!
                    </span>
                )}
                {isUnlocked && !hasContent && (
                    <span className="inline-block text-xs mt-1 text-[#B2B2D8]">
                        🔜 Yakında
                    </span>
                )}
            </motion.div>
        </motion.div>
    );
}
