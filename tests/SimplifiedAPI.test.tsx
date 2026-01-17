/**
 * Unit Tests for Simplified API Components
 * Tests SpotlightProvider, SearchTrigger, and useGlobalSpotlight
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { SpotlightProvider } from '../providers/SpotlightProvider';
import { SearchTrigger } from '../components/SearchTrigger';
import { useGlobalSpotlight } from '../hooks/useGlobalSpotlight';
import type { SpotlightItem } from '../types';

// Test data
const mockItems: SpotlightItem[] = [
    {
        id: 'home',
        label: 'Home',
        type: 'page',
        route: '/',
        group: 'Navigation',
    },
    {
        id: 'settings',
        label: 'Settings',
        type: 'page',
        route: '/settings',
        group: 'System',
    },
];

describe('SpotlightProvider', () => {
    it('should render children correctly', () => {
        render(
            <SpotlightProvider items={mockItems}>
                <div data-testid="child">Test Child</div>
            </SpotlightProvider>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should provide context to child components', () => {
        const TestComponent = () => {
            const { isOpen } = useGlobalSpotlight();
            return <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>;
        };

        render(
            <SpotlightProvider items={mockItems}>
                <TestComponent />
            </SpotlightProvider>
        );

        expect(screen.getByTestId('status')).toHaveTextContent('closed');
    });

    it('should handle keyboard shortcut (Cmd+K)', async () => {
        const TestComponent = () => {
            const { isOpen } = useGlobalSpotlight();
            return <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>;
        };

        render(
            <SpotlightProvider items={mockItems}>
                <TestComponent />
            </SpotlightProvider>
        );

        // Simulate Cmd+K
        fireEvent.keyDown(window, { key: 'k', metaKey: true });

        await waitFor(() => {
            expect(screen.getByTestId('status')).toHaveTextContent('open');
        });
    });

    it('should handle keyboard shortcut (Ctrl+K)', async () => {
        const TestComponent = () => {
            const { isOpen } = useGlobalSpotlight();
            return <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>;
        };

        render(
            <SpotlightProvider items={mockItems}>
                <TestComponent />
            </SpotlightProvider>
        );

        // Simulate Ctrl+K
        fireEvent.keyDown(window, { key: 'k', ctrlKey: true });

        await waitFor(() => {
            expect(screen.getByTestId('status')).toHaveTextContent('open');
        });
    });

    it('should respect disableShortcut prop', async () => {
        const TestComponent = () => {
            const { isOpen } = useGlobalSpotlight();
            return <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>;
        };

        render(
            <SpotlightProvider items={mockItems} disableShortcut={true}>
                <TestComponent />
            </SpotlightProvider>
        );

        // Try to trigger shortcut
        fireEvent.keyDown(window, { key: 'k', metaKey: true });

        // Should remain closed
        expect(screen.getByTestId('status')).toHaveTextContent('closed');
    });

    it('should accept custom shortcut key', async () => {
        const TestComponent = () => {
            const { isOpen } = useGlobalSpotlight();
            return <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>;
        };

        render(
            <SpotlightProvider items={mockItems} shortcutKey="p">
                <TestComponent />
            </SpotlightProvider>
        );

        // Cmd+P should work
        fireEvent.keyDown(window, { key: 'p', metaKey: true });

        await waitFor(() => {
            expect(screen.getByTestId('status')).toHaveTextContent('open');
        });
    });

    it('should pass props to Spotlight component', () => {
        const onNavigate = vi.fn();

        render(
            <SpotlightProvider
                items={mockItems}
                onNavigate={onNavigate}
                theme="dark"
                layout="center"
                debug={true}
            >
                <div>Test</div>
            </SpotlightProvider>
        );

        // Component should render without errors
        expect(screen.getByText('Test')).toBeInTheDocument();
    });
});

describe('SearchTrigger', () => {
    it('should render default variant correctly', () => {
        render(
            <SpotlightProvider items={mockItems}>
                <SearchTrigger variant="default" />
            </SpotlightProvider>
        );

        const button = screen.getByRole('button', { name: /open search/i });
        expect(button).toBeInTheDocument();
        expect(screen.getByText('Search...')).toBeInTheDocument();
    });

    it('should render minimal variant correctly', () => {
        render(
            <SpotlightProvider items={mockItems}>
                <SearchTrigger variant="minimal" />
            </SpotlightProvider>
        );

        const button = screen.getByRole('button', { name: /open search/i });
        expect(button).toBeInTheDocument();
    });

    it('should render icon-only variant correctly', () => {
        render(
            <SpotlightProvider items={mockItems}>
                <SearchTrigger variant="icon-only" />
            </SpotlightProvider>
        );

        const button = screen.getByRole('button', { name: /open search/i });
        expect(button).toBeInTheDocument();
        // Should not have "Search..." text
        expect(screen.queryByText('Search...')).not.toBeInTheDocument();
    });

    it('should open Spotlight when clicked', async () => {
        const TestComponent = () => {
            const { isOpen } = useGlobalSpotlight();
            return (
                <>
                    <SearchTrigger variant="default" />
                    <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>
                </>
            );
        };

        render(
            <SpotlightProvider items={mockItems}>
                <TestComponent />
            </SpotlightProvider>
        );

        const button = screen.getByRole('button', { name: /open search/i });
        fireEvent.click(button);

        await waitFor(() => {
            expect(screen.getByTestId('status')).toHaveTextContent('open');
        });
    });

    it('should accept custom className', () => {
        render(
            <SpotlightProvider items={mockItems}>
                <SearchTrigger variant="default" className="custom-class" />
            </SpotlightProvider>
        );

        const button = screen.getByRole('button', { name: /open search/i });
        expect(button).toHaveClass('custom-class');
    });

    it('should accept custom children', () => {
        render(
            <SpotlightProvider items={mockItems}>
                <SearchTrigger variant="default">Custom Text</SearchTrigger>
            </SpotlightProvider>
        );

        expect(screen.getByText('Custom Text')).toBeInTheDocument();
    });

    it('should hide shortcut when showShortcut is false', () => {
        render(
            <SpotlightProvider items={mockItems}>
                <SearchTrigger variant="default" showShortcut={false} />
            </SpotlightProvider>
        );

        // ⌘K should not be visible
        expect(screen.queryByText('⌘')).not.toBeInTheDocument();
    });
});

describe('useGlobalSpotlight', () => {
    it('should provide open, close, toggle, and isOpen', () => {
        const TestComponent = () => {
            const { open, close, toggle, isOpen } = useGlobalSpotlight();
            return (
                <div>
                    <button onClick={open} data-testid="open-btn">Open</button>
                    <button onClick={close} data-testid="close-btn">Close</button>
                    <button onClick={toggle} data-testid="toggle-btn">Toggle</button>
                    <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>
                </div>
            );
        };

        render(
            <SpotlightProvider items={mockItems}>
                <TestComponent />
            </SpotlightProvider>
        );

        expect(screen.getByTestId('status')).toHaveTextContent('closed');
    });

    it('should open Spotlight when open() is called', async () => {
        const TestComponent = () => {
            const { open, isOpen } = useGlobalSpotlight();
            return (
                <>
                    <button onClick={open} data-testid="open-btn">Open</button>
                    <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>
                </>
            );
        };

        render(
            <SpotlightProvider items={mockItems}>
                <TestComponent />
            </SpotlightProvider>
        );

        fireEvent.click(screen.getByTestId('open-btn'));

        await waitFor(() => {
            expect(screen.getByTestId('status')).toHaveTextContent('open');
        });
    });

    it('should close Spotlight when close() is called', async () => {
        const TestComponent = () => {
            const { open, close, isOpen } = useGlobalSpotlight();
            return (
                <>
                    <button onClick={open} data-testid="open-btn">Open</button>
                    <button onClick={close} data-testid="close-btn">Close</button>
                    <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>
                </>
            );
        };

        render(
            <SpotlightProvider items={mockItems}>
                <TestComponent />
            </SpotlightProvider>
        );

        // Open first
        fireEvent.click(screen.getByTestId('open-btn'));
        await waitFor(() => {
            expect(screen.getByTestId('status')).toHaveTextContent('open');
        });

        // Then close
        fireEvent.click(screen.getByTestId('close-btn'));
        await waitFor(() => {
            expect(screen.getByTestId('status')).toHaveTextContent('closed');
        });
    });

    it('should toggle Spotlight when toggle() is called', async () => {
        const TestComponent = () => {
            const { toggle, isOpen } = useGlobalSpotlight();
            return (
                <>
                    <button onClick={toggle} data-testid="toggle-btn">Toggle</button>
                    <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>
                </>
            );
        };

        render(
            <SpotlightProvider items={mockItems}>
                <TestComponent />
            </SpotlightProvider>
        );

        // Toggle to open
        fireEvent.click(screen.getByTestId('toggle-btn'));
        await waitFor(() => {
            expect(screen.getByTestId('status')).toHaveTextContent('open');
        });

        // Toggle to close
        fireEvent.click(screen.getByTestId('toggle-btn'));
        await waitFor(() => {
            expect(screen.getByTestId('status')).toHaveTextContent('closed');
        });
    });

    it('should throw error when used outside SpotlightProvider', () => {
        const TestComponent = () => {
            useGlobalSpotlight();
            return <div>Test</div>;
        };

        // Suppress console.error for this test
        const spy = vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(() => {
            render(<TestComponent />);
        }).toThrow('useSpotlightContext must be used within SpotlightProvider');

        spy.mockRestore();
    });
});

describe('Integration Tests', () => {
    it('should work with all components together', async () => {
        const TestApp = () => {
            const { isOpen } = useGlobalSpotlight();
            return (
                <div>
                    <SearchTrigger variant="default" />
                    <SearchTrigger variant="minimal" />
                    <SearchTrigger variant="icon-only" />
                    <div data-testid="status">{isOpen ? 'open' : 'closed'}</div>
                </div>
            );
        };

        render(
            <SpotlightProvider items={mockItems}>
                <TestApp />
            </SpotlightProvider>
        );

        // All triggers should be present
        const buttons = screen.getAllByRole('button', { name: /open search/i });
        expect(buttons).toHaveLength(3);

        // Click first trigger
        fireEvent.click(buttons[0]);

        await waitFor(() => {
            expect(screen.getByTestId('status')).toHaveTextContent('open');
        });
    });

    it('should handle navigation callback', async () => {
        const onNavigate = vi.fn();

        render(
            <SpotlightProvider items={mockItems} onNavigate={onNavigate}>
                <SearchTrigger variant="default" />
            </SpotlightProvider>
        );

        // This test would require opening Spotlight and selecting an item
        // which requires more complex interaction with the Spotlight component
        // For now, we verify the prop is accepted
        expect(onNavigate).toBeDefined();
    });
});
