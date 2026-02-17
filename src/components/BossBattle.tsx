'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    xpReward: number;
}

interface BossBattleProps {
    questions: QuizQuestion[];
    unitId: number;
    onComplete: (passed: boolean) => void;
}

export default function BossBattle({ questions, unitId, onComplete }: BossBattleProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [gameOver, setGameOver] = useState(false);

    const { hearts, loseHeart, resetHearts, addXP, addCoins, completeUnit } = useGameStore();

    if (!questions || questions.length === 0) {
        return <div className="text-center text-[#B2B2D8] py-10">Yükleniyor...</div>;
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    // Timer
    useEffect(() => {
        if (gameOver || showResult) return;
        if (timeLeft <= 0) {
            handleTimeout();
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, gameOver, showResult]);

    const handleTimeout = () => {
        loseHeart();
        setShowResult(true);
        setSelectedAnswer(-1);
        checkGameOver();
    };

    const checkGameOver = useCallback(() => {
        // We check in next render because state may not have updated yet
        setTimeout(() => {
            const state = useGameStore.getState();
            if (state.hearts <= 0) {
                setGameOver(true);
            }
        }, 100);
    }, []);

    const handleAnswer = (answerIndex: number) => {
        if (showResult || gameOver) return;
        setSelectedAnswer(answerIndex);
        setShowResult(true);

        if (answerIndex === currentQuestion.correctAnswer) {
            setScore((prev) => prev + 1);
            addXP(currentQuestion.xpReward);
        } else {
            loseHeart();
            checkGameOver();
        }
    };

    const handleNext = () => {
        if (hearts <= 0) {
            setGameOver(true);
            return;
        }
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setShowResult(false);
            setTimeLeft(20);
        } else {
            // Quiz complete
            const passed = score + (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0) >= Math.ceil(questions.length * 0.6);
            if (passed) {
                completeUnit(unitId);
                addCoins(30);
            }
            onComplete(passed);
        }
    };

    const handleRetryBattle = () => {
        resetHearts();
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setTimeLeft(20);
        setGameOver(false);
    };

    // Game Over screen
    if (gameOver || (hearts <= 0 && showResult)) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center px-4 text-center"
            >
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-7xl mb-6"
                >
                    💀
                </motion.div>
                <h2 className="text-3xl font-bold text-[#FF6B6B] mb-3">Oyun Bitti!</h2>
                <p className="text-[#B2B2D8] mb-2">Canların tükendi.</p>
                <p className="text-[#B2B2D8] mb-6">
                    Skor: {score}/{questions.length}
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetryBattle}
                    className="btn-game btn-game-danger px-8 py-3 text-lg"
                >
                    🔄 Tekrar Dene
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col items-center px-4">
            {/* Boss header */}
            <div className="w-full max-w-md mb-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <motion.span
                            animate={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-3xl"
                        >
                            🐲
                        </motion.span>
                        <span className="font-bold text-[#FF6B6B]">Boss Savaşı!</span>
                    </div>

                    {/* Timer */}
                    <motion.div
                        className="flex items-center gap-1 px-3 py-1 rounded-full"
                        style={{
                            background:
                                timeLeft <= 5
                                    ? 'rgba(255,107,107,0.3)'
                                    : 'rgba(255,255,255,0.08)',
                            border: `1px solid ${timeLeft <= 5 ? 'rgba(255,107,107,0.5)' : 'rgba(255,255,255,0.15)'
                                }`,
                        }}
                        animate={timeLeft <= 5 ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    >
                        <span className="text-sm">⏱️</span>
                        <span
                            className={`font-bold text-sm ${timeLeft <= 5 ? 'text-[#FF6B6B]' : 'text-white'
                                }`}
                        >
                            {timeLeft}s
                        </span>
                    </motion.div>
                </div>

                {/* Hearts */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-[#B2B2D8]">CAN:</span>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <motion.span
                            key={i}
                            className={`text-xl ${i < hearts ? 'heart' : 'heart-empty'}`}
                            animate={
                                i === hearts
                                    ? { scale: [1, 0, 0], opacity: [1, 0] }
                                    : {}
                            }
                        >
                            {i < hearts ? '❤️' : '🖤'}
                        </motion.span>
                    ))}
                </div>

                {/* Progress */}
                <div className="xp-bar-bg h-2">
                    <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #FF6B6B, #E84393)' }}
                        animate={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-[#B2B2D8] text-right mt-1">
                    {currentIndex + 1}/{questions.length}
                </p>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="glass-card w-full max-w-md p-6 mb-6"
                    style={{ border: '2px solid rgba(255,107,107,0.2)' }}
                >
                    <h3 className="text-lg font-bold text-center">{currentQuestion.question}</h3>
                </motion.div>
            </AnimatePresence>

            {/* Options */}
            <div className="w-full max-w-md grid grid-cols-1 gap-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const isSelected = index === selectedAnswer;

                    let optionStyle = {};
                    if (showResult) {
                        if (isCorrect) {
                            optionStyle = {
                                background: 'rgba(0,184,148,0.3)',
                                border: '2px solid rgba(0,184,148,0.6)',
                            };
                        } else if (isSelected && !isCorrect) {
                            optionStyle = {
                                background: 'rgba(255,107,107,0.3)',
                                border: '2px solid rgba(255,107,107,0.6)',
                            };
                        } else {
                            optionStyle = {
                                background: 'rgba(255,255,255,0.03)',
                                border: '2px solid rgba(255,255,255,0.08)',
                                opacity: 0.5,
                            };
                        }
                    } else {
                        optionStyle = {
                            background: 'rgba(255,255,255,0.06)',
                            border: '2px solid rgba(255,255,255,0.12)',
                        };
                    }

                    return (
                        <motion.button
                            key={index}
                            whileHover={!showResult ? { scale: 1.02, x: 4 } : {}}
                            whileTap={!showResult ? { scale: 0.98 } : {}}
                            animate={
                                showResult && isSelected && !isCorrect
                                    ? { x: [0, -5, 5, -5, 0] }
                                    : showResult && isCorrect
                                        ? { scale: [1, 1.03, 1] }
                                        : {}
                            }
                            transition={{ duration: 0.4 }}
                            onClick={() => handleAnswer(index)}
                            disabled={showResult}
                            className="p-4 rounded-2xl text-left font-medium transition-all"
                            style={optionStyle}
                        >
                            <span className="mr-3 text-[#B2B2D8]">
                                {String.fromCharCode(65 + index)}.
                            </span>
                            {option}
                            {showResult && isCorrect && <span className="float-right">✅</span>}
                            {showResult && isSelected && !isCorrect && (
                                <span className="float-right">❌</span>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Next button */}
            {showResult && (
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="btn-game px-8 py-3"
                    style={{ background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)' }}
                >
                    {currentIndex === questions.length - 1 ? '🏆 Sonuçları Gör' : 'Sonraki →'}
                </motion.button>
            )}
        </div>
    );
}
