// screens/SettingsScreen.tsx
import * as Application from 'expo-application';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native';
import { queryClient } from './_layout';

const SettingsScreen = () => {
    const { colorScheme, toggleColorScheme } = useColorScheme();
    const [appVersion, setAppVersion] = useState<string>('');

    React.useEffect(() => {
        const fetchVersion = async () => {
            const version = await Application.nativeApplicationVersion;
            setAppVersion(version || '1.0.0');
        };
        fetchVersion();
    }, []);

    const handleClearCache = () => {
        Alert.alert(
            'Clear Cache?',
            'This will remove all saved Pokémon data. The app will refetch on next use.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: () => {
                        queryClient.clear();
                        Alert.alert('Success', 'Cache cleared!');
                    },
                },
            ]
        );
    };

    const openGitHub = () => {
        Linking.openURL('https://github.com/karmsetu/pokeapp');
    };

    return (
        <View className="flex-1 bg-white dark:bg-gray-900 p-6">
            <Text className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Settings
            </Text>

            {/* Theme */}
            <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Appearance
                </Text>
                <TouchableOpacity
                    className="flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-xl"
                    onPress={toggleColorScheme}
                >
                    <Text className="text-gray-800 dark:text-gray-200">
                        Dark Mode
                    </Text>
                    <View
                        className={`w-12 h-6 rounded-full p-1 ${
                            colorScheme === 'dark'
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                        }`}
                    >
                        <View
                            className={`bg-white w-4 h-4 rounded-full transform ${
                                colorScheme === 'dark'
                                    ? 'translate-x-6'
                                    : 'translate-x-0'
                            }`}
                        />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Data */}
            <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    Data & Cache
                </Text>
                <TouchableOpacity
                    className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl"
                    onPress={handleClearCache}
                >
                    <Text className="text-red-600 dark:text-red-400 font-medium">
                        Clear Pokémon Cache
                    </Text>
                </TouchableOpacity>
            </View>

            {/* About */}
            <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    About
                </Text>
                <View className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    <Text className="text-gray-600 dark:text-gray-300 text-lg">
                        Poké App
                    </Text>

                    <Text className="text-gray-600 dark:text-gray-200">
                        This app was made by Karmsetu.
                    </Text>

                    <Text className="text-gray-500 dark:text-gray-400 text-sm my-2">
                        Expo SDK version: {appVersion}
                    </Text>
                    <TouchableOpacity onPress={openGitHub} className="mt-2">
                        <Text className="text-blue-500 dark:text-blue-400 text-sm">
                            View on GitHub
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Footer */}
            <View className="mt-auto items-center">
                <Text className="text-gray-500 dark:text-gray-400 text-xs text-center">
                    Made with ❤️ using PokéAPI
                </Text>
            </View>
        </View>
    );
};

export default SettingsScreen;
