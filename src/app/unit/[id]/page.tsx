'use client';

import { useState, useCallback, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import curriculum from '@/data/english_curriculum.json';
import { useGameStore } from '@/store/gameStore';
import PlayerHUD from '@/components/PlayerHUD';
import Flashcard from '@/components/Flashcard';
import SentenceBuilder from '@/components/SentenceBuilder';
import BossBattle from '@/components/BossBattle';
import RewardPopup from '@/components/RewardPopup';

type Phase = 'hub' | 'flashcards' | 'sentence-builder' | 'boss-battle' | 'results';

export default function UnitPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const unitId = parseInt(resolvedParams.id);
    const unit = curriculum.units.find((u) => u.id === unitId);
    const router = useRouter();

    const [phase, setPhase] = useState<Phase>('hub');
    const [showReward, setShowReward] = useState(false);
    const [rewardData, setRewardData] = useState({ xp: 0, coins: 0, message: '' });
    const [battleResult, setBattleResult] = useState<boolean | null>(null);

    const { completedUnits, resetHearts } = useGameStore();

    if (!unit) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-5xl mb-4">🏝️</p>
                    <h1 className="text-2xl font-bold text-[#FF6B6B]">Ada Bulunamadı!</h1>
                    <Link href="/" className="text-[#A29BFE] underline mt-4 block">
                        ← Haritaya Dön
                    </Link>
                </div>
            </div>
        );
    }

    const isCompleted = completedUnits.includes(unitId);

    const triggerReward = useCallback((xp: number, coins: number, message: string) => {
        setRewardData({ xp, coins, message });
        setShowReward(true);
    }, []);

    const handleFlashcardComplete = () => {
        triggerReward(30, 10, 'Brifing Tamamlandı! 📚');
        setTimeout(() => setPhase('hub'), 2000);
    };

    const handleSentenceComplete = () => {
        triggerReward(50, 15, 'Eğitim Tamamlandı! 💪');
        setTimeout(() => setPhase('hub'), 2000);
    };

    const handleBossComplete = (passed: boolean) => {
        setBattleResult(passed);
        if (passed) {
            triggerReward(100, 30, '🏆 Boss Yenildi! Bölge Açıldı!');
        }
        setPhase('results');
    };

    const phases = [
        {
            id: 'flashcards',
            title: 'Aşama 1: Brifing',
            subtitle: 'Kelimeleri öğren',
            icon: '📚',
            color: '#6C5CE7',
            ready: unit.flashcards.length > 0,
        },
        {
            id: 'sentence-builder',
            title: 'Aşama 2: Eğitim',
            subtitle: 'Cümle kur',
            icon: '🏋️',
            color: '#F59E0B',
            ready: unit.sentenceBuilder.length > 0,
        },
        {
            id: 'boss-battle',
            title: 'Aşama 3: Boss Savaşı',
            subtitle: 'Boss’u yen!',
            icon: '🐲',
            color: '#FF6B6B',
            ready: unit.bossQuiz.length > 0,
        },
    ];

    return (
        <main className="relative z-10 min-h-screen">
            <PlayerHUD />
            <RewardPopup
                show={showReward}
                xp={rewardData.xp}
                coins={rewardData.coins}
                message={rewardData.message}
                onClose={() => setShowReward(false)}
            />

            <div className="pt-24 pb-16 px-4 max-w-2xl mx-auto">
                {/* Fixed Back Button */}
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push('/')}
                    className="fixed top-32 left-4 z-40 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-white shadow-lg hover:bg-black/60 transition-colors"
                >
                    <span className="text-xl">←</span>
                    <span className="font-bold text-sm hidden sm:inline">Haritaya Dön</span>
                </motion.button>

                {/* Unit Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <motion.span
                        className="text-5xl inline-block"
                        animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        {unit.icon}
                    </motion.span>
                    <h1
                        className="text-3xl font-black mt-3"
                        style={{ color: unit.color }}
                    >
                        {unit.title}
                    </h1>
                    <p className="text-[#B2B2D8] text-sm mt-1">{unit.subtitle}</p>
                    {isCompleted && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold text-[#00B894]"
                            style={{ background: 'rgba(0,184,148,0.2)', border: '1px solid rgba(0,184,148,0.3)' }}
                        >
                            ⭐ Tamamlandı
                        </motion.span>
                    )}
                </motion.div>

                <AnimatePresence mode="wait">
                    {/* Hub View */}
                    {phase === 'hub' && (
                        <motion.div
                            key="hub"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            {phases.map((p, index) => (
                                <motion.button
                                    key={p.id}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.15 }}
                                    whileHover={p.ready ? { scale: 1.02, x: 5 } : {}}
                                    whileTap={p.ready ? { scale: 0.98 } : {}}
                                    onClick={() => {
                                        if (p.ready) {
                                            if (p.id === 'boss-battle') resetHearts();
                                            setPhase(p.id as Phase);
                                        }
                                    }}
                                    className="glass-card w-full p-5 flex items-center gap-4 text-left"
                                    style={{
                                        borderLeft: `4px solid ${p.ready ? p.color : '#333'}`,
                                        opacity: p.ready ? 1 : 0.4,
                                        cursor: p.ready ? 'pointer' : 'not-allowed',
                                    }}
                                >
                                    <span className="text-3xl">{p.icon}</span>
                                    <div>
                                        <h3 className="font-bold" style={{ color: p.color }}>
                                            {p.title}
                                        </h3>
                                        <p className="text-sm text-[#B2B2D8]">{p.subtitle}</p>
                                    </div>
                                    {p.ready && (
                                        <motion.span
                                            className="ml-auto text-lg"
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            ▶
                                        </motion.span>
                                    )}
                                </motion.button>
                            ))}
                        </motion.div>
                    )}

                    {/* Flashcards Phase */}
                    {phase === 'flashcards' && (
                        <motion.div
                            key="flashcards"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                        >
                            <button
                                onClick={() => setPhase('hub')}
                                className="text-[#B2B2D8] hover:text-white text-sm mb-4 flex items-center gap-1"
                            >
                                ← Aşamalara Dön
                            </button>
                            <Flashcard cards={unit.flashcards} onComplete={handleFlashcardComplete} />
                        </motion.div>
                    )}

                    {/* Sentence Builder Phase */}
                    {phase === 'sentence-builder' && (
                        <motion.div
                            key="sentence-builder"
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -40 }}
                        >
                            <button
                                onClick={() => setPhase('hub')}
                                className="text-[#B2B2D8] hover:text-white text-sm mb-4 flex items-center gap-1"
                            >
                                ← Aşamalara Dön
                            </button>
                            <SentenceBuilder
                                sentences={unit.sentenceBuilder}
                                onComplete={handleSentenceComplete}
                            />
                        </motion.div>
                    )}

                    {/* Boss Battle Phase */}
                    {phase === 'boss-battle' && (
                        <motion.div
                            key="boss-battle"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <button
                                onClick={() => setPhase('hub')}
                                className="text-[#B2B2D8] hover:text-white text-sm mb-4 flex items-center gap-1"
                            >
                                ← Aşamalara Dön
                            </button>
                            <BossBattle
                                questions={unit.bossQuiz}
                                unitId={unitId}
                                onComplete={handleBossComplete}
                            />
                        </motion.div>
                    )}

                    {/* Results Phase */}
                    {phase === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="text-7xl mb-6"
                            >
                                {battleResult ? '🏆' : '😢'}
                            </motion.div>
                            <h2
                                className={`text-3xl font-bold mb-3 ${battleResult ? 'text-[#00B894]' : 'text-[#FF6B6B]'
                                    }`}
                            >
                                {battleResult ? 'Zafer!' : 'Neredeyse Başarmıştın!'}
                            </h2>
                            <p className="text-[#B2B2D8] mb-6">
                                {battleResult
                                    ? 'Boss’u yendin! Yeni bölge açıldı! 🎉'
                                    : 'Daha fazla çalış ve tekrar dene!'}
                            </p>
                            <div className="flex gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => router.push('/')}
                                    className="btn-game px-6 py-3"
                                >
                                    🗺️ Haritaya Dön
                                </motion.button>
                                {!battleResult && (
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            resetHearts();
                                            setBattleResult(null);
                                            setPhase('boss-battle');
                                        }}
                                        className="btn-game btn-game-danger px-6 py-3"
                                    >
                                        🔄 Tekrar Dene
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
