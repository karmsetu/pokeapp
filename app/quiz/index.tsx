// app/quiz/index.tsx
import { useQuiz } from '@/contexts/QuizContext';
import { getWinStreakColor } from '@/lib/ui';
import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function QuizHome() {
    const { currentScore, highestScore } = useQuiz();
    const { bg, text } = getWinStreakColor(currentScore);

    return (
        <View className="flex-1 bg-gray-50 justify-center items-center p-6">
            <View
                className={`absolute top-5 left-3 ${bg} ${text} rounded-xl p-4`}
            >
                <Text className={`text-md ${text}`}>
                    Highest Score: {highestScore}
                </Text>
                <Text className="text-3xl font-semibold ">
                    Current Score: {currentScore}
                </Text>
            </View>
            <View className="bg-white rounded-2xl p-8 w-full max-w-md items-center ">
                <Text className="text-2xl font-bold mb-2">Pokémon Quiz</Text>
                <Text className="text-gray-600 text-center mb-6">
                    Test your Pokémon knowledge! Types, names, stats & more.
                </Text>
                <Link href="/quiz/game" asChild>
                    <TouchableOpacity className="bg-purple-500 py-3 px-8 rounded-full">
                        <Text className="text-white text-lg font-semibold">
                            Start Quiz
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
