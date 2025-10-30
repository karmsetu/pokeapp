// app/quiz/game.tsx
import { useQuiz } from '@/contexts/QuizContext';
import { useRandomQuizQuestion } from '@/hooks/useQuizQuestions';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function QuizGameScreen() {
    const router = useRouter();

    const { currentScore, incrementScore, resetCurrentScore } = useQuiz();
    const { data: question, isLoading, refetch } = useRandomQuizQuestion();
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleAnswer = (option: string) => {
        if (selected || !question) return;

        const correct = option === question.correctAnswer;
        setSelected(option);
        setIsCorrect(correct);

        if (correct) {
            incrementScore();
        } else {
            resetCurrentScore();
        }

        // Show result, then auto-advance
        setTimeout(() => {
            nextQuestion();
        }, 2000);
    };

    const nextQuestion = () => {
        setSelected(null);
        setIsCorrect(null);
        refetch(); // fetch new question
    };

    const goBack = () => router.back();

    if (isLoading || !question) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Text>Loading question...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 p-4">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <TouchableOpacity onPress={goBack}>
                    <Text className="text-blue-500">← Back</Text>
                </TouchableOpacity>
                <Text className="font-bold">Pokémon Quiz</Text>
                <Text className="text-orange-500">🔥 {currentScore}</Text>
            </View>

            {/* Question */}
            <View className="mb-6">
                <Text className="text-xl font-bold text-center mb-4">
                    {question.question}
                </Text>

                {/* Sprite (if applicable) */}
                {question.type === 'pokemon-guess' && (
                    <View className="items-center mb-6">
                        <Image
                            source={{
                                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Math.floor(Math.random() * 151) + 1}.png`,
                            }}
                            style={{ width: 120, height: 120 }}
                            contentFit="contain"
                        />
                    </View>
                )}
            </View>

            {/* Options */}
            <View className="gap-3">
                {question.options.map((option, i) => {
                    let bg = 'bg-white';
                    if (selected) {
                        if (option === question.correctAnswer)
                            bg = 'bg-green-100';
                        else if (option === selected) bg = 'bg-red-100';
                    }

                    return (
                        <TouchableOpacity
                            key={i}
                            onPress={() => handleAnswer(option)}
                            disabled={!!selected}
                            className={`${bg} p-4 rounded-xl border border-gray-200`}
                        >
                            <Text className="text-lg capitalize">{option}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Feedback */}
            {isCorrect !== null && (
                <View className="mt-4 p-3 rounded-lg bg-opacity-20">
                    <Text
                        className={`text-center font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {isCorrect
                            ? '✅ Correct!'
                            : `❌ ${question.explanation || `It's ${question.correctAnswer}!`}`}
                    </Text>
                </View>
            )}
        </View>
    );
}
