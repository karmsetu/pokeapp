// app/_layout.tsx
import { QuizProvider } from '@/contexts/QuizContext';
import { WinStreakProvider } from '@/contexts/WinStreakContext';
import { useAppReady } from '@/hooks/use-app-ready';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './global.css';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            // cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
});

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
});

export default function RootLayout() {
    const isReady = useAppReady();

    if (!isReady) return null; // Keep native splash screen visible

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
        >
            <QuizProvider>
                <WinStreakProvider>
                    <SafeAreaProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                            {/* Only declare root-level screens */}
                            <Stack.Screen
                                name="index"
                                options={{ headerShown: false }}
                            />
                            <Stack.Screen
                                name="(tabs)"
                                options={{ headerShown: false }}
                            />
                        </Stack>
                    </SafeAreaProvider>
                </WinStreakProvider>
            </QuizProvider>
        </PersistQueryClientProvider>
    );
}
