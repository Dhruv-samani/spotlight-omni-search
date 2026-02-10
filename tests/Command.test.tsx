import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from '../components/Command';

// Mock scrollTo since it's not available in jsdom
Element.prototype.scrollTo = () => { };

describe('Command Component', () => {
    it('renders without crashing', () => {
        render(
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandItem value="1">Item 1</CommandItem>
                </CommandList>
            </Command>
        );
        expect(screen.getByPlaceholderText('Search...')).toBeDefined();
        expect(screen.getByText('Item 1')).toBeDefined();
    });

    it('filters items based on input', async () => {
        render(
            <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                    <CommandItem value="apple">Apple</CommandItem>
                    <CommandItem value="banana">Banana</CommandItem>
                    <CommandItem value="cherry">Cherry</CommandItem>
                </CommandList>
            </Command>
        );

        const input = screen.getByPlaceholderText('Search...');

        // Initial state: all visible
        expect(screen.getByText('Apple')).toBeDefined();
        expect(screen.getByText('Banana')).toBeDefined();

        // Search for "app"
        fireEvent.change(input, { target: { value: 'app' } });

        // Wait for state update (debounced or immediate)
        // Our implementation is immediate for now in context, but let's wait to be safe
        await waitFor(() => {
            expect(screen.queryByText('Banana')).toBeNull(); // Should be filtered out (hidden)
            // Note: Our current CommandItem implementation returns null when hidden, 
            // so queryByText should return null.
        });

        expect(screen.getByText('Apple')).toBeDefined();
    });

    it('handles selection via click', () => {
        const handleSelect = vi.fn();
        render(
            <Command>
                <CommandInput />
                <CommandList>
                    <CommandItem value="test" onSelect={handleSelect}>Test Item</CommandItem>
                </CommandList>
            </Command>
        );

        fireEvent.click(screen.getByText('Test Item'));
        expect(handleSelect).toHaveBeenCalledWith('test');
    });

    it('shows empty state when no matches found', async () => {
        render(
            <Command>
                <CommandInput />
                <CommandList>
                    <CommandEmpty>No results.</CommandEmpty>
                    <CommandItem value="apple">Apple</CommandItem>
                </CommandList>
            </Command>
        );

        expect(screen.queryByText('No results.')).toBeNull();

        const input = screen.getByRole('combobox');
        fireEvent.change(input, { target: { value: 'zebra' } });

        await waitFor(() => {
            expect(screen.getByText('No results.')).toBeDefined();
        });
    });

    it('groups items correctly', () => {
        render(
            <Command>
                <CommandInput />
                <CommandList>
                    <CommandGroup heading="Fruits">
                        <CommandItem value="apple">Apple</CommandItem>
                    </CommandGroup>
                    <CommandGroup heading="Vegetables">
                        <CommandItem value="carrot">Carrot</CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        );

        expect(screen.getByText('Fruits')).toBeDefined();
        expect(screen.getByText('Vegetables')).toBeDefined();
    });
});
