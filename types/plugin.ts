import { ReactNode } from 'react';
import { SpotlightItem } from '../types';
import { ScoredItem } from '../lib/fuzzySearch';

export interface PluginStorage {
    getItem: <T>(key: string) => T | null;
    setItem: <T>(key: string, value: T) => void;
    removeItem: (key: string) => void;
}

export interface PluginContext {
    isOpen: boolean;
    query: string;
    setQuery: (query: string) => void;
    open: () => void;
    close: () => void;
    toggle: () => void;
    /** Scoped storage for this plugin */
    storage: PluginStorage;
}

export interface SpotlightPlugin {
    name: string;
    version?: string;
    
    /**
     * Called when the plugin is initialized.
     * Use this to access the context or set up side effects.
     */
    onInit?: (context: PluginContext) => void;

    /**
     * Called before search results are filtered.
     */
    onBeforeSearch?: (query: string, items: SpotlightItem[]) => SpotlightItem[];

    /**
     * Called after fuzzy search is complete but before rendering.
     */
    onAfterSearch?: (results: ScoredItem[]) => ScoredItem[];

    /**
     * Called when an item is selected.
     * Return `false` to prevent the default action (execution/navigation).
     */
    onSelect?: (item: SpotlightItem) => void | boolean;

    /**
     * Called when the spotlight is closed.
     */
    onClose?: () => void;
    
    /**
     * Allow plugin to render content in the header
     */
    renderHeader?: () => ReactNode;

    /**
     * Render content immediately before the results list
     */
    renderBeforeList?: () => ReactNode;

    /**
     * Render content immediately after the results list (e.g. custom footer)
     */
    renderAfterList?: () => ReactNode;

    /**
     * Cleanup when plugin or component is unmounted
     */
    onDestroy?: () => void;
}
