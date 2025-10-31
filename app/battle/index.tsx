// screens/BattleScreen.tsx
import {
    BattlePokemon,
    KNOWN_MOVE_POWERS,
    normalizeMoveName,
} from '@/lib/pokemon';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Fetch full Pokémon data
const fetchPokemon = async (id: number): Promise<BattlePokemon> => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch Pokémon ${id}`);
    const data = await res.json();

    const stats = data.stats.reduce(
        (acc: Record<string, number>, statObj: any) => {
            acc[statObj.stat.name] = statObj.base_stat;
            return acc;
        },
        {}
    );

    // Extract up to 8 moves, then filter to those with known power
    const validMoves = data.moves
        .map((m: any) => {
            const rawName = m.move.name;
            const normalizedName = normalizeMoveName(rawName);
            const power = KNOWN_MOVE_POWERS[normalizedName] || null;
            return {
                name: rawName,
                power,
                type: m.move.name.split('-')[0] || 'normal',
            };
        })
        .filter((m: any) => m.power !== null)
        .slice(0, 4);

    // If no valid moves, fallback to Tackle
    if (validMoves.length === 0) {
        validMoves.push({ name: 'tackle', power: 40, type: 'normal' });
    }

    return {
        id: data.id,
        name: data.name,
        hp: stats.hp,
        maxHp: stats.hp,
        attack: stats.attack,
        defense: stats.defense,
        speed: stats.speed,
        moves: validMoves,
        spriteFront: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
        spriteBack: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${data.id}.png`,
    };
};

interface NavigationProp {
    navigate: (screen: string, params?: any) => void;
}

