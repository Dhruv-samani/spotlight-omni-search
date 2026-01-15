import { describe, it, expect } from 'vitest';
import { fuzzyMatch, fuzzyFilterItems, regexFilter } from './fuzzySearch';
import { SpotlightItem } from '../types';

const items: SpotlightItem[] = [
    { id: '1', label: 'Home', description: 'Go to home page', type: 'page', group: 'Navigation' },
    { id: '2', label: 'Settings', description: 'Adjust preferences', type: 'page', group: 'Settings' },
    { id: '3', label: 'User Profile', description: 'View profile', type: 'page', group: 'Users' },
    { id: '4', label: 'React', description: 'Frontend library', type: 'docs', keywords: ['javascript', 'ui'] },
];

describe('fuzzySearch', () => {
    describe('fuzzyMatch', () => {
        it('should return null for no match', () => {
            const result = fuzzyMatch('xyz', 'Home');
            expect(result).toBeNull();
        });

        it('should match exact string case-insensitive', () => {
            const result = fuzzyMatch('home', 'Home');
            expect(result).not.toBeNull();
            expect(result?.score).toBeGreaterThan(0);
        });

        it('should match partial string', () => {
            const result = fuzzyMatch('set', 'Settings');
            expect(result).not.toBeNull();
        });

        it('should match scattered characters', () => {
            const result = fuzzyMatch('stt', 'Settings');
            expect(result).not.toBeNull();
        });
    });

    describe('fuzzyFilterItems', () => {
        it('should return all items for empty query', () => {
            const results = fuzzyFilterItems(items, '');
            expect(results).toHaveLength(items.length);
        });

        it('should filter items based on label', () => {
            const results = fuzzyFilterItems(items, 'Home');
            expect(results).toHaveLength(1);
            expect(results[0].label).toBe('Home');
        });

        it('should filter based on description', () => {
            const results = fuzzyFilterItems(items, 'preferences');
            expect(results).toHaveLength(1);
            expect(results[0].label).toBe('Settings');
        });

        it('should filter based on keywords', () => {
            const results = fuzzyFilterItems(items, 'javascript');
            expect(results).toHaveLength(1);
            expect(results[0].label).toBe('React');
        });
    });

    describe('regexFilter', () => {
        it('should filter using regex pattern', () => {
            const results = regexFilter(items, '^Home');
            expect(results).toHaveLength(1);
            expect(results[0].item.label).toBe('Home');
        });

        it('should return empty array for invalid regex', () => {
            const results = regexFilter(items, '[');
            expect(results).toEqual([]);
        });
    });
});
