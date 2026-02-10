import type { Meta, StoryObj } from '@storybook/react';
import { SpotlightOmni } from '../components/SpotlightOmni';
import { Mail, Settings, User, CreditCard, Calendar, BarChart, Search } from 'lucide-react';
import { SpotlightItem } from '../types';

const meta: Meta<typeof SpotlightOmni> = {
    title: 'Components/SpotlightOmni',
    component: SpotlightOmni,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
    argTypes: {
        theme: {
            control: 'select',
            options: ['light', 'dark', 'slate', 'rose', 'violet', 'amber', 'midnight']
        },
        layout: {
            control: 'select',
            options: ['center', 'top', 'bottom', 'side-left', 'side-right', 'compact']
        }
    }
};

export default meta;
type Story = StoryObj<typeof SpotlightOmni>;

const items: SpotlightItem[] = [
    { id: '1', label: 'Dashboard', type: 'page', group: 'Navigation', icon: <BarChart size={16} /> },
    { id: '2', label: 'Settings', type: 'page', group: 'Navigation', icon: <Settings size={16} /> },
    { id: '3', label: 'Profile', type: 'page', group: 'Navigation', icon: <User size={16} /> },
    { id: '4', label: 'Billing', type: 'page', group: 'Navigation', icon: <CreditCard size={16} /> },
    { id: '5', label: 'Calendar', type: 'page', group: 'Apps', icon: <Calendar size={16} /> },
    { id: '6', label: 'Mail', type: 'page', group: 'Apps', icon: <Mail size={16} /> },
];

export const Default: Story = {
    args: {
        isOpen: true,
        items: items,
        onClose: () => console.log('close'),
        onNavigate: (path) => console.log('navigate', path),
        theme: 'dark'
    }
};

export const Virtualized1000Items: Story = {
    args: {
        isOpen: true,
        onClose: () => console.log('close'),
        onNavigate: (path) => console.log('navigate', path),
        theme: 'midnight',
        enableVirtualScrolling: true,
        items: Array.from({ length: 1000 }, (_, i) => ({
            id: `item-${i}`,
            label: `Item ${i}`,
            description: `Description for item ${i}`,
            type: 'page',
            group: 'Generated'
        }))
    }
};

export const WithAsyncSearch: Story = {
    args: {
        isOpen: true,
        items: [],
        onClose: () => console.log('close'),
        onNavigate: (path) => console.log('navigate', path),
        theme: 'slate',
        searchPlaceholder: 'Search for "temp"...',
        onSearch: async (query) => {
            if (!query) return [];
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate latency
            return [
                { id: `res-1-${query}`, label: `Result for ${query}`, type: 'search' },
                { id: `res-2-${query}`, label: `Another result for ${query}`, type: 'search' }
            ];
        }
    }
};
