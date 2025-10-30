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

const queryClient = new QueryClient({
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
                        <Stack>
                            {/* Only declare root-level screens */}
                            <Stack.Screen
                                name="index"
                                options={{ headerShown: false }}
                            />
                            {/* 
            Screens inside (tabs) are handled by (tabs)/_layout.tsx — 
            NO need to declare them here!
          */}
                        </Stack>
                    </SafeAreaProvider>
                </WinStreakProvider>
            </QuizProvider>
        </PersistQueryClientProvider>
    );
}
