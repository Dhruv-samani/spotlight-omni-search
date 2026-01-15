import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchHistory } from './useSearchHistory';

describe('useSearchHistory', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('should initialize with empty history', () => {
        const { result } = renderHook(() => useSearchHistory());
        expect(result.current.history).toEqual([]);
    });

    it('should add item to history', () => {
        const { result } = renderHook(() => useSearchHistory());
        
        act(() => {
            result.current.addToHistory('test query');
        });

        expect(result.current.history).toContain('test query');
        expect(localStorage.getItem('spotlight-history')).toContain('test query');
    });

    it('should not add duplicate items', () => {
        const { result } = renderHook(() => useSearchHistory());

        act(() => {
            result.current.addToHistory('test');
        });
        act(() => {
            result.current.addToHistory('test');
        });

        expect(result.current.history).toHaveLength(1);
    });

    it('should limit history size', () => {
        const { result } = renderHook(() => useSearchHistory({ maxItems: 3 }));

        act(() => {
            result.current.addToHistory('1');
            result.current.addToHistory('2');
            result.current.addToHistory('3');
            result.current.addToHistory('4');
        });

        expect(result.current.history).toHaveLength(3);
        expect(result.current.history).toEqual(['4', '3', '2']);
    });

    it('should clear history', () => {
        const { result } = renderHook(() => useSearchHistory());

        act(() => {
            result.current.addToHistory('test');
            result.current.clearHistory();
        });

        expect(result.current.history).toEqual([]);
        expect(localStorage.getItem('spotlight-history')).toBeNull();
    });
});
