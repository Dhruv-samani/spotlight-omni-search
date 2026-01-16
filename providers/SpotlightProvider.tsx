import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import { Spotlight } from '../Spotlight';
import { SpotlightProps } from '../types';
import { SpotlightContextProvider } from './SpotlightContext';
import '../index.css'; // Auto-import CSS

export interface SpotlightProviderProps extends Omit<SpotlightProps, 'isOpen' | 'onClose'> {
    children: ReactNode;
    /**
     * Custom keyboard shortcut to open Spotlight
     * @default 'k' (Cmd+K / Ctrl+K)
     */
    shortcutKey?: string;
    /**
     * Disable the default Cmd+K / Ctrl+K shortcut
     * @default false
     */
    disableShortcut?: boolean;
}

/**
 * SpotlightProvider - Simplified wrapper for Spotlight
 * 
 * Automatically handles:
 * - Open/close state management
 * - Cmd+K / Ctrl+K keyboard shortcut
 * - CSS imports
 * 
 * @example
 * ```tsx
 * <SpotlightProvider items={items} onNavigate={(path) => router.push(path)}>
 *   {children}
 * </SpotlightProvider>
 * ```
 */
export function SpotlightProvider({
    children,
    items,
    shortcutKey = 'k',
    disableShortcut = false,
    ...spotlightProps
}: SpotlightProviderProps) {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen(prev => !prev), []);

    // Global keyboard shortcut (Cmd+K / Ctrl+K)
    useEffect(() => {
        if (disableShortcut) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcutKey.toLowerCase()) {
                e.preventDefault();
                toggle();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcutKey, disableShortcut, toggle]);

    return (
        <SpotlightContextProvider value={{ isOpen, open, close, toggle }}>
            {children}
            <Spotlight
                isOpen={isOpen}
                onClose={close}
                items={items}
                {...spotlightProps}
            />
        </SpotlightContextProvider>
    );
}
