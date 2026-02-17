'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { soundManager } from '@/lib/sound';

interface FlashcardData {
    id: string;
    word: string;
    translation: string;
    image: string;
    example: string;
    audio: string;
}

interface FlashcardProps {
    cards: FlashcardData[];
    onComplete: () => void;
}

export default function Flashcard({ cards, onComplete }: FlashcardProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const { markFlashcardViewed, addXP } = useGameStore();

    if (!cards || cards.length === 0) {
        return <div className="text-center text-[#B2B2D8] py-10">Yükleniyor...</div>;
    }

    const safeIndex = Math.min(currentIndex, cards.length - 1);
    const currentCard = cards[safeIndex];
    const progress = ((safeIndex + 1) / cards.length) * 100;

    const speak = useCallback((text: string) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.85;
            utterance.pitch = 1.1;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const handleNext = () => {
        soundManager.playSFX('click');
        markFlashcardViewed(currentCard.id);
        addXP(5);

        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
        } else {
            soundManager.playSFX('success');
            onComplete();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            soundManager.playSFX('click');
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex((prev) => prev - 1), 200);
        }
    };

    return (
        <div className="flex flex-col items-center px-4">
            {/* Progress bar */}
            <div className="w-full max-w-md mb-6">
                <div className="flex justify-between text-xs text-[#B2B2D8] mb-1">
                    <span>Kart {currentIndex + 1} / {cards.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="xp-bar-bg h-2">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #6C5CE7, #00CEC9)' }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </div>

            {/* Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentCard.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="w-full max-w-md cursor-pointer"
                    style={{ perspective: '1000px' }}
                    onClick={() => {
                        soundManager.playSFX('click');
                        setIsFlipped(!isFlipped);
                    }}
                >
                    <motion.div
                        className="relative w-full h-72 sm:h-80"
                        animate={{ rotateY: isFlipped ? 180 : 0 }}
                        transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Front */}
                        <div
                            className="glass-card absolute inset-0 flex flex-col items-center justify-center p-6"
                            style={{
                                backfaceVisibility: 'hidden',
                                border: '2px solid rgba(108,92,231,0.3)',
                                boxShadow: '0 8px 40px rgba(108,92,231,0.2)',
                            }}
                        >
                            <motion.div
                                className="text-6xl sm:text-7xl mb-4"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                {currentCard.image}
                            </motion.div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                {currentCard.word}
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    speak(currentCard.audio);
                                }}
                                className="mt-3 w-12 h-12 rounded-full flex items-center justify-center text-xl"
                                style={{
                                    background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
                                    border: '2px solid rgba(255,255,255,0.2)',
                                }}
                            >
                                🔊
                            </motion.button>
                            <p className="text-xs text-[#B2B2D8] mt-3">Çevirmek için dokun!</p>
                        </div>

                        {/* Back */}
                        <div
                            className="glass-card absolute inset-0 flex flex-col items-center justify-center p-6"
                            style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                                border: '2px solid rgba(0,206,201,0.3)',
                                boxShadow: '0 8px 40px rgba(0,206,201,0.2)',
                            }}
                        >
                            <p className="text-lg text-[#B2B2D8] mb-2">Çevirisi:</p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-[#00CEC9] mb-4">
                                {currentCard.translation}
                            </h2>
                            <div
                                className="px-4 py-2 rounded-xl text-sm text-center"
                                style={{
                                    background: 'rgba(0,206,201,0.1)',
                                    border: '1px solid rgba(0,206,201,0.2)',
                                }}
                            >
                                <p className="text-[#B2B2D8]">📝 Örnek:</p>
                                <p className="text-white font-medium mt-1">{currentCard.example}</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="btn-game px-6 py-3 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    ← Geri
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => speak(currentCard.audio)}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(108,92,231,0.3), rgba(162,155,254,0.3))',
                        border: '1px solid rgba(108,92,231,0.4)',
                    }}
                >
                    🔊
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="btn-game-success btn-game px-6 py-3"
                    style={{ background: 'linear-gradient(135deg, #00B894, #00CEC9)' }}
                >
                    {currentIndex === cards.length - 1 ? '✓ Bitti' : 'Sonraki →'}
                </motion.button>
            </div>
        </div>
    );
}
