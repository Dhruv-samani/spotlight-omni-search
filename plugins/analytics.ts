import { SpotlightPlugin } from '../types/plugin';

export interface AnalyticsOptions {
    onSearch?: (query: string) => void;
    onSelect?: (itemId: string, itemType: string) => void;
    storageKey?: string;
    enableSessionTracking?: boolean;
}

interface AnalyticsData {
    searches: Array<{ query: string; timestamp: number }>;
    selections: Array<{ itemId: string; itemType: string; timestamp: number }>;
    popularCommands: Record<string, number>; // itemId -> count
    sessionStart: number;
}

export const AnalyticsPlugin = (options: AnalyticsOptions = {}): SpotlightPlugin & { 
    exportData: (format?: 'json' | 'csv') => string;
    clearData: () => void;
    getPopularCommands: () => Array<{ id: string; count: number }>;
} => {
    const STORAGE_KEY = options.storageKey || 'spotlight_analytics';
    let sessionStart = Date.now();

    const loadData = (): AnalyticsData => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : { 
                searches: [], 
                selections: [], 
                popularCommands: {}, 
                sessionStart: Date.now() 
            };
        } catch {
            return { searches: [], selections: [], popularCommands: {}, sessionStart: Date.now() };
        }
    };

    const saveData = (data: AnalyticsData) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save analytics data', e);
        }
    };

    return {
        name: 'spotlight-analytics',
        version: '1.0.0',
        
        onInit: () => {
            if (options.enableSessionTracking) {
                const data = loadData();
                data.sessionStart = Date.now();
                saveData(data);
            }
        },

        onBeforeSearch: (query, items) => {
            if (query.trim().length > 1) { // Debounce/Min-length check ideally handled by caller
                options.onSearch?.(query);
                // Note: We don't store every keystroke in LS to avoid thrashing
            }
            return items;
        },

        onSelect: (item) => {
            options.onSelect?.(item.id, item.type);
            
            const data = loadData();
            
            // Track Selection
            data.selections.push({
                itemId: item.id,
                itemType: item.type,
                timestamp: Date.now()
            });

            // Track Popularity
            data.popularCommands[item.id] = (data.popularCommands[item.id] || 0) + 1;

            saveData(data);
        },

        // --- Export Utilities ---
        
        getPopularCommands: () => {
             const data = loadData();
             return Object.entries(data.popularCommands)
                .map(([id, count]) => ({ id, count }))
                .sort((a, b) => b.count - a.count);
        },

        exportData: (format = 'json') => {
            const data = loadData();
            if (format === 'json') {
                return JSON.stringify(data, null, 2);
            }
            // Simple CSV Export
            const header = 'Type,ID,Timestamp\n';
            const rows = data.selections.map(s => 
                `Selection,${s.itemId},${new Date(s.timestamp).toISOString()}`
            ).join('\n');
            return header + rows;
        },

        clearData: () => {
            localStorage.removeItem(STORAGE_KEY);
        }
    };
};
