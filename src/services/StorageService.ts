export interface DailyStats {
    date: string;
    lunchProtein: boolean | null;
    noCarbs: boolean | null;
    waterCount: number;
    sodaCount: number;
    workoutCompleted: boolean;
    measurements?: {
        weight: number;
        waist: number;
    };
}

const STORAGE_KEY = 'spartan_daily_stats_v2';
const HISTORY_KEY = 'spartan_history';

export const StorageService = {
    getStats: (): DailyStats => {
        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            const parsed = JSON.parse(saved) as DailyStats;
            if (parsed.date === today) {
                return parsed;
            } else {
                // Save previous day to history before resetting
                StorageService.saveToHistory(parsed);
            }
        }

        return {
            date: today,
            lunchProtein: null,
            noCarbs: null,
            waterCount: 0,
            sodaCount: 0,
            workoutCompleted: false
        };
    },

    saveStats: (stats: DailyStats) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    },

    saveToHistory: (stats: DailyStats) => {
        const history = StorageService.getHistory();
        const updatedHistory = [stats, ...history].slice(0, 30); // Keep last 30 days
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    },

    getHistory: (): DailyStats[] => {
        const saved = localStorage.getItem(HISTORY_KEY);
        return saved ? JSON.parse(saved) : [];
    },

    getStreak: (): number => {
        const history = StorageService.getHistory();
        const today = StorageService.getStats();
        let streak = 0;

        // Check today first
        const isTodayDone = today.lunchProtein && today.noCarbs && today.workoutCompleted;
        if (isTodayDone) streak++;

        for (const day of history) {
            if (day.lunchProtein && day.noCarbs && day.workoutCompleted) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
};
