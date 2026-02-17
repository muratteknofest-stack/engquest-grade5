'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [step, setStep] = useState(0);

    useEffect(() => {
        // Timeline for animations
        const timer1 = setTimeout(() => setStep(1), 500); // Start text 1
        const timer2 = setTimeout(() => setStep(2), 2500); // Start text 2
        const timer3 = setTimeout(() => setStep(3), 4500); // Exit

        // Complete after exit animation
        const timer4 = setTimeout(onComplete, 5500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center text-center bg-[#0F0A1E] text-white overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
        >
            {/* Background Effects */}
            <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                    background: 'radial-gradient(circle at center, #6C5CE7 0%, transparent 70%)',
                }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Floating Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                    initial={{
                        x: Math.random() * 100 + 'vw',
                        y: Math.random() * 100 + 'vh',
                    }}
                    animate={{
                        y: [null, Math.random() * -100],
                        opacity: [0.2, 0.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            ))}

            {/* School Name Animation */}
            {step >= 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                    className="relative z-10 mb-8 px-4"
                >
                    <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#FDCB6E] via-[#FF6B6B] to-[#E84393] bg-clip-text text-transparent drop-shadow-lg">
                        Celalettin Ökten
                    </h1>
                    <h2 className="text-2xl md:text-4xl font-bold text-white mt-2 drop-shadow-md">
                        İmamhatip Ortaokulu
                    </h2>
                </motion.div>
            )}

            {/* Class Greeting Animation */}
            {step >= 2 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                    className="relative z-10"
                >
                    <div className="glass-card px-8 py-4 rounded-full border-2 border-[#6C5CE7]">
                        <span className="text-4xl md:text-6xl font-black text-[#A29BFE]">
                            5-E Sınıfı
                        </span>
                        <span className="block text-2xl md:text-3xl mt-2 font-bold text-white">
                            Merhaba! 👋
                        </span>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
