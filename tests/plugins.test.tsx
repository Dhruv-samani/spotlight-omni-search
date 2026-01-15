import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePluginManager } from '../hooks/usePluginManager';
import { SpotlightItem } from '../types';
import { AnalyticsPlugin } from '../plugins/analytics';

describe('Plugin System', () => {

    // Mock Data
    const mockItems: SpotlightItem[] = [
        { id: '1', label: 'Item 1', type: 'page' },
        { id: '2', label: 'Item 2', type: 'page' }
    ];

    it('should initialize plugins correctly', () => {
        const onInitSpy = vi.fn();
        const testPlugin = {
            name: 'test-plugin',
            onInit: onInitSpy
        };

        renderHook(() => usePluginManager({
            plugins: [testPlugin],
            isOpen: true,
            query: '',
            setQuery: vi.fn(),
            onClose: vi.fn(),
            setIsOpen: vi.fn()
        }));

        expect(onInitSpy).toHaveBeenCalled();
    });

    it('should execute onBeforeSearch middleware', () => {
        const testPlugin = {
            name: 'filter-plugin',
            onBeforeSearch: (q: string, items: SpotlightItem[]) => {
                return items.filter(i => i.id === '1');
            }
        };

        const { result } = renderHook(() => usePluginManager({
            plugins: [testPlugin],
            isOpen: true,
            query: 'test',
            setQuery: vi.fn(),
            onClose: vi.fn(),
            setIsOpen: vi.fn()
        }));

        const filtered = result.current.runOnBeforeSearch('test', mockItems);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].id).toBe('1');
    });

    it('should prevent selection if onSelect returns false', () => {
        const testPlugin = {
            name: 'block-plugin',
            onSelect: () => false
        };

        const { result } = renderHook(() => usePluginManager({
            plugins: [testPlugin],
            isOpen: true,
            query: '',
            setQuery: vi.fn(),
            onClose: vi.fn(),
            setIsOpen: vi.fn()
        }));

        const shouldProceed = result.current.runOnSelect(mockItems[0]);
        expect(shouldProceed).toBe(false);
    });

    describe('Analytics Plugin', () => {
        it('should track search queries', () => {
            const onSearchSpy = vi.fn();
            const plugin = AnalyticsPlugin({ onSearch: onSearchSpy });

            const { result } = renderHook(() => usePluginManager({
                plugins: [plugin],
                isOpen: true,
                query: 'hello',
                setQuery: vi.fn(),
                onClose: vi.fn(),
                setIsOpen: vi.fn()
            }));

            // trigger via hook
            result.current.runOnBeforeSearch('hello', mockItems);
            expect(onSearchSpy).toHaveBeenCalledWith('hello');
        });

        it('should track selections', () => {
            const onSelectSpy = vi.fn();
            const plugin = AnalyticsPlugin({ onSelect: onSelectSpy });

            const { result } = renderHook(() => usePluginManager({
                plugins: [plugin],
                isOpen: true,
                query: '',
                setQuery: vi.fn(),
                onClose: vi.fn(),
                setIsOpen: vi.fn()
            }));

            // trigger via hook
            result.current.runOnSelect(mockItems[0]);
            expect(onSelectSpy).toHaveBeenCalledWith('1', 'page');
        });
    });
});
