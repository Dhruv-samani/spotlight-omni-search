import type { Meta, StoryObj } from '@storybook/react';
import { SpotlightProvider } from '../providers/SpotlightProvider';
import { SearchTrigger } from '../components/SearchTrigger';
import { useGlobalSpotlight } from '../hooks/useGlobalSpotlight';
import React from 'react';

// Layout container to make Spotlight visible
const Container = ({ children }: { children: React.ReactNode }) => (
    <div className="h-[600px] w-full flex flex-col items-center justify-center bg-gray-100 p-8 relative">
        {children}
    </div>
);

const items = [
    { id: 'home', label: 'Home', route: '/', type: 'page', group: 'Navigation' },
    { id: 'docs', label: 'Documentation', route: '/docs', type: 'page', group: 'Navigation' },
    { id: 'dashboard', label: 'Dashboard', route: '/dashboard', type: 'page', group: 'Navigation' },
    { id: 'theme-light', label: 'Light Theme', action: () => console.log('Light clicked'), group: 'Actions', type: 'action' },
    { id: 'theme-dark', label: 'Dark Theme', action: () => console.log('Dark clicked'), group: 'Actions', type: 'action' },
];

const meta = {
    title: 'Components/Spotlight',
    component: SpotlightProvider,
    decorators: [
        (Story) => (
            <Container>
                <Story />
            </Container>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
    // Explicitly disabling automatic arg inference for children to avoid complex type errors in controls
    argTypes: {
        children: { table: { disable: true } },
    },
    args: {
        onNavigate: () => { },
        // Ensure overlay stays within the container for docs
        classNames: {
            backdrop: 'absolute inset-0 z-50',
        },
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SpotlightProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        items: items,
        children: (
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Spotlight Demo</h1>
                <p className="mb-4">Press Cmd+K to open</p>
                <div className="flex gap-4 justify-center">
                    <SearchTrigger />
                    <CustomButton />
                </div>
            </div>
        ),
    },
};

export const DarkTheme: Story = {
    args: {
        items: items,
        children: (
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Spotlight Demo (Dark)</h1>
                <p className="mb-4">Press Cmd+K to open</p>
                <div className="flex gap-4 justify-center">
                    <SearchTrigger />
                </div>
            </div>
        ),
        theme: 'dark',
    },
};

export const MinimalLayout: Story = {
    args: {
        items: items,
        children: (
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Spotlight Demo (Compact)</h1>
                <p className="mb-4">Press Cmd+K to open</p>
                <div className="flex gap-4 justify-center">
                    <SearchTrigger />
                </div>
            </div>
        ),
        layout: 'compact',
    },
};

// Example of using custom trigger
function CustomButton() {
    const { open } = useGlobalSpotlight();
    return (
        <button
            onClick={open}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
            Open API
        </button>
    );
}

export const CustomStyled: Story = {
    args: {
        items: items,
        children: (
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4 text-blue-900">Custom Styled Spotlight</h1>
                <p className="mb-4 text-blue-600">Press Cmd+K to open</p>
                <div className="flex gap-4 justify-center">
                    <SearchTrigger className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300" />
                </div>
            </div>
        ),
        // Simplified API
        className: "shadow-xl border-blue-100",
        headerClassName: "bg-blue-50 border-b-2 border-blue-200",
        itemClassName: "hover:bg-blue-50",

        // Granular overrides
        classNames: {
            backdrop: "absolute inset-0 z-50",
            itemSelected: "bg-blue-100 text-blue-900 border-l-4 border-blue-500 rounded-r-lg rounded-l-none",
        }
    },
};
