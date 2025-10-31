import { Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
const battle = () => {
    return (
        <View className="flex-1 bg-gray-50 justify-center items-center p-6 mt-10">
            <View className="bg-white rounded-2xl p-8 w-full max-w-md items-center ">
                <Text className="text-2xl font-bold mb-2">Pokémon Battle</Text>
                {/* <Text className="text-gray-600 text-center mb-6">
                    Test your Pokémon knowledge! Types, names, stats & more.
                </Text> */}
                <Link href="/battle/select" asChild>
                    <TouchableOpacity className="bg-purple-500 py-3 px-8 rounded-full">
                        <Text className="text-white text-lg font-semibold">
                            begin!
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
};
export default battle;
