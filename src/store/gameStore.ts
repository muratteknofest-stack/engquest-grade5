'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  price: number;
  category: string;
}

interface GameState {
  // Player stats
  xp: number;
  coins: number;
  hearts: number;
  maxHearts: number;
  level: number;
  playerName: string;

  // Progress
  completedUnits: number[];
  currentUnit: number;
  flashcardsViewed: Record<string, boolean>;
  sentenceBuilderCompleted: Record<string, boolean>;

  // Inventory
  ownedItems: string[];
  equippedItems: Record<string, string>;

  // Actions
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  loseHeart: () => void;
  resetHearts: () => void;
  completeUnit: (unitId: number) => void;
  setCurrentUnit: (unitId: number) => void;
  markFlashcardViewed: (cardId: string) => void;
  markSentenceComplete: (sentenceId: string) => void;
  purchaseItem: (item: ShopItem) => boolean;
  equipItem: (category: string, itemId: string) => void;
  setPlayerName: (name: string) => void;
  resetGame: () => void;
}

const XP_PER_LEVEL = 200;

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      coins: 50,
      hearts: 3,
      maxHearts: 3,
      level: 1,
      playerName: 'Adventurer',

      completedUnits: [],
      currentUnit: 1,
      flashcardsViewed: {},
      sentenceBuilderCompleted: {},

      ownedItems: [],
      equippedItems: {},

      addXP: (amount: number) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
          const levelUp = newLevel > state.level;
          return {
            xp: newXP,
            level: newLevel,
            coins: levelUp ? state.coins + 25 : state.coins,
          };
        }),

      addCoins: (amount: number) =>
        set((state) => ({ coins: state.coins + amount })),

      loseHeart: () =>
        set((state) => ({
          hearts: Math.max(0, state.hearts - 1),
        })),

      resetHearts: () =>
        set((state) => ({ hearts: state.maxHearts })),

      completeUnit: (unitId: number) =>
        set((state) => ({
          completedUnits: state.completedUnits.includes(unitId)
            ? state.completedUnits
            : [...state.completedUnits, unitId],
        })),

      setCurrentUnit: (unitId: number) =>
        set({ currentUnit: unitId }),

      markFlashcardViewed: (cardId: string) =>
        set((state) => ({
          flashcardsViewed: { ...state.flashcardsViewed, [cardId]: true },
        })),

      markSentenceComplete: (sentenceId: string) =>
        set((state) => ({
          sentenceBuilderCompleted: {
            ...state.sentenceBuilderCompleted,
            [sentenceId]: true,
          },
        })),

      purchaseItem: (item: ShopItem) => {
        const state = get();
        if (state.coins >= item.price && !state.ownedItems.includes(item.id)) {
          set({
            coins: state.coins - item.price,
            ownedItems: [...state.ownedItems, item.id],
          });
          return true;
        }
        return false;
      },

      equipItem: (category: string, itemId: string) =>
        set((state) => ({
          equippedItems: { ...state.equippedItems, [category]: itemId },
        })),

      setPlayerName: (name: string) =>
        set({ playerName: name }),

      resetGame: () =>
        set({
          xp: 0,
          coins: 50,
          hearts: 3,
          level: 1,
          completedUnits: [],
          currentUnit: 1,
          flashcardsViewed: {},
          sentenceBuilderCompleted: {},
          ownedItems: [],
          equippedItems: {},
        }),
    }),
    {
      name: 'engquest-game-storage',
    }
  )
);
