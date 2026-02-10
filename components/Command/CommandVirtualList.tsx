import React, { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { cn } from '../../lib/utils';
import { useCommand } from './CommandContext';

export interface CommandVirtualListProps<T> extends React.HTMLAttributes<HTMLDivElement> {
    /** The data array to render */
    data: T[];
    /** Render function for each item */
    renderItem: (item: T, index: number) => React.ReactNode;
    /** Estimated height of each item in pixels (default: 40) */
    estimateSize?: number;
    /** Overscan count (default: 5) */
    overscan?: number;
}

export function CommandVirtualList<T>({
    className,
    data,
    renderItem,
    estimateSize = 40,
    overscan = 5,
    ...props
}: CommandVirtualListProps<T>) {
    const parentRef = useRef<HTMLDivElement>(null);
    const { filteredIds } = useCommand();

    // Filter data based on CommandContext
    const filteredData = useMemo(() => {
        if (!filteredIds) return data;
        // Optimization: If we have IDs on items, we can enable fast lookup
        // But here T is generic. We assume T has an id or we pass a key extractor?
        // CommandItem registers using its value or id.
        // We need to know how to map T to the ID registered in CommandContext.
        // For now, let's assume T is SpotlightItem and has an ID.
        return data.filter((item: any) => filteredIds.has(item.id));
    }, [data, filteredIds]);

    // Filter the data if needed
    // Note: For true virtualization with search, we usually want the consumer to pass the FILTERED data.
    // However, since our Context manages filtering IDs, we might need to filter here to know the count.
    // BUT: The primitive `Command.Item` logic registers itself.
    // If we virtualization, we only render a subset. `Command` context won't know about unmounted items.
    // This breaks the updated `Command` arrow-key navigation logic which relies on DOM query or internal map.

    // CRITICAL ARCHITECTURE DECISION:
    // When using Virtualization, the `Command.tsx` navigation logic (which queries DOM or checks registered items)
    // needs to know about items that are NOT in the DOM yet?
    // Actually, TanStack virtualizer handles the scroll. 
    // But keyboard navigation `activeValue` logic needs to "scroll to" the index.

    // Workaround: 
    // 1. We must pass the `filtered` data to this component if external filtering is used.
    // 2. Or we filter internally here based on `filteredIds` if the items had stable IDs? 
    //    No, `filteredIds` implies items rendered and registered.

    // "Omni" Solution:
    // When using `CommandVirtualList`, we assume the user is passing the *visible* items (already filtered or not).
    // If the user relies on `Command`'s internal fuzzy search, this component needs to know how to filter `data` using that same logic?
    // OR simpler: `CommandVirtualList` is meant for when YOU control the data (async/server/large list).
    // Let's assume `data` passed here is what should be shown.

    const rowVirtualizer = useVirtualizer({
        count: filteredData.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimateSize,
        overscan,
    });

    return (
        <div
            ref={parentRef}
            className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
            cmdk-list=""
            role="listbox"
            tabIndex={-1}
            {...props}
        >
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
                role="presentation"
            >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                    <div
                        key={virtualItem.key}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: `${virtualItem.size}px`,
                            transform: `translateY(${virtualItem.start}px)`,
                        }}
                    >
                        {renderItem(filteredData[virtualItem.index], virtualItem.index)}
                    </div>
                ))}
            </div>
        </div>
    );
}
