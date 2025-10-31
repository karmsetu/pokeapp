// app/(tabs)/_layout.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';

export default function TabLayout() {
    const { colorScheme } = useColorScheme();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#3b82f6',
                tabBarInactiveTintColor: '#94a3b8',
                tabBarStyle: {
                    backgroundColor:
                        colorScheme === 'light' ? '#ffffff' : '#111827',
                    borderTopWidth: 2,
                    borderTopColor:
                        colorScheme === 'light' ? '#ffffff' : '#1e1a4d',
                    height: 60,
                    paddingBottom: 6,
                    paddingTop: 5,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="pokedex"
                options={{
                    title: 'Pokédex',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="pokeball"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="battle"
                options={{
                    title: 'Battle',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="sword"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="home"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="types"
                options={{
                    title: 'Types',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="alpha-t-box"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="more"
                options={{
                    title: 'More',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons
                            name="dots-horizontal"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
