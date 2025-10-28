// app/_layout.tsx
import { useAppReady } from '@/hooks/use-app-ready';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

export default function RootLayout() {
    const isAppReady = useAppReady();

    if (!isAppReady) {
        // This won't show because the native splash screen is still up
        // But it's a fallback in case JS loads before splash hides
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="home" options={{ headerShown: false }} />
            </Stack>
        </SafeAreaProvider>
    );
}
