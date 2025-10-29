// components/PokemonSearch.tsx
import { useDebounce } from '@/hooks/useDebounce';
import { usePokemonSearch, usePokemonTypes } from '@/hooks/usePokemonSearch';
import { EvilIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Helper: extract ID from PokeAPI URL
const getIdFromUrl = (url: string): string => {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2], 10).toString();
};

export default function Pokedex() {
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('');

    const debouncedSearch = useDebounce(search, 400);
    const { data: typesData } = usePokemonTypes();
    const {
        data: pokemonList,
        isLoading,
        isFetching,
    } = usePokemonSearch(debouncedSearch, selectedType);

    // Get unique types
    const types = useMemo(() => {
        if (!typesData?.results) return [];
        return typesData.results
            .map((t: any) => t.name)
            .filter((name: string) => !['unknown', 'shadow'].includes(name))
            .slice(0, 18);
    }, [typesData]);

    const clearFilters = () => {
        setSearch('');
        setSelectedType('');
    };

    const renderPokemonItem = ({
        item,
    }: {
        item: { name: string; url: string };
    }) => {
        const id = getIdFromUrl(item.url);
        const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

        return (
            <Link
                href={{ pathname: '/pokemon/[id]', params: { id } }}
                className="w-full m-3 shadow"
            >
                <View className="w-full flex-row items-center justify-between  bg-white rounded-xl p-3 mb-3 shadow-sm">
                    <View className="flex-row">
                        {/* Sprite */}
                        <View className="w-24 h-24 justify-center items-center mr-3">
                            <Image
                                source={{ uri: spriteUrl }}
                                style={{ width: 100, height: 100 }}
                                contentFit="contain"
                                transition={150}
                                // placeholder={require('@/assets/placeholder.png')} // optional
                            />
                        </View>

                        {/* Name + ID */}
                        <View className="flex flex-col justify-center">
                            <Text className="text-sm text-gray-500">#{id}</Text>
                            <Text className="text-lg font-medium text-gray-800 capitalize">
                                {item.name}
                            </Text>
                        </View>
                    </View>

                    {/* icon */}
                    <View className="flex justify-start items-start">
                        <EvilIcons
                            name="external-link"
                            size={24}
                            color="black"
                        />
                    </View>
                </View>
            </Link>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Search Bar */}
            <View className="p-4 bg-white border-b border-gray-200">
                <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
                    <TextInput
                        className="flex-1 py-2 text-gray-800"
                        placeholder="Search Pokémon..."
                        value={search}
                        onChangeText={setSearch}
                        autoFocus
                    />
                    {(search || selectedType) && (
                        <TouchableOpacity onPress={clearFilters}>
                            <Text className="text-blue-500 font-medium ml-2">
                                Clear
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Type Filters */}
            <View className="p-4">
                <Text className="text-sm font-medium text-gray-600 mb-2">
                    Filter by Type:
                </Text>
                <FlatList
                    data={types}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="gap-2"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() =>
                                setSelectedType(
                                    selectedType === item ? '' : item
                                )
                            }
                            className={`px-3 py-1.5 rounded-full ${
                                selectedType === item
                                    ? 'bg-blue-500 border border-blue-600'
                                    : 'bg-white border border-gray-300'
                            }`}
                        >
                            <Text
                                className={`text-xs font-medium ${
                                    selectedType === item
                                        ? 'text-white'
                                        : 'text-gray-700'
                                }`}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item}
                />
            </View>

            {/* Results */}
            <View className="flex-1 px-4">
                {isLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#3b82f6" />
                        <Text className="mt-2 text-gray-500">
                            Loading Pokémon...
                        </Text>
                    </View>
                ) : pokemonList?.length ? (
                    <FlatList
                        data={pokemonList}
                        keyExtractor={(item) => item.name}
                        showsVerticalScrollIndicator={false}
                        contentContainerClassName="pb-4"
                        renderItem={renderPokemonItem} // ✅ Updated
                    />
                ) : debouncedSearch || selectedType ? (
                    <View className="flex-1 justify-center items-center py-8">
                        <Text className="text-gray-500 text-center">
                            No Pokémon found 😢
                        </Text>
                        <Text className="text-gray-400 text-sm mt-1">
                            Try a different name or type
                        </Text>
                    </View>
                ) : (
                    <View className="flex-1 justify-center items-center py-8">
                        <Text className="text-gray-500">
                            Search for Pokémon or select a type
                        </Text>
                    </View>
                )}

                {isFetching && !isLoading && (
                    <View className="py-2">
                        <ActivityIndicator color="#3b82f6" />
                    </View>
                )}
            </View>
        </View>
    );
}
