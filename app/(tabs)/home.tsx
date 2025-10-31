import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

const fetchPokemon = async (id: number) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return res.json();
};

export default function HomeScreen() {
    const randomId = Math.floor(Math.random() * 151) + 1; // Gen 1 Pokémon
    const { data: pokemon, isLoading } = useQuery({
        queryKey: ['featured', randomId],
        queryFn: () => fetchPokemon(randomId),
    });

    const features = [
        { label: 'Search Pokémon', icon: '🔍', link: '/pokedex' },
        { label: 'Explore Types', icon: '✨', link: '/types' },
        { label: 'Guess Game', icon: '🧠', link: '/guess/index' },
        { label: 'Battle', icon: '⚔️', link: '/battle/index' },
    ] as {
        label: string;
        icon: string;
        link: '/pokedex' | '/types' | '/(tabs)/pokedex' | '/(tabs)/types';
    }[];

    return (
        <View className="flex-1 bg-gray-50 p-4 mt-12">
            {/* Header */}
            <View className=" flex justify-between flex-row p-2">
                <Text className="text-2xl font-extrabold text-gray-800 mb-4">
                    Pokédex Hub
                </Text>

                <Link href={'/settings'}>
                    <Ionicons name="settings-outline" size={32} color="black" />
                </Link>
            </View>

            {/* Featured Pokémon */}
            <View className="bg-white rounded-2xl p-4 items-center mb-6 shadow-sm border border-gray-100">
                <Text className="text-lg font-bold text-gray-500">
                    {' '}
                    Today's feature pokemon
                </Text>
                {isLoading ? (
                    <Text className="text-gray-600">Loading Pokémon...</Text>
                ) : pokemon ? (
                    <>
                        <Image
                            source={{ uri: pokemon.sprites.front_default }}
                            style={{ width: 120, height: 120 }}
                        />
                        <Text className="text-xl capitalize font-semibold mt-2">
                            {pokemon.name}
                        </Text>
                        <View className="flex-row mt-1">
                            {pokemon.types.map((t: any) => (
                                <View
                                    key={t.type.name}
                                    className="px-3 py-1 rounded-full mx-1"
                                    style={{
                                        backgroundColor:
                                            t.type.name === 'fire'
                                                ? '#F08030'
                                                : t.type.name === 'water'
                                                  ? '#6890F0'
                                                  : '#A8A878',
                                    }}
                                >
                                    <Text className="text-white text-xs font-medium">
                                        {t.type.name}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <Text> hmm...</Text>
                )}
            </View>

            {/* Quick Access Grid */}
            <FlatList
                data={features}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                keyExtractor={(item) => item.label}
                renderItem={({ item }) => (
                    <Link href={{ pathname: item.link }} asChild>
                        <TouchableOpacity
                            className="bg-white p-4 rounded-2xl flex-1 mx-1 mb-4 items-center shadow-sm border border-gray-100"
                            activeOpacity={0.8}
                        >
                            <Text className="text-3xl mb-2">{item.icon}</Text>
                            <Text className="font-medium text-gray-700 text-center">
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    </Link>
                )}
            />
        </View>
    );
}
