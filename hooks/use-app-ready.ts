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

                // Optional: prefetch a few common Pokémon (e.g., #1-10) for instant feel
                // await prefetchInitialPokemon();
            } catch (e) {
                console.warn('App prep error:', e);
            } finally {
                setIsReady(true);
                await SplashScreen.hideAsync();
            }
        };

        prepare();
    }, []);

    return isReady;
}
