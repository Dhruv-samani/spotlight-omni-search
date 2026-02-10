import React, { useMemo } from 'react';
import { cn } from '../../lib/utils';
import { useCommand } from './CommandContext';
import { SpotlightItem } from '../../types';
import { CommandGroup } from './CommandGroup';
import { CommandItem } from './CommandItem';
import { Command as CommandIcon } from 'lucide-react';

interface DynamicGroupsProps {
    items: SpotlightItem[];
    onSelect: (value: string) => void;
    mergeClasses: (defaultClasses: string, customKey?: any, ...moreClasses: any[]) => string;
}

export function DynamicGroups({ items, onSelect, mergeClasses }: DynamicGroupsProps) {
    const { filteredIds } = useCommand();

    // Group items and filter out empty groups
    const groupsWithItems = useMemo(() => {
        const itemsByGroup = new Map<string, SpotlightItem[]>();

        items.forEach(item => {
            // Only include items that pass the Command's filter
            if (!filteredIds || filteredIds.has(item.id)) {
                const groupName = item.group || 'Other';
                if (!itemsByGroup.has(groupName)) {
                    itemsByGroup.set(groupName, []);
                }
                itemsByGroup.get(groupName)?.push(item);
            }
        });

        return itemsByGroup;
    }, [items, filteredIds]);

    return (
        <>
            {Array.from(groupsWithItems.entries()).map(([group, groupItems]) => (
                <CommandGroup
                    key={group}
                    heading={group}
                    className="text-foreground [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground/70 [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2"
                >
                    {groupItems.map(item => (
                        <CommandItem
                            key={item.id}
                            value={item.id}
                            keywords={[item.label, item.description || '', ...(item.keywords || [])]}
                            onSelect={onSelect}
                            className={mergeClasses("relative flex cursor-default select-none items-center rounded-md px-3 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 group my-0.5 transition-colors", 'item')}
                        >
                            <div className="flex items-center gap-3 flex-1 overflow-hidden">
                                <div className={cn(
                                    "w-6 h-6 flex items-center justify-center rounded text-muted-foreground shrink-0 transition-colors group-aria-selected:text-primary",
                                    item.icon ? "bg-transparent" : "bg-muted/50"
                                )}>
                                    {item.icon || <CommandIcon size={14} />}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium truncate">{item.label}</span>
                                        {(item.type === 'page' || item.type === 'action') && (
                                            <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 bg-muted/50 px-1 rounded border border-border/30">
                                                {item.type}
                                            </span>
                                        )}
                                    </div>
                                    {item.description && (
                                        <span className="text-xs text-muted-foreground truncate opacity-80">{item.description}</span>
                                    )}
                                </div>
                            </div>
                            {item.shortcut && (
                                <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded border border-border/50 ml-2 shrink-0 group-aria-selected:bg-background/20 group-aria-selected:border-background/20 group-aria-selected:text-current">
                                    {item.shortcut}
                                </span>
                            )}
                        </CommandItem>
                    ))}
                </CommandGroup>
            ))}
        </>
    );
}
