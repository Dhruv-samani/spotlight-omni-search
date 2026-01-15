import { SpotlightPlugin } from '../types/plugin';

interface VirtualPluginOptions {
    /**
     * Estimated height of each item in pixels
     * @default 40
     */
    itemHeight?: number;
    /**
     * Max items to render (Window Size)
     * @default 50
     */
    windowSize?: number;
}

export const VirtualScrollingPlugin = (options: VirtualPluginOptions = {}): SpotlightPlugin => {
    const WINDOW_SIZE = options.windowSize || 50;
    
    // We can't truly virtualize the DOM injectively without controlling the list map loop.
    // But we CAN limit the 'results' array which effectively limits DOM nodes.
    // To support scrolling, we would need to listen to scroll events and update the window.
    // LIMITATION: Plugin API doesn't expose scroll events yet.
    
    // Current Solution: "Pagination" / "Safety Cap"
    // Just caps the results to avoid crashing the browser with 10k items.
    
    return {
        name: 'spotlight-virtual-scroll',
        version: '1.0.0',

        onInit: () => {
             // console.log('[Virtual] Safety Cap Enabled');
        },

        onAfterSearch: (results) => {
            if (results.length > WINDOW_SIZE) {
                // Add a dummy item at the end to indicate more results?
                // For now, just slice.
                return results.slice(0, WINDOW_SIZE);
            }
            return results;
        }
    };
};
