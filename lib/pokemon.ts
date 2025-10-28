// lib/pokemon.ts
export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: { type: { name: string } }[];
    sprites: {
        front_default: string;
        other?: {
            'official-artwork'?: { front_default: string };
        };
    };
    stats: { base_stat: number; stat: { name: string } }[];
}

export interface PokemonSpecies {
    flavor_text_entries: { flavor_text: string; language: { name: string } }[];
    genera: { genus: string; language: { name: string } }[];
}
