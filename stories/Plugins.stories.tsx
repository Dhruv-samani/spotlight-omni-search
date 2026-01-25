import type { Meta, StoryObj } from '@storybook/react';
import React, { useMemo, useState } from 'react';
import { SpotlightProvider } from '../providers/SpotlightProvider';
import { SearchTrigger } from '../components/SearchTrigger';
import { NestedCommandsPlugin } from '../plugins/nested';
import { VirtualScrollingPlugin } from '../plugins/virtual';
import { AnalyticsPlugin } from '../plugins/analytics';
import { SpotlightItem } from '../types';
import { ChevronRight, Folder, File, Activity, Zap } from 'lucide-react';

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
