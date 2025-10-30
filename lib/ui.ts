export const getWinStreakColor = (
    streakCount: number
): { text: string; bg: string } => {
    if (streakCount <= 0) {
        return { text: 'text-gray-700', bg: 'bg-gray-200' };
    }
    if (streakCount <= 2) {
        return { text: 'text-emerald-700', bg: 'bg-emerald-100' };
    }
    if (streakCount <= 5) {
        return { text: 'text-amber-700', bg: 'bg-amber-100' };
    }
    if (streakCount <= 10) {
        return { text: 'text-orange-700', bg: 'bg-orange-100' };
    }
    if (streakCount <= 20) {
        return { text: 'text-red-700', bg: 'bg-red-100' };
    }
    return { text: 'text-white', bg: 'bg-yellow-400' };
};
