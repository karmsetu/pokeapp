// lib/quiz.ts
export type QuestionType = 'type-matchup' | 'pokemon-guess';

export interface QuizQuestion {
    id: string;
    type: QuestionType;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

// Generate a random type matchup question
export const generateTypeMatchupQuestion = (): QuizQuestion => {
    const types = [
        'normal',
        'fire',
        'water',
        'electric',
        'grass',
        'ice',
        'fighting',
        'poison',
        'ground',
        'flying',
        'psychic',
        'bug',
        'rock',
        'ghost',
        'dragon',
        'dark',
        'steel',
        'fairy',
    ];

    const attacker = types[Math.floor(Math.random() * types.length)];
    const defender = types[Math.floor(Math.random() * types.length)];

    // Simplified: just ask "What is super effective against X?"
    const question = `Which type is super effective against ${defender}?`;

    // For demo: use hardcoded answers (you can expand later)
    const correctMap: Record<string, string> = {
        water: 'grass',
        fire: 'water',
        grass: 'fire',
        ground: 'water',
        rock: 'water',
        // Add more as needed
    };

    const correct = correctMap[defender] || 'normal';
    const wrongOptions = types
        .filter((t) => t !== correct)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    const options = [correct, ...wrongOptions].sort(() => 0.5 - Math.random());

    return {
        id: `type-${Date.now()}`,
        type: 'type-matchup',
        question,
        options,
        correctAnswer: correct,
        explanation: `${correct} is super effective against ${defender}!`,
    };
};

// Generate "Guess Pokémon" question
export const generatePokemonGuessQuestion = async (
    id: number
): Promise<QuizQuestion> => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();

    const name = data.name;
    const sprite = data.sprites.front_default;

    // Get 3 random wrong names
    const allIds = Array.from({ length: 151 }, (_, i) => i + 1).filter(
        (i) => i !== id
    );
    const wrongIds = allIds.sort(() => 0.5 - Math.random()).slice(0, 3);
    const wrongNames = await Promise.all(
        wrongIds.map(async (i) => {
            const r = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
            const d = await r.json();
            return d.name;
        })
    );

    const options = [name, ...wrongNames].sort(() => 0.5 - Math.random());

    return {
        id: `pokemon-${id}`,
        type: 'pokemon-guess',
        question: 'Which Pokémon is this?',
        options,
        correctAnswer: name,
        // sprite can be passed separately
    };
};
