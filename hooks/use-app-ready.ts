// hooks/useAppReady.ts
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export function useAppReady() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const prepare = async () => {
            try {
                // Pre-load fonts (including icons)
                await Font.loadAsync({
                    ...Ionicons.font,
                    // Add your custom fonts here if needed
                    // 'Inter-Medium': require('../assets/fonts/Inter-Medium.otf'),
                });

                // Simulate other async setup (e.g., check auth, load settings)
                // await loadInitialData();

                // Optional: small delay for perceived smoothness (remove if not needed)
                await new Promise((resolve) => setTimeout(resolve, 300));
            } catch (e) {
                console.warn('App ready error:', e);
            } finally {
                setIsReady(true);
                // Hide splash screen
                await SplashScreen.hideAsync();
            }
        };

        prepare();
    }, []);

    return isReady;
}
