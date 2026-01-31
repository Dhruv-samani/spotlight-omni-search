import type { Meta, StoryObj } from '@storybook/react';
import React, { useMemo, useState } from 'react';
import { SpotlightProvider } from '../providers/SpotlightProvider';
import { SearchTrigger } from '../components/SearchTrigger';
import { NestedCommandsPlugin } from '../plugins/nested';
import { VirtualScrollingPlugin } from '../plugins/virtual';
import { AnalyticsPlugin } from '../plugins/analytics';
import { CalculatorPlugin } from '../plugins/calculator';
import { UnitConverterPlugin } from '../plugins/unit-converter';
import { RecentSearchesPlugin } from '../plugins/recent-searches';
import { BookmarksPlugin } from '../plugins/bookmarks';
import { ShortcutsPanelPlugin } from '../plugins/shortcuts-panel';
import { SpotlightItem } from '../types';
import { ChevronRight, Folder, File, Activity, Zap, Calculator, Ruler, History, Star, Keyboard, Settings, Home, Users } from 'lucide-react';

const meta: Meta<typeof SpotlightProvider> = {
    title: 'Demos/Plugins',
    component: SpotlightProvider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SpotlightProvider>;

// --- Helper Container ---
const Container = ({ children, title, description }: { children: React.ReactNode, title: string, description: string }) => (
    <div className="w-[600px] h-[400px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex flex-col relative shadow-sm">
        <div className="p-6 border-b border-slate-200 bg-white">
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-50/50">
            {children}
        </div>
    </div>
);

// --- Nested Commands Story ---

const nestedItems: SpotlightItem[] = [
    {
        id: 'settings',
        label: 'Settings',
        description: 'Manage app preferences',
        type: 'action', // or 'group'
        icon: <Folder size={18} className="text-blue-500" />,
        items: [
            {
                id: 'profile',
                label: 'Profile Settings',
                type: 'action',
                items: [
                    { id: 'change-avatar', label: 'Change Avatar', type: 'action' },
                    { id: 'change-name', label: 'Change Display Name', type: 'action' },
                ]
            },
            { id: 'notifications', label: 'Notifications', type: 'action' },
            { id: 'security', label: 'Security & Privacy', type: 'action' },
        ]
    },
    {
        id: 'dev-tools',
        label: 'Developer Tools',
        type: 'group',
        icon: <Zap size={18} className="text-amber-500" />,
        items: [
            { id: 'console', label: 'Open Console', type: 'action' },
            { id: 'network', label: 'Network Inspector', type: 'action' },
        ]
    },
    { id: 'home', label: 'Go Home', type: 'page', icon: <File size={18} /> }
];

export const NestedCommands: Story = {
    render: () => {
        return (
            <Container
                title="Nested Commands"
                description="Navigate through folders. Click 'Settings' to zoom in."
            >
                <SpotlightProvider
                    items={nestedItems}
                    plugins={[NestedCommandsPlugin({ backKey: 'Backspace' })]}
                    onNavigate={(path) => alert(`Navigated to ${path}`)}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <p className="text-xs text-center mt-4 text-slate-400">
                        Tip: Press Backspace to go back up a level
                    </p>
                </SpotlightProvider>
            </Container>
        );
    }
};

// --- Virtual Scrolling Story ---

const generateItems = (count: number): SpotlightItem[] => {
    return Array.from({ length: count }, (_, i) => ({
        id: `item-${i}`,
        label: `Virtual Item ${i + 1}`,
        description: `This is item number ${i + 1} in the large list`,
        type: 'result'
    }));
};

export const VirtualScrolling: Story = {
    render: () => {
        const largeList = useMemo(() => generateItems(2000), []);

        return (
            <Container
                title="Virtual Scrolling"
                description="Rendering 2,000 items efficiently."
            >
                <SpotlightProvider
                    items={largeList}
                    plugins={[VirtualScrollingPlugin({ windowSize: 20 })]}
                    onNavigate={() => { }}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <p className="text-xs text-center mt-4 text-slate-400">
                        Try scrolling quickly. Only 20 items are rendered at once.
                    </p>
                </SpotlightProvider>
            </Container>
        );
    }
};

// --- Analytics Story ---

export const Analytics: Story = {
    render: () => {
        const [logs, setLogs] = useState<string[]>([]);

        const analytics = useMemo(() => AnalyticsPlugin({
            onSearch: (q) => setLogs(p => [`Search: "${q}"`, ...p].slice(0, 5)),
            onSelect: (id) => setLogs(p => [`Select: "${id}"`, ...p].slice(0, 5)),
        }), []);

        return (
            <Container
                title="Analytics Integration"
                description="Track every search and selection event."
            >
                <div className="flex flex-col gap-6 w-full max-w-md">
                    <SpotlightProvider
                        items={[
                            { id: '1', label: 'Event 1', type: 'action' },
                            { id: '2', label: 'Event 2', type: 'action' }
                        ]}
                        plugins={[analytics]}
                        onNavigate={() => { }}
                    >
                        <SearchTrigger className="w-full" />
                    </SpotlightProvider>

                    <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-green-400 h-32 overflow-hidden flex flex-col">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 border-b border-slate-800 pb-2">
                            <Activity size={12} />
                            <span>LIVE LOGS</span>
                        </div>
                        {logs.length === 0 && <span className="opacity-30 italic">Interact to see events...</span>}
                        {logs.map((log, i) => (
                            <div key={i} className="truncate">{'>'} {log}</div>
                        ))}
                    </div>
                </div>
            </Container>
        );
    }
};

// --- NEW v2.5.0 PLUGINS ---

// --- Calculator + Unit Converter Story ---
export const CalculatorAndConverter: Story = {
    render: () => {
        return (
            <Container
                title="Calculator & Unit Converter (NEW!)"
                description="Type math expressions or unit conversions"
            >
                <SpotlightProvider
                    items={[
                        { id: 'home', label: 'Home', type: 'page', icon: <Home size={18} /> },
                        { id: 'settings', label: 'Settings', type: 'page', icon: <Settings size={18} /> },
                    ]}
                    plugins={[
                        CalculatorPlugin({
                            enableClipboardCopy: true,
                            icon: <Calculator size={18} className="text-purple-500" />
                        }),
                        UnitConverterPlugin({
                            enableClipboardCopy: true,
                            icon: <Ruler size={18} className="text-blue-500" />
                        })
                    ]}
                    onNavigate={() => { }}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 space-y-1">
                        <p className="font-semibold">Try these:</p>
                        <p className="text-slate-400">Math: <code className="bg-slate-200 px-1 rounded">2 + 2</code> or <code className="bg-slate-200 px-1 rounded">(10 + 5) * 2</code></p>
                        <p className="text-slate-400">Convert: <code className="bg-slate-200 px-1 rounded">100 km to miles</code> or <code className="bg-slate-200 px-1 rounded">32 F to C</code></p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// --- Recent Searches Story ---
export const RecentSearches: Story = {
    render: () => {
        return (
            <Container
                title="Recent Searches (NEW!)"
                description="Search history with privacy protection"
            >
                <SpotlightProvider
                    items={[
                        { id: 'home', label: 'Home', type: 'page', icon: <Home size={18} /> },
                        { id: 'settings', label: 'Settings', type: 'page', icon: <Settings size={18} /> },
                        { id: 'users', label: 'Users', type: 'page', icon: <Users size={18} /> },
                        { id: 'analytics', label: 'Analytics', type: 'page', icon: <Activity size={18} /> },
                    ]}
                    plugins={[
                        RecentSearchesPlugin({
                            maxSearches: 5,
                            showInResults: true,
                            icon: <History size={18} className="text-green-500" />
                        })
                    ]}
                    onNavigate={() => { }}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 space-y-1">
                        <p className="font-semibold">How to test:</p>
                        <p className="text-slate-400">1. Search for something (e.g., "settings")</p>
                        <p className="text-slate-400">2. Close and reopen Spotlight</p>
                        <p className="text-slate-400">3. See your recent searches!</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// --- Bookmarks Story ---
export const Bookmarks: Story = {
    render: () => {
        return (
            <Container
                title="Bookmarks (NEW!)"
                description="Star your favorite commands"
            >
                <SpotlightProvider
                    items={[
                        { id: 'home', label: 'Home', type: 'page', icon: <Home size={18} /> },
                        { id: 'settings', label: 'Settings', type: 'page', icon: <Settings size={18} /> },
                        { id: 'users', label: 'Users', type: 'page', icon: <Users size={18} /> },
                        { id: 'analytics', label: 'Analytics', type: 'page', icon: <Activity size={18} /> },
                    ]}
                    plugins={[
                        BookmarksPlugin({
                            maxBookmarks: 10,
                            showAtTop: true,
                            bookmarkIcon: <Star size={18} className="text-yellow-500" />
                        })
                    ]}
                    onNavigate={() => { }}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 space-y-1">
                        <p className="font-semibold">Features:</p>
                        <p className="text-slate-400">• Search "manage bookmarks" to view all</p>
                        <p className="text-slate-400">• Search "clear bookmarks" to reset</p>
                        <p className="text-slate-400">• Bookmarks persist across sessions</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// --- Shortcuts Panel Story ---
export const ShortcutsPanel: Story = {
    render: () => {
        return (
            <Container
                title="Keyboard Shortcuts Panel (NEW!)"
                description="Press ? to view all shortcuts"
            >
                <SpotlightProvider
                    items={[
                        { id: 'home', label: 'Home', type: 'page', icon: <Home size={18} /> },
                        { id: 'settings', label: 'Settings', type: 'page', icon: <Settings size={18} /> },
                    ]}
                    plugins={[
                        ShortcutsPanelPlugin({
                            triggerKey: '?',
                            icon: <Keyboard size={18} className="text-indigo-500" />,
                            customShortcuts: [
                                { key: 'Ctrl+B', description: 'Bookmark current item', category: 'Actions' },
                                { key: 'Ctrl+H', description: 'View history', category: 'Navigation' }
                            ]
                        })
                    ]}
                    onNavigate={() => { }}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 space-y-1">
                        <p className="font-semibold">Try it:</p>
                        <p className="text-slate-400">• Search for "keyboard shortcuts"</p>
                        <p className="text-slate-400">• Or type <code className="bg-slate-200 px-1 rounded">?</code> to trigger</p>
                        <p className="text-slate-400">• View all available shortcuts!</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// --- Command Aliases Story ---
export const CommandAliases: Story = {
    render: () => {
        const itemsWithAliases: SpotlightItem[] = [
            {
                id: 'settings',
                label: 'Settings',
                aliases: ['preferences', 'config', 'options', 'prefs'],
                description: 'Try searching: prefs, config, options',
                type: 'page',
                icon: <Settings size={18} className="text-blue-500" />
            },
            {
                id: 'users',
                label: 'Users',
                aliases: ['people', 'members', 'team'],
                description: 'Try searching: people, members, team',
                type: 'page',
                icon: <Users size={18} className="text-green-500" />
            },
            {
                id: 'home',
                label: 'Dashboard',
                aliases: ['home', 'main', 'overview'],
                description: 'Try searching: home, main, overview',
                type: 'page',
                icon: <Home size={18} className="text-purple-500" />
            },
        ];

        return (
            <Container
                title="Command Aliases (NEW!)"
                description="Find commands with alternative names"
            >
                <SpotlightProvider
                    items={itemsWithAliases}
                    onNavigate={() => { }}
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 space-y-1">
                        <p className="font-semibold">Try searching:</p>
                        <p className="text-slate-400">• <code className="bg-slate-200 px-1 rounded">prefs</code> → finds "Settings"</p>
                        <p className="text-slate-400">• <code className="bg-slate-200 px-1 rounded">people</code> → finds "Users"</p>
                        <p className="text-slate-400">• <code className="bg-slate-200 px-1 rounded">home</code> → finds "Dashboard"</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// --- All New Plugins Combined Story ---
export const AllNewPlugins: Story = {
    render: () => {
        const itemsWithAliases: SpotlightItem[] = [
            {
                id: 'settings',
                label: 'Settings',
                aliases: ['preferences', 'config', 'options', 'prefs'],
                type: 'page',
                icon: <Settings size={18} />
            },
            {
                id: 'users',
                label: 'Users',
                aliases: ['people', 'members', 'team'],
                type: 'page',
                icon: <Users size={18} />
            },
            {
                id: 'home',
                label: 'Home',
                type: 'page',
                icon: <Home size={18} />
            },
        ];

        return (
            <Container
                title="All v2.5.0 Plugins Combined!"
                description="Calculator, Converter, Recent Searches, Bookmarks, Shortcuts & Aliases"
            >
                <SpotlightProvider
                    items={itemsWithAliases}
                    plugins={[
                        CalculatorPlugin({ icon: <Calculator size={18} /> }),
                        UnitConverterPlugin({ icon: <Ruler size={18} /> }),
                        RecentSearchesPlugin({ icon: <History size={18} /> }),
                        BookmarksPlugin({ bookmarkIcon: <Star size={18} /> }),
                        ShortcutsPanelPlugin({ icon: <Keyboard size={18} /> }),
                    ]}
                    onNavigate={() => { }}
                    theme="dark"
                >
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 space-y-1">
                        <p className="font-semibold text-purple-600">🎉 All 5 new features in one!</p>
                        <p className="text-slate-400">Math: 2+2 | Convert: 100 km to miles | Aliases: prefs</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};
