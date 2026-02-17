'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import curriculum from '@/data/english_curriculum.json';
import { useGameStore } from '@/store/gameStore';
import { soundManager } from '@/lib/sound';

export default function ReadingPage() {
    const { addXP } = useGameStore();
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);

    const activeUnit = selectedUnit ? curriculum.units.find(u => u.id === selectedUnit) : null;
    const questions = activeUnit?.readingQuestions || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (optionIndex: number) => {
        if (!currentQuestion) return;

        if (optionIndex === currentQuestion.correctAnswer) {
            soundManager.playSFX('success');
            setShowResult('correct');
            addXP(30);
            setTimeout(() => {
                setShowResult(null);
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                } else {
                    // Completed all questions for this unit
                    setSelectedUnit(null);
                    setCurrentQuestionIndex(0);
                }
            }, 1500);
        } else {
            soundManager.playSFX('error');
            setShowResult('incorrect');
            setTimeout(() => setShowResult(null), 1000);
        }
    };

    return (
        <div className="min-h-screen p-6 pb-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="btn-game px-4 py-2 text-sm z-50 relative">
                        ← Geri Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Okuma & Anlama</h1>
                </div>

                {!selectedUnit ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {curriculum.units.map((unit) => (
                            <motion.button
                                key={unit.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    if (unit.readingQuestions && unit.readingQuestions.length > 0) {
                                        setSelectedUnit(unit.id);
                                        setCurrentQuestionIndex(0);
                                    }
                                }}
                                className={`glass-card p-6 text-left relative overflow-hidden ${!unit.readingQuestions?.length ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                                style={{ borderLeft: `6px solid ${unit.color}` }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{unit.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{unit.title}</h3>
                                        <p className="text-[#B2B2D8] text-sm">
                                            {unit.readingQuestions?.length || 0} Soru
                                        </p>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-8 border-2" style={{ borderColor: activeUnit?.color }}>
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">{activeUnit?.title}</h2>
                            <span className="text-[#B2B2D8]">Soru {currentQuestionIndex + 1}/{questions.length}</span>
                        </div>

                        {currentQuestion && (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                                    <h3 className="text-[#A29BFE] font-bold mb-4">Okuma Parçası</h3>
                                    <p className="text-lg leading-relaxed whitespace-pre-line text-white">
                                        {currentQuestion.text}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6">
                                        {currentQuestion.question}
                                    </h3>
                                    <div className="space-y-3">
                                        {currentQuestion.options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(idx)}
                                                className="w-full p-4 rounded-xl text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all active:scale-98"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <AnimatePresence>
                            {showResult && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none`}
                                >
                                    <div className={`text-6xl font-bold drop-shadow-lg ${showResult === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                                        {showResult === 'correct' ? 'Mükemmel! 🎉' : 'Tekrar Dene 😕'}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
