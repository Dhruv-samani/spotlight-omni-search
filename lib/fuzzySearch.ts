import { SpotlightItem } from '../types';

export interface FuzzyMatchResult {
  score: number;
  matches: number[]; // Indices of matched characters
}

/**
 * Performs fuzzy matching on a string
 * Returns a score and the positions of matched characters
 * 
 * Algorithm:
 * - Sequential character matching (characters must appear in order)
 * - Bonus for consecutive matches
 * - Bonus for matches at word boundaries
 * - Case-insensitive
 */
/**
 * Performs fuzzy matching on a string
 * Returns a score and the positions of matched characters
 * 
 * Algorithm:
 * - Sequential character matching (characters must appear in order)
 * - Bonus for consecutive matches
 * - Bonus for matches at word boundaries
 * - Case-insensitive (assumes queryLower is passed for performance, or computes it)
 */
export function fuzzyMatch(query: string, text: string, queryLower?: string): FuzzyMatchResult | null {
  if (!query || !text) return null;

  const qType = queryLower ?? query.toLowerCase();
  const textLower = text.toLowerCase();
  
  let score = 0;
  let queryIndex = 0;
  const matches: number[] = [];
  let consecutiveBonus = 0;

  for (let i = 0; i < textLower.length && queryIndex < qType.length; i++) {
    if (textLower[i] === qType[queryIndex]) {
      matches.push(i);
      
      // Base score for match
      score += 1;
      
      // Consecutive match bonus
      if (matches.length > 1 && matches[matches.length - 1] === matches[matches.length - 2] + 1) {
        consecutiveBonus += 5;
        score += consecutiveBonus;
      } else {
        consecutiveBonus = 0;
      }
      
      // Word boundary bonus (match at start or after space/dash/underscore)
      if (i === 0 || /[\s\-_]/.test(textLower[i - 1])) {
        score += 10;
      }
      
      // Early match bonus (matches near the beginning are better)
      score += Math.max(0, 10 - i);
      
      queryIndex++;
    }
  }

  // All characters must match
  if (queryIndex !== qType.length) {
    return null;
  }

  return { score, matches };
}

/**
 * Searches multiple fields of an item
 * Optimized to avoid array allocations in the loop
 */
function searchItem(item: SpotlightItem, query: string, queryLower: string): FuzzyMatchResult | null {
  let bestMatch: FuzzyMatchResult | null = null;
  let currentMatch: FuzzyMatchResult | null;
  let weightedScore: number;

  // Check Label (Weight: 3)
  currentMatch = fuzzyMatch(query, item.label, queryLower);
  if (currentMatch) {
    weightedScore = currentMatch.score * 3;
    bestMatch = { ...currentMatch, score: weightedScore };
  }

  // Check Description (Weight: 1)
  if (item.description) {
    currentMatch = fuzzyMatch(query, item.description, queryLower);
    if (currentMatch) {
      weightedScore = currentMatch.score * 1;
      if (!bestMatch || weightedScore > bestMatch.score) {
        bestMatch = { ...currentMatch, score: weightedScore };
      }
    }
  }

  // Check Group (Weight: 1)
  if (item.group) {
    currentMatch = fuzzyMatch(query, item.group, queryLower);
    if (currentMatch) {
      weightedScore = currentMatch.score * 1;
      if (!bestMatch || weightedScore > bestMatch.score) {
        bestMatch = { ...currentMatch, score: weightedScore };
      }
    }
  }

  // Check Keywords (Weight: 2)
  if (item.keywords) {
    for (const keyword of item.keywords) {
        currentMatch = fuzzyMatch(query, keyword, queryLower);
        if (currentMatch) {
          weightedScore = currentMatch.score * 2;
          if (!bestMatch || weightedScore > bestMatch.score) {
            bestMatch = { ...currentMatch, score: weightedScore };
          }
        }
    }
  }

  // Check Aliases (Weight: 2.5) - Higher than keywords, lower than label
  if (item.aliases) {
    for (const alias of item.aliases) {
        currentMatch = fuzzyMatch(query, alias, queryLower);
        if (currentMatch) {
          weightedScore = currentMatch.score * 2.5;
          if (!bestMatch || weightedScore > bestMatch.score) {
            bestMatch = { ...currentMatch, score: weightedScore };
          }
        }
    }
  }

  return bestMatch;
}

export interface ScoredItem {
  item: SpotlightItem;
  score: number;
  matches: number[];
}

/**
 * Filters and sorts items using fuzzy search
 * Returns scored items with match information for highlighting
 */
export function fuzzyFilter(items: SpotlightItem[], query: string): ScoredItem[] {
  if (!query.trim()) {
    return items.map(item => ({ item, score: 0, matches: [] }));
  }

  const queryLower = query.toLowerCase();
  const scored: ScoredItem[] = [];

  for (const item of items) {
    const match = searchItem(item, query, queryLower);
    if (match) {
      scored.push({
        item,
        score: match.score,
        matches: match.matches,
      });
    }
  }

  // Sort by score (descending), then by group
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const groupA = a.item.group || 'Other';
    const groupB = b.item.group || 'Other';
    return groupA.localeCompare(groupB);
  });

  return scored;
}

/**
 * Filters and sorts items, returning only the items (for backward compatibility)
 */
export function fuzzyFilterItems(items: SpotlightItem[], query: string): SpotlightItem[] {
  return fuzzyFilter(items, query).map(s => s.item);
}

/**
 * Filters and sorts items using regex
 * Returns scored items (score = 1 for match) with match indices
 */
export function regexFilter(items: SpotlightItem[], pattern: string): ScoredItem[] {
  try {
    const regex = new RegExp(pattern, 'i');
    const scored: ScoredItem[] = [];

    for (const item of items) {
      let matched = false;
      const matches: number[] = [];

      // Check label
      const labelMatch = item.label.match(regex);
      if (labelMatch && labelMatch.index !== undefined) {
        matched = true;
        for (let i = 0; i < labelMatch[0].length; i++) {
          matches.push(labelMatch.index + i);
        }
      }

      // Check description
      if (!matched && item.description && regex.test(item.description)) {
        matched = true;
      }
      
      // Keywords
      if (!matched && item.keywords && item.keywords.some(k => regex.test(k))) {
        matched = true;
      }

      if (matched) {
        scored.push({
          item,
          score: 1,
          matches,
        });
      }
    }

    // Sort by group
    scored.sort((a, b) => {
      const groupA = a.item.group || 'Other';
      const groupB = b.item.group || 'Other';
      return groupA.localeCompare(groupB);
    });

    return scored;
  } catch (e) {
    return [];
  }
}

