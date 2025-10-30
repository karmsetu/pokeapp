// contexts/QuizContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

const QUIZ_STORAGE_KEY = 'pokemon_quiz_scores';

type QuizScores = {
    current: number;
    highest: number;
};

type QuizContextType = {
    currentScore: number;
    highestScore: number;
    incrementScore: () => void;
    resetCurrentScore: () => void;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: React.ReactNode }) {
    const [scores, setScores] = useState<QuizScores>({
        current: 0,
        highest: 0,
    });

    // Load from AsyncStorage on mount
    useEffect(() => {
        const loadScores = async () => {
            try {
                const saved = await AsyncStorage.getItem(QUIZ_STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setScores({
                        current: parsed.current || 0,
                        highest: parsed.highest || 0,
                    });
                }
            } catch (e) {
                console.warn('Failed to load quiz scores', e);
            }
        };
        loadScores();
    }, []);

    // Save to AsyncStorage whenever scores change
    useEffect(() => {
        const saveScores = async () => {
            try {
                await AsyncStorage.setItem(
                    QUIZ_STORAGE_KEY,
                    JSON.stringify(scores)
                );
            } catch (e) {
                console.warn('Failed to save quiz scores', e);
            }
        };
        saveScores();
    }, [scores]);

    // update high score when current score is greater than high score
    useEffect(() => {
        if (scores.current > scores.highest) {
            const scr = scores.current;
            setScores((prevScores) => ({ ...prevScores, current: scr }));
        }
    }, [scores.current]);

    const incrementScore = () => {
        setScores((prev) => ({ ...prev, current: prev.current + 1 }));
    };

    const resetCurrentScore = () => {
        setScores((prev) => ({ ...prev, current: 0 }));
    };

    return (
        <QuizContext.Provider
            value={{
                currentScore: scores.current,
                highestScore: scores.highest,
                incrementScore,
                resetCurrentScore,
            }}
        >
            {children}
        </QuizContext.Provider>
    );
}

// Custom hook for easy access
export function useQuiz() {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
}
