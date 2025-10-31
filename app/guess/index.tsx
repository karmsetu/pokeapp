// app/guess/index.tsx
import { useWinStreak } from '@/contexts/WinStreakContext';
import { getWinStreakColor } from '@/lib/ui';
import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function GuessPokemonScreen() {
    const { streak } = useWinStreak();
    const { bg, text } = getWinStreakColor(streak);
    return (
        <View className="flex-1 bg-gray-50 justify-center items-center p-6 mt-10">
            <View className="absolute top-5 left-2">
                <Text
                    className={`text-3xl font-semibold p-2 rounded-lg ${bg} ${text}`}
                >
                    Win Streak: {streak}
                </Text>
            </View>
            <View className="bg-white rounded-2xl p-8  w-full max-w-md items-center">
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                    ❓ Guess the Pokémon
                </Text>
                <Text className="text-gray-600 text-center mb-6">
                    Can you name this Pokémon from its silhouette?
                </Text>

                <Link href="/guess/game" asChild>
                    <TouchableOpacity className="bg-blue-500 py-3 px-8 rounded-full">
                        <Text className="text-white font-semibold text-lg">
                            Start Game
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}
