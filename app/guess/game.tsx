// app/guess/game.tsx
import { useWinStreak } from '@/contexts/WinStreakContext';
import MaskedView from '@react-native-masked-view/masked-view';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MotiImage, MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// Fetch a random Pokémon (ID 1–151 for simplicity)
const useRandomPokemon = () => {
    const randomId = Math.floor(Math.random() * 151) + 1;

    return useQuery({
        queryKey: ['random-pokemon', randomId],
        queryFn: () =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`).then((res) =>
                res.json()
            ),
        staleTime: 1000 * 60, // 1 minute
    });
};

export default function GuessGameScreen() {
    const router = useRouter();
    const { data: pokemon, isLoading, isError } = useRandomPokemon();
    console.log({ pokemon });
    const [guess, setGuess] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const { incrementStreak, resetStreak } = useWinStreak();

    useEffect(() => {
        if (pokemon) {
            setGuess('');
            setSubmitted(false);
            setIsCorrect(false);
        }
    }, [pokemon]);

    const handleGuess = () => {
        if (!pokemon || !guess.trim()) return;

        const userGuess = guess.trim().toLowerCase();
        const correctName = pokemon.name.toLowerCase();
        const isRight = userGuess === correctName;

        setIsCorrect(isRight);
        setSubmitted(true);

        if (isRight) {
            incrementStreak();
        } else {
            resetStreak();
        }

        // if (!isRight) {
        //     Alert.alert('Incorrect!', `It was ${pokemon.name}! Try again.`);
        // }
    };

    const nextPokemon = () => {
        router.replace('/guess/game'); // Reloads the screen → new random Pokémon
    };

    const goBack = () => {
        router.back();
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-gray-600">Loading Pokémon...</Text>
            </View>
        );
    }

    if (isError || !pokemon) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center p-6">
                <Text className="text-red-500 text-center mb-4">
                    Failed to load Pokémon.
                </Text>
                <TouchableOpacity
                    onPress={nextPokemon}
                    className="bg-blue-500 py-2 px-6 rounded-full"
                >
                    <Text className="text-white">Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50 p-4">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
                <TouchableOpacity onPress={goBack}>
                    <Text className="text-blue-500 font-medium">← Back</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-gray-800">
                    Guess the Pokémon
                </Text>
                <View className="w-12" />
            </View>

            {/* Silhouette / Blurred Sprite */}
            <View className="flex-1 justify-center items-center mb-6">
                {pokemon.sprites?.front_default ? (
                    <View className="w-48 h-48 rounded-2xl justify-center items-center overflow-hidden bg-gray-200">
                        {/* Show silhouette until submitted & correct */}
                        {!submitted ? (
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'timing', duration: 500 }}
                            >
                                <PokemonSilhouette
                                    spriteUri={pokemon.sprites.front_default}
                                />
                            </MotiView>
                        ) : (
                            <MotiImage
                                from={{
                                    opacity: 0,
                                    scale: 0.9,
                                    rotate: '10deg',
                                }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    rotate: '0deg',
                                }}
                                transition={{ type: 'spring', duration: 600 }}
                                source={{ uri: pokemon.sprites.front_default }}
                                style={{ width: 150, height: 150 }}
                            />
                        )}
                    </View>
                ) : (
                    <View className="w-48 h-48 bg-gray-800 rounded-2xl justify-center items-center">
                        <Text className="text-white text-opacity-80">???</Text>
                    </View>
                )}
            </View>

            {/* Input & Submit */}
            {!submitted ? (
                <View className="gap-3">
                    <TextInput
                        className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800"
                        placeholder="Enter Pokémon name..."
                        value={guess}
                        onChangeText={setGuess}
                        onSubmitEditing={handleGuess}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                    />
                    <TouchableOpacity
                        onPress={handleGuess}
                        className="bg-blue-500 py-3 rounded-xl"
                    >
                        <Text className="text-white text-center font-medium">
                            Submit Guess
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="gap-4">
                    {isCorrect ? (
                        <View className="bg-green-100 border border-green-300 rounded-xl p-4">
                            <Text className="text-green-800 text-center font-bold text-lg">
                                🎉 Correct! It's {pokemon.name}!
                            </Text>
                        </View>
                    ) : (
                        <View className="bg-red-100 border border-red-300 rounded-xl p-4">
                            <Text className="text-red-800 text-center">
                                ❌ It was{' '}
                                <Text className="font-bold">
                                    {pokemon.name}
                                </Text>
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={nextPokemon}
                        className="bg-gray-800 py-3 rounded-xl"
                    >
                        <Text className="text-white text-center font-medium">
                            {isCorrect ? 'Next Pokémon' : 'Try Another'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const PokemonSilhouette = ({ spriteUri }: { spriteUri: string }) => {
    return (
        <MaskedView
            style={{ width: 150, height: 150 }}
            maskElement={
                <Image
                    source={{ uri: spriteUri }}
                    style={{ width: 150, height: 150 }}
                    contentFit="contain"
                />
            }
        >
            <View style={{ flex: 1, backgroundColor: 'black' }} />
        </MaskedView>
    );
};
