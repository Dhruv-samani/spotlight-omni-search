import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
    it('should handle navigation keys', () => {
        const onUp = vi.fn();
        const onDown = vi.fn();
        
        const { result } = renderHook(() => useKeyboardShortcuts({
            onUp,
            onDown,
            shortcuts: {
                up: ['ArrowUp', 'Ctrl+k'],
                down: ['ArrowDown', 'Ctrl+j']
            }
        }));

        act(() => {
            // Simulate KeyDown
            const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
            result.current.handleKeyDown(event as any);
        });

        expect(onDown).toHaveBeenCalled();
    });

    // More tests would go here mocking standard events
});
