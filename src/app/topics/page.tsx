'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import curriculum from '@/data/english_curriculum.json';
import { useState } from 'react';

export default function TopicsPage() {
    const [expandedUnit, setExpandedUnit] = useState<number | null>(null);

    return (
        <div className="min-h-screen p-6 pb-24">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="btn-game px-4 py-2 text-sm">
                        ← Geri Dön
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Konu Özetleri</h1>
                </div>

                <div className="grid gap-6">
                    {curriculum.units.map((unit, index) => (
                        <motion.div
                            key={unit.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card overflow-hidden"
                            style={{ borderLeft: `6px solid ${unit.color}` }}
                        >
                            <button
                                onClick={() => setExpandedUnit(expandedUnit === unit.id ? null : unit.id)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                                        style={{ background: `${unit.color}20`, color: unit.color }}
                                    >
                                        {unit.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{unit.title}</h2>
                                        <p className="text-[#B2B2D8] text-sm">{unit.subtitle}</p>
                                    </div>
                                </div>
                                <div className={`text-2xl transition-transform ${expandedUnit === unit.id ? 'rotate-180' : ''}`}>
                                    👇
                                </div>
                            </button>

                            {expandedUnit === unit.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-6 pb-6 pt-2 border-t border-white/10"
                                >
                                    {unit.topicSummary ? (
                                        <div
                                            className="prose prose-invert max-w-none text-[#B2B2D8]"
                                            dangerouslySetInnerHTML={{ __html: unit.topicSummary }}
                                        />
                                    ) : (
                                        <p className="text-[#B2B2D8] italic">Bu ünite için henüz özet bulunmuyor.</p>
                                    )}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
