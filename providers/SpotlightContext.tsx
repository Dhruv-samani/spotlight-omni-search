import React, { createContext, useContext, ReactNode } from 'react';

export interface SpotlightContextValue {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
}

const SpotlightContext = createContext<SpotlightContextValue | undefined>(undefined);

export const useSpotlightContext = () => {
    const context = useContext(SpotlightContext);
    if (!context) {
        throw new Error('useSpotlightContext must be used within SpotlightProvider');
    }
    return context;
};

export const SpotlightContextProvider = SpotlightContext.Provider;
