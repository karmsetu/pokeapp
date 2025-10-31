// app/(tabs)/more.tsx
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Text, TouchableOpacity, View } from 'react-native';

export default function MoreScreen() {
    const router = useRouter();
    const { colorScheme } = useColorScheme();

    return (
        <View className="flex-1 bg-gray-50 p-4 gap-4 mt-10 dark:bg-dark-background">
            <TouchableOpacity
                className="bg-white dark:bg-dark-surface p-6 rounded-xl flex flex-row justify-between "
                onPress={() => router.push('/guess')}
            >
                <Text className="text-xl font-semibold dark:bg-dark-surface dark:text-dark-text">
                    Guess Pokémon
                </Text>
                <FontAwesome5
                    name="question"
                    size={24}
                    color={colorScheme === 'light' ? 'black' : 'white'}
                />
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-white dark:bg-dark-surface p-6 rounded-xl flex flex-row justify-between "
                onPress={() => router.push('/quiz')}
            >
                <Text className="text-xl font-semibold dark:bg-dark-surface dark:text-dark-text">
                    Pokémon Quiz
                </Text>
                <MaterialIcons
                    name="quiz"
                    size={24}
                    color={colorScheme === 'light' ? 'black' : 'white'}
                />
            </TouchableOpacity>
        </View>
    );
}
