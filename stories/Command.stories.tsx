import type { Meta, StoryObj } from '@storybook/react';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty, CommandLoading } from '../components/Command';
import { User, CreditCard, Settings, Calculator, Calendar } from 'lucide-react';

const meta: Meta<typeof Command> = {
    title: 'Components/Command (New)',
    component: Command,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof Command>;

export const Default: Story = {
    render: () => (
        <Command className="w-[450px] rounded-lg border shadow-md">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem onSelect={(v) => console.log('Selected:', v)}>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Calendar</span>
                    </CommandItem>
                    <CommandItem onSelect={(v) => console.log('Selected:', v)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem onSelect={(v) => console.log('Selected:', v)}>
                        <Calculator className="mr-2 h-4 w-4" />
                        <span>Calculator</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <CommandItem onSelect={(v) => console.log('Selected:', v)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </CommandItem>
                    <CommandItem onSelect={(v) => console.log('Selected:', v)}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                    </CommandItem>
                    <CommandItem onSelect={(v) => console.log('Selected:', v)}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    ),
};

// Separator helper component for the demo (will move to main lib later)
function CommandSeparator() {
    return <div className="-mx-1 h-px bg-border" role="separator" />;
}

export const WithLoading: Story = {
    render: () => (
        <Command className="w-[450px] rounded-lg border shadow-md">
            <CommandInput placeholder="Searching..." />
            <CommandList>
                <CommandLoading>Fetching items...</CommandLoading>
            </CommandList>
        </Command>
    )
};
