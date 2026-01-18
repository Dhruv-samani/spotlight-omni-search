import { SpotlightPlugin } from '../types/plugin';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export interface GoogleAnalyticsOptions {
    measurementId?: string; // GA4 Measurement ID (G-XXXXXXXXXX)
    enableDebug?: boolean;   // Log events to console instead/as well
    loadScript?: boolean;    // Automatically inject GA script script tag
}

export const GoogleAnalyticsPlugin = (options: GoogleAnalyticsOptions = {}): SpotlightPlugin => {
    
    const log = (msg: string, ...args: any[]) => {
        if (options.enableDebug) {
            console.log(`[Spotlight GA] ${msg}`, ...args);
        }
    };

    // Initialize GA Script
    const initGA = () => {
        if (!options.measurementId) return;
        
        if (options.loadScript && typeof window !== 'undefined' && !document.getElementById('ga-script')) {
            log('Injecting GA Script');
            const script = document.createElement('script');
            script.id = 'ga-script';
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${options.measurementId}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            window.gtag = function(){window.dataLayer.push(arguments);}
            window.gtag('js', new Date());
            window.gtag('config', options.measurementId);
        }
    };

    const trackEvent = (eventName: string, params: Record<string, any>) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', eventName, params);
            log(`Tracked ${eventName}`, params);
        } else {
            log(`(Mock) Tracked ${eventName}`, params);
        }
    };

    return {
        name: 'google-analytics',
        version: '1.0.0',

        onInit: () => {
            initGA();
            // Track initial view (optional, might duplicate page views if not careful)
            // trackEvent('spotlight_init', {}); 
        },

        onBeforeSearch: (query, items) => {
            // Track search (debounce handled by GA usually, but we could throttle here)
            if (query.length > 2) {
                 // We don't want to spam GA with every keystroke, 
                 // but implementing true debounce here is complex without external deps.
                 // Ideally, we just track 'spotlight_search' with the final query on select/close?
                 // For now, let's just log meaningful query lengths
            }
            return items; // Must return items
        },

        onSelect: (item) => {
            trackEvent('select_content', {
                content_type: item.type || 'unknown',
                item_id: item.id,
                method: 'spotlight'
            });
            
            trackEvent('spotlight_action', {
                action_name: item.label,
                group: item.group
            });

            return true; // execution continues
        }
    };
};
