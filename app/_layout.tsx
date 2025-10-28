// app/_layout.tsx
import { useAppReady } from '@/hooks/use-app-ready';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function RootLayout() {
    const isReady = useAppReady();

    if (!isReady) return null; // Keep native splash screen visible

    return (
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
    );
}
