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
export function fuzzyMatch(query: string, text: string): FuzzyMatchResult | null {
  if (!query || !text) return null;

  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  let score = 0;
  let queryIndex = 0;
  const matches: number[] = [];
  let consecutiveBonus = 0;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
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
  if (queryIndex !== queryLower.length) {
    return null;
  }

  return { score, matches };
}

/**
 * Searches multiple fields of an item
 */
function searchItem(item: SpotlightItem, query: string): FuzzyMatchResult | null {
  const fields = [
    { text: item.label, weight: 3 },
    { text: item.description || '', weight: 1 },
    { text: item.group || '', weight: 1 },
    ...(item.keywords || []).map(k => ({ text: k, weight: 2 })),
  ];

  let bestMatch: FuzzyMatchResult | null = null;

  for (const field of fields) {
    const match = fuzzyMatch(query, field.text);
    if (match) {
      const weightedScore = match.score * field.weight;
      if (!bestMatch || weightedScore > bestMatch.score) {
        bestMatch = { ...match, score: weightedScore };
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
 * Returns items sorted by relevance score
 */
export function fuzzyFilter(items: SpotlightItem[], query: string): SpotlightItem[] {
  if (!query.trim()) {
    return items;
  }

  const scored: ScoredItem[] = [];

  for (const item of items) {
    const match = searchItem(item, query);
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

  return scored.map(s => s.item);
}
