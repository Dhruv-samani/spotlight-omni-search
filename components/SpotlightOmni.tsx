import React, { useState, useEffect, useRef, useMemo, useCallback, ReactNode } from 'react';
import { Search, X, Regex, Filter, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { SpotlightProps, SpotlightItem, SpotlightClassNames } from '../types';
import { usePluginManager } from '../hooks/usePluginManager';
import { useDebounce } from '../hooks/useDebounce';
import { themes } from '../themes';
import { useTouchGestures } from '../hooks/useTouchGestures';
import { useFocusTrap } from '../lib/accessibility';
import { generateId } from '../lib/accessibility';

// Import New Primitives
import {
    Command,
    CommandInput,
    CommandList,
    CommandItem,
    CommandGroup,
    CommandEmpty,
    CommandLoading,
    CommandVirtualList
} from './Command';

function useScrollLock(lock: boolean) {
    useEffect(() => {
        if (!lock) return;
        const originalBodyStyle = document.body.style.overflow;
        const originalHtmlStyle = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalBodyStyle;
            document.documentElement.style.overflow = originalHtmlStyle;
        };
    }, [lock]);
}

import { useMobile } from '../hooks/useMobile';
import { useAiSearch } from '../hooks/useAiSearch';

export function SpotlightOmni({
    isOpen,
    onClose,
    items,
    onNavigate,
    searchPlaceholder = 'Search...',
    className,
    classNames,
    headerClassName,
    isLoading = false,
    theme,
    layout: initialLayout = 'center',
    enableTouchGestures = true,
    plugins = [],
    onSearch,
    debounceTime = 300,
    enableGoogleSearch = false,
    enableRecent = true,
    headless = false,
    enableVirtualScrolling = 'auto',
    virtualScrollThreshold = 500,
    debug = false,
    enableAutocomplete = false,
}: SpotlightProps) {
    const isMobile = useMobile();
    // Force bottom layout on mobile, otherwise use prop
    const layout = isMobile ? 'bottom' : initialLayout;

    const [query, setQuery] = useState('');
    const [activeGroup, setActiveGroup] = useState<string | null>(null);
    const [asyncResults, setAsyncResults] = useState<SpotlightItem[]>([]);
    const [isAsyncLoading, setIsAsyncLoading] = useState(false);

    // AI Search Hook
    const { results: aiResults, isLoading: isAiLoading } = useAiSearch({
        query,
        enabled: true, // Could be a prop
        debounceTime: 500
    });

    // NOTE: Plugin Manager logic (Simplified for initial integration)
    // We will hook this up fully in the next step, for now basic rendering.
    const debouncedQuery = useDebounce(query, debounceTime);

    // Scroll Lock
    useScrollLock(isOpen);

    // Focus Trap
    const modalRef = useFocusTrap(isOpen) as React.RefObject<HTMLDivElement>;

    // Touch Gestures (Swipe down to close)
    // Only attach if enableTouchGestures is true (default)
    const gestureRef = useRef<HTMLDivElement>(null);
    useTouchGestures({
        onSwipeDown: enableTouchGestures ? onClose : undefined,
        threshold: 50
    });

    // Merge refs for the container (focus trap + gestures)
    // We can just attach gestures to the modalRef's current if we wanted, but useTouchGestures expects to attach events itself.
    // Let's manually attach the ref logic or just wrap the content.
    // Actually, useTouchGestures returns a ref. We should combine them.
    // Enhanced approach: The layout container will need the ref.

    // Async Search Effect
    useEffect(() => {
        if (!onSearch || !debouncedQuery.trim()) {
            setAsyncResults([]);
            return;
        }
        let isMounted = true;
        const fetchAsync = async () => {
            setIsAsyncLoading(true);
            try {
                const results = await onSearch(debouncedQuery);
                if (isMounted) setAsyncResults(results);
            } catch (error) {
                if (isMounted) setAsyncResults([]);
            } finally {
                if (isMounted) setIsAsyncLoading(false);
            }
        };
        fetchAsync();
        return () => { isMounted = false; };
    }, [debouncedQuery, onSearch]);

    // Theme Styles
    const themeStyles = useMemo(() => {
        let variables: Record<string, string> = {};
        if (typeof theme === 'string') {
            if (themes[theme]) variables = themes[theme].variables;
        } else if (theme && typeof theme === 'object') {
            variables = theme.variables || {};
        }
        const styles: React.CSSProperties = {};
        Object.entries(variables).forEach(([key, value]) => {
            (styles as any)[`--spotlight-${key}`] = value;
        });
        return styles;
    }, [theme]);

    // Layout Classes (Ported from Spotlight.tsx)
    const layoutClasses = useMemo(() => {
        const baseOuter = "fixed inset-0 z-[999] flex bg-background/80 backdrop-blur-sm transition-all duration-200 spotlight-overlay";
        const baseInner = "relative w-full bg-popover shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200 spotlight-container";

        switch (layout) {
            case 'top': return { outer: cn(baseOuter, "items-start justify-center pt-[10vh] p-4"), inner: cn(baseInner, "max-w-2xl rounded-xl") };
            case 'bottom': return { outer: cn(baseOuter, "items-end justify-center pb-0 p-4"), inner: cn(baseInner, "max-w-2xl rounded-t-xl rounded-b-none border-b-0") };
            case 'side-left': return { outer: cn(baseOuter, "items-stretch justify-start"), inner: cn(baseInner, "h-full w-[400px] rounded-r-xl rounded-l-none slide-in-from-left duration-300") };
            case 'side-right': return { outer: cn(baseOuter, "items-stretch justify-end"), inner: cn(baseInner, "h-full w-[400px] rounded-l-xl rounded-r-none slide-in-from-right duration-300") };
            case 'fullscreen': return { outer: cn(baseOuter, "p-0"), inner: cn(baseInner, "h-full w-full rounded-none border-0") };
            case 'compact': return { outer: cn(baseOuter, "items-start justify-center pt-4 sm:pt-[5vh] p-4"), inner: cn(baseInner, "max-w-lg rounded-lg") };
            default: return { outer: cn(baseOuter, "items-center justify-center p-4"), inner: cn(baseInner, "max-w-2xl rounded-xl") };
        }
    }, [layout]);

    const mergeClasses = useCallback((defaultClasses: string, customKey?: keyof SpotlightClassNames, ...moreClasses: (string | undefined | null | false)[]) => {
        if (headless) {
            const customClass = customKey && classNames?.[customKey] ? classNames[customKey] : '';
            return cn(customClass, ...moreClasses);
        }
        const baseClass = customKey && classNames?.[customKey] ? cn(defaultClasses, classNames[customKey]) : defaultClasses;
        return cn(baseClass, ...moreClasses);
    }, [headless, classNames]);

    // Combined Items (Props + Async + AI)
    const allItems = useMemo(() => {
        // AI results go to the top
        return [...aiResults, ...items, ...asyncResults];
    }, [items, asyncResults, aiResults]);

    const handleSelect = useCallback((value: string) => {
        const item = allItems.find(i => i.id === value);
        if (!item) return;

        // Execute Check
        if (item.action) {
            item.action();
            onClose();
        } else if (item.route) {
            onNavigate(item.route);
            onClose();
        }
    }, [allItems, onClose, onNavigate]);

    if (!isOpen) return null;

    // Detect if we should use virtual list
    const useVirtual = enableVirtualScrolling === true || (enableVirtualScrolling === 'auto' && allItems.length > virtualScrollThreshold);

    return (
        <div style={themeStyles} className={mergeClasses(layoutClasses.outer, 'backdrop')} onClick={onClose}>
            <div
                className={mergeClasses(layoutClasses.inner, 'container', className)}
                onClick={e => e.stopPropagation()}
                ref={modalRef}
            >
                {/* Mobile Drag Handle */}
                {layout === 'bottom' && (
                    <div className="w-full flex justify-center py-2 cursor-grab active:cursor-grabbing touch-none">
                        <div className="w-12 h-1.5 bg-border rounded-full opacity-50" />
                    </div>
                )}

                <Command
                    search={query}
                    onSearchChange={setQuery}
                    shouldFilter={!isAsyncLoading} // If async loading, maybe don't filter? Or allow filtering async results?
                    className="h-full w-full bg-transparent"
                >
                    <div className={mergeClasses("flex items-center gap-3 px-4 py-3 border-b border-border relative", 'header', headerClassName)}>
                        <Search className={mergeClasses("w-5 h-5 text-muted-foreground", 'searchIcon')} aria-hidden="true" />

                        <div className="relative flex-1">
                            {enableAutocomplete && query && (
                                (() => {
                                    const match = allItems.find(i => i.label.toLowerCase().startsWith(query.toLowerCase()) && i.label.length > query.length);
                                    if (match) {
                                        return (
                                            <div
                                                className="absolute inset-0 flex items-center pointer-events-none"
                                                aria-hidden="true"
                                            >
                                                {/* Invisible text to push the ghost text to the right position */}
                                                <span className="invisible whitespace-pre">{query}</span>
                                                {/* Ghost text suffix */}
                                                <span style={{ color: 'var(--spotlight-muted-foreground)', opacity: 0.5 }} className="whitespace-pre">
                                                    {match.label.substring(query.length)}
                                                </span>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()
                            )}

                            <CommandInput
                                placeholder={searchPlaceholder}
                                className={mergeClasses("w-full bg-transparent border-none outline-none text-base placeholder:text-muted-foreground relative z-10", 'input')}
                                wrapperClassName="contents"
                                style={{ color: 'var(--spotlight-foreground)' }}
                                disableIcon={true}
                                onKeyDown={(e) => {
                                    if (enableAutocomplete && e.key === 'Tab' && query) {
                                        const match = allItems.find(i => i.label.toLowerCase().startsWith(query.toLowerCase()) && i.label.length > query.length);
                                        if (match) {
                                            e.preventDefault();
                                            setQuery(match.label);
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <CommandList className={mergeClasses("max-h-[300px] overflow-y-auto overflow-x-hidden p-2", 'listContainer')}>
                        {isAsyncLoading || isLoading || isAiLoading ? (
                            <CommandLoading>
                                <div className="py-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                                    {isAiLoading && <Sparkles className="w-4 h-4 animate-pulse text-purple-500" />}
                                    {isAiLoading ? 'Thinking...' : 'Loading...'}
                                </div>
                            </CommandLoading>
                        ) : (
                            <>
                                <CommandEmpty>No results found.</CommandEmpty>

                                {useVirtual ? (
                                    <CommandVirtualList
                                        data={allItems}
                                        estimateSize={40}
                                        renderItem={(item) => (
                                            <CommandItem
                                                key={item.id}
                                                value={item.id} // ID is unique value
                                                onSelect={handleSelect}
                                                className={mergeClasses("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", 'item')}
                                            >
                                                {/* Icon + Label + Desc */}
                                                <div className="flex items-center gap-2 flex-1">
                                                    {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                                                    <span className="font-medium">{item.label}</span>
                                                </div>
                                                {item.description && <span className="text-xs text-muted-foreground">{item.description}</span>}
                                            </CommandItem>
                                        )}
                                    />
                                ) : (
                                    // Standard Rendering with Groups
                                    // Need to group items manually? CommandGroup handles it if we structure it right.
                                    // But Command handles filtering. If we pass flat list to Command, it filters.
                                    // We need to render Groups.
                                    // Current Engine doesn't auto-group. We must map data to Groups.
                                    // Let's implement a quick grouper.
                                    (() => {
                                        const groups = new Map<string, SpotlightItem[]>();
                                        // We let Command handle filtering visibility, but we must render structure.
                                        allItems.forEach(item => {
                                            const g = item.group || 'Other';
                                            if (!groups.has(g)) groups.set(g, []);
                                            groups.get(g)?.push(item);
                                        });

                                        return Array.from(groups.entries()).map(([group, groupItems]) => (
                                            <CommandGroup key={group} heading={group} className="text-foreground">
                                                {groupItems.map(item => (
                                                    <CommandItem
                                                        key={item.id}
                                                        value={item.id}
                                                        keywords={[item.label, item.description || '', ...(item.keywords || [])]}
                                                        onSelect={handleSelect}
                                                        className={mergeClasses("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", 'item')}
                                                    >
                                                        <div className="flex items-center gap-2 flex-1">
                                                            {item.icon && <span className="w-4 h-4 flex shrink-0 items-center justify-center">{item.icon}</span>}
                                                            <span className="font-medium truncate">{item.label}</span>
                                                        </div>
                                                        {item.description && <span className="text-xs text-muted-foreground ml-2 truncate max-w-[150px]">{item.description}</span>}
                                                        {item.shortcut && <span className="text-[10px] text-muted-foreground ml-auto bg-muted px-1 rounded border border-border">{item.shortcut}</span>}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        ));
                                    })()
                                )}
                            </>
                        )}
                    </CommandList>
                </Command>
            </div>
        </div>
    );
}
