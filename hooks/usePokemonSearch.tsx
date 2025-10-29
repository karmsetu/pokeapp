// hooks/usePokemonSearch.ts
import { POKE_API } from '@/constants';
import { useQuery } from '@tanstack/react-query';

// Get all types for filter
export function usePokemonTypes() {
    return useQuery({
        queryKey: ['pokemon-types'],
        queryFn: () => fetch(`${POKE_API}/type`).then((res) => res.json()),
    });
}

type PokemonSearchApiResponse = {
    count: number;
    next: string;
    previous: unknown;
    result: {
        name: string;
        url: string;
    }[];
};
// Search Pokémon
export function usePokemonSearch(search: string, type: string) {
    const enabled = search.length > 0 || type.length > 0;

    return useQuery({
        queryKey: ['pokemon-search', search, type],
        queryFn: async () => {
            if (type) {
                // Fetch Pokémon by type
                const res = await fetch(`${POKE_API}/type/${type}`);
                const data = await res.json();
                // Filter by name if search exists
                if (search) {
                    return data.pokemon
                        .filter((p: any) =>
                            p.pokemon.name
                                .toLowerCase()
                                .includes(search.toLowerCase())
                        )
                        .map((p: any) => p.pokemon);
                }
                return data.pokemon.map((p: any) => p.pokemon);
            } else {
                // Search all Pokémon (limited to first 1000)
                const res = await fetch(`${POKE_API}/pokemon?limit=1000`);
                const data = await res.json();
                // console.log({ pokemon: data });
                return data.results.filter((p: any) =>
                    p.name.toLowerCase().includes(search.toLowerCase())
                );
            }
        },
        enabled,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

type GetPokemonDetailAPIResponse = {
    id: number;
    name: string;
    sprites?: { front_default: string };
    types: { name: string }[];
    stats: [];
    height: number;
    weight: number;
};

export const getPokemonDetail = (id: string) => {
    return useQuery<GetPokemonDetailAPIResponse>({
        queryKey: ['pokemon', id],
        queryFn: async (): Promise<GetPokemonDetailAPIResponse> => {
            const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${id}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch Pokémon');
            }
            return response.json();
        },
        enabled: !!id, // Prevents query if id is 0/null/undefined
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};
