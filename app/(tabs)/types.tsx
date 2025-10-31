import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

// Pokémon type colors (same as your detail screen)
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

const TYPES = Object.keys(TYPE_COLORS);

const fetchTypeData = async (type: string) => {
    const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
    if (!res.ok) throw new Error('Failed to fetch Pokémon type data');
    return res.json();
};

export default function TypeExplorerScreen() {
    const [selectedType, setSelectedType] = useState('fire');
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['type', selectedType],
        queryFn: () => fetchTypeData(selectedType),
    });

    const pokemons = data?.pokemon?.slice(0, 60) || [];

    return (
        <View className="flex-1 bg-gray-50 p-4">
            {/* Header */}
            <View className="mb-4">
                <Text className="text-2xl font-extrabold text-gray-800">
                    Pokémon Type Explorer
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                    Tap a type to discover its Pokémon!
                </Text>
            </View>

            {/* Type Selector */}
            <View className="max-h-10 mb-4">
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={TYPES}
                    keyExtractor={(t) => t}
                    className="  h-full"
                    renderItem={({ item: type }) => {
                        const isSelected = selectedType === type;
                        const bgColor = TYPE_COLORS[type];
                        return (
                            <TouchableOpacity
                                onPress={() => setSelectedType(type)}
                                className={`px-4 py-2 mr-2 rounded-full border ${
                                    isSelected
                                        ? 'border-gray-300'
                                        : 'border-transparent'
                                }`}
                                style={{
                                    backgroundColor: isSelected
                                        ? bgColor
                                        : '#e5e7eb',
                                }}
                            >
                                <Text
                                    className={`text-sm font-semibold capitalize ${
                                        isSelected
                                            ? 'text-white'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>

            {/* Pokémon Grid */}
            {isLoading ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-600">Loading Pokémon...</Text>
                </View>
            ) : isError ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-red-500 text-center mb-3">
                        Failed to load Pokémon.
                    </Text>
                    <TouchableOpacity
                        onPress={() => refetch()}
                        className="bg-blue-500 px-5 py-2 rounded-full"
                    >
                        <Text className="text-white font-medium">
                            Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={pokemons}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    keyExtractor={(item) => item.pokemon.url}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => {
                        const id = item.pokemon.url.split('/').slice(-2, -1)[0];
                        const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

                        return (
                            <Link
                                href={{
                                    pathname: '/pokemon/[id]',
                                    params: { id },
                                }}
                                asChild
                            >
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    className="bg-white p-3 mb-4 rounded-2xl flex-1 mx-1 items-center  border border-gray-100"
                                >
                                    <Image
                                        source={{ uri: sprite }}
                                        style={{ width: 96, height: 96 }}
                                    />
                                    <Text className="text-sm capitalize text-gray-800 mt-2 text-center font-medium">
                                        {item.pokemon.name}
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        );
                    }}
                />
            )}
        </View>
    );
}
