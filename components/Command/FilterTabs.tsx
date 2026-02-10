import React, { useMemo } from 'react';
import { cn } from '../../lib/utils';
import { useCommand } from './CommandContext';
import { SpotlightItem } from '../../types';

interface FilterTabsProps {
    allItems: SpotlightItem[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function FilterTabs({ allItems, activeTab, setActiveTab }: FilterTabsProps) {
    const { filteredIds } = useCommand();

    // Calculate tabs based on items that match the current search filter
    const tabs = useMemo(() => {
        const t = new Map<string, number>();

        allItems.forEach(item => {
            // Only count items that pass the Command's filter
            if (!filteredIds || filteredIds.has(item.id)) {
                const groupName = item.group || 'Other';
                t.set(groupName, (t.get(groupName) || 0) + 1);
            }
        });

        return t;
    }, [allItems, filteredIds]);

    return (
        <div className="flex items-center gap-1 px-2 py-2 border-b border-border bg-muted/20 shrink-0 overflow-x-auto no-scrollbar">
            <button
                onClick={() => setActiveTab('all')}
                className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap",
                    activeTab === 'all'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
            >
                All
            </button>
            {Array.from(tabs.entries()).map(([tab, count]) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                        "px-2.5 py-1 text-xs font-medium rounded-sm transition-colors whitespace-nowrap flex items-center gap-1.5",
                        activeTab === tab
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                >
                    {tab}
                    <span className={cn(
                        "text-[10px] px-1 rounded-full",
                        activeTab === tab ? "bg-primary-foreground/20" : "bg-muted-foreground/10"
                    )}>
                        {count}
                    </span>
                </button>
            ))}
        </div>
    );
}
