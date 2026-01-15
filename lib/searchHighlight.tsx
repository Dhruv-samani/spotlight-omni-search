import React from 'react';

/**
 * Highlights matched characters in text
 * @param text - The text to highlight
 * @param matches - Array of indices to highlight
 * @returns React node with highlighted text
 */
export function highlightMatches(text: string, matches: number[]): React.ReactNode {
    if (!matches || matches.length === 0) {
        return text;
    }

    const matchSet = new Set(matches);
    const parts: React.ReactNode[] = [];
    let currentPart = '';
    let isHighlighted = false;

    for (let i = 0; i < text.length; i++) {
        const shouldHighlight = matchSet.has(i);

        if (shouldHighlight !== isHighlighted) {
            // State changed, push current part
            if (currentPart) {
                parts.push(
                    isHighlighted ? (
                        <mark
                            key={i}
                            className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground font-semibold rounded px-0.5"
                        >
                            {currentPart}
                        </mark>
                    ) : (
                        <span key={i}>{currentPart}</span>
                    )
                );
            }
            currentPart = text[i];
            isHighlighted = shouldHighlight;
        } else {
            currentPart += text[i];
        }
    }

    // Push remaining part
    if (currentPart) {
        parts.push(
            isHighlighted ? (
                <mark
                    key={text.length}
                    className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground font-semibold rounded px-0.5"
                >
                    {currentPart}
                </mark>
            ) : (
                <span key={text.length}>{currentPart}</span>
            )
        );
    }

    return <>{parts}</>;
}

/**
 * Simple text highlighting based on query (for non-fuzzy matches)
 * @param text - The text to highlight
 * @param query - The search query
 * @returns React node with highlighted text
 */
export function highlightQuery(text: string, query: string): React.ReactNode {
    if (!query.trim()) {
        return text;
    }

    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const index = textLower.indexOf(queryLower);

    if (index === -1) {
        return text;
    }

    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);

    return (
        <>
            {before}
            <mark className="bg-yellow-200 dark:bg-yellow-900/50 text-foreground font-semibold rounded px-0.5">
                {match}
            </mark>
            {highlightQuery(after, query)}
        </>
    );
}
