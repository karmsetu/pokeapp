import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-white">
            <Text className="text-3xl font-bold text-blue-600">
                Hello World!
            </Text>
        </SafeAreaView>
    );
}
