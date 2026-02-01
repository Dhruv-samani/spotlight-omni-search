import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SpotlightProvider } from '../providers/SpotlightProvider';
import { SearchTrigger } from '../components/SearchTrigger';
import { SaaSDashboardTemplate } from '../templates/saas-dashboard';
import { DocsTemplate } from '../templates/docs-site';
import { AdminPanelTemplate } from '../templates/admin-panel';
import '../dev/index.css';

const meta: Meta<typeof SpotlightProvider> = {
    title: 'Templates/Ready-to-Use',
    component: SpotlightProvider,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SpotlightProvider>;

// Helper Container
const Container = ({ children, title, description }: { children: React.ReactNode, title: string, description: string }) => (
    <div className="w-[600px] h-[400px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col relative shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50">
            {children}
        </div>
    </div>
);

// SaaS Dashboard Template Story
export const SaaSDashboard: Story = {
    render: () => {
        return (
            <Container
                title="SaaS Dashboard Template"
                description="Pre-configured for SaaS applications with navigation, quick actions, and billing"
            >
                <SpotlightProvider {...SaaSDashboardTemplate} onNavigate={(path) => console.log('Navigate to:', path)}>
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 dark:text-slate-400 space-y-1">
                        <p className="font-semibold">Includes:</p>
                        <p>• Navigation (Dashboard, Analytics, Users, Settings)</p>
                        <p>• Quick Actions (New Project, Invite User, Export)</p>
                        <p>• Billing & Subscription</p>
                        <p>• All v2.5.0 plugins enabled</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// Docs Site Template Story
export const DocumentationSite: Story = {
    render: () => {
        return (
            <Container
                title="Documentation Site Template"
                description="Perfect for documentation websites with guides, API reference, and examples"
            >
                <SpotlightProvider {...DocsTemplate} onNavigate={(path) => console.log('Navigate to:', path)}>
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 dark:text-slate-400 space-y-1">
                        <p className="font-semibold">Includes:</p>
                        <p>• Documentation (Getting Started, API, Guides)</p>
                        <p>• Examples & Playground</p>
                        <p>• Community Links (GitHub, Discord)</p>
                        <p>• Version Switcher</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// Admin Panel Template Story
export const AdminPanel: Story = {
    render: () => {
        return (
            <Container
                title="Admin Panel Template"
                description="Comprehensive admin dashboard with user management and system controls"
            >
                <SpotlightProvider {...AdminPanelTemplate} onNavigate={(path) => console.log('Navigate to:', path)}>
                    <SearchTrigger className="w-full max-w-sm" />
                    <div className="text-xs text-center mt-4 text-slate-600 dark:text-slate-400 space-y-1">
                        <p className="font-semibold">Includes:</p>
                        <p>• User Management (Users, Roles, Permissions)</p>
                        <p>• System Settings (Config, Logs, Monitoring)</p>
                        <p>• Analytics & Reports</p>
                        <p>• Danger Zone (with confirmations)</p>
                    </div>
                </SpotlightProvider>
            </Container>
        );
    }
};

// Side-by-Side Comparison
export const Comparison: Story = {
    render: () => {
        const [activeTemplate, setActiveTemplate] = useState<'saas' | 'docs' | 'admin'>('saas');

        const templates = {
            saas: { name: 'SaaS Dashboard', config: SaaSDashboardTemplate, color: 'blue' },
            docs: { name: 'Docs Site', config: DocsTemplate, color: 'green' },
            admin: { name: 'Admin Panel', config: AdminPanelTemplate, color: 'purple' }
        };

        const active = templates[activeTemplate];

        return (
            <div className="w-[800px] h-[500px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden flex flex-col shadow-sm">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Template Comparison</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Switch between templates to see the differences</p>
                </div>

                <div className="flex gap-3 p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50">
                    {Object.entries(templates).map(([key, template]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTemplate(key as any)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTemplate === key
                                ? `bg-${template.color}-600 text-white shadow-lg`
                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                        >
                            {template.name}
                        </button>
                    ))}
                </div>

                <div className="flex-1 p-8 flex flex-col items-center justify-center">
                    <SpotlightProvider {...active.config} onNavigate={(path) => console.log('Navigate to:', path)}>
                        <SearchTrigger className="w-full max-w-md" />
                        <div className="text-xs text-center mt-4 text-slate-600 dark:text-slate-400">
                            <p className="font-semibold mb-2">Currently viewing: {active.name}</p>
                            <p>Open Spotlight to explore the pre-configured items</p>
                        </div>
                    </SpotlightProvider>
                </div>
            </div>
        );
    }
};
