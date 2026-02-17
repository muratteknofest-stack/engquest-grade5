'use client';

import { motion } from 'framer-motion';
import ZoneNode from './ZoneNode';
import curriculum from '@/data/english_curriculum.json';

export default function WorldMap() {
    return (
        <div className="relative px-4 pt-24 pb-16 max-w-lg mx-auto">
            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
            >
                <motion.h1
                    className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#6C5CE7] via-[#A29BFE] to-[#00CEC9] bg-clip-text text-transparent"
                    animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    style={{ backgroundSize: '200% 200%' }}
                >
                    🗺️ Macera Haritası
                </motion.h1>
                <p className="text-[#B2B2D8] text-sm mt-2">
                    Her adayı fethedip İngilizce'de ustalaş!
                </p>
            </motion.div>

            {/* Path line decoration */}
            <div className="absolute left-1/2 top-44 bottom-16 w-1 -translate-x-1/2">
                <motion.div
                    className="h-full w-full rounded-full"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    style={{
                        transformOrigin: 'top',
                        background: 'linear-gradient(to bottom, rgba(108,92,231,0.4), rgba(0,206,201,0.4), rgba(232,67,147,0.4), rgba(108,92,231,0.4))',
                    }}
                />
            </div>

            {/* Zone Nodes */}
            <div className="relative z-10 flex flex-col items-center">
                {curriculum.units.map((unit, index) => (
                    <ZoneNode
                        key={unit.id}
                        id={unit.id}
                        title={unit.title}
                        subtitle={unit.subtitle}
                        icon={unit.icon}
                        color={unit.color}
                        bgGradient={unit.bgGradient}
                        index={index}
                        hasContent={unit.flashcards.length > 0}
                    />
                ))}
            </div>

            {/* Bottom decoration */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center mt-8"
            >
                <p className="text-[#B2B2D8] text-xs">
                    🏆 Tüm adaları tamamlayarak İngilizce Ustası ol!
                </p>
            </motion.div>
        </div>
    );
}
