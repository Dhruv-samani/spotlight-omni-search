import React, { ReactNode } from 'react';
import { SpotlightPlugin } from '../types/plugin';
import { ScoredItem } from '../lib/fuzzySearch';


export interface CalculatorOptions {
    /**
     * Enable automatic clipboard copy on result selection
     * @default true
     */
    enableClipboardCopy?: boolean;
    /**
     * Decimal precision for results
     * @default 10
     */
    precision?: number;
    /**
     * Custom icon to display for calculator results
     * Can be any ReactNode (Lucide, Material Icons, SVG, etc.)
     * @default undefined (no icon)
     */
    icon?: ReactNode;
}

/**
 * Safe math expression evaluator
 * Only allows numbers and basic operators: + - * / ( ) % ^
 */
function safeEvaluate(expression: string): number | null {
    try {
        // Remove all whitespace
        const cleaned = expression.replace(/\s+/g, '');
        
        // Strict validation: only allow numbers, operators, and parentheses
        const validPattern = /^[\d+\-*/.()%^]+$/;
        if (!validPattern.test(cleaned)) {
            return null;
        }
        
        // Check for dangerous patterns
        const dangerousPatterns = [
            /[a-zA-Z]/,  // No letters
            /__/,         // No double underscores
            /\$/,         // No dollar signs
            /\[|\]/,      // No brackets
            /\{|\}/,      // No braces
        ];
        
        if (dangerousPatterns.some(pattern => pattern.test(cleaned))) {
            return null;
        }
        
        // Replace ^ with ** for exponentiation
        const normalized = cleaned.replace(/\^/g, '**');
        
        // Use Function constructor (safer than eval, but still sandboxed)
        // This creates a new function scope without access to outer variables
        const result = new Function(`'use strict'; return (${normalized})`)();
        
        // Validate result is a finite number
        if (typeof result !== 'number' || !isFinite(result)) {
            return null;
        }
        
        return result;
    } catch (error) {
        return null;
    }
}

/**
 * Detect if a query looks like a math expression
 */
function isMathExpression(query: string): boolean {
    const trimmed = query.trim();
    
    // Must contain at least one operator
    const hasOperator = /[+\-*/%^]/.test(trimmed);
    
    // Must contain at least one digit
    const hasDigit = /\d/.test(trimmed);
    
    // Should not start with letters (to avoid matching regular searches)
    const startsWithNumber = /^[\d\s(.-]/.test(trimmed);
    
    return hasOperator && hasDigit && startsWithNumber;
}

export const CalculatorPlugin = (options: CalculatorOptions = {}): SpotlightPlugin => {
    const {
        enableClipboardCopy = true,
        precision = 10,
        icon
    } = options;

    return {
        name: 'spotlight-calculator',
        version: '1.0.0',
        
        onAfterSearch: (results: ScoredItem[]): ScoredItem[] => {
            // Get the current query from the first result's context (if available)
            // Since we don't have direct access to query here, we'll use onBeforeSearch instead
            return results;
        },

        onBeforeSearch: (query, items) => {
            // Check if query is a math expression
            if (!isMathExpression(query)) {
                return items;
            }

            // Try to evaluate
            const result = safeEvaluate(query);
            
            if (result === null) {
                return items;
            }

            // Format result with appropriate precision
            const formattedResult = Number(result.toPrecision(precision)).toString();
            
            // Create calculator item
            const calculatorItem = {
                id: 'calculator-result',
                label: `${formattedResult}`,
                description: `= ${query}`,
                type: 'action' as const,
                group: 'Calculator',
                ...(icon && { icon }), // Only include icon if provided
                action: () => {
                    if (enableClipboardCopy && navigator.clipboard) {
                        navigator.clipboard.writeText(formattedResult)
                            .then(() => {
                                console.log('Result copied to clipboard');
                            })
                            .catch(err => {
                                console.error('Failed to copy to clipboard:', err);
                            });
                    }
                }
            };


            // Prepend calculator result to items
            return [calculatorItem, ...items];
        }
    };
};
