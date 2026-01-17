/**
 * Simplified API Test Page
 * Tests the new v2.3 simplified API components
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '../index.css';
import { SpotlightProvider, SearchTrigger, useGlobalSpotlight } from '../integrations/react';
import type { SpotlightItem } from '../types';
import { Home, Settings, Trash2, Search, Users, FileText, Zap } from 'lucide-react';

// Test data
const testItems: SpotlightItem[] = [
    {
        id: 'home',
        label: 'Home',
        description: 'Go to home page',
        icon: <Home size={18} />,
        type: 'page',
        route: '/',
        group: 'Navigation',
    },
    {
        id: 'about',
        label: 'About',
        description: 'Learn more about us',
        icon: <FileText size={18} />,
        type: 'page',
        route: '/about',
        group: 'Navigation',
    },
    {
        id: 'users',
        label: 'Users',
        description: 'Manage users',
        icon: <Users size={18} />,
        type: 'page',
        route: '/users',
        group: 'Navigation',
    },
    {
        id: 'settings',
        label: 'Settings',
        description: 'Configure preferences',
        icon: <Settings size={18} />,
        type: 'page',
        route: '/settings',
        group: 'System',
    },
    {
        id: 'test-action',
        label: 'Test Action',
        description: 'Execute a test action',
        icon: <Zap size={18} />,
        type: 'action',
        group: 'Actions',
        action: () => {
            console.log('✅ Test action executed!');
            alert('✅ Test action executed successfully!');
        },
    },
    {
        id: 'delete-data',
        label: 'Clear Cache',
        description: 'Delete all cached data',
        icon: <Trash2 size={18} />,
        type: 'action',
        group: 'Danger Zone',
        confirm: {
            title: 'Clear Cache?',
            message: 'This will reset your local application state.',
            type: 'danger',
        },
        action: () => {
            console.log('🗑️ Cache cleared!');
            alert('🗑️ Cache cleared successfully!');
        },
    },
];

// Test component using useGlobalSpotlight hook
function CustomControls() {
    const { open, close, toggle, isOpen } = useGlobalSpotlight();

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">useGlobalSpotlight Hook Test</h3>
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={open}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                >
                    Open
                </button>
                <button
                    onClick={close}
                    className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                    Close
                </button>
                <button
                    onClick={toggle}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                    Toggle
                </button>
            </div>
            <p className="mt-4 text-sm opacity-70">
                Status: <span className={`font-semibold ${isOpen ? 'text-green-500' : 'text-red-500'}`}>
                    {isOpen ? 'OPEN' : 'CLOSED'}
                </span>
            </p>
        </div>
    );
}

// Main test app
function SimplifiedAPITest() {
    const handleNavigate = (path: string) => {
        console.log('🔗 Navigate to:', path);
        alert(`Would navigate to: ${path}`);
    };

    return (
        <SpotlightProvider
            items={testItems}
            onNavigate={handleNavigate}
            theme="dark"
            layout="center"
            enableGoogleSearch={true}
            enableRecent={true}
            debug={true}
        >
            <div className="min-h-screen bg-slate-950 text-white">
                {/* Header */}
                <header className="border-b border-white/10 px-8 py-6 backdrop-blur-md sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Spotlight <span className="text-blue-500">Simplified API Test</span>
                                </h1>
                                <p className="text-sm opacity-50 mt-1">v2.3.0 - Testing Phase 1</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <SearchTrigger variant="default" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-8 py-12">
                    <div className="space-y-8">

                        {/* Test 1: SearchTrigger Variants */}
                        <section className="glass-card p-8">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Search size={20} className="text-blue-500" />
                                Test 1: SearchTrigger Component Variants
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <div>
                                    <p className="text-sm opacity-70 mb-2">Default Variant</p>
                                    <SearchTrigger variant="default" />
                                </div>
                                <div>
                                    <p className="text-sm opacity-70 mb-2">Minimal Variant</p>
                                    <SearchTrigger variant="minimal" />
                                </div>
                                <div>
                                    <p className="text-sm opacity-70 mb-2">Icon-Only Variant</p>
                                    <SearchTrigger variant="icon-only" />
                                </div>
                                <div>
                                    <p className="text-sm opacity-70 mb-2">Custom Styled</p>
                                    <SearchTrigger
                                        variant="default"
                                        className="bg-gradient-to-r from-purple-600 to-pink-600 border-0"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Test 2: useGlobalSpotlight Hook */}
                        <section>
                            <CustomControls />
                        </section>

                        {/* Test 3: Keyboard Shortcut */}
                        <section className="glass-card p-8">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Zap size={20} className="text-yellow-500" />
                                Test 3: Keyboard Shortcut
                            </h2>
                            <p className="opacity-70">
                                Press <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Cmd+K</kbd> (Mac)
                                or <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Ctrl+K</kbd> (Windows/Linux)
                                to toggle Spotlight
                            </p>
                        </section>

                        {/* Test Checklist */}
                        <section className="glass-card p-8 bg-blue-600/5 border-blue-500/20">
                            <h2 className="text-xl font-semibold mb-6">✅ Test Checklist</h2>
                            <ol className="space-y-3 text-sm">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-mono">1.</span>
                                    <span>Verify all three SearchTrigger variants render correctly</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-mono">2.</span>
                                    <span>Click each SearchTrigger button - Spotlight should open</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-mono">3.</span>
                                    <span>Use Open/Close/Toggle buttons - verify state changes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-mono">4.</span>
                                    <span>Press Cmd+K / Ctrl+K - Spotlight should toggle</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-mono">5.</span>
                                    <span>Search for items - fuzzy search should work</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-mono">6.</span>
                                    <span>Select a navigation item - alert should show</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-mono">7.</span>
                                    <span>Select "Test Action" - action should execute</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-mono">8.</span>
                                    <span>Select "Clear Cache" - confirmation modal should appear</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-mono">9.</span>
                                    <span>Press Esc - Spotlight should close</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-mono">10.</span>
                                    <span>Check browser console for debug output</span>
                                </li>
                            </ol>
                        </section>

                        {/* Success Criteria */}
                        <section className="glass-card p-8 bg-green-600/5 border-green-500/20">
                            <h2 className="text-xl font-semibold mb-4 text-green-500">🎯 Success Criteria</h2>
                            <ul className="space-y-2 text-sm">
                                <li>✅ All components render without errors</li>
                                <li>✅ Keyboard shortcuts work (Cmd+K / Ctrl+K)</li>
                                <li>✅ All SearchTrigger variants are clickable</li>
                                <li>✅ useGlobalSpotlight hook provides correct state</li>
                                <li>✅ Navigation callback fires correctly</li>
                                <li>✅ Action items execute properly</li>
                                <li>✅ Confirmation modals appear for dangerous actions</li>
                                <li>✅ No TypeScript errors in console</li>
                            </ul>
                        </section>
                    </div>
                </main>

                {/* Backdrop glow */}
                <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />
            </div>
        </SpotlightProvider>
    );
}

// Render
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <SimplifiedAPITest />
    </React.StrictMode>
);
