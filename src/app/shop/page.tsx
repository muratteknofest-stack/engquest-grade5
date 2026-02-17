'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGameStore, ShopItem } from '@/store/gameStore';
import PlayerHUD from '@/components/PlayerHUD';
import curriculum from '@/data/english_curriculum.json';

const shopItems = curriculum.shopItems as ShopItem[];

export default function ShopPage() {
    const { coins, ownedItems, equippedItems, purchaseItem, equipItem } = useGameStore();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [notification, setNotification] = useState<string | null>(null);
    const router = useRouter();

    const categories = [
        { id: 'all', label: '🎁 Tümü', color: '#6C5CE7' },
        { id: 'hat', label: '🎩 Şapkalar', color: '#FF6B6B' },
        { id: 'frame', label: '🖼️ Çerçeveler', color: '#F59E0B' },
        { id: 'pet', label: '🐾 Evcil Hayvanlar', color: '#00CEC9' },
        { id: 'badge', label: '⭐ Rozetler', color: '#E84393' },
    ];

    const filteredItems =
        selectedCategory === 'all'
            ? shopItems
            : shopItems.filter((item) => item.category === selectedCategory);

    const handleBuy = (item: ShopItem) => {
        if (ownedItems.includes(item.id)) {
            equipItem(item.category, item.id);
            setNotification(`${item.name} kuşanıldı! ${item.icon}`);
        } else {
            const success = purchaseItem(item);
            if (success) {
                setNotification(`${item.name} satın alındı! ${item.icon}`);
            } else {
                setNotification('Yeterli altının yok! 😢');
            }
        }
        setTimeout(() => setNotification(null), 2000);
    };

    return (
        <main className="relative z-10 min-h-screen">
            <PlayerHUD />

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

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <span className="text-5xl">🛒</span>
                    <h1 className="text-3xl font-black bg-gradient-to-r from-[#FDCB6E] via-[#E84393] to-[#6C5CE7] bg-clip-text text-transparent mt-3">
                        Macera Dükkanı
                    </h1>
                    <p className="text-[#B2B2D8] text-sm mt-1">
                        Altınlarını harika öğelerle harca!
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <span className="text-xl">🪙</span>
                        <span className="text-2xl font-bold text-[#FDCB6E]">{coins}</span>
                        <span className="text-[#B2B2D8] text-sm">altın</span>
                    </div>
                </motion.div>

                {/* Categories */}
                <div className="flex gap-2 justify-center flex-wrap mb-6">
                    {categories.map((cat) => (
                        <motion.button
                            key={cat.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedCategory(cat.id)}
                            className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                            style={{
                                background:
                                    selectedCategory === cat.id
                                        ? `${cat.color}30`
                                        : 'rgba(255,255,255,0.05)',
                                border: `2px solid ${selectedCategory === cat.id ? cat.color : 'rgba(255,255,255,0.1)'
                                    }`,
                                color: selectedCategory === cat.id ? cat.color : '#B2B2D8',
                            }}
                        >
                            {cat.label}
                        </motion.button>
                    ))}
                </div>

                {/* Notification */}
                <AnimatePresence>
                    {notification && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center mb-4"
                        >
                            <span className="glass-card px-4 py-2 text-sm font-semibold text-[#FDCB6E] inline-block">
                                {notification}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {filteredItems.map((item, index) => {
                        const isOwned = ownedItems.includes(item.id);
                        const isEquipped = equippedItems[item.category] === item.id;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.06 }}
                                whileHover={{ y: -4, scale: 1.03 }}
                                className="glass-card p-4 text-center relative"
                                style={{
                                    border: isEquipped
                                        ? '2px solid rgba(0,184,148,0.5)'
                                        : '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                {isEquipped && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#00B894] flex items-center justify-center text-xs border-2 border-[#0F0A1E]"
                                    >
                                        ✓
                                    </motion.div>
                                )}

                                <motion.span
                                    className="text-4xl inline-block"
                                    animate={{ rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.3 }}
                                >
                                    {item.icon}
                                </motion.span>
                                <h3 className="font-bold text-sm mt-2">{item.name}</h3>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleBuy(item)}
                                    className="mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all"
                                    style={
                                        isOwned
                                            ? {
                                                background: isEquipped
                                                    ? 'rgba(0,184,148,0.3)'
                                                    : 'rgba(108,92,231,0.3)',
                                                border: `1px solid ${isEquipped
                                                    ? 'rgba(0,184,148,0.5)'
                                                    : 'rgba(108,92,231,0.5)'
                                                    }`,
                                                color: isEquipped ? '#00B894' : '#A29BFE',
                                            }
                                            : coins >= item.price
                                                ? {
                                                    background: 'linear-gradient(135deg, #F59E0B, #FDCB6E)',
                                                    color: '#1A1333',
                                                }
                                                : {
                                                    background: 'rgba(255,255,255,0.05)',
                                                    color: '#666',
                                                    cursor: 'not-allowed',
                                                }
                                    }
                                >
                                    {isOwned
                                        ? isEquipped
                                            ? '✓ Kuşanıldı'
                                            : 'Kuşan'
                                        : `🪙 ${item.price}`}
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
