// app/(tabs)/more.tsx
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function MoreScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-gray-50 p-4 gap-4 mt-10">
            <TouchableOpacity
                className="bg-white p-6 rounded-xl flex flex-row justify-between "
                onPress={() => router.push('/guess')}
            >
                <Text className="text-xl font-semibold">Guess Pokémon</Text>
                <FontAwesome5 name="question" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-white p-6 rounded-xl flex flex-row justify-between "
                onPress={() => router.push('/quiz')}
            >
                <Text className="text-xl font-semibold">Pokémon Quiz</Text>
                <MaterialIcons name="quiz" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );
}
