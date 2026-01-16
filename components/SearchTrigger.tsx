import React, { ButtonHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { useSpotlightContext } from '../providers/SpotlightContext';
import { cn } from '../lib/utils';

export interface SearchTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * Visual variant of the button
     * @default 'default'
     */
    variant?: 'default' | 'minimal' | 'icon-only';
    /**
     * Show keyboard shortcut hint
     * @default true
     */
    showShortcut?: boolean;
}

/**
 * SearchTrigger - Pre-styled button to open Spotlight
 * 
 * Automatically connects to SpotlightProvider context
 * 
 * @example
 * ```tsx
 * <SearchTrigger variant="default" />
 * <SearchTrigger variant="icon-only" className="custom-class" />
 * ```
 */
export function SearchTrigger({
    variant = 'default',
    showShortcut = true,
    className,
    children,
    ...props
}: SearchTriggerProps) {
    const { toggle } = useSpotlightContext();

    const baseClasses = "inline-flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

    const variantClasses = {
        default: "px-4 py-2 bg-muted hover:bg-accent text-foreground rounded-lg border border-border",
        minimal: "px-3 py-1.5 hover:bg-accent text-muted-foreground rounded-md",
        'icon-only': "p-2 hover:bg-accent text-muted-foreground rounded-md",
    };

    return (
        <button
            type="button"
            onClick={toggle}
            className={cn(baseClasses, variantClasses[variant], className)}
            aria-label="Open search"
            {...props}
        >
            <Search size={18} />
            {variant !== 'icon-only' && (
                <>
                    {children || <span>Search...</span>}
                    {showShortcut && (
                        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    )}
                </>
            )}
        </button>
    );
}
