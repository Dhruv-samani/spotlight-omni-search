import { useMemo } from 'react';
import { fuzzyMatch } from '../lib/fuzzySearch';

interface UseCommandSearchProps {
    query: string;
    items: Map<string, { value: string; keywords?: string[]; ref: React.RefObject<HTMLElement | null> }>;
    shouldFilter?: boolean;
    filter?: (value: string, search: string, keywords?: string[]) => number;
    version?: number;
    shouldTrim?: boolean;
}

export function useCommandSearch({
    query,
    items,
    shouldFilter = true,
    filter,
    version = 0,
    shouldTrim = true,
}: UseCommandSearchProps) {
    return useMemo(() => {
        const startTime = performance.now();
        const normalizedQuery = shouldTrim ? query.trim() : query;
        
        if (!shouldFilter || !normalizedQuery) {
            return { ids: new Set(items.keys()), duration: 0 };
        }

        const ids = new Set<string>();

        items.forEach((item, id) => {
            let maxScore = 0;

            if (filter) {
                // Pass raw query to filter if not trimming
                maxScore = filter(item.value, query, item.keywords);
            } else {
                // ... default fuzzy search logic uses trimmed query usually
                // But fuzzyMatch handles spaces? Let's assume normalizedQuery for default logic
                const search = normalizedQuery;
                
                if (item.keywords && item.keywords.length > 0) {
                    for (const keyword of item.keywords) {
                        const result = fuzzyMatch(search, keyword);
                        if (result && result.score > maxScore) {
                            maxScore = result.score;
                        }
                    }
                } else {
                    const result = fuzzyMatch(search, item.value);
                    if (result && result.score > maxScore) {
                        maxScore = result.score;
                    }
                }
            }

            if (maxScore > 0) {
                ids.add(id);
            }
        });

        const endTime = performance.now();
        return { ids, duration: endTime - startTime };
    }, [query, items, shouldFilter, filter, version, shouldTrim]);
}
