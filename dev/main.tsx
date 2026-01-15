import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';         // Dev Tailwind
import '../index.css';        // Library Variables
import { Spotlight } from '../Spotlight';
import { SpotlightItem } from '../types';
import { getSpotlightItemsFromRoutes, RouteConfig } from '../adapters/routes';
import { Moon, Sun, Languages, Plus, Palette, LayoutDashboard, Settings, User } from 'lucide-react';

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

    // 1. Generate items from routes (Static or Dynamic)
    const routeItems = useMemo(() => getSpotlightItemsFromRoutes(routes), []);

    // 2. Define Action Items (Context-dependent)
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
        }
    ], [theme, direction]);

    // Combine all items
    const allItems = useMemo(() => [...routeItems, ...actionItems], [routeItems, actionItems]);

    // Keyboard shortcut to open
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

    // Simulate navigation
    const handleNavigate = (path: string) => {
        // In a real app, use router.push(path)
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
            </div>

            <p className="mb-4 opacity-70">Press <kbd className="bg-gray-200/50 px-2 py-1 rounded border border-gray-300/50">Cmd+K</kbd> to open.</p>

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
            />
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
