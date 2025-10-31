// screens/TeamSelectionScreen.tsx
import { useNavigation as useNav } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Types
interface PokemonSummary {
    name: string;
    url: string;
}

interface NavigationProp {
    navigate: (screen: string, params?: any) => void;
}

// Fetcher function
const fetchPokemonList = async (): Promise<PokemonSummary[]> => {
    const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    if (!res.ok) throw new Error('Failed to fetch Pokémon list');
    const data = await res.json();
    return data.results;
};

const TeamSelectionScreen = () => {
    const navigation = useNav<NavigationProp>();
    const [search, setSearch] = useState<string>('');
    const [selected, setSelected] = useState<number[]>([]);

    // TanStack Query
    const {
        data: pokemonList = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['pokemon-list'],
        queryFn: fetchPokemonList,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const filteredPokemon = useMemo(() => {
        if (!search) return pokemonList;
        const term = search.toLowerCase();
        return pokemonList.filter((p) => p.name.toLowerCase().includes(term));
    }, [search, pokemonList]);

    const toggleSelect = (id: number) => {
        if (selected.includes(id)) {
            setSelected(selected.filter((i) => i !== id));
        } else if (selected.length < 3) {
            setSelected([...selected, id]);
        }
    };

    const handleStartBattle = () => {
        navigation.navigate('battle/index', { playerTeam: selected });
    };

    const getPokemonIdFromUrl = (url: string): number => {
        const parts = url.split('/');
        return Number(parts[parts.length - 2]);
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-gray-900 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-white mt-4">Loading Pokémon...</Text>
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 bg-gray-900 items-center justify-center p-6">
                <Text className="text-red-400 text-center">
                    Failed to load Pokémon. Please check your connection.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-900 p-4">
            <Text className="text-white text-2xl font-bold text-center mb-4">
                Choose Your Team (3 Pokémon)
            </Text>

            <View className="mb-4">
                <TextInput
                    placeholder="Search Pokémon (e.g., pikachu)"
                    placeholderTextColor="#9CA3AF"
                    value={search}
                    onChangeText={setSearch}
                    className="w-full p-3 bg-gray-800 text-white rounded-lg"
                />
            </View>

            {selected.length > 0 && (
                <View className="mb-4 flex-row justify-center">
                    {selected.map((id) => (
                        <Image
                            key={id}
                            source={{
                                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                            }}
                            className="w-14 h-14 mx-1"
                        />
                    ))}
                </View>
            )}

            <FlatList
                data={filteredPokemon}
                keyExtractor={(item) => item.url}
                numColumns={3}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-24"
                renderItem={({ item }) => {
                    const id = getPokemonIdFromUrl(item.url);
                    const isSelected = selected.includes(id);
                    return (
                        <View className="w-1/3">
                            <TouchableOpacity
                                className={`m-2 items-center rounded-xl p-2   ${
                                    isSelected ? 'bg-blue-600' : 'bg-gray-800'
                                }`}
                                onPress={() => toggleSelect(id)}
                                disabled={selected.length >= 3 && !isSelected}
                            >
                                <Image
                                    source={{
                                        uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
                                    }}
                                    className="w-16 h-16"
                                />
                                <Text className="text-white text-xs mt-1 text-center capitalize">
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
            />

            <View className="absolute bottom-4 left-4 right-4">
                {/* <Link
                    href={{ pathname: '/battle/index', params: { selected } }}
                > */}
                <TouchableOpacity
                    disabled={selected.length !== 3}
                    onPress={handleStartBattle}
                    className={`py-3 rounded-lg ${
                        selected.length === 3
                            ? 'bg-green-600 active:bg-green-700'
                            : 'bg-gray-700 opacity-60'
                    }`}
                >
                    <Text className="text-white text-center font-bold text-lg">
                        Start Battle ({selected.length}/3)
                    </Text>
                </TouchableOpacity>
                {/* </Link> */}
            </View>
        </View>
    );
};

export default TeamSelectionScreen;
