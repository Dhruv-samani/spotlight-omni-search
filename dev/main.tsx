import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';         // Dev Tailwind
import '../index.css';        // Library Variables
import { Spotlight } from '../Spotlight';
import { SpotlightItem } from '../types';
import { SpotlightPlugin } from '../types/plugin';
import { AnalyticsPlugin } from '../plugins/analytics';
import { NestedCommandsPlugin } from '../plugins/nested';
import { VirtualScrollingPlugin } from '../plugins/virtual';
import { getSpotlightItemsFromRoutes, RouteConfig } from '../adapters/routes';
import { Moon, Sun, Languages, Plus, Palette, LayoutDashboard, Settings, User, Search, Trash2 } from 'lucide-react';

// Mock Routes
const routes: RouteConfig[] = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard size={18} />,
        children: [
            { path: 'analytics', label: 'Analytics' },
            { path: 'reports', label: 'Reports' }
        ]
    },
    {
        path: '/settings',
        label: 'Settings',
        icon: <Settings size={18} />,
    },
    {
        path: '/profile',
        label: 'Profile',
        icon: <User size={18} />,
    }
];

function App() {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
    const [palette, setPalette] = useState('blue');
    const [debug, setDebug] = useState(true);
    const [enableGoogle, setEnableGoogle] = useState(true);

    // 1. Generate items from routes
    const routeItems = useMemo(() => getSpotlightItemsFromRoutes(routes), []);

    // 2. Action Items
    const actionItems: SpotlightItem[] = useMemo(() => [
        {
            id: 'create-role',
            label: 'Create Role',
            icon: <Plus size={18} />,
            type: 'action',
            group: 'Actions',
            action: () => alert('Navigating to /system/roles/create')
        },
        {
            id: 'toggle-theme',
            label: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`,
            icon: theme === 'light' ? <Moon size={18} /> : <Sun size={18} />,
            type: 'action',
            group: 'Actions',
            action: () => setTheme(prev => prev === 'light' ? 'dark' : 'light')
        },
        {
            id: 'toggle-rtl',
            label: `Switch to ${direction === 'ltr' ? 'RTL' : 'LTR'}`,
            icon: <Languages size={18} />,
            type: 'action',
            group: 'Actions',
            action: () => setDirection(prev => prev === 'ltr' ? 'rtl' : 'ltr')
        },
        {
            id: 'palette-green',
            label: 'Set Green Palette',
            icon: <Palette size={18} />,
            type: 'action',
            group: 'Preferences',
            action: () => setPalette('green')
        },
        {
            id: 'palette-blue',
            label: 'Set Blue Palette',
            icon: <Palette size={18} />,
            type: 'action',
            group: 'Preferences',
            action: () => setPalette('blue')
        },
        {
            id: 'clear-storage',
            label: 'Reset Application Data',
            description: 'This will clear all local history and recent items',
            icon: <Trash2 size={18} />,
            type: 'action',
            group: 'Danger Zone',
            confirm: {
                title: 'Reset All Data?',
                message: 'This will permanently delete your search history and recent items. This action cannot be undone.',
                confirmLabel: 'Reset Everything',
                cancelLabel: 'Keep Data',
                type: 'danger'
            },
            action: () => {
                localStorage.clear();
                window.location.reload();
            }
        }
    ], [theme, direction]);

    // 3. Nested Items Demo
    const nestedItems: SpotlightItem[] = useMemo(() => [
        {
            id: 'nested-parent',
            label: 'Advanced Settings',
            type: 'page',
            items: [
                { id: 'nested-1', label: 'Security', type: 'page' },
                {
                    id: 'nested-2', label: 'Notifications', type: 'page', items: [
                        { id: 'nested-deep-1', label: 'Email Alerts', type: 'action' },
                        { id: 'nested-deep-2', label: 'SMS Alerts', type: 'action' }
                    ]
                },
            ]
        }
    ], []);

    // 4. Large List for Virtual Scroll
    const largeListItems: SpotlightItem[] = useMemo(() => {
        return Array.from({ length: 20 }, (_, i) => ({
            id: `virtual-item-${i}`,
            label: `Virtual Item ${i + 1}`,
            type: 'result'
        }));
    }, []);

    // Combine All Items
    const allItems = useMemo(() =>
        [...routeItems, ...actionItems, ...nestedItems, ...largeListItems],
        [routeItems, actionItems, nestedItems, largeListItems]);

    // Plugins
    const plugins = useMemo(() => [
        AnalyticsPlugin({ enableSessionTracking: true }),
        NestedCommandsPlugin({ backKey: 'Backspace' }),
        VirtualScrollingPlugin({ windowSize: 20 })
    ], []);

    // Keyboard shortcut
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const handleNavigate = (path: string) => {
        console.log('Navigate to:', path);
    };

    // 5. Mock Async Search
    const handleSearch = async (query: string): Promise<SpotlightItem[]> => {
        console.log('[Dev] Async searching for:', query);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Return some mock remote results
        return [
            {
                id: `remote-${query}-1`,
                label: `Remote Result for "${query}"`,
                description: 'Fetched from mock API',
                type: 'result',
                group: 'Remote Results',
                action: () => alert(`Executed remote result for ${query}`)
            },
            {
                id: `remote-${query}-2`,
                label: `Search GitHub for "${query}"`,
                description: 'Open in new tab',
                type: 'action',
                group: 'External',
                action: () => window.open(`https://github.com/search?q=${query}`, '_blank')
            }
        ];
    };

    return (
        <div className={`p-8 font-sans min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <h1 className="text-2xl font-bold mb-4">Spotlight Dynamic Playground</h1>

            <div className="grid grid-cols-2 gap-4 max-w-md mb-8">
                <div className="p-4 border rounded bg-white/10">
                    <div className="text-xs uppercase text-gray-500 mb-1">Theme</div>
                    <div className="font-mono">{theme}</div>
                </div>
                <div className="p-4 border rounded bg-white/10">
                    <div className="text-xs uppercase text-gray-500 mb-1">Direction</div>
                    <div className="font-mono">{direction}</div>
                </div>
                <div className="p-4 border rounded bg-white/10">
                    <div className="text-xs uppercase text-gray-500 mb-1">Palette</div>
                    <div className="font-mono" style={{ color: palette }}>{palette}</div>
                </div>
                <div className="p-4 border rounded bg-white/10 flex items-center justify-between">
                    <div className="text-xs uppercase text-gray-500">Google Search</div>
                    <input
                        type="checkbox"
                        checked={enableGoogle}
                        onChange={(e) => setEnableGoogle(e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                    />
                </div>
                <div className="p-4 border rounded bg-white/10 flex items-center justify-between">
                    <div className="text-xs uppercase text-gray-500">Debug Mode</div>
                    <input
                        type="checkbox"
                        checked={debug}
                        onChange={(e) => setDebug(e.target.checked)}
                        className="w-4 h-4 cursor-pointer"
                    />
                </div>
            </div>

            <p className="mb-4 opacity-70">
                Press <kbd className="bg-gray-200/50 px-2 py-1 rounded border border-gray-300/50">Cmd+K</kbd> to open.
                Use <kbd className="bg-gray-200/50 px-2 py-1 rounded border border-gray-300/50">Cmd+Z</kbd> for undo.
            </p>

            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition-colors"
                style={{ backgroundColor: palette === 'blue' ? '#3b82f6' : palette === 'green' ? '#22c55e' : '#0f172a' }}
            >
                Open Spotlight
            </button>

            <Spotlight
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                items={allItems}
                onNavigate={handleNavigate}
                theme={theme === 'dark' ? 'dark' : 'light'}
                plugins={plugins}
                onSearch={handleSearch}
                debounceTime={500}
                debug={debug}
                enableGoogleSearch={enableGoogle}
                onEvent={(event, data) => console.log('🔥 [Spotlight Event]:', event, data)}
            />
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
