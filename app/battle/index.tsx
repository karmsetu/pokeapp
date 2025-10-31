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
        (acc: Record<string, number>, s: any) => ({
            ...acc,
            [s.stat.name]: s.base_stat,
        }),
        {}
    );

    // Extract up to 8 moves, then filter to those with known power
    const validMoves = data.moves
        .map((m: any) => {
            const name = m.move.name;
            const normalized = normalizeMoveName(name);
            const power = KNOWN_MOVE_POWERS[normalized] || null;
            return { name, power, type: name.split('-')[0] };
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

type Player = {
    name: string;
    attack: number;
    defense: number;
    spriteBack: string;
    spriteFront: string;
    hp: number;
    moves: { name: string; power: number }[];
};

const BattleScreen = () => {
    const router = useRouter();
    const route = useRoute();
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
        queryFn: () => Promise.all(allIds.map(fetchPokemon)),
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

    const playerActive = allPokemon?.[playerIndex] as Player;
    const opponentActive = allPokemon?.[3 + opponentIndex] as Player; // opponent starts at index 3

    const calculateDamage = (atk: number, def: number, power: number) => {
        return Math.max(
            1,
            Math.floor((((2 * 50) / 5 + 2) * power * (atk / def)) / 50 + 2)
        );
    };

    const hpColor = (hp: number, max: number) => {
        const pct = hp / max;
        if (pct > 0.6) return '#22C55E'; // green
        if (pct > 0.3) return '#EAB308'; // yellow
        return '#EF4444'; // red
    };

    const handlePlayerMove = (move: any) => {
        if (!isPlayerTurn || isProcessing) return;
        setIsProcessing(true);
        setBattleLog((l) => [...l, `${playerActive.name} used ${move.name}!`]);

        const dmg = calculateDamage(
            playerActive.attack,
            opponentActive.defense,
            move.power
        );
        const newHp = Math.max(0, opponentCurrentHp - dmg);
        setOpponentCurrentHp(newHp);

        setTimeout(() => {
            if (newHp <= 0) {
                setBattleLog((l) => [...l, `${opponentActive.name} fainted!`]);
                if (opponentIndex < 2) {
                    const next = allPokemon[3 + opponentIndex + 1];
                    setOpponentIndex(opponentIndex + 1);
                    setOpponentCurrentHp(next.hp);
                    setBattleLog((l) => [...l, `Wild ${next.name} appeared!`]);
                } else {
                    Alert.alert('Victory!', 'You defeated all opponents!', [
                        { text: 'OK' },
                    ]);
                    router.push('/(tabs)/battle');
                }
            } else {
                setIsPlayerTurn(false);
                setTimeout(handleAiMove, 800);
            }
            setIsProcessing(false);
        }, 600);
    };

    const handleAiMove = () => {
        const move =
            opponentActive.moves[
                Math.floor(Math.random() * opponentActive.moves.length)
            ];
        setBattleLog((l) => [
            ...l,
            `Wild ${opponentActive.name} used ${move.name}!`,
        ]);

        const dmg = calculateDamage(
            opponentActive.attack,
            playerActive.defense,
            move.power
        );
        const newHp = Math.max(0, playerCurrentHp - dmg);
        setPlayerCurrentHp(newHp);

        setTimeout(() => {
            if (newHp <= 0) {
                setBattleLog((l) => [...l, `${playerActive.name} fainted!`]);
                if (playerIndex < 2) {
                    const next = allPokemon[playerIndex + 1];
                    setPlayerIndex(playerIndex + 1);
                    setPlayerCurrentHp(next.hp);
                    setBattleLog((l) => [...l, `Go, ${next.name}!`]);
                } else {
                    Alert.alert('Defeat!', 'All your Pokémon fainted!', [
                        { text: 'OK' },
                    ]);
                    router.push('/(tabs)/battle');
                }
            } else setIsPlayerTurn(true);
        }, 600);
    };

    if (isLoading)
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <ActivityIndicator color="#3B82F6" size="large" />
                <Text className="text-white mt-4">Loading battle...</Text>
            </View>
        );

    if (isError)
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <Text className="text-red-400">Failed to load Pokémon.</Text>
            </View>
        );

    return (
        <View className="flex-1  p-4 dark:bg-dark-background">
            {/* Log */}
            <View className=" bg-black/40 p-3 rounded-xl border border-white/10 min-h-48">
                {battleLog.slice(-2).map((msg, i) => (
                    <Text key={i} className="text-yellow-200 text-sm mb-1">
                        {msg}
                    </Text>
                ))}
            </View>

            <View className="">
                {/* Opponent */}
                <View className="items-end mt-6">
                    <View className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg mb-2">
                        <Text className="text-white font-bold capitalize">
                            {opponentActive.name}
                        </Text>
                        <View className="h-2 w-40 bg-white/20 rounded-full mt-1">
                            <View
                                className="h-full rounded-full"
                                style={{
                                    backgroundColor: hpColor(
                                        opponentCurrentHp,
                                        opponentActive.hp
                                    ),
                                    width: `${(opponentCurrentHp / opponentActive.hp) * 100}%`,
                                }}
                            />
                        </View>
                    </View>
                    <Image
                        source={{ uri: opponentActive.spriteFront }}
                        className="w-36 h-36"
                    />
                </View>

                {/* Player */}
                <View className="">
                    <Image
                        source={{ uri: playerActive.spriteBack }}
                        className="w-36 h-36"
                    />
                    <View className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg mt-2">
                        <Text className="text-white font-bold capitalize">
                            {playerActive.name}
                        </Text>
                        <View className="h-2 w-40 bg-white/20 rounded-full mt-1">
                            <View
                                className="h-full rounded-full"
                                style={{
                                    backgroundColor: hpColor(
                                        playerCurrentHp,
                                        playerActive.hp
                                    ),
                                    width: `${(playerCurrentHp / playerActive.hp) * 100}%`,
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>

            {/* Moves */}
            <View className="absolute bottom-6 left-4 right-4 bg-black/60 rounded-2xl p-4 border border-white/10">
                <Text className="text-white text-center font-semibold mb-3">
                    Choose a move:
                </Text>
                <View className="flex-row flex-wrap justify-between">
                    {playerActive.moves.map((m, i) => (
                        <TouchableOpacity
                            key={i}
                            disabled={!isPlayerTurn || isProcessing}
                            onPress={() => handlePlayerMove(m)}
                            className={`w-[48%] py-3 my-1 rounded-lg items-center ${
                                isPlayerTurn && !isProcessing
                                    ? 'bg-blue-500 active:bg-blue-600'
                                    : 'bg-gray-600 opacity-50'
                            }`}
                        >
                            <Text className="text-white capitalize font-semibold">
                                {m.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

export default BattleScreen;
