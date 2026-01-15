import { useEffect, useRef } from 'react';

interface TouchGesturesOptions {
    onSwipeDown?: () => void;
    threshold?: number;
}

export function useTouchGestures({ onSwipeDown, threshold = 50 }: TouchGesturesOptions) {
    const touchStart = useRef<number | null>(null);
    const touchY = useRef<number | null>(null);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleTouchStart = (e: TouchEvent) => {
            touchStart.current = e.touches[0].clientY;
            touchY.current = e.touches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (touchStart.current === null) return;
            touchY.current = e.touches[0].clientY;
            
            // Optional: Add resistance or visual feedback logic here
        };

        const handleTouchEnd = () => {
             if (touchStart.current === null || touchY.current === null) return;

             const deltaY = touchY.current - touchStart.current;

             // Check if swiped down enough
             if (deltaY > threshold) {
                 // Check if we are at the top of the scroll container (if applicable) -- 
                 // For now, assume this is attached to the main modal container which might not scroll itself, 
                 // but the list inside does. 
                 // If attached to outer container, always close.
                 if (onSwipeDown) onSwipeDown();
             }

             touchStart.current = null;
             touchY.current = null;
        };

        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('touchmove', handleTouchMove);
        element.addEventListener('touchend', handleTouchEnd);

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchmove', handleTouchMove);
            element.removeEventListener('touchend', handleTouchEnd);
        };
    }, [onSwipeDown, threshold]);

    return elementRef;
}