const BattleScreen = () => {
    const router = useRouter();

    const route = useRoute(); // Access the route object
    const { playerTeam } = route.params as { playerTeam: number[] };
    const [opponentTeam] = useState<number[]>(
        Array.from({ length: 3 }, () => Math.floor(Math.random() * 151) + 1)
    );

    const allIds = [...playerTeam, ...opponentTeam];

    // Fetch all 6 Pokémon in parallel
    const {
        data: allPokemon,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['battle-pokemon', allIds],
        queryFn: () => Promise.all(allIds.map((id) => fetchPokemon(id))),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });

    // Battle state
    const [playerIndex, setPlayerIndex] = useState(0);
    const [opponentIndex, setOpponentIndex] = useState(0);
    const [playerCurrentHp, setPlayerCurrentHp] = useState(0);
    const [opponentCurrentHp, setOpponentCurrentHp] = useState(0);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [battleLog, setBattleLog] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Initialize HP when data loads
    useEffect(() => {
        if (allPokemon && allPokemon.length === 6) {
            setPlayerCurrentHp(allPokemon[0].hp);
            setOpponentCurrentHp(allPokemon[3].hp);
        }
    }, [allPokemon]);

    const playerActive = allPokemon?.[playerIndex];
    const opponentActive = allPokemon?.[3 + opponentIndex]; // opponent starts at index 3

    const calculateDamage = (
        attack: number,
        defense: number,
        power: number
    ): number => {
        // Simplified damage formula
        const damage = Math.floor(
            (((2 * 50) / 5 + 2) * power * (attack / defense)) / 50 + 2
        );
        return Math.max(1, damage); // min 1 damage
    };

    const handlePlayerMove = (move: { name: string; power: number }) => {
        if (!isPlayerTurn || isProcessing || !playerActive || !opponentActive)
            return;

        setIsProcessing(true);
        const logMsg = `${playerActive.name} used ${move.name}!`;
        setBattleLog((prev) => [...prev, logMsg]);

        const damage = calculateDamage(
            playerActive.attack,
            opponentActive.defense,
            move.power
        );
        const newOpponentHp = Math.max(0, opponentCurrentHp - damage);
        setOpponentCurrentHp(newOpponentHp);

        setTimeout(() => {
            if (newOpponentHp <= 0) {
                const faintMsg = `${opponentActive.name} fainted!`;
                setBattleLog((prev) => [...prev, faintMsg]);
                if (opponentIndex < 2) {
                    // Switch to next opponent
                    const nextOpponent = allPokemon![3 + opponentIndex + 1];
                    setOpponentIndex(opponentIndex + 1);
                    setOpponentCurrentHp(nextOpponent.hp);
                    setBattleLog((prev) => [
                        ...prev,
                        `Wild ${nextOpponent.name} appeared!`,
                    ]);
                    setIsPlayerTurn(true);
                } else {
                    // Player wins
                    Alert.alert('Victory!', 'You won the battle!', [
                        { text: 'OK' },
                    ]);

                    router.push('/(tabs)/battle');
                }
            } else {
                // AI turn
                setIsPlayerTurn(false);
                setTimeout(handleAiMove, 800);
            }
            setIsProcessing(false);
        }, 600);
    };

    const handleAiMove = () => {
        if (!opponentActive || !playerActive) return;

        const randomMove =
            opponentActive.moves[
                Math.floor(Math.random() * opponentActive.moves.length)
            ];
        const logMsg = `Wild ${opponentActive.name} used ${randomMove.name}!`;
        setBattleLog((prev) => [...prev, logMsg]);

        const damage = calculateDamage(
            opponentActive.attack,
            playerActive.defense,
            randomMove.power
        );
        const newPlayerHp = Math.max(0, playerCurrentHp - damage);
        setPlayerCurrentHp(newPlayerHp);

        setTimeout(() => {
            if (newPlayerHp <= 0) {
                const faintMsg = `${playerActive.name} fainted!`;
                setBattleLog((prev) => [...prev, faintMsg]);
                if (playerIndex < 2) {
                    const nextPlayer = allPokemon![playerIndex + 1];
                    setPlayerIndex(playerIndex + 1);
                    setPlayerCurrentHp(nextPlayer.hp);
                    setBattleLog((prev) => [
                        ...prev,
                        `Go, ${nextPlayer.name}!`,
                    ]);
                    setIsPlayerTurn(true);
                } else {
                    Alert.alert('Defeat!', 'All your Pokémon fainted!', [
                        { text: 'OK' },
                    ]);
                    return;
                }
            } else {
                setIsPlayerTurn(true);
            }
        }, 600);
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-gray-900 items-center justify-center">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="text-white mt-4">Loading battle...</Text>
            </View>
        );
    }

    if (isError || !allPokemon || allPokemon.length !== 6) {
        return (
            <View className="flex-1 bg-gray-900 items-center justify-center p-6">
                <Text className="text-red-400 text-center">
                    Failed to load battle data.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-900 p-4">
            {/* Opponent */}
            <View className="items-end mb-8">
                <Image
                    source={{ uri: opponentActive.spriteFront }}
                    className="w-32 h-32"
                />
                <View className="mt-2 w-48">
                    <Text className="text-white font-bold">
                        {opponentActive.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <View className="w-32 h-3 bg-gray-700 rounded-full">
                            <View
                                className="h-full bg-red-500 rounded-full"
                                style={{
                                    width: `${(opponentCurrentHp / opponentActive.hp) * 100}%`,
                                }}
                            />
                        </View>
                        <Text className="text-white text-xs ml-2">
                            {opponentCurrentHp} / {opponentActive.hp}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Battle Log (last 2 messages) */}
            <View className="h-16 mb-4 justify-end">
                {battleLog.slice(-2).map((msg, i) => (
                    <Text key={i} className="text-yellow-300 text-sm">
                        {msg}
                    </Text>
                ))}
            </View>

            {/* Player */}
            <View className="items-start mt-auto">
                <Image
                    source={{ uri: playerActive.spriteBack }}
                    className="w-32 h-32"
                />
                <View className="mt-2 w-48">
                    <Text className="text-white font-bold">
                        {playerActive.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <View className="w-32 h-3 bg-gray-700 rounded-full">
                            <View
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                    width: `${(playerCurrentHp / playerActive.hp) * 100}%`,
                                }}
                            />
                        </View>
                        <Text className="text-white text-xs ml-2">
                            {playerCurrentHp} / {playerActive.hp}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Moves */}
            <View className="mt-4 flex-row flex-wrap justify-between">
                {playerActive.moves.map((move, i) => (
                    <TouchableOpacity
                        key={i}
                        disabled={!isPlayerTurn || isProcessing}
                        onPress={() => handlePlayerMove(move)}
                        className={`w-[48%] p-3 my-1 rounded-lg ${
                            isPlayerTurn && !isProcessing
                                ? 'bg-blue-600 active:bg-blue-700'
                                : 'bg-gray-800 opacity-60'
                        }`}
                    >
                        <Text className="text-white text-center capitalize">
                            {move.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default BattleScreen;
