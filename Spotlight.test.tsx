import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Spotlight } from './Spotlight';
import { SpotlightItem } from './types';

const items: SpotlightItem[] = [
    { id: '1', label: 'Test Item', type: 'page' }
];

describe('Spotlight Component', () => {
    it('should not render when isOpen is false', () => {
        const { container } = render(
            <Spotlight
                items={items}
                isOpen={false}
                onClose={() => { }}
                onNavigate={() => { }}
            />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it('should render when isOpen is true', () => {
        render(
            <Spotlight
                items={items}
                isOpen={true}
                onClose={() => { }}
                onNavigate={() => { }}
            />
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Type a command/i)).toBeInTheDocument();
    });
});
