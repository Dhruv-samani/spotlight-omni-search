import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from './lib/utils';
import { SpotlightItem, SpotlightProps } from './types';
import { fuzzyFilter } from './lib/fuzzySearch';
import { useRecentItems } from './hooks/useRecentItems';

export function Spotlight({
    isOpen,
    onClose,
    items,
    onNavigate,
    searchPlaceholder = 'Search pages, actions, commands...',
    enableRecent = true,
    maxRecentItems = 10,
    isLoading = false,
    renderItem,
}: SpotlightProps) {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Recent items tracking
    const { recentItems, addRecentItem } = useRecentItems({
        enabled: enableRecent,
        maxItems: maxRecentItems,
    });

    // Filter and Sort items using fuzzy search
    const filteredItems = useMemo(() => {
        if (!query.trim()) {
            // No query - show recent items first, then all items
            if (enableRecent && recentItems.length > 0) {
                // Get recent item IDs
                const recentIds = new Set(recentItems.map(r => r.id));
                // Filter out recent items from main list
                const nonRecentItems = items.filter(item => !recentIds.has(item.id));
                // Combine: recent first, then rest sorted by group
                const sortedNonRecent = [...nonRecentItems].sort((a, b) => {
                    const groupA = a.group || 'Other';
                    const groupB = b.group || 'Other';
                    if (groupA === groupB) return 0;
                    return groupA.localeCompare(groupB);
                });
                return [...recentItems, ...sortedNonRecent];
            }
            // No recent items - return all items sorted by group
            return [...items].sort((a, b) => {
                const groupA = a.group || 'Other';
                const groupB = b.group || 'Other';
                if (groupA === groupB) return 0;
                return groupA.localeCompare(groupB);
            });
        }

        // Use fuzzy search for filtering and sorting
        return fuzzyFilter(items, query);
    }, [query, items, enableRecent, recentItems]);

    // Reset state when opened
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);

            // Immediate scroll reset
            if (listRef.current) {
                listRef.current.scrollTop = 0;
            }

            setTimeout(() => {
                inputRef.current?.focus();
                // Reset scroll position to top again after DOM updates
                if (listRef.current) {
                    listRef.current.scrollTop = 0;
                }
            }, 50);

            // Final scroll reset after render
            setTimeout(() => {
                if (listRef.current) {
                    listRef.current.scrollTop = 0;
                }
            }, 150);
        }
    }, [isOpen]);



    // Reset selection when list changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [filteredItems]);

    // Handle Action Execution
    const executeItem = (item: SpotlightItem) => {

        // Track in recent items
        addRecentItem(item);

        if (item.action) {
            item.action();
            onClose();
        } else if (item.route) {
            onNavigate(item.route);
            onClose();
        }
    };

    // Keyboard Navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev < filteredItems.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) =>
                prev > 0 ? prev - 1 : 0
            );
        } else if (e.key === 'PageDown') {
            e.preventDefault();
            setSelectedIndex((prev) =>
                Math.min(prev + 5, filteredItems.length - 1)
            );
        } else if (e.key === 'PageUp') {
            e.preventDefault();
            setSelectedIndex((prev) =>
                Math.max(prev - 5, 0)
            );
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const selectedItem = filteredItems[selectedIndex];
            if (selectedItem && selectedIndex >= 0 && selectedIndex < filteredItems.length) {
                executeItem(selectedItem);
            }
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    // Scroll into view
    useEffect(() => {
        if (listRef.current && filteredItems.length > 0) {
            const buttons = listRef.current.querySelectorAll('button[data-spotlight-item]');
            const selectedEl = buttons[selectedIndex] as HTMLElement;
            if (selectedEl) {
                // For the first item, scroll to start to ensure it's visible at the top
                // For other items, use 'nearest' for smooth scrolling
                selectedEl.scrollIntoView({
                    block: selectedIndex === 0 ? 'start' : 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [selectedIndex, filteredItems]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-2 sm:pt-[10vh] lg:pt-[15vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Content */}
            <div className="relative w-full max-w-[96vw] sm:max-w-xl lg:max-w-2xl xl:max-w-3xl bg-popover text-foreground rounded-xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Search Bar */}
                <div className="flex items-center px-4 border-b border-border h-14">
                    <Search className="w-5 h-5 text-muted-foreground mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 h-full bg-transparent border-none outline-none text-foreground placeholder-muted-foreground text-sm"
                        placeholder={searchPlaceholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex items-center gap-2">
                        {query && (
                            <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                                <X size={16} />
                            </button>
                        )}
                        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            ESC
                        </kbd>
                    </div>
                </div>

                {/* Results List */}
                <div ref={listRef} className="max-h-[65vh] sm:max-h-[60vh] overflow-y-auto p-2">
                    {isLoading ? (
                        // Loading skeleton
                        <div className="space-y-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center rounded-sm px-3 py-2.5">
                                    <div className="h-8 w-8 rounded-md bg-muted animate-pulse mr-3" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                                        <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="py-12 text-center text-sm text-muted-foreground">
                            No results found.
                        </div>
                    ) : (
                        filteredItems.map((item, index) => {
                            // Check if we need to render a header
                            const showHeader = index === 0 || item.group !== filteredItems[index - 1].group;

                            return (
                                <React.Fragment key={item.id}>
                                    {showHeader && item.group && (
                                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-popover">
                                            {item.group}
                                        </div>
                                    )}
                                    {renderItem ? (
                                        // Custom rendering
                                        <div
                                            data-spotlight-item
                                            onClick={() => executeItem(item)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={cn(
                                                "cursor-pointer",
                                                index === selectedIndex && "bg-accent"
                                            )}
                                        >
                                            {renderItem(item, index === selectedIndex)}
                                        </div>
                                    ) : (
                                        // Default rendering
                                        <button
                                            data-spotlight-item
                                            onClick={() => executeItem(item)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={cn(
                                                "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2.5 text-sm outline-none w-full text-left transition-colors",
                                                index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-muted/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-md border border-border mr-3",
                                                index === selectedIndex ? "bg-background" : "bg-muted"
                                            )}>
                                                {item.icon || <Search size={14} />}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="truncate font-medium">
                                                    {item.label}
                                                </div>
                                                {item.description && (
                                                    <div className="truncate text-xs text-muted-foreground">
                                                        {item.description}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-auto">
                                                {item.shortcut && (
                                                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                                                        {item.shortcut}
                                                    </kbd>
                                                )}
                                                {item.type && (
                                                    <span className="text-[10px] uppercase text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                        {item.type}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="h-10 border-t border-border bg-muted/30 px-4 flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex gap-2">
                        <span>Use arrow keys to navigate</span>
                        <span>Enter to select</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
