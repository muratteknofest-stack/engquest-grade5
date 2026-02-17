'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { soundManager } from '@/lib/sound';

interface SentenceData {
    id: string;
    correctSentence: string;
    words: string[];
    hint: string;
}

interface SentenceBuilderProps {
    sentences: SentenceData[];
    onComplete: () => void;
}

export default function SentenceBuilder({ sentences, onComplete }: SentenceBuilderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [availableWords, setAvailableWords] = useState<string[]>([]);
    const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
    const { addXP, addCoins, markSentenceComplete } = useGameStore();

    if (!sentences || sentences.length === 0) {
        return <div className="text-center text-[#B2B2D8] py-10">Yükleniyor...</div>;
    }

    const currentSentence = sentences[currentIndex];
    const progress = ((currentIndex + 1) / sentences.length) * 100;

    // Shuffle words on mount and when sentence changes
    useMemo(() => {
        const shuffled = [...currentSentence.words].sort(() => Math.random() - 0.5);
        setAvailableWords(shuffled);
        setSelectedWords([]);
        setStatus('playing');
    }, [currentIndex, currentSentence.words]);

    const handleSelectWord = useCallback((word: string, index: number) => {
        if (status !== 'playing') return;
        soundManager.playSFX('click');
        setSelectedWords((prev) => [...prev, word]);
        setAvailableWords((prev) => prev.filter((_, i) => i !== index));
    }, [status]);

    const handleDeselectWord = useCallback((word: string, index: number) => {
        if (status !== 'playing') return;
        soundManager.playSFX('click');
        setAvailableWords((prev) => [...prev, word]);
        setSelectedWords((prev) => prev.filter((_, i) => i !== index));
    }, [status]);

    const handleCheck = () => {
        const builtSentence = selectedWords.join(' ');
        if (builtSentence === currentSentence.correctSentence) {
            soundManager.playSFX('success');
            setStatus('correct');
            addXP(15);
            addCoins(5);
            markSentenceComplete(currentSentence.id);
        } else {
            soundManager.playSFX('error');
            setStatus('wrong');
        }
    };

    const handleNext = () => {
        soundManager.playSFX('click');
        if (currentIndex < sentences.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setStatus('playing');
        } else {
            onComplete();
        }
    };

    const handleRetry = () => {
        soundManager.playSFX('click');
        const shuffled = [...currentSentence.words].sort(() => Math.random() - 0.5);
        setAvailableWords(shuffled);
        setSelectedWords([]);
        setStatus('playing');
    };

    return (
        <div className="flex flex-col items-center px-4">
            {/* Progress */}
            <div className="w-full max-w-md mb-6">
                <div className="flex justify-between text-xs text-[#B2B2D8] mb-1">
                    <span>Cümle {currentIndex + 1} / {sentences.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="xp-bar-bg h-2">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #F59E0B, #FDCB6E)' }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Hint */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card px-5 py-3 mb-6 max-w-md w-full text-center"
                style={{ border: '1px solid rgba(245,158,11,0.3)' }}
            >
                <p className="text-sm text-[#FDCB6E]">💡 {currentSentence.hint}</p>
            </motion.div>

            {/* Answer zone */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`glass-card w-full max-w-md min-h-[80px] p-4 mb-4 flex flex-wrap gap-2 items-center justify-center ${status === 'correct'
                        ? 'ring-2 ring-[#00B894]'
                        : status === 'wrong'
                            ? 'ring-2 ring-[#FF6B6B] animate-shake'
                            : ''
                        }`}
                    style={{
                        border: status === 'correct'
                            ? '2px solid rgba(0,184,148,0.5)'
                            : status === 'wrong'
                                ? '2px solid rgba(255,107,107,0.5)'
                                : '2px dashed rgba(255,255,255,0.15)',
                    }}
                >
                    {selectedWords.length === 0 ? (
                        <p className="text-[#B2B2D8] text-sm">Cümleyi oluşturmak için aşağıdaki kelimelere dokun...</p>
                    ) : (
                        selectedWords.map((word, index) => (
                            <motion.button
                                key={`selected-${index}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                                onClick={() => handleDeselectWord(word, index)}
                                className="px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer"
                                style={{
                                    background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                }}
                            >
                                {word}
                            </motion.button>
                        ))
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Available words */}
            <div className="flex flex-wrap gap-2 justify-center max-w-md mb-6">
                <AnimatePresence>
                    {availableWords.map((word, index) => (
                        <motion.button
                            key={`avail-${word}-${index}`}
                            layout
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            whileHover={{ scale: 1.1, y: -3 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSelectWord(word, index)}
                            className="px-4 py-2 rounded-xl font-semibold text-sm cursor-pointer"
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                border: '2px solid rgba(255,255,255,0.15)',
                            }}
                        >
                            {word}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Status messages */}
            <AnimatePresence>
                {status === 'correct' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center mb-4"
                    >
                        <p className="text-[#00B894] font-bold text-lg">✅ Doğru! +15 XP +5 Altın</p>
                    </motion.div>
                )}
                {status === 'wrong' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-center mb-4"
                    >
                        <p className="text-[#FF6B6B] font-bold text-lg">❌ Yaklaştın! Tekrar dene.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex gap-3">
                {status === 'playing' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCheck}
                        disabled={selectedWords.length === 0}
                        className="btn-game px-8 py-3 disabled:opacity-40"
                        style={{ background: 'linear-gradient(135deg, #F59E0B, #FDCB6E)', color: '#1A1333' }}
                    >
                        ✓ Cevabı Kontrol Et
                    </motion.button>
                )}
                {status === 'wrong' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRetry}
                        className="btn-game btn-game-danger px-8 py-3"
                    >
                        🔄 Tekrar Dene
                    </motion.button>
                )}
                {status === 'correct' && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        className="btn-game btn-game-success px-8 py-3"
                        style={{ background: 'linear-gradient(135deg, #00B894, #00CEC9)' }}
                    >
                        {currentIndex === sentences.length - 1 ? '🎯 Bitir!' : 'Sonraki →'}
                    </motion.button>
                )}
            </div>
        </div>
    );
}
