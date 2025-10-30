// hooks/useQuizQuestions.ts
import {
    generatePokemonGuessQuestion,
    generateTypeMatchupQuestion,
} from '@/lib/quiz';
import { useQuery } from '@tanstack/react-query';

export const useRandomQuizQuestion = () => {
    return useQuery({
        queryKey: ['quiz-question', Date.now()], // new key = new question
        queryFn: async () => {
            const type = Math.random() > 0.5 ? 'type' : 'pokemon';
            if (type === 'type') {
                return generateTypeMatchupQuestion();
            } else {
                const randomId = Math.floor(Math.random() * 151) + 1;
                return generatePokemonGuessQuestion(randomId);
            }
        },
        staleTime: 0, // always fresh
    });
};
