/**
 * Manual Test File for Simplified API
 * 
 * This file tests the simplified API exports to ensure they work correctly.
 * Run this with: npm run dev
 */

import React from 'react';
import { SpotlightProvider, SearchTrigger, useGlobalSpotlight } from './integrations/react';
import type { SpotlightItem } from './types';

// Test data
const testItems: SpotlightItem[] = [
    {
        id: 'home',
        label: 'Home',
        description: 'Go to home page',
        type: 'page',
        route: '/',
        group: 'Navigation',
    },
    {
        id: 'about',
        label: 'About',
        description: 'Learn more about us',
        type: 'page',
        route: '/about',
        group: 'Navigation',
    },
    {
        id: 'settings',
        label: 'Settings',
        description: 'Configure your preferences',
        type: 'page',
        route: '/settings',
        group: 'Navigation',
    },
    {
        id: 'test-action',
        label: 'Test Action',
        description: 'Test action functionality',
        type: 'action',
        group: 'Actions',
        action: () => {
            console.log('Test action executed!');
            alert('Test action executed!');
        },
    },
];

// Test component using useGlobalSpotlight
function CustomTrigger() {
    const { open, isOpen } = useGlobalSpotlight();

    return (
        <div>
            <button onClick={open} style={{ padding: '10px 20px', margin: '10px' }}>
                Custom Open Button
            </button>
            <p>Spotlight is {isOpen ? 'OPEN' : 'CLOSED'}</p>
        </div>
    );
}

// Main test app
export default function TestApp() {
    const handleNavigate = (path: string) => {
        console.log('Navigate to:', path);
        alert(`Would navigate to: ${path}`);
    };

    return (
        <SpotlightProvider
            items={testItems}
            onNavigate={handleNavigate}
            theme="dark"
            enableGoogleSearch={true}
            enableRecent={true}
        >
            <div style={{ padding: '40px', fontFamily: 'system-ui' }}>
                <h1>Spotlight Simplified API Test</h1>

                <div style={{ marginTop: '20px' }}>
                    <h2>Test 1: SearchTrigger Variants</h2>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <SearchTrigger variant="default" />
                        <SearchTrigger variant="minimal" />
                        <SearchTrigger variant="icon-only" />
                    </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h2>Test 2: useGlobalSpotlight Hook</h2>
                    <CustomTrigger />
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h2>Test 3: Keyboard Shortcut</h2>
                    <p>Press <kbd>Cmd+K</kbd> (Mac) or <kbd>Ctrl+K</kbd> (Windows/Linux) to open</p>
                </div>

                <div style={{ marginTop: '20px' }}>
                    <h2>Test Instructions</h2>
                    <ol>
                        <li>✅ Verify all three SearchTrigger variants render correctly</li>
                        <li>✅ Click each trigger button - Spotlight should open</li>
                        <li>✅ Click "Custom Open Button" - Spotlight should open</li>
                        <li>✅ Press Cmd+K / Ctrl+K - Spotlight should toggle</li>
                        <li>✅ Search for items - fuzzy search should work</li>
                        <li>✅ Select an item - navigation callback should fire</li>
                        <li>✅ Press Esc - Spotlight should close</li>
                        <li>✅ Try "Test Action" item - action should execute</li>
                    </ol>
                </div>
            </div>
        </SpotlightProvider>
    );
}
