// hooks/usePokeAPI.ts
import { POKE_API } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { Pokemon, PokemonSpecies } from '../lib/pokemon';

export const usePokemon = (id: number) => {
    return useQuery<Pokemon>({
        queryKey: ['pokemon', id],
        queryFn: () =>
            fetch(`${POKE_API}/pokemon/${id}`).then((res) => res.json()),
    });
};

export const usePokemonSpecies = (id: number) => {
    return useQuery<PokemonSpecies>({
        queryKey: ['species', id],
        queryFn: () =>
            fetch(`${POKE_API}/pokemon-species/${id}`).then((res) =>
                res.json()
            ),
    });
};

export const usePokemonList = (limit = 151, offset = 0) => {
    return useQuery({
        queryKey: ['pokemon-list', limit, offset],
        queryFn: () =>
            fetch(`${POKE_API}/pokemon?limit=${limit}&offset=${offset}`).then(
                (res) => res.json()
            ),
    });
};
