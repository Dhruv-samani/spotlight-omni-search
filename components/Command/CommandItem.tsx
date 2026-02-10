import React, { forwardRef, useEffect, useRef, useId, useCallback } from 'react';
import { useCommand } from './CommandContext';
import { cn } from '../../lib/utils';

export interface CommandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    value?: string;
    onSelect?: (value: string) => void;
    disabled?: boolean;
    keywords?: string[];
    forceMount?: boolean;
}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(({
    className,
    children,
    value,
    onSelect,
    disabled = false,
    keywords,
    onClick,
    forceMount = false,
    ...props
}, ref) => {
    const { registerItem, unregisterItem, activeValue, setActiveValue, filteredIds } = useCommand();
    const internalRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    // Value defaults to text content if not provided (simplified, ideally strictly required or derived safely)
    // For safety in this implementation, we require value or fallback to id
    const itemValue = value || generatedId;
    const id = `command-item-${generatedId}`;

    // Register item on mount
    useEffect(() => {
        if (disabled) return;
        registerItem(id, itemValue, internalRef, keywords);
        return () => unregisterItem(id);
    }, [id, itemValue, disabled, registerItem, unregisterItem, keywords]);

    const isSelected = activeValue === itemValue; // Assuming value uniqueness for now, or ID based

    const { setActiveItemId } = useCommand();
    useEffect(() => {
        if (isSelected) {
            setActiveItemId(id);
        }
    }, [isSelected, id, setActiveItemId]);

    // Filtering Logic
    const hidden = !forceMount && filteredIds !== null && !filteredIds.has(id);

    const handleSelect = useCallback(() => {
        if (disabled) return;
        onSelect?.(itemValue);
    }, [disabled, onSelect, itemValue]);

    // Use passed ref or internal ref
    const setRef = (node: HTMLDivElement) => {
        internalRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
    };

    if (hidden) return null;

    return (
        <div
            ref={setRef}
            id={id}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
            role="option"
            aria-disabled={disabled}
            aria-selected={isSelected}
            data-selected={isSelected}
            data-value={itemValue}
            onClick={(e) => {
                handleSelect();
                onClick?.(e);
            }}
            onPointerMove={() => {
                if (!disabled && activeValue !== itemValue) {
                    setActiveValue(itemValue);
                }
            }}
            cmdk-item=""
            {...props}
        >
            {children}
        </div>
    );
});

CommandItem.displayName = "CommandItem";
