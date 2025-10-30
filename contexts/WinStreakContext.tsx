// contexts/WinStreakContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const WIN_STREAK_KEY = 'pokemon_guess_win_streak';

type WinStreakContextType = {
    streak: number;
    incrementStreak: () => void;
    resetStreak: () => void;
};

const WinStreakContext = createContext<WinStreakContextType | undefined>(
    undefined
);

export function WinStreakProvider({ children }: { children: React.ReactNode }) {
    const [streak, setStreak] = useState(0);

    // Load from AsyncStorage on mount
    useEffect(() => {
        const loadStreak = async () => {
            try {
                const saved = await AsyncStorage.getItem(WIN_STREAK_KEY);
                if (saved !== null) {
                    setStreak(parseInt(saved, 10));
                }
            } catch (e) {
                console.warn('Failed to load win streak', e);
            }
        };
        loadStreak();
    }, []);

    // Save to AsyncStorage whenever streak changes
    useEffect(() => {
        const saveStreak = async () => {
            try {
                await AsyncStorage.setItem(WIN_STREAK_KEY, streak.toString());
            } catch (e) {
                console.warn('Failed to save win streak', e);
            }
        };
        saveStreak();
    }, [streak]);

    const incrementStreak = () => setStreak((prev) => prev + 1);
    const resetStreak = () => setStreak(0);

    return (
        <WinStreakContext.Provider
            value={{ streak, incrementStreak, resetStreak }}
        >
            {children}
        </WinStreakContext.Provider>
    );
}

// Custom hook for easy access
export function useWinStreak() {
    const context = useContext(WinStreakContext);
    if (!context) {
        throw new Error('useWinStreak must be used within a WinStreakProvider');
    }
    return context;
}
