// app/pokemin/[id].tsx
import { getPokemonDetail } from '@/hooks/usePokemonSearch';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

/* Type colors (official Pokémon palette) */
const TYPE_COLORS: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
};

export default function PokemonCardScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: pokemon, isLoading } = getPokemonDetail(id);

    const statMap = useMemo(() => {
        if (!pokemon?.stats) return {};
        const map: Record<string, number> = {};
        pokemon.stats.forEach((s: any) => {
            map[s.stat.name] = s.base_stat;
        });
        return map;
    }, [pokemon?.stats]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!pokemon) {
        return (
            <View style={[styles.center, styles.padding]}>
                <Text className="text-center">
                    You sure this Pokémon exists?
                </Text>
                <Link href="/(tabs)/home" className="mt-2 text-blue-500">
                    <Text>Go back home</Text>
                </Link>
            </View>
        );
    }

    const sprite = pokemon.sprites?.front_default;
    const types = pokemon.types?.map((t: any) => t.type.name) || [];

    const height = (pokemon.height / 10).toFixed(1); // decimeters → meters
    const weight = (pokemon.weight / 10).toFixed(1); // hectograms → kilograms

    return (
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
            {/* 🧾 Header: ID + Name */}
            <View className="flex-row justify-between items-start mb-3">
                <View className="bg-gray-200 rounded-full px-3 py-1">
                    <Text className="text-xs font-bold text-gray-700">
                        #{id.toString().padStart(3, '0')}
                    </Text>
                </View>
                <Text className="text-xl font-bold text-gray-800 capitalize flex-1 text-center">
                    {pokemon.name}
                </Text>
                <View className="w-8" /> {/* Spacer for alignment */}
            </View>

            {/* 🖼️ Sprite */}
            <View className="items-center mb-4">
                {sprite ? (
                    <Image
                        source={{ uri: sprite }}
                        style={styles.sprite}
                        contentFit="contain"
                        transition={200}
                    />
                ) : (
                    <View style={styles.noSpriteBox}>
                        <Text className="text-gray-400 text-xs">No sprite</Text>
                    </View>
                )}
            </View>

            {/*  Types */}
            <View className="flex-row justify-center gap-2 mb-4">
                {types.map((type: string) => (
                    <View
                        key={type}
                        className="px-3 py-1 rounded-full"
                        style={{
                            backgroundColor: TYPE_COLORS[type] || '#A0A0A0',
                        }}
                    >
                        <Text className="text-white text-xs font-medium capitalize">
                            {type}
                        </Text>
                    </View>
                ))}
            </View>

            {/*  Stats */}
            <View className="mb-3">
                {[
                    { name: 'HP', key: 'hp', color: '#ef4444' },
                    { name: 'Attack', key: 'attack', color: '#f97316' },
                    { name: 'Defense', key: 'defense', color: '#3b82f6' },
                    {
                        name: 'Sp. Atk',
                        key: 'special-attack',
                        color: '#ec4899',
                    },
                    {
                        name: 'Sp. Def',
                        key: 'special-defense',
                        color: '#8b5cf6',
                    },
                    { name: 'Speed', key: 'speed', color: '#10b981' },
                ].map((stat) => (
                    <View key={stat.key} className="mb-2">
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-sm font-medium text-gray-700">
                                {stat.name}
                            </Text>
                            <Text className="text-sm font-bold text-gray-900">
                                {statMap[stat.key] || 0}
                            </Text>
                        </View>

                        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <View
                                className="h-full rounded-full"
                                style={{
                                    width: `${Math.min(100, statMap[stat.key] || 0)}%`,
                                    backgroundColor: stat.color,
                                }}
                            />
                        </View>
                    </View>
                ))}
            </View>

            {/*  Height & Weight */}
            <View className="flex-row justify-between px-1">
                <View className="items-center">
                    <Text className="text-xs text-gray-500">HEIGHT</Text>
                    <Text className="text-sm font-bold text-gray-800">
                        {height} m
                    </Text>
                </View>

                <View className="items-center">
                    <Text className="text-xs text-gray-500">WEIGHT</Text>
                    <Text className="text-sm font-bold text-gray-800">
                        {weight} kg
                    </Text>
                </View>
            </View>
        </View>
    );
}

/* 🧩 Styles */
const styles = StyleSheet.create({
    sprite: {
        width: 240,
        height: 240,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    padding: {
        padding: 16,
    },
    noSpriteBox: {
        width: 96,
        height: 96,
        backgroundColor: '#f3f4f6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
