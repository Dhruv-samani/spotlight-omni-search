import { describe, it, expect } from 'vitest';
import { CalculatorPlugin } from '../../plugins/calculator';
import { SpotlightItem } from '../../types';

describe('CalculatorPlugin', () => {
    const plugin = CalculatorPlugin();

    describe('Basic Arithmetic', () => {
        it('should evaluate simple addition', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('2 + 2', items) || items;
            
            expect(result.length).toBe(1);
            expect(result[0].label).toBe('4');
            expect(result[0].description).toBe('= 2 + 2');
        });

        it('should evaluate subtraction', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('10 - 3', items) || items;
            
            expect(result.length).toBe(1);
            expect(result[0].label).toBe('7');
        });

        it('should evaluate multiplication', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('5 * 4', items) || items;
            
            expect(result.length).toBe(1);
            expect(result[0].label).toBe('20');
        });

        it('should evaluate division', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('20 / 4', items) || items;
            
            expect(result.length).toBe(1);
            expect(result[0].label).toBe('5');
        });

        it('should evaluate modulo', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('10 % 3', items) || items;
            
            expect(result.length).toBe(1);
            expect(result[0].label).toBe('1');
        });

        it('should evaluate exponentiation', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('2 ^ 3', items) || items;
            
            expect(result.length).toBe(1);
            expect(result[0].label).toBe('8');
        });
    });

    describe('Complex Expressions', () => {
        it('should handle parentheses', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('(2 + 3) * 4', items) || items;
            
            expect(result.length).toBe(1);
            expect(result[0].label).toBe('20');
        });

        it('should handle nested parentheses', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('((2 + 3) * 4) / 2', items) || items;
            
            expect(result.length).toBe(1);
            expect(result[0].label).toBe('10');
        });

        it('should handle decimal numbers', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('3.5 * 2', items) || items;
            
            expect(result.length).toBe(1);
            expect(result[0].label).toBe('7');
        });

        it('should handle negative numbers', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('-5 + 10', items) || items;
            
            expect(result.length).toBe(1);
            expect(result[0].label).toBe('5');
        });
    });

    describe('Edge Cases', () => {
        it('should handle division by zero', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('10 / 0', items) || items;
            
            // Division by zero returns Infinity, which is filtered out
            expect(result.length).toBe(0);
        });

        it('should ignore non-math queries', () => {
            const items: SpotlightItem[] = [
                { id: '1', label: 'Test', type: 'page' }
            ];
            const result = plugin.onBeforeSearch?.('hello world', items) || items;
            
            expect(result).toEqual(items);
        });

        it('should ignore queries starting with letters', () => {
            const items: SpotlightItem[] = [
                { id: '1', label: 'Test', type: 'page' }
            ];
            const result = plugin.onBeforeSearch?.('test 2 + 2', items) || items;
            
            expect(result).toEqual(items);
        });
    });

    describe('Security', () => {
        it('should reject expressions with letters', () => {
            const items: SpotlightItem[] = [];
            const result = plugin.onBeforeSearch?.('2 + a', items) || items;
            
            expect(result.length).toBe(0);
        });

        it('should reject expressions with dangerous patterns', () => {
            const items: SpotlightItem[] = [];
            const dangerousInputs = [
                'alert(1)',
                'console.log(1)',
                '2 + window',
                '2 + $var',
                '2 + [1]',
                '2 + {a: 1}'
            ];

            dangerousInputs.forEach(input => {
                const result = plugin.onBeforeSearch?.(input, items) || items;
                expect(result.length).toBe(0);
            });
        });
    });

    describe('Plugin Configuration', () => {
        it('should respect precision option', () => {
            const customPlugin = CalculatorPlugin({ precision: 3 });
            const items: SpotlightItem[] = [];
            const result = customPlugin.onBeforeSearch?.('1 / 3', items) || items;
            
            expect(result.length).toBe(1);
            // Result should be limited to 3 significant figures
            expect(result[0].label).toBe('0.333');
        });
    });
});
