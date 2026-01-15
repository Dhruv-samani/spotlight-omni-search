import { useRef, useEffect, useMemo, ReactNode } from 'react';
import { SpotlightItem } from '../types';
import { ScoredItem } from '../lib/fuzzySearch';
import { SpotlightPlugin, PluginContext } from '../types/plugin';
import { spotlightStorage } from '../lib/storage';

interface UsePluginManagerProps {
    plugins: SpotlightPlugin[];
    isOpen: boolean;
    query: string;
    setQuery: (q: string) => void;
    onClose: () => void;
    setIsOpen: (isOpen: boolean) => void;
}

export function usePluginManager({
    plugins,
    isOpen,
    query,
    setQuery,
    onClose,
    setIsOpen
}: UsePluginManagerProps) {
    const initializedPlugins = useRef<Set<string>>(new Set());

    // Create stable context object
    // Create stable context object (excluding storage)
    const baseContext = useMemo(() => ({
        isOpen,
        query,
        setQuery,
        open: () => setIsOpen(true),
        close: onClose,
        toggle: () => setIsOpen(!isOpen)
    }), [isOpen, query, setQuery, onClose, setIsOpen]);

    // Initialize plugins once
    useEffect(() => {
        plugins.forEach(plugin => {
            if (!initializedPlugins.current.has(plugin.name)) {
                try {
                    // scoped storage wrapper (silent errors)
                    const storage = {
                        getItem: <T>(key: string): T | null => {
                            return spotlightStorage.getItem<T>(`spotlight_plugin_${plugin.name}_${key}`);
                        },
                        setItem: <T>(key: string, value: T) => {
                            spotlightStorage.setItem(`spotlight_plugin_${plugin.name}_${key}`, value);
                        },
                        removeItem: (key: string) => {
                            spotlightStorage.removeItem(`spotlight_plugin_${plugin.name}_${key}`);
                        }
                    };

                    plugin.onInit?.({ ...baseContext, storage });
                    initializedPlugins.current.add(plugin.name);
                } catch (e) { }
            }
        });

        // Cleanup
        return () => {
            plugins.forEach(plugin => {
                try {
                    plugin.onDestroy?.();
                } catch (e) { }
            });
            initializedPlugins.current.clear();
        };
    }, [plugins, baseContext]); 
    // Note: context dependency might re-trigger init if not careful, 
    // but we use a ref set to prevent double init. 
    // Ideally onInit should only run once on mount.

    const runOnBeforeSearch = (currentQuery: string, items: SpotlightItem[]): SpotlightItem[] => {
        return plugins.reduce((accItems, plugin) => {
            if (plugin.onBeforeSearch) {
                try {
                    return plugin.onBeforeSearch(currentQuery, accItems);
                } catch (e) {
                    return accItems;
                }
            }
            return accItems;
        }, items);
    };

    const runOnAfterSearch = (results: ScoredItem[]): ScoredItem[] => {
        return plugins.reduce((accResults, plugin) => {
            if (plugin.onAfterSearch) {
                try {
                    return plugin.onAfterSearch(accResults);
                } catch (e) {
                    return accResults;
                }
            }
            return accResults;
        }, results);
    };

    const runOnSelect = (item: SpotlightItem): boolean => {
        // Return false if ANY plugin returns false (prevent default)
        for (const plugin of plugins) {
            if (plugin.onSelect) {
                try {
                    const result = plugin.onSelect(item);
                    if (result === false) return false;
                } catch (e) { }
            }
        }
        return true;
    };

    const runRenderHeader = (): ReactNode | null => {
        for (const plugin of plugins) {
            if (plugin.renderHeader) {
                try {
                    const content = plugin.renderHeader();
                    if (content) return content;
                } catch (e) {
                    console.error(`[Spotlight] Plugin ${plugin.name} failed in renderHeader:`, e);
                }
            }
        }
        return null;
    };

    const runRenderBeforeList = (): ReactNode | null => {
        for (const plugin of plugins) {
            if (plugin.renderBeforeList) {
                try {
                    const content = plugin.renderBeforeList();
                    if (content) return content;
                } catch (e) {
                    console.error(`[Spotlight] Plugin ${plugin.name} failed in renderBeforeList:`, e);
                }
            }
        }
        return null;
    };

    const runRenderAfterList = (): ReactNode | null => {
        for (const plugin of plugins) {
            if (plugin.renderAfterList) {
                try {
                    const content = plugin.renderAfterList();
                    if (content) return content;
                } catch (e) {
                    console.error(`[Spotlight] Plugin ${plugin.name} failed in renderAfterList:`, e);
                }
            }
        }
        return null;
    };

    return {
        runOnBeforeSearch,
        runOnAfterSearch,
        runOnSelect,
        runRenderHeader,
        runRenderBeforeList,
        runRenderAfterList
    };
}
