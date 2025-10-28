// app/(tabs)/more.tsx
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function MoreScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-gray-50 p-4 gap-4">
            <TouchableOpacity
                className="bg-white p-6 rounded-xl"
                onPress={() => router.push('/guess')} // or keep in tabs
            >
                <Text className="text-xl font-semibold">Guess Pokémon</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-white p-6 rounded-xl"
                onPress={() => router.push('/quiz')}
            >
                <Text className="text-xl font-semibold">Pokémon Quiz</Text>
            </TouchableOpacity>
        </View>
    );
}
