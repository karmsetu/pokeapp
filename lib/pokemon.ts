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

// src/utils/pokemon.ts
export interface MoveWithPower {
    name: string;
    power: number;
    type: string;
}

export interface BattlePokemon {
    id: number;
    name: string;
    hp: number;
    maxHp: number;
    attack: number;
    defense: number;
    speed: number;
    moves: MoveWithPower[];
    spriteFront: string;
    spriteBack: string;
}

// Fallback move powers (expand as needed)
export const KNOWN_MOVE_POWERS: Record<string, number> = {
    tackle: 40,
    ember: 40,
    waterGun: 50,
    vineWhip: 45,
    thunderShock: 40,
    scratch: 40,
    bite: 60,
    flamethrower: 90,
    hydroPump: 110,
    thunderbolt: 90,
    psychic: 90,
    iceBeam: 90,
    quickAttack: 40,
    wingAttack: 60,
    megakick: 120,
    // Add more as needed
};

export const normalizeMoveName = (name: string): string => {
    return name.toLowerCase().replace(/[^a-z]/g, '');
};
