import type { Meta, StoryObj } from '@storybook/react';
import { SearchTrigger } from '../components/SearchTrigger';
import { SpotlightProvider } from '../providers/SpotlightProvider';
import React from 'react';

const items = [{ id: '1', label: 'Test', type: 'page' }];

const meta = {
    title: 'Components/SearchTrigger',
    component: SearchTrigger,
    decorators: [
        (Story) => (
            <SpotlightProvider items={items} onNavigate={() => { }}>
                <div className="p-8 flex justify-center bg-gray-50">
                    <Story />
                </div>
            </SpotlightProvider>
        ),
    ],
    argTypes: {
        onClick: { action: 'clicked' }
    }
} satisfies Meta<typeof SearchTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const Minimal: Story = {
    args: {
        variant: 'minimal',
    },
};

export const IconOnly: Story = {
    args: {
        variant: 'icon-only',
    },
};

export const WithoutShortcutHost: Story = {
    args: {
        showShortcut: false,
    },
};
