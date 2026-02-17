'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import screeningData from '@/data/screening_questions.json';
import { useGameStore } from '@/store/gameStore';
import { soundManager } from '@/lib/sound';

export default function ScreeningPage() {
    const { addXP } = useGameStore();
    const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showResult, setShowResult] = useState<'correct' | 'incorrect' | null>(null);
    const [score, setScore] = useState(0);
    const [testCompleted, setTestCompleted] = useState(false);

    const activeTest = selectedTestId ? screeningData.tests.find(t => t.id === selectedTestId) : null;
    const questions = activeTest?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (optionIndex: number) => {
        if (!currentQuestion || showResult) return;

        const isCorrect = optionIndex === currentQuestion.correctAnswer;

        if (isCorrect) {
            soundManager.playSFX('success');
            setShowResult('correct');
            addXP(10); // 10 XP per question
            setScore(prev => prev + 1);
        } else {
            soundManager.playSFX('error');
            setShowResult('incorrect');
        }

        setTimeout(() => {
            setShowResult(null);
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                setTestCompleted(true);
            }
        }, 1500);
    };

    const resetTest = () => {
        setSelectedTestId(null);
        setCurrentQuestionIndex(0);
        setScore(0);
        setTestCompleted(false);
    };

    return (
        <div className="min-h-screen p-6 pb-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="btn-game px-4 py-2 text-sm z-50 relative text-white bg-white/10 hover:bg-white/20 rounded-lg">
                        ← Ana Menü
                    </Link>
                    <h1 className="text-3xl font-bold text-white">🏆 Genel Tarama Testleri</h1>
                </div>

                {!selectedTestId ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {screeningData.tests.map((test) => (
                            <motion.button
                                key={test.id}
                                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedTestId(test.id)}
                                className="glass-card p-6 text-left relative overflow-hidden flex flex-col gap-2 rounded-xl bg-white/10 border border-white/10"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-white">{test.title}</h3>
                                    <span className="text-xs bg-purple-500/50 px-2 py-1 rounded text-white">
                                        {test.questions.length} Soru
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm">
                                    5. Sınıf Ünite {test.id} Tarama Testi
                                </p>
                            </motion.button>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-8 border border-white/20 rounded-2xl bg-black/20 backdrop-blur-xl">
                        {!testCompleted ? (
                            <>
                                <div className="mb-6 flex justify-between items-center border-b border-white/10 pb-4">
                                    <h2 className="text-2xl font-bold text-white">{activeTest?.title}</h2>
                                    <div className="flex gap-4 text-white/80">
                                        <span>Soru: {currentQuestionIndex + 1}/{questions.length}</span>
                                        <span>Puan: {score}</span>
                                    </div>
                                </div>

                                {currentQuestion && (
                                    <div className="flex flex-col gap-6">
                                        <div className="bg-white/5 p-6 rounded-xl border border-white/10 min-h-[120px] flex items-center justify-center">
                                            <p className="text-xl text-center text-white font-medium">
                                                {currentQuestion.text}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {currentQuestion.options.map((option, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleAnswer(idx)}
                                                    className="p-4 rounded-xl text-left bg-white/5 hover:bg-purple-500/30 border border-white/10 hover:border-purple-300/50 transition-all active:scale-98 text-white relative group"
                                                >
                                                    <span className="inline-block w-8 font-bold text-purple-300 group-hover:text-white">
                                                        {['A', 'B', 'C', 'D'][idx]})
                                                    </span>
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-6xl mb-4"
                                >
                                    🎉
                                </motion.div>
                                <h2 className="text-3xl font-bold text-white mb-4">Test Tamamlandı!</h2>
                                <p className="text-xl text-purple-200 mb-8">
                                    Toplam Puan: <strong className="text-white">{score} / {questions.length}</strong>
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={resetTest}
                                        className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-full font-bold transition-all hover:scale-105"
                                    >
                                        Test Listesine Dön
                                    </button>
                                </div>
                            </div>
                        )}

                        <AnimatePresence>
                            {showResult && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                                >
                                    <div className="bg-black/50 backdrop-blur-sm absolute inset-0" />
                                    <div className={`relative px-8 py-4 rounded-2xl text-4xl font-bold drop-shadow-lg transform -translate-y-12 ${showResult === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                        }`}>
                                        {showResult === 'correct' ? 'Doğru! 🌟' : 'Yanlış 😔'}
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
